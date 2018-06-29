import {
    fail,
    INode,
    createNode,
    Type,
    IType,
    TypeFlags,
    isType,
    IContext,
    IValidationResult,
    typeCheckFailure,
    ObjectNode,
    ModelType,
    typeCheckSuccess
} from "../../internal"

export class IdentifierType extends Type<string, string, string> {
    readonly shouldAttachNode = false
    readonly flags = TypeFlags.Identifier

    constructor() {
        super(`identifier`)
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: string
    ): INode {
        if (!parent || !(parent.type instanceof ModelType))
            fail(`Identifier types can only be instantiated as direct child of a model type`)

        return createNode(this, parent, subpath, environment, snapshot)
    }

    reconcile(current: INode, newValue: string) {
        if (current.storedValue !== newValue)
            return fail(
                `Tried to change identifier from '${
                    current.storedValue
                }' to '${newValue}'. Changing identifiers is not allowed.`
            )
        return current
    }

    describe() {
        return `identifier`
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (typeof value !== "string") {
            return typeCheckFailure(
                context,
                value,
                "Value is not a valid identifier, expected a string"
            )
        }
        return typeCheckSuccess()
    }
}

export class IdentifierNumberType extends IdentifierType {
    constructor() {
        super()
        ;(this as any).name = "identifierNumber"
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        return super.instantiate(parent, subpath, environment, snapshot)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (typeof value === "number") {
            return typeCheckSuccess()
        }
        return typeCheckFailure(
            context,
            value,
            "Value is not a valid identifierNumber, expected a number"
        )
    }

    reconcile(current: INode, newValue: any) {
        return super.reconcile(current, newValue)
    }

    getSnapshot(node: INode) {
        return node.storedValue
    }

    describe() {
        return `identifierNumber`
    }
}

/**
 * Identifiers are used to make references, lifecycle events and reconciling works.
 * Inside a state tree, for each type can exist only one instance for each given identifier.
 * For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
 * Identifier can be used only as type property of a model.
 * This type accepts as parameter the value type of the identifier field that can be either string or number.
 *
 * @example
 *  const Todo = types.model("Todo", {
 *      id: types.identifier,
 *      title: types.string
 *  })
 *
 * @export
 * @alias types.identifier
 * @template T
 * @returns {IType<T, T>}
 */
export const identifier: IType<string, string, string> = new IdentifierType()

/**
 * Similar to `types.identifier`, but `identifierNumber` will serialize from / to a number when applying snapshots
 *
 * @example
 *  const Todo = types.model("Todo", {
 *      id: types.identifierNumber,
 *      title: types.string
 *  })
 *
 * @export
 * @alias types.identifierNumber
 * @template T
 * @returns {IType<T, T>}
 */
export const identifierNumber: IType<number, number, number> = new IdentifierNumberType() as any

export function isIdentifierType(type: any): type is IdentifierType | IdentifierNumberType {
    return isType(type) && (type.flags & TypeFlags.Identifier) > 0
}
