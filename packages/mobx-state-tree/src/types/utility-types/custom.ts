import {
    createScalarNode,
    Type,
    IType,
    TypeFlags,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    IAnyType,
    AnyObjectNode
} from "../../internal"

export interface CustomTypeOptions<S, T> {
    /** Friendly name */
    name: string
    /** given a serialized value, how to turn it into the target type */
    fromSnapshot(snapshot: S): T
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
 *     // given a serialized value, how to turn it into the target type
 *     fromSnapshot(snapshot: S): T
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
    return new CustomType(options)
}

/**
 * @internal
 * @hidden
 */
export class CustomType<C, S, T> extends Type<C, S, T> {
    readonly flags = TypeFlags.Reference

    constructor(protected readonly options: CustomTypeOptions<S, T>) {
        super(options.name)
    }

    describe() {
        return this.name
    }

    isAssignableFrom(type: IAnyType): boolean {
        return type === this
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (this.options.isTargetType(value)) return typeCheckSuccess()
        const typeError: string = this.options.getValidationMessage(value)
        if (typeError) {
            return typeCheckFailure(
                context,
                value,
                `Invalid value for type '${this.name}': ${typeError}`
            )
        }
        return typeCheckSuccess()
    }

    getValue(node: this["N"]): T {
        return node.storedValue
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
            : this.options.fromSnapshot(initialValue as S)
        return createScalarNode(this, parent, subpath, environment, valueToStore)
    }

    reconcile(current: this["N"], value: S | T): this["N"] {
        const isSnapshot = !this.options.isTargetType(value)
        const unchanged =
            current.type === this &&
            (isSnapshot ? value === current.snapshot : value === current.storedValue)
        if (unchanged) return current
        const valueToStore: T = isSnapshot ? this.options.fromSnapshot(value as S) : (value as T)
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current.environment,
            valueToStore
        )
        current.die()
        return newNode
    }
}
