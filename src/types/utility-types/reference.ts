import { getStateTreeNode, isStateTreeNode, Node } from "../../core"
import { TypeFlags, Type, IType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess } from "../type-checker"
import { fail } from "../../utils"

// TODO: eleminate IReference stuff
export interface IReference {
    $ref: string
}

export type ReferenceSnapshot = string | null | IReference

class StoredReference {
    constructor(
        public mode: "identifier" | "object",
        public value: any
    ) {}
}

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
        const ref = node.storedValue as StoredReference
        if (ref.mode === "object")
            return ref.value

        // reference was initialized with the identifier of the target
        const target = node.root.identifierCache.resolve(this.targetType, ref.value)
        if (!target)
            return fail(`Failed to resolve reference of type ${this.targetType.name}: '${ref.value}' (in: ${node.path})`)
        return target.getValue()
    }

    getSnapshot(node: Node): any {
        const ref = node.storedValue as StoredReference
        switch (ref.mode) {
            case "identifier":
                return ref.value
            case "object":
                return getStateTreeNode(ref.value).identifier
        }
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any): Node {
        const isComplex = isStateTreeNode(snapshot)
        return new Node(this, parent, subpath, environment, new StoredReference(
            isComplex ? "object" : "identifier",
            snapshot
        ))
    }

    reconcile(current: Node, newValue: any): Node {
        const targetMode = isStateTreeNode(newValue) ? "object" : "identifier"
        const ref = current.storedValue as StoredReference
        if (targetMode === ref.mode && ref.value === newValue)
            return current
        current.die()
        return this.instantiate(current.parent, current.subpath, current._environment, newValue)
    }

    isAssignableFrom(type: IType<any, any>): boolean {
        return this.targetType.isAssignableFrom(type)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // TODO: check if reference is valid
        // return (typeof value === "string" || typeof value === "string") ? typeCheckSuccess() : typeCheckFailure(value, context)
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
