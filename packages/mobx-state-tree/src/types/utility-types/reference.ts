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
    IAnyStateTreeNode,
    IAnyComplexType,
    IStateTreeNode,
    RedefineIStateTreeNode
} from "../../internal"

export type OnReferenceInvalidated<STN extends IAnyStateTreeNode> = (
    event: {
        parent: IAnyStateTreeNode | undefined
        oldRef: STN
        setNewRef: (newRef: STN | undefined | null) => void
        cause: "detach" | "destroy"
    }
) => void

export type ReferenceIdentifier = string | number

class StoredReference<IT extends IAnyType> {
    readonly identifier!: ReferenceIdentifier
    node!: INode

    private resolvedReference?: {
        node: ObjectNode
        lastCacheModification: string
    }

    constructor(value: ExtractT<IT> | ReferenceIdentifier, private readonly targetType: IT) {
        if (typeof value === "string" || typeof value === "number") {
            this.identifier = value
        } else if (isStateTreeNode(value)) {
            const targetNode = getStateTreeNode(value)
            if (!targetNode.identifierAttribute)
                return fail(`Can only store references with a defined identifier attribute.`)
            const id = targetNode.unnormalizedIdentifier
            if (id === null || id === undefined) {
                return fail(`Can only store references to tree nodes with a defined identifier.`)
            }
            this.identifier = id
        } else {
            return fail(`Can only store references to tree nodes or identifiers, got: '${value}'`)
        }
    }

    private updateResolvedReference(node: INode) {
        const normalizedId = "" + this.identifier
        const lastCacheModification = node.root.identifierCache!.getLastCacheModificationPerId(
            normalizedId
        )
        if (
            !this.resolvedReference ||
            this.resolvedReference.lastCacheModification !== lastCacheModification
        ) {
            const { targetType } = this
            // reference was initialized with the identifier of the target

            const target = node.root.identifierCache!.resolve(targetType, normalizedId)

            if (!target) {
                throw new InvalidReferenceError(
                    `[mobx-state-tree] Failed to resolve reference '${this.identifier}' to type '${
                        this.targetType.name
                    }' (from node: ${node.path})`
                )
            }

            this.resolvedReference = {
                node: target!,
                lastCacheModification: lastCacheModification
            }
        }
    }

    get resolvedValue(): ExtractT<IT> {
        this.updateResolvedReference(this.node)
        return this.resolvedReference!.node.value
    }
}

/**
 * @internal
 * @private
 */
export class InvalidReferenceError extends Error {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, InvalidReferenceError.prototype)
    }
}

/**
 * @internal
 * @private
 */
export abstract class BaseReferenceType<IT extends IAnyComplexType> extends Type<
    ReferenceIdentifier,
    ReferenceIdentifier,
    RedefineIStateTreeNode<ExtractT<IT>, IStateTreeNode<ReferenceIdentifier, ReferenceIdentifier>>
