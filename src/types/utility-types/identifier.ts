import { TypeFlags, Type, IType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, typecheck } from "../type-checker"
import { fail } from "../../utils"
import { Node, isStateTreeNode } from "../../core"
import { string as stringType, number as numberType } from "../primitives"
import { Late } from "./late"

class Identifier {
    constructor(public identifier: string|number) {}
    toString() {
        return `identifier(${this.identifier})`
    }
}

export class IdentifierType<T> extends Type<T, T> {
    readonly flags = TypeFlags.Identifier

    constructor(
        public readonly identifierType: IType<T, T>,
    ) {
        super(`identifier(${identifierType.name})`)
    }

    instantiate(parent: Node, subpath: string, environment: any, snapshot: T): Node {
        typecheck(this.identifierType, snapshot)
        if (!isStateTreeNode(parent.storedValue))
            fail(`Identifier types can only be instantiated as direct child of a model type`)
        return new Node(this, parent, subpath, environment, snapshot)
    }

    reconcile(current: Node, newValue) {
        if (current.storedValue !== newValue)
            return fail(`Tried to change identifier from '${current.storedValue}' to '${newValue}'. Changing identifiers is not allowed.`)
        return current
    }

    describe() {
        return `identifier(${this.identifierType})`
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (this.identifierType.is(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }
}

export function identifier<T>(baseType: IType<T, T>): T;
export function identifier(): string;
export function identifier(baseType: IType<any, any> = stringType): any {
    // TODO: MWE: this seems contrived, let's not assert anything and support unions, refinements etc.
    if (baseType !== stringType && baseType !== numberType)
        fail(`Only 'types.number' and 'types.string' are acceptable as type specification for identifiers`)
    return new IdentifierType(baseType)
}

export function isIdentifierType(type: any): type is IdentifierType<any> {
    return (!(type instanceof Late)) && // yikes
        (type.flags & (TypeFlags.Identifier)) > 0
}
