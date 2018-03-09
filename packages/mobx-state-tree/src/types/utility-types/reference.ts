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
    fail,
    ObjectNode,
    IStateTreeNode
} from "../../internal"

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

export abstract class BaseReferenceType<T> extends Type<string | number, T> {
    readonly flags = TypeFlags.Reference

    constructor(protected readonly targetType: IType<any, T>) {
        super(`reference(${targetType.name})`)
    }

    describe() {
        return this.name
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

export class IdentifierReferenceType<T> extends BaseReferenceType<T> {
    readonly shouldAttachNode = true

    constructor(targetType: IType<any, T>) {
        super(targetType)
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        const ref = node.storedValue as StoredReference

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

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        return createNode(
            this,
            parent,
            subpath,
            environment,
            new StoredReference(isStateTreeNode(snapshot) ? "object" : "identifier", snapshot)
        )
    }

    reconcile(current: INode, newValue: any): INode {
        if (current.type === this) {
            const targetMode = isStateTreeNode(newValue) ? "object" : "identifier"
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
}

export class CustomReferenceType<T> extends BaseReferenceType<T> {
    readonly shouldAttachNode = false

    constructor(targetType: IType<any, T>, private readonly options: ReferenceOptions<T>) {
        super(targetType)
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        return this.options.get(node.storedValue, node.parent ? node.parent.storedValue : null)
    }

    getSnapshot(node: INode): any {
        return node.storedValue
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        const identifier = isStateTreeNode(snapshot)
            ? this.options.set(snapshot as T, parent ? parent.storedValue : null)
            : snapshot
        return createNode(this, parent, subpath, environment, identifier)
    }

    reconcile(current: INode, snapshot: any): INode {
        const newIdentifier = isStateTreeNode(snapshot)
            ? this.options.set(snapshot as T, current ? current.storedValue : null)
            : snapshot
        if (current.type === this) {
            if (current.storedValue === newIdentifier) return current
        }
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current._environment,
            newIdentifier
        )
        current.die()
        return newNode
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
    if (options) return new CustomReferenceType(subType, options)
    else return new IdentifierReferenceType(subType)
}

export function isReferenceType(type: any): type is BaseReferenceType<any> {
    return (type.flags & TypeFlags.Reference) > 0
}
