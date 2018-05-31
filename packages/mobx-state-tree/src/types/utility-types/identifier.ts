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
    string as stringType,
    ObjectNode,
    ModelType
} from "../../internal"

class Identifier {
    constructor(public identifier: string | number) {}
    toString() {
        return `identifier(${this.identifier})`
    }
}

export class IdentifierType<T> extends Type<T, T> {
    readonly shouldAttachNode = false
    readonly flags = TypeFlags.Identifier

    constructor(public readonly identifierType: IType<T, T>) {
        super(`identifier(${identifierType.name})`)
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: T): INode {
        if (!parent || !(parent.type instanceof ModelType))
            fail(`Identifier types can only be instantiated as direct child of a model type`)

        return createNode(this, parent, subpath, environment, snapshot)
    }

    reconcile(current: INode, newValue: any) {
        if (current.storedValue !== newValue)
            return fail(
                `Tried to change identifier from '${current.storedValue}' to '${newValue}'. Changing identifiers is not allowed.`
            )
        return current
    }

    describe() {
        return `identifier(${this.identifierType.describe()})`
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (
            value === undefined ||
            value === null ||
            typeof value === "string" ||
            typeof value === "number"
        )
            return this.identifierType.validate(value, context)
        return typeCheckFailure(
            context,
            value,
            "Value is not a valid identifier, which is a string or a number"
        )
    }
}

export function identifier<T>(baseType: IType<T, T>): IType<T, T>
export function identifier<T>(): T
/**
 * Identifiers are used to make references, lifecycle events and reconciling works.
 * Inside a state tree, for each type can exist only one instance for each given identifier.
 * For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
 * Identifier can be used only as type property of a model.
 * This type accepts as parameter the value type of the identifier field that can be either string or number.
 *
 * @example
 *  const Todo = types.model("Todo", {
 *      id: types.identifier(types.string),
 *      title: types.string
 *  })
 *
 * @export
 * @alias types.identifier
 * @template T
 * @param {IType<T, T>} baseType
 * @returns {IType<T, T>}
 */
export function identifier(baseType: IType<any, any> = stringType): any {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(baseType))
            fail("expected a mobx-state-tree type as first argument, got " + baseType + " instead")
    }
    return new IdentifierType(baseType)
}

export function isIdentifierType(type: any): type is IdentifierType<any> {
    return isType(type) && (type.flags & TypeFlags.Identifier) > 0
}
