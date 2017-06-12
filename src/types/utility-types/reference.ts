import { getStateTreeNode, isStateTreeNode, Node, createNode } from "../../core"
import { TypeFlags, Type, IType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, prettyPrintValue } from "../type-checker"
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
    ) {
        if (mode === "object") {
            if (!isStateTreeNode(value))
                return fail(`Can only store references to tree nodes, got: '${value}'`)
            const targetNode = getStateTreeNode(value)
            if (!targetNode.identifierAttribute)
                return fail(`Can only store references with a defined identifier attribute.`)
        }
    }
}

export class ReferenceType<T> extends Type<ReferenceSnapshot, T> {
    readonly snapshottable = true
    readonly flags = TypeFlags.Reference

    constructor(
        private readonly targetType: IType<any, T>
    ) {
        // TODO: check if targetType is object type? Or does that break late types? Do it in instantiate
        super(`reference(${targetType.name})`)
    }

    describe() {
        return this.name
    }

    getValue(node: Node) {
        const ref = node.storedValue as StoredReference
        if (ref.mode === "object")
            return ref.value

        // reference was initialized with the identifier of the target
        const target = node.root.identifierCache!.resolve(this.targetType, ref.value)
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
        return createNode(this, parent, subpath, environment, new StoredReference(
            isComplex ? "object" : "identifier",
            snapshot
        ))
    }

    reconcile(current: Node, newValue: any): Node {
        const targetMode = isStateTreeNode(newValue) ? "object" : "identifier"
        if (isReferenceType(current.type)) {
            const ref = current.storedValue as StoredReference
            if (targetMode === ref.mode && ref.value === newValue)
                return current
        }
        const newNode = this.instantiate(current.parent, current.subpath, current._environment, newValue)
        current.die()
        return newNode
    }

    isAssignableFrom(type: IType<any, any>): boolean {
        return this.targetType.isAssignableFrom(type)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return (typeof value === "string" || typeof value === "number")
            ? typeCheckSuccess()
            : typeCheckFailure(context, value, `Value '${prettyPrintValue(value)}' is not a valid reference. Expected a string or number.`)
    }
}

// TODO support get / set
export function reference<T>(factory: IType<any, T>): IType<string | number, T>
export function reference<T>(factory: IType<any, T>): any {
    if (arguments.length === 2 && typeof arguments[1] === "string")
        fail("References with base path are no longer supported. Please remove the base path.")
    return new ReferenceType(factory)
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & (TypeFlags.Reference)) > 0
}
