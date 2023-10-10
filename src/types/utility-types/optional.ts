import {
  isStateTreeNode,
  IType,
  TypeFlags,
  isType,
  IValidationContext,
  IValidationResult,
  typecheckInternal,
  typeCheckSuccess,
  fail,
  IAnyType,
  AnyObjectNode,
  BaseType,
  assertIsType,
  ExtractCSTWithSTN,
  devMode
} from "../../internal"

type IFunctionReturn<T> = () => T

type IOptionalValue<C, T> = C | IFunctionReturn<C | T>

/** @hidden */
export type ValidOptionalValue = string | boolean | number | null | undefined

/** @hidden */
export type ValidOptionalValues = [ValidOptionalValue, ...ValidOptionalValue[]]

/**
 * @hidden
 * @internal
 */
export class OptionalValue<
  IT extends IAnyType,
  OptionalVals extends ValidOptionalValues
> extends BaseType<
  IT["CreationType"] | OptionalVals[number],
  IT["SnapshotType"],
  IT["TypeWithoutSTN"]
> {
  get flags() {
    return this._subtype.flags | TypeFlags.Optional
  }

  constructor(
    private readonly _subtype: IT,
    private readonly _defaultValue: IOptionalValue<IT["CreationType"], IT["Type"]>,
    readonly optionalValues: OptionalVals
  ) {
    super(_subtype.name)
  }

  describe() {
    return this._subtype.describe() + "?"
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"] | this["T"]
  ): this["N"] {
    if (this.optionalValues.indexOf(initialValue) >= 0) {
      const defaultInstanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
      return this._subtype.instantiate(parent, subpath, environment, defaultInstanceOrSnapshot)
    }
    return this._subtype.instantiate(parent, subpath, environment, initialValue)
  }

  reconcile(
    current: this["N"],
    newValue: this["C"] | this["T"],
    parent: AnyObjectNode,
    subpath: string
  ): this["N"] {
    return this._subtype.reconcile(
      current,
      this.optionalValues.indexOf(newValue) < 0 && this._subtype.is(newValue)
        ? newValue
        : this.getDefaultInstanceOrSnapshot(),
      parent,
      subpath
    )
  }

  getDefaultInstanceOrSnapshot(): this["C"] | this["T"] {
    const defaultInstanceOrSnapshot =
      typeof this._defaultValue === "function"
        ? (this._defaultValue as IFunctionReturn<this["C"] | this["T"]>)()
        : this._defaultValue

    // while static values are already snapshots and checked on types.optional
    // generator functions must always be rechecked just in case
    if (typeof this._defaultValue === "function") {
      typecheckInternal(this, defaultInstanceOrSnapshot)
    }

    return defaultInstanceOrSnapshot
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    // defaulted values can be skipped
    if (this.optionalValues.indexOf(value) >= 0) {
      return typeCheckSuccess()
    }
    // bounce validation to the sub-type
    return this._subtype.validate(value, context)
  }

  isAssignableFrom(type: IAnyType) {
    return this._subtype.isAssignableFrom(type)
  }

  getSubTypes() {
    return this._subtype
  }
}

/** @hidden */
export type OptionalDefaultValueOrFunction<IT extends IAnyType> =
  | IT["CreationType"]
  | IT["SnapshotType"]
  | (() => ExtractCSTWithSTN<IT>)

/** @hidden */
export interface IOptionalIType<IT extends IAnyType, OptionalVals extends ValidOptionalValues>
  extends IType<
    IT["CreationType"] | OptionalVals[number],
    IT["SnapshotType"],
    IT["TypeWithoutSTN"]
  > {}

function checkOptionalPreconditions<IT extends IAnyType>(
  type: IAnyType,
  defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
) {
  // make sure we never pass direct instances
  if (typeof defaultValueOrFunction !== "function" && isStateTreeNode(defaultValueOrFunction)) {
    throw fail(
      "default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead"
    )
  }
  assertIsType(type, 1)
  if (devMode()) {
    // we only check default values if they are passed directly
    // if they are generator functions they will be checked once they are generated
    // we don't check generator function results here to avoid generating a node just for type-checking purposes
    // which might generate side-effects
    if (typeof defaultValueOrFunction !== "function") {
      typecheckInternal(type, defaultValueOrFunction)
    }
  }
}

export function optional<IT extends IAnyType>(
  type: IT,
  defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
): IOptionalIType<IT, [undefined]>
export function optional<IT extends IAnyType, OptionalVals extends ValidOptionalValues>(
  type: IT,
  defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>,
  optionalValues: OptionalVals
): IOptionalIType<IT, OptionalVals>
/**
 * `types.optional` - Can be used to create a property with a default value.
 *
 * Depending on the third argument (`optionalValues`) there are two ways of operation:
 * - If the argument is not provided, then if a value is not provided in the snapshot (`undefined` or missing),
 *   it will default to the provided `defaultValue`
 * - If the argument is provided, then if the value in the snapshot matches one of the optional values inside the array then it will
 *   default to the provided `defaultValue`. Additionally, if one of the optional values inside the array is `undefined` then a missing
 *   property is also valid.
 *
 *   Note that it is also possible to include values of the same type as the intended subtype as optional values,
 *   in this case the optional value will be transformed into the `defaultValue` (e.g. `types.optional(types.string, "unnamed", [undefined, ""])`
 *   will transform the snapshot values `undefined` (and therefore missing) and empty strings into the string `"unnamed"` when it gets
 *   instantiated).
 *
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is one of the optional values (or `undefined`/_not_ present if none are provided) causes the
 * value to be reset.
 *
 * Example:
 * ```ts
 * const Todo = types.model({
 *   title: types.string,
 *   subtitle1: types.optional(types.string, "", [null]),
 *   subtitle2: types.optional(types.string, "", [null, undefined]),
 *   done: types.optional(types.boolean, false),
 *   created: types.optional(types.Date, () => new Date()),
 * })
 *
 * // if done is missing / undefined it will become false
 * // if created is missing / undefined it will get a freshly generated timestamp
 * // if subtitle1 is null it will default to "", but it cannot be missing or undefined
 * // if subtitle2 is null or undefined it will default to ""; since it can be undefined it can also be missing
 * const todo = Todo.create({ title: "Get coffee", subtitle1: null })
 * ```
 *
 * @param type
 * @param defaultValueOrFunction
 * @param optionalValues an optional array with zero or more primitive values (string, number, boolean, null or undefined)
 *                       that will be converted into the default. `[ undefined ]` is assumed when none is provided
 * @returns
 */
export function optional<IT extends IAnyType, OptionalVals extends ValidOptionalValues>(
  type: IT,
  defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>,
  optionalValues?: OptionalVals
): IOptionalIType<IT, OptionalVals> {
  checkOptionalPreconditions(type, defaultValueOrFunction)

  return new OptionalValue(
    type,
    defaultValueOrFunction,
    optionalValues ? optionalValues : undefinedAsOptionalValues
  )
}

const undefinedAsOptionalValues: [undefined] = [undefined]

/**
 * Returns if a value represents an optional type.
 *
 * @template IT
 * @param type
 * @returns
 */
export function isOptionalType<IT extends IAnyType>(type: IT): type is IT {
  return isType(type) && (type.flags & TypeFlags.Optional) > 0
}
