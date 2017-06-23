import { Type, IType } from "../type"
import { TypeFlags } from "../type-flags"
import { IContext, IValidationResult, typeCheckFailure } from "../type-checker"
import { fail } from "../../utils"
import { Node, createNode, isStateTreeNode } from "../../core"
import { string as stringType } from "../primitives"

class Identifier {
    constructor(public identifier: string | number) {}
    toString() {
        return `identifier(${this.identifier})`
    }
}

export class IdentifierType<T> extends Type<T, T> {
    readonly flags = TypeFlags.Identifier

    constructor(public readonly identifierType: IType<T, T>) {
        super(`identifier(${identifierType.name})`)
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: T): Node {
        if (!parent || !isStateTreeNode(parent.storedValue))
            return fail(`Identifier types can only be instantiated as direct child of a model type`)

        if (parent.identifierAttribute)
            fail(
                `Cannot define property '${subpath}' as object identifier, property '${parent.identifierAttribute}' is already defined as identifier property`
            )
        parent.identifierAttribute = subpath
        return createNode(this, parent, subpath, environment, snapshot)
    }

    reconcile(current: Node, newValue: any) {
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
        if (value === undefined || value === null || typeof value === "string" || typeof value === "number")
            return this.identifierType.validate(value, context)
        return typeCheckFailure(context, value, "References should be a primitive value")
    }
}

export function identifier<T>(baseType: IType<T, T>): IType<T, T>
export function identifier<T>(): T
export function identifier(baseType: IType<any, any> = stringType): any {
    return new IdentifierType(baseType)
}
