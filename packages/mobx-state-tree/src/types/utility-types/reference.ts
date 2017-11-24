import {
    getStateTreeNode,
    isStateTreeNode,
    INode,
    createNode,
    Type,
    IType,
    TypeFlags,
    isType,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    fail
} from "../../internal"
import { IStateTreeNode } from "../../index"

class StoredReference {
    constructor(public readonly mode: "identifier" | "object", public readonly value: any) {
        if (mode === "object") {
            if (!isStateTreeNode(value))
                return fail(`Can only store references to tree nodes, got: '${value}'`)
            const targetNode = getStateTreeNode(value)
            if (!targetNode.identifierAttribute)
                return fail(`Can only store references with a defined identifier attribute.`)
        }
    }
}

export class ReferenceType<T> extends Type<string | number, T> {
    readonly shouldAttachNode = true
    readonly flags = TypeFlags.Reference

    constructor(
        private readonly targetType: IType<any, T>,
        private readonly options?: ReferenceOptions<T>
    ) {
        super(`reference(${targetType.name})`)
    }

    get isCustomReference() {
        return !!this.options
    }

    describe() {
        return this.name
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        const ref = node.storedValue as StoredReference

        if (!this.isCustomReference) {
            // id already resolved, return
            if (ref.mode === "object") return ref.value

            // reference was initialized with the identifier of the target
            const target = node.root.identifierCache!.resolve(this.targetType, ref.value)
            if (!target)
                return fail(
                    `Failed to resolve reference of type ${this.targetType
                        .name}: '${ref.value}' (in: ${node.path})`
                )
            return target.value
        } else {
            return this.options!.get(ref.value, node.parent ? node.parent.storedValue : null)
        }
    }

    getSnapshot(node: INode): any {
        const ref = node.storedValue as StoredReference
        switch (ref.mode) {
            case "identifier":
                return ref.value
            case "object":
                return getStateTreeNode(ref.value).identifier
        }
    }

    instantiate(parent: INode | null, subpath: string, environment: any, snapshot: any): INode {
        const isComplex = isStateTreeNode(snapshot)
        if (!this.isCustomReference)
            return createNode(
                this,
                parent,
                subpath,
                environment,
                new StoredReference(isComplex ? "object" : "identifier", snapshot)
            )
        else
            return createNode(
                this,
                parent,
                subpath,
                environment,
                new StoredReference(
                    "identifier",
                    isComplex
                        ? this.options!.set(snapshot, parent ? parent.storedValue : null)
                        : snapshot
                )
            )
    }

    reconcile(current: INode, newValue: any): INode {
        const targetMode = isStateTreeNode(newValue) ? "object" : "identifier"
        if (isReferenceType(current.type)) {
            const ref = current.storedValue as StoredReference
            if (targetMode === ref.mode && ref.value === newValue) return current
        }
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current._environment,
            newValue
        )
        current.die()
        return newNode
    }

    isAssignableFrom(type: IType<any, any>): boolean {
        return this.targetType.isAssignableFrom(type)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return typeof value === "string" || typeof value === "number"
            ? typeCheckSuccess()
            : typeCheckFailure(
                  context,
                  value,
                  "Value is not a valid identifier, which is a string or a number"
              )
    }
}

export type ReferenceOptions<T> = {
    get(identifier: string | number, parent: IStateTreeNode | null): T
    set(value: T, parent: IStateTreeNode | null): string | number
}

export function reference<T>(
    factory: IType<any, T>,
    options?: ReferenceOptions<T>
): IType<string | number, T>
/**
 * Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
 *
 * @export
 * @alias types.reference
 */
export function reference<T>(subType: IType<any, T>, options?: ReferenceOptions<T>): any {
    // check that a type is given
    if (process.env.NODE_ENV !== "production") {
        if (!isType(subType))
            fail("expected a mobx-state-tree type as first argument, got " + subType + " instead")
        if (arguments.length === 2 && typeof arguments[1] === "string")
            fail("References with base path are no longer supported. Please remove the base path.")
    }
    return new ReferenceType(subType, options)
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & TypeFlags.Reference) > 0
}
