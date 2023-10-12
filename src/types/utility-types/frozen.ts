import {
  isSerializable,
  deepFreeze,
  createScalarNode,
  IValidationContext,
  IValidationResult,
  typeCheckSuccess,
  typeCheckFailure,
  TypeFlags,
  isType,
  optional,
  IType,
  IAnyType,
  AnyObjectNode,
  SimpleType
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export class Frozen<T> extends SimpleType<T, T, T> {
  flags = TypeFlags.Frozen

  constructor(private subType?: IAnyType) {
    super(subType ? `frozen(${subType.name})` : "frozen")
  }

  describe() {
    return "<any immutable value>"
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    value: this["C"]
  ): this["N"] {
    // create the node
    return createScalarNode(this, parent, subpath, environment, deepFreeze(value))
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (!isSerializable(value)) {
      return typeCheckFailure(context, value, "Value is not serializable and cannot be frozen")
    }
    if (this.subType) return this.subType.validate(value, context)
    return typeCheckSuccess()
  }
}

const untypedFrozenInstance = new Frozen()

export function frozen<C>(subType: IType<C, any, any>): IType<C, C, C>
export function frozen<T>(defaultValue: T): IType<T | undefined | null, T, T>
export function frozen<T = any>(): IType<T, T, T> // do not assume undefined by default, let the user specify it if needed
/**
 * `types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
 * Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
 * Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.
 *
 * This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.
 *
 * Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.
 *
 * Frozen properties can be defined in three different ways
 * 1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
 * 2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
 * 3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)
 *
 * Example:
 * ```ts
 * const GameCharacter = types.model({
 *   name: string,
 *   location: types.frozen({ x: 0, y: 0})
 * })
 *
 * const hero = GameCharacter.create({
 *   name: "Mario",
 *   location: { x: 7, y: 4 }
 * })
 *
 * hero.location = { x: 10, y: 2 } // OK
 * hero.location.x = 7 // Not ok!
 * ```
 *
 * ```ts
 * type Point = { x: number, y: number }
 *    const Mouse = types.model({
 *         loc: types.frozen<Point>()
 *    })
 * ```
 *
 * @param defaultValueOrType
 * @returns
 */
export function frozen(arg?: any): any {
  if (arguments.length === 0) return untypedFrozenInstance
  else if (isType(arg)) return new Frozen(arg)
  else return optional(untypedFrozenInstance, arg)
}

/**
 * Returns if a given value represents a frozen type.
 *
 * @param type
 * @returns
 */
export function isFrozenType<IT extends IType<T | any, T, T>, T = any>(type: IT): type is IT {
  return isType(type) && (type.flags & TypeFlags.Frozen) > 0
}
