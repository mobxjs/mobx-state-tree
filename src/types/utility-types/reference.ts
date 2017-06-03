import { computed } from "mobx"
import { isComplexValue, Node } from '../../core';
import { ISimpleType, TypeFlags, Type, IType, ComplexType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, typecheck } from "../type-checker"
import { isPrimitive, fail } from "../../utils"


export interface IReference {
    $ref: string
}

export type ReferenceSnapshot = string | null | IReference

export class ReferenceType<T> extends Type<ReferenceSnapshot, T> {
    readonly flags = TypeFlags.Reference

    constructor(
        private readonly targetType: IType<any, T>
    ) {
        super(`reference(${targetType.name})`)
    }

    // TODO: inistiate should check if identifier is wellformed / node is of proper type and has an identifier

    describe() {
        return this.name
    }

    getValue(node: Node) {
        // Optimization: should be cached on the node
        if (isComplexValue(node.storedValue)) {
            // reference was initialized with a real value
            return node.storedValue
        }
        // reference was initialized with the identifier of the target
        const target = node.root.identifierCache.resolve(this.targetType, node.storedValue)
        if (!target)
            return fail(`Failed to resolve reference of type ${this.targetType.name}: '${node.storedValue}' (in: ${node.path})`)
        return target.getValue()
    }

    getSnapshot(node: Node): any {
        if (isComplexValue(node.storedValue)) {
            // TODO: should we chach whether target is actually in the tree?
            return node.identifier
        }
        return node.storedValue
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // TODO: check if reference is valid
        return typeCheckSuccess()
    }
}

// TODO: fix; handle paths deeply to elements with multiple id's in it correctly....
// TODO: fix, references are not mentioned in type.describe...
// TODO: make distinction between nullable and non-nullable refs?
// TODO: verify ref is requird in non-nullable snapshos and vice versa
// TODO support get / set
export function reference<T>(factory: IType<any, T>): IType<{ $ref: string }, T | null>;
export function reference<T>(factory: IType<any, T>): any {
    if (arguments.length === 2 && typeof arguments[1] === "string")
        fail("References with base path are no longer supported. Please remove the base path.")
    // FIXME: IType return type is inconsistent with what is actually returned, however, results in the best type-inference results for objects...
    return new ReferenceType(factory)
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & (TypeFlags.Reference)) > 0
}
