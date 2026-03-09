import {
    MstError,
    createScalarNode,
    SimpleType,
    TypeFlags,
    isType,
    IValidationContext,
    IValidationResult,
    typeCheckFailure,
    ModelType,
    typeCheckSuccess,
    ISimpleType,
    IType,
    AnyObjectNode,
    ScalarNode,
    assertArg
} from "../../internal"

abstract class BaseIdentifierType<T> extends SimpleType<T, T, T> {
    readonly flags = TypeFlags.Identifier

    constructor(
        name: string,
        private readonly validType: "string" | "number" | "bigint"
    ) {
        super(name)
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: this["C"]
    ): this["N"] {
        if (!parent || !(parent.type instanceof ModelType))
            throw new MstError(
                `Identifier types can only be instantiated as direct child of a model type`
            )

        return createScalarNode(this, parent, subpath, environment, initialValue)
    }

    reconcile(current: this["N"], newValue: this["C"], parent: AnyObjectNode, subpath: string) {
        // we don't consider detaching here since identifier are scalar nodes, and scalar nodes cannot be detached
        if (current.storedValue !== newValue)
            throw new MstError(
                `Tried to change identifier from '${current.storedValue}' to '${newValue}'. Changing identifiers is not allowed.`
            )
        current.setParent(parent, subpath)
        return current
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        if (typeof value !== this.validType) {
            return typeCheckFailure(
                context,
                value,
                `Value is not a valid ${this.describe()}, expected a ${this.validType}`
            )
        }
        return typeCheckSuccess()
    }
}

/**
 * @internal
 * @hidden
 */
export class IdentifierType extends BaseIdentifierType<string> {
    readonly flags = TypeFlags.Identifier

    constructor() {
        super(`identifier`, "string")
    }

    describe() {
        return `identifier`
    }
}

/**
 * @internal
 * @hidden
 */
export class IdentifierNumberType extends BaseIdentifierType<number> {
    constructor() {
        super("identifierNumber", "number")
    }

    getSnapshot(node: ScalarNode<number, number, number>): number {
        return node.storedValue
    }

    describe() {
        return `identifierNumber`
    }
}

/**
 * `types.identifier` - Identifiers are used to make references, lifecycle events and reconciling works.
 * Inside a state tree, for each type can exist only one instance for each given identifier.
 * For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
 * Identifier can be used only as type property of a model.
 * This type accepts as parameter the value type of the identifier field that can be either string or number.
 *
 * Example:
 * ```ts
 *  const Todo = types.model("Todo", {
 *      id: types.identifier,
 *      title: types.string
 *  })
 * ```
 *
 * @returns
 */
export const identifier: ISimpleType<string> = new IdentifierType()

/**
 * `types.identifierNumber` - Similar to `types.identifier`. This one will serialize from / to a number when applying snapshots
 *
 * Example:
 * ```ts
 *  const Todo = types.model("Todo", {
 *      id: types.identifierNumber,
 *      title: types.string
 *  })
 * ```
 *
 * @returns
 */
export const identifierNumber: ISimpleType<number> = new IdentifierNumberType()

/**
 * @internal
 * @hidden
 * IdentifierBigintType uses SimpleType<bigint | string | number, string, bigint> so snapshots serialize to string (JSON-safe).
 */
export class IdentifierBigintType extends SimpleType<bigint | string | number, string, bigint> {
    readonly flags = TypeFlags.Identifier

    constructor() {
        super("identifierBigint")
    }

    createNewInstance(snapshot: bigint | string | number): bigint {
        if (typeof snapshot === "bigint") return snapshot
        return BigInt(snapshot)
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: bigint | string | number
    ): this["N"] {
        if (!parent || !(parent.type instanceof ModelType))
            throw new MstError(
                `Identifier types can only be instantiated as direct child of a model type`
            )
        return createScalarNode(this, parent, subpath, environment, initialValue)
    }

    reconcile(
        current: this["N"],
        newValue: bigint | string | number,
        parent: AnyObjectNode,
        subpath: string
    ): this["N"] {
        const currentVal = current.storedValue
        const newVal = typeof newValue === "bigint" ? newValue : BigInt(newValue)
        if (currentVal !== newVal)
            throw new MstError(
                `Tried to change identifier from '${currentVal}' to '${newVal}'. Changing identifiers is not allowed.`
            )
        current.setParent(parent, subpath)
        return current
    }

    isValidSnapshot(
        value: bigint | string | number,
        context: IValidationContext
    ): IValidationResult {
        if (typeof value === "bigint") {
            return typeCheckSuccess()
        }

        if (typeof value === "string" || typeof value === "number") {
            try {
                // BigInt primitive constructor verifies whether the value is a valid integer
                BigInt(value)
                return typeCheckSuccess()
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e)
                return typeCheckFailure(
                    context,
                    value,
                    `Value is not a valid ${this.describe()}: ${errorMessage}`
                )
            }
        }

        return typeCheckFailure(
            context,
            value,
            `Value is not a valid ${this.describe()}, expected a bigint, a string or a number`
        )
    }

    getSnapshot(node: this["N"]): string {
        return String(node.storedValue)
    }

    describe() {
        return `identifierBigint`
    }
}

/**
 * `types.identifierBigint` - Similar to `types.identifier`. Snapshots serialize to string (JSON-safe) and deserialize from string, number or bigint.
 *
 * Example:
 * ```ts
 *  const Todo = types.model("Todo", {
 *      id: types.identifierBigint,
 *      title: types.string
 *  })
 * ```
 *
 * @returns
 */
export const identifierBigint: IType<bigint | string | number, string, bigint> =
    new IdentifierBigintType()

/**
 * Returns if a given value represents an identifier type.
 *
 * @param type
 * @returns
 */
export function isIdentifierType(
    type: unknown
): type is typeof identifier | typeof identifierNumber | typeof identifierBigint {
    return isType(type) && (type.flags & TypeFlags.Identifier) > 0
}

/**
 * Valid types for identifiers.
 */
export type ReferenceIdentifier = string | number | bigint

/**
 * @internal
 * @hidden
 */
export function normalizeIdentifier(id: ReferenceIdentifier): string {
    return "" + id
}

/**
 * @internal
 * @hidden
 */
export function isValidIdentifier(id: any): id is ReferenceIdentifier {
    return typeof id === "string" || typeof id === "number" || typeof id === "bigint"
}

/**
 * @internal
 * @hidden
 */
export function assertIsValidIdentifier(id: ReferenceIdentifier, argNumber: number | number[]) {
    assertArg(id, isValidIdentifier, "string, number or bigint (identifier)", argNumber)
}