> {
    readonly shouldAttachNode = false
    readonly flags = TypeFlags.Reference

    constructor(protected readonly targetType: IT) {
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
export class IdentifierReferenceType<IT extends IAnyComplexType> extends BaseReferenceType<IT> {
    constructor(
        targetType: IT,
        private readonly onInvalidated?: OnReferenceInvalidated<ExtractT<IT>>
    ) {
        super(targetType)
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        const storedRef = node.storedValue as StoredReference<IT>
        return storedRef.resolvedValue
    }

    getSnapshot(node: INode) {
        const ref = node.storedValue as StoredReference<IT>
        return ref.identifier
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        newValue: ExtractT<IT> | ReferenceIdentifier
    ): INode {
        const storedRef = new StoredReference(newValue, this.targetType)
        const node = createNode(this, parent, subpath, environment, storedRef)
        storedRef.node = node
        // TODO: add reaction on after creation
        return node
    }

    reconcile(current: INode, newValue: ExtractT<IT> | ReferenceIdentifier): INode {
        if (current.type === this) {
            const compareByValue = isStateTreeNode(newValue)
            const ref = current.storedValue as StoredReference<IT>
            if (!compareByValue && ref.identifier === newValue) return current
            else if (compareByValue && ref.resolvedValue === newValue) return current
        }
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current.environment,
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
export class CustomReferenceType<IT extends IAnyComplexType> extends BaseReferenceType<IT> {
    constructor(
        targetType: IT,
        private readonly options: ReferenceOptionsGetSet<IT>,
        private readonly onInvalidated?: OnReferenceInvalidated<ExtractT<IT>>
    ) {
        super(targetType)
    }

    getValue(node: INode) {
        if (!node.isAlive) return undefined
        const referencedNode = this.options.get(
            node.storedValue,
            node.parent ? node.parent.storedValue : null
        )
        return referencedNode
    }

    getSnapshot(node: INode) {
        return node.storedValue as ReferenceIdentifier
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        newValue: ExtractT<IT> | ReferenceIdentifier
    ): INode {
        const identifier = isStateTreeNode(newValue)
            ? this.options.set(newValue, parent ? parent.storedValue : null)
            : newValue
        const node = createNode(this, parent, subpath, environment, identifier)
        // TODO: add reaction on after creation
        return node
    }

    reconcile(current: INode, newValue: ExtractT<IT> | ReferenceIdentifier): INode {
        const newIdentifier = isStateTreeNode(newValue)
            ? this.options.set(newValue, current ? current.storedValue : null)
            : newValue
        if (current.type === this && current.storedValue === newIdentifier) {
            return current
        }
        const newNode = this.instantiate(
            current.parent,
            current.subpath,
            current.environment,
            newIdentifier
        )
        current.die()
        return newNode
    }
}

export interface ReferenceOptionsGetSet<IT extends IAnyComplexType> {
    get(identifier: ReferenceIdentifier, parent: IAnyStateTreeNode | null): ExtractT<IT>
    set(value: ExtractT<IT>, parent: IAnyStateTreeNode | null): ReferenceIdentifier
}

export interface ReferenceOptionsOnInvalidated<IT extends IAnyComplexType> {
    // called when the current reference is about to become invalid
    onInvalidated: OnReferenceInvalidated<ExtractT<IT>>
}

export type ReferenceOptions<IT extends IAnyComplexType> =
    | ReferenceOptionsGetSet<IT>
    | ReferenceOptionsOnInvalidated<IT>
    | (ReferenceOptionsGetSet<IT> & ReferenceOptionsOnInvalidated<IT>)

export interface IReferenceType<IT extends IAnyComplexType>
    extends IType<
            ReferenceIdentifier,
            ReferenceIdentifier,
            RedefineIStateTreeNode<
                ExtractT<IT>,
                IStateTreeNode<ReferenceIdentifier, ReferenceIdentifier>
            >
        > {}

/**
 * Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
 *
 * @export
 * @alias types.reference
 */
export function reference<IT extends IAnyComplexType>(
    subType: IT,
    options?: ReferenceOptions<IT>
): IReferenceType<IT> {
    // check that a type is given
    if (process.env.NODE_ENV !== "production") {
        if (!isType(subType))
            fail("expected a mobx-state-tree type as first argument, got " + subType + " instead")
        if (arguments.length === 2 && typeof arguments[1] === "string")
            fail("References with base path are no longer supported. Please remove the base path.")
    }

    const getSetOptions = options ? (options as ReferenceOptionsGetSet<IT>) : undefined
    const onInvalidated = options
        ? (options as ReferenceOptionsOnInvalidated<IT>).onInvalidated
        : undefined

    if (getSetOptions && (getSetOptions.get || getSetOptions.set)) {
        if (process.env.NODE_ENV !== "production") {
            if (!getSetOptions.get || !getSetOptions.set) {
                fail(
                    "reference options must either contain both a 'get' and a 'set' method or none of them"
                )
            }
        }

        return new CustomReferenceType(
            subType,
            {
                get: getSetOptions.get,
                set: getSetOptions.set
            },
            onInvalidated
        ) as any
    } else {
        return new IdentifierReferenceType(subType, onInvalidated) as any
    }
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
