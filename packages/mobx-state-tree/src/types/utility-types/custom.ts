import {
    INode,
    createNode,
    Type,
    IType,
    TypeFlags,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    ObjectNode,
    IAnyType
} from "../../internal"

export type CustomTypeOptions<S, T> = {
    // Friendly name
    name: string
    // given a serialized value, how to turn it into the target type
    fromSnapshot(snapshot: S): T
    // return the serialization of the current value
    toSnapshot(value: T): S
    // if true, this is a converted value, if false, it's a snapshot
    isTargetType(value: T | S): boolean
    // a non empty string is assumed to be a validation error
    getValidationMessage(snapshot: S): string
    // TODO: isSnapshotEqual
    // TODO: isValueEqual
}

/**
 * Creates a custom type. Custom types can be used for arbitrary immutable values, that have a serializable representation. For example, to create your own Date representation, Decimal type etc.
 *
 * The signature of the options is:
 *
 * ```javascript
 * export type CustomTypeOptions<S, T> = {
 *     // Friendly name
 *     name: string
 *     // given a serialized value, how to turn it into the target type
 *     fromSnapshot(snapshot: S): T
 *     // return the serialization of the current value
 *     toSnapshot(value: T): S
 *     // if true, this is a converted value, if false, it's a snapshot
 *     isTargetType(value: T | S): boolean
 *     // a non empty string is assumed to be a validation error
 *     getValidationMessage?(snapshot: S): string
 * }
 * ```
 *
 * @export
 * @alias types.custom
 *
 * @example
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
 */
export function custom<S, T>(options: CustomTypeOptions<S, T>): IType<S | T, S, T> {
    return new CustomType(options)
}

export class CustomType<S, T> extends Type<S, S, T> {
    readonly flags = TypeFlags.Reference
    readonly shouldAttachNode = false

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

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        return node.storedValue
    }

    getSnapshot(node: INode): any {
        return this.options.toSnapshot(node.storedValue)
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        const valueToStore: T = this.options.isTargetType(snapshot)
            ? snapshot
            : this.options.fromSnapshot(snapshot)
        return createNode(this, parent, subpath, environment, valueToStore)
    }

    reconcile(current: INode, value: any): INode {
        const isSnapshot = !this.options.isTargetType(value)
        const unchanged =
            current.type === this &&
            (isSnapshot ? value === current.snapshot : value === current.storedValue)
        if (unchanged) return current
        const valueToStore: T = isSnapshot ? this.options.fromSnapshot(value) : value
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current._environment,
            valueToStore
        )
        current.die()
        return newNode
    }
}
