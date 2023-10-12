import {
  createScalarNode,
  SimpleType,
  IType,
  TypeFlags,
  IValidationContext,
  IValidationResult,
  typeCheckSuccess,
  typeCheckFailure,
  AnyObjectNode
} from "../../internal"

export interface CustomTypeOptions<S, T> {
  /** Friendly name */
  name: string
  /** given a serialized value and environment, how to turn it into the target type */
  fromSnapshot(snapshot: S, env?: any): T
  /** return the serialization of the current value */
  toSnapshot(value: T): S
  /** if true, this is a converted value, if false, it's a snapshot */
  isTargetType(value: T | S): boolean
  /** a non empty string is assumed to be a validation error */
  getValidationMessage(snapshot: S): string
  // TODO: isSnapshotEqual
  // TODO: isValueEqual
}

/**
 * `types.custom` - Creates a custom type. Custom types can be used for arbitrary immutable values, that have a serializable representation. For example, to create your own Date representation, Decimal type etc.
 *
 * The signature of the options is:
 * ```ts
 * export interface CustomTypeOptions<S, T> {
 *     // Friendly name
 *     name: string
 *     // given a serialized value and environment, how to turn it into the target type
 *     fromSnapshot(snapshot: S, env: any): T
 *     // return the serialization of the current value
 *     toSnapshot(value: T): S
 *     // if true, this is a converted value, if false, it's a snapshot
 *     isTargetType(value: T | S): value is T
 *     // a non empty string is assumed to be a validation error
 *     getValidationMessage?(snapshot: S): string
 * }
 * ```
 *
 * Example:
 * ```ts
 * const DecimalPrimitive = types.custom<string, Decimal>({
 *     name: "Decimal",
 *     fromSnapshot(value: string) {
 *         return new Decimal(value)
 *     },
 *     toSnapshot(value: Decimal) {
 *         return value.toString()
 *     },
 *     isTargetType(value: string | Decimal): boolean {
 *         return value instanceof Decimal
 *     },
 *     getValidationMessage(value: string): string {
 *         if (/^-?\d+\.\d+$/.test(value)) return "" // OK
 *         return `'${value}' doesn't look like a valid decimal number`
 *     }
 * })
 *
 * const Wallet = types.model({
 *     balance: DecimalPrimitive
 * })
 * ```
 *
 * @param options
 * @returns
 */
export function custom<S, T>(options: CustomTypeOptions<S, T>): IType<S | T, S, T> {
  return new CustomType<S, T>(options)
}

/**
 * @internal
 * @hidden
 */
export class CustomType<S, T> extends SimpleType<S | T, S, T> {
  readonly flags = TypeFlags.Custom

  constructor(protected readonly options: CustomTypeOptions<S, T>) {
    super(options.name)
  }

  describe() {
    return this.name
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (this.options.isTargetType(value)) return typeCheckSuccess()

    const typeError: string = this.options.getValidationMessage(value as S)
    if (typeError) {
      return typeCheckFailure(context, value, `Invalid value for type '${this.name}': ${typeError}`)
    }
    return typeCheckSuccess()
  }

  getSnapshot(node: this["N"]): S {
    return this.options.toSnapshot(node.storedValue)
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: S | T
  ): this["N"] {
    const valueToStore: T = this.options.isTargetType(initialValue)
      ? (initialValue as T)
      : this.options.fromSnapshot(initialValue as S, parent && parent.root.environment)
    return createScalarNode(this, parent, subpath, environment, valueToStore)
  }

  reconcile(current: this["N"], value: S | T, parent: AnyObjectNode, subpath: string): this["N"] {
    const isSnapshot = !this.options.isTargetType(value)
    // in theory customs use scalar nodes which cannot be detached, but still...
    if (!current.isDetaching) {
      const unchanged =
        current.type === this &&
        (isSnapshot ? value === current.snapshot : value === current.storedValue)
      if (unchanged) {
        current.setParent(parent, subpath)
        return current
      }
    }
    const valueToStore: T = isSnapshot
      ? this.options.fromSnapshot(value as S, parent.root.environment)
      : (value as T)
    const newNode = this.instantiate(parent, subpath, undefined, valueToStore)
    current.die() // noop if detaching
    return newNode
  }
}
