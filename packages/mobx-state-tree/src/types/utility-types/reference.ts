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
    IAnyType,
    ExtractT,
    IComplexType,
    IAnyStateTreeNode,
    IAnyComplexType
} from "../../internal"

class StoredReference {
    node!: INode
    readonly identifier!: string | number

    private resolvedNode?: {
        node: ObjectNode
        lastCacheModification: number
    }

    constructor(mode: "identifier" | "object", value: any, private readonly targetType: IAnyType) {
        if (mode === "object") {
            if (!isStateTreeNode(value))
                return fail(
                    `Can only store references to tree nodes or identifiers, got: '${value}'`
                )
            const targetNode = getStateTreeNode(value)
            if (!targetNode.identifierAttribute)
                return fail(`Can only store references with a defined identifier attribute.`)
            const id = targetNode.unnormalizedIdentifier
            if (id === null || id === undefined) {
                return fail(`Can only store references to tree nodes with a defined identifier.`)
            }
            this.identifier = id
        } else {
            this.identifier = value
        }
    }

    updateResolvedNode() {
        const normalizedId = "" + this.identifier
        const { node } = this
        const lastCacheModification = node.root.identifierCache!.getLastCacheModificationPerId(
            normalizedId
        )
        if (
            !this.resolvedNode ||
            this.resolvedNode.lastCacheModification !== lastCacheModification
        ) {
            const { targetType } = this
            // reference was initialized with the identifier of the target
            const target = node.root.identifierCache!.resolve(targetType, normalizedId)
            if (!target)
                fail(
                    `Failed to resolve reference '${this.identifier}' to type '${
                        this.targetType.name
                    }' (from node: ${node.path})`
                )
            this.resolvedNode = {
                node: target!,
                lastCacheModification: lastCacheModification
            }
        }
    }

    get resolvedValue() {
        return this.resolvedNode!.node.value
    }
}

/**
 * @internal
 * @private
 */
export abstract class BaseReferenceType<T> extends Type<string | number | T, string | number, T> {
    readonly shouldAttachNode = false
    readonly flags = TypeFlags.Reference

    constructor(protected readonly targetType: IType<any, any, T>) {
        super(`reference(${targetType.name})`)
    }

    describe() {
        return this.name
    }

    isAssignableFrom(type: IAnyType): boolean {
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

/**
 * @internal
 * @private
 */
export class IdentifierReferenceType<T> extends BaseReferenceType<T> {
    constructor(targetType: IType<any, any, T>) {
        super(targetType)
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        const ref = node.storedValue as StoredReference

        ref.updateResolvedNode()
        return ref.resolvedValue
    }

    getSnapshot(node: INode): any {
        const ref = node.storedValue as StoredReference
        return ref.identifier
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        const mode = isStateTreeNode(snapshot) ? "object" : "identifier"
        let r
        const node = createNode(
            this,
            parent,
            subpath,
            environment,
            (r = new StoredReference(mode, snapshot, this.targetType))
        )
        r.node = node
        return node
    }

    reconcile(current: INode, newValue: any): INode {
        if (current.type === this) {
            const targetMode = isStateTreeNode(newValue) ? "object" : "identifier"
            const ref = current.storedValue as StoredReference
            if (targetMode === "identifier" && ref.identifier === newValue) return current
            else if (targetMode === "object") {
                ref.updateResolvedNode()
                if (ref.resolvedValue === newValue) return current
            }
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

/**
 * @internal
 * @private
 */
export class CustomReferenceType<T> extends BaseReferenceType<T> {
    constructor(targetType: IType<any, any, T>, private readonly options: ReferenceOptions<T>) {
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

export interface ReferenceOptions<T> {
    get(identifier: string | number, parent: IAnyStateTreeNode | null): T
    set(value: T, parent: IAnyStateTreeNode | null): string | number
}

export interface IReferenceType<IR extends IAnyComplexType>
    extends IComplexType<string | number | ExtractT<IR>, string | number, ExtractT<IR>> {}

/**
 * Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
 *
 * @export
 * @alias types.reference
 */
export function reference<IT extends IAnyComplexType>(
    subType: IT,
    options?: ReferenceOptions<ExtractT<IT>>
): IReferenceType<IT> {
    // check that a type is given
    if (process.env.NODE_ENV !== "production") {
        if (!isType(subType))
            fail("expected a mobx-state-tree type as first argument, got " + subType + " instead")
        if (arguments.length === 2 && typeof arguments[1] === "string")
            fail("References with base path are no longer supported. Please remove the base path.")
    }
    // as any because getValue might actually return undefined if the node is not alive
    if (options) return new CustomReferenceType(subType, options) as any
    else return new IdentifierReferenceType(subType)
}

/**
 * Returns if a given value represents a reference type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isReferenceType<IT extends IReferenceType<any>>(type: IT): type is IT {
    return (type.flags & TypeFlags.Reference) > 0
}
