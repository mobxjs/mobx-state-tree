import {
  fail,
  isPrimitive,
  createScalarNode,
  ISimpleType,
  TypeFlags,
  IValidationContext,
  IValidationResult,
  typeCheckSuccess,
  typeCheckFailure,
  isType,
  Primitives,
  AnyObjectNode,
  SimpleType,
  devMode
} from "../../internal"
import { assertArg } from "../../utils"

/**
 * @internal
 * @hidden
 */
export class Literal<T> extends SimpleType<T, T, T> {
  readonly value: T
  readonly flags = TypeFlags.Literal

  constructor(value: T) {
    super(JSON.stringify(value))
    this.value = value
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"]
  ): this["N"] {
    return createScalarNode(this, parent, subpath, environment, initialValue)
  }

  describe() {
    return JSON.stringify(this.value)
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (isPrimitive(value) && value === this.value) {
      return typeCheckSuccess()
    }
    return typeCheckFailure(context, value, `Value is not a literal ${JSON.stringify(this.value)}`)
  }
}

/**
 * `types.literal` - The literal type will return a type that will match only the exact given type.
 * The given value must be a primitive, in order to be serialized to a snapshot correctly.
 * You can use literal to match exact strings for example the exact male or female string.
 *
 * Example:
 * ```ts
 * const Person = types.model({
 *     name: types.string,
 *     gender: types.union(types.literal('male'), types.literal('female'))
 * })
 * ```
 *
 * @param value The value to use in the strict equal check
 * @returns
 */
export function literal<S extends Primitives>(value: S): ISimpleType<S> {
  // check that the given value is a primitive
  assertArg(value, isPrimitive, "primitive", 1)

  return new Literal<S>(value)
}

/**
 * Returns if a given value represents a literal type.
 *
 * @param type
 * @returns
 */
export function isLiteralType<IT extends ISimpleType<any>>(type: IT): type is IT {
  return isType(type) && (type.flags & TypeFlags.Literal) > 0
}
