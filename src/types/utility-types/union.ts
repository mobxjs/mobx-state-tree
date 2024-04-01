import {
  IValidationContext,
  IValidationResult,
  typeCheckSuccess,
  typeCheckFailure,
  flattenTypeErrors,
  isType,
  TypeFlags,
  IType,
  MstError,
  isPlainObject,
  IAnyType,
  IValidationError,
  _NotCustomized,
  AnyObjectNode,
  BaseType,
  devMode,
  assertIsType,
  assertArg
} from "../../internal"

export type ITypeDispatcher = (snapshot: any) => IAnyType

export interface UnionOptions {
  eager?: boolean
  dispatcher?: ITypeDispatcher
}

/**
 * @internal
 * @hidden
 */
export class Union<Types extends IAnyType[]> extends BaseType<
  _CustomCSProcessor<Types[number]["CreationType"]>,
  _CustomCSProcessor<Types[number]["SnapshotType"]>,
  Types[number]["TypeWithoutSTN"]
> {
  private readonly _dispatcher?: ITypeDispatcher
  private readonly _eager: boolean = true

  get flags() {
    let result: TypeFlags = TypeFlags.Union

    this._types.forEach((type) => {
      result |= type.flags
    })

    return result
  }

  constructor(name: string, private readonly _types: Types, options?: UnionOptions) {
    super(name)
    options = {
      eager: true,
      dispatcher: undefined,
      ...options
    }
    this._dispatcher = options.dispatcher
    if (!options.eager) this._eager = false
  }

  isAssignableFrom(type: IAnyType) {
    return this._types.some((subType) => subType.isAssignableFrom(type))
  }

  describe() {
    return "(" + this._types.map((factory) => factory.describe()).join(" | ") + ")"
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"] | this["T"]
  ): this["N"] {
    const type = this.determineType(initialValue, undefined)
    if (!type) throw new MstError("No matching type for union " + this.describe()) // can happen in prod builds
    return type.instantiate(parent, subpath, environment, initialValue)
  }

  reconcile(
    current: this["N"],
    newValue: this["C"] | this["T"],
    parent: AnyObjectNode,
    subpath: string
  ): this["N"] {
    const type = this.determineType(newValue, current.getReconciliationType())
    if (!type) throw new MstError("No matching type for union " + this.describe()) // can happen in prod builds
    return type.reconcile(current, newValue, parent, subpath)
  }

  determineType(
    value: this["C"] | this["T"],
    reconcileCurrentType: IAnyType | undefined
  ): IAnyType | undefined {
    // try the dispatcher, if defined
    if (this._dispatcher) {
      return this._dispatcher(value)
    }

    // find the most accommodating type
    // if we are using reconciliation try the current node type first (fix for #1045)
    if (reconcileCurrentType) {
      if (reconcileCurrentType.is(value)) {
        return reconcileCurrentType
      }
      return this._types.filter((t) => t !== reconcileCurrentType).find((type) => type.is(value))
    } else {
      return this._types.find((type) => type.is(value))
    }
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (this._dispatcher) {
      return this._dispatcher(value).validate(value, context)
    }

    const allErrors: IValidationError[][] = []
    let applicableTypes = 0
    for (let i = 0; i < this._types.length; i++) {
      const type = this._types[i]
      const errors = type.validate(value, context)
      if (errors.length === 0) {
        if (this._eager) return typeCheckSuccess()
        else applicableTypes++
      } else {
        allErrors.push(errors)
      }
    }

    if (applicableTypes === 1) return typeCheckSuccess()
    return typeCheckFailure(context, value, "No type is applicable for the union").concat(
      flattenTypeErrors(allErrors)
    )
  }

  getSubTypes() {
    return this._types
  }
}

/**
 * Transform _NotCustomized | _NotCustomized... to _NotCustomized, _NotCustomized | A | B to A | B
 * @hidden
 */
export type _CustomCSProcessor<T> = Exclude<T, _NotCustomized> extends never
  ? _NotCustomized
  : Exclude<T, _NotCustomized>

/** @hidden */
export interface ITypeUnion<C, S, T>
  extends IType<_CustomCSProcessor<C>, _CustomCSProcessor<S>, T> {}

type IUnionType<Types extends IAnyType[]> = ITypeUnion<
  Types[number]["CreationType"],
  Types[number]["SnapshotType"],
  Types[number]["TypeWithoutSTN"]
>

export function union<Types extends IAnyType[]>(...types: Types): IUnionType<Types>
export function union<Types extends IAnyType[]>(
  options: UnionOptions,
  ...types: Types
): IUnionType<Types>
/**
 * `types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.
 *
 * @param optionsOrType
 * @param otherTypes
 * @returns
 */
export function union<Types extends IAnyType[]>(
  optionsOrType: UnionOptions | Types[number],
  ...otherTypes: Types
): IUnionType<Types> {
  const options = isType(optionsOrType) ? undefined : optionsOrType
  const types = isType(optionsOrType) ? [optionsOrType, ...otherTypes] : otherTypes
  const name = "(" + types.map((type) => type.name).join(" | ") + ")"

  // check all options
  if (devMode()) {
    if (options) {
      assertArg(
        options,
        (o) => isPlainObject(o),
        "object { eager?: boolean, dispatcher?: Function }",
        1
      )
    }
    types.forEach((type, i) => {
      assertIsType(type, options ? i + 2 : i + 1)
    })
  }
  return new Union(name, types, options)
}

/**
 * Returns if a given value represents a union type.
 *
 * @param type
 * @returns
 */
export function isUnionType<IT extends IAnyType>(type: IT): type is IT {
  return (type.flags & TypeFlags.Union) > 0
}
