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
    RedefineIStateTreeNode,
    Hook,
    IDisposer,
    ScalarNode,
    maybe,
    isModelType,
    IMaybe,
    NodeLifeCycle,
    ReferenceIdentifier,
    normalizeIdentifier,
    getIdentifier,
    applyPatch,
    joinJsonPath
} from "../../internal"

export type OnReferenceInvalidatedEvent<STN extends IAnyStateTreeNode> = {
    parent: IAnyStateTreeNode
    invalidTarget: STN | undefined
    invalidId: ReferenceIdentifier
    replaceRef: (newRef: STN | null | undefined) => void
    removeRef: () => void
    cause: "detach" | "destroy" | "invalidSnapshotReference"
}

export type OnReferenceInvalidated<STN extends IAnyStateTreeNode> = (
    event: OnReferenceInvalidatedEvent<STN>
) => void

function getInvalidationCause(hook: Hook): "detach" | "destroy" | undefined {
    switch (hook) {
        case Hook.beforeDestroy:
            return "destroy"
        case Hook.beforeDetach:
            return "detach"
        default:
            return undefined
    }
}

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
        const normalizedId = normalizeIdentifier(this.identifier)
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
 * @hidden
 */
export class InvalidReferenceError extends Error {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, InvalidReferenceError.prototype)
    }
}

/**
 * @internal
 * @hidden
 */
export abstract class BaseReferenceType<IT extends IAnyComplexType> extends Type<
    ReferenceIdentifier,
    ReferenceIdentifier,
    RedefineIStateTreeNode<ExtractT<IT>, IStateTreeNode<ReferenceIdentifier, ReferenceIdentifier>>
> {
    readonly shouldAttachNode = false
    readonly flags = TypeFlags.Reference

    constructor(
        protected readonly targetType: IT,
        private readonly onInvalidated?: OnReferenceInvalidated<ExtractT<IT>>
    ) {
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

    private fireInvalidated(
        cause: "detach" | "destroy" | "invalidSnapshotReference",
        storedRefNode: ScalarNode,
        referenceId: ReferenceIdentifier,
        refTargetNode: ObjectNode | null
    ) {
        // to actually invalidate a reference we need an alive parent,
        // since it is a scalar value (immutable-ish) and we need to change it
        // from the parent
        const storedRefParentNode = storedRefNode.parent
        if (!storedRefParentNode || !storedRefParentNode.isAlive) {
            return
        }
        const storedRefParentValue = storedRefParentNode.storedValue
        if (!storedRefParentValue) {
            return
        }
        this.onInvalidated!({
            cause,
            parent: storedRefParentValue,
            invalidTarget: refTargetNode ? refTargetNode.storedValue : undefined,
            invalidId: referenceId,
            replaceRef(newRef) {
                applyPatch(storedRefNode.root.storedValue, {
                    op: "replace",
                    value: newRef,
                    path: storedRefNode.path
                })
            },
            removeRef() {
                if (isModelType(storedRefParentNode.type)) {
                    this.replaceRef(undefined as any)
                } else {
                    applyPatch(storedRefNode.root.storedValue, {
                        op: "remove",
                        path: storedRefNode.path
                    })
                }
            }
        })
    }

    private addTargetNodeWatcher(
        storedRefNode: ScalarNode,
        referenceId: ReferenceIdentifier
    ): IDisposer | undefined {
        // this will make sure the target node becomes created
        const refTargetValue = this.getValue(storedRefNode)
        if (!refTargetValue) {
            return undefined
        }
        const refTargetNode = getStateTreeNode(refTargetValue)

        const hookHandler = (_: ObjectNode, refTargetNodeHook: Hook) => {
            const cause = getInvalidationCause(refTargetNodeHook)
            if (!cause) {
                return
            }
            this.fireInvalidated(cause, storedRefNode, referenceId, refTargetNode)
        }

        const refTargetDetachHookDisposer = refTargetNode.hookSubscribers[
            Hook.beforeDetach
        ].register(hookHandler)
        const refTargetDestroyHookDisposer = refTargetNode.hookSubscribers[
            Hook.beforeDestroy
        ].register(hookHandler)

        return () => {
            refTargetDetachHookDisposer()
            refTargetDestroyHookDisposer()
        }
    }

    protected watchTargetNodeForInvalidations(
        storedRefNode: ScalarNode,
        identifier: ReferenceIdentifier,
        customGetSet: ReferenceOptionsGetSet<IT> | undefined
    ) {
        if (!this.onInvalidated) {
            return
        }

        let onRefTargetDestroyedHookDisposer: IDisposer | undefined

        // get rid of the watcher hook when the stored ref node is destroyed
        // detached is ignored since scalar nodes (where the reference resides) cannot be detached
        storedRefNode.hookSubscribers[Hook.beforeDestroy].register(() => {
            if (onRefTargetDestroyedHookDisposer) {
                onRefTargetDestroyedHookDisposer()
            }
        })

        const startWatching = (sync: boolean) => {
            // re-create hook in case the stored ref gets reattached
            if (onRefTargetDestroyedHookDisposer) {
                onRefTargetDestroyedHookDisposer()
            }

            // make sure the target node is actually there and initialized
            const storedRefParentNode = storedRefNode.parent
            const storedRefParentValue = storedRefParentNode && storedRefParentNode.storedValue
            if (storedRefParentNode && storedRefParentNode.isAlive && storedRefParentValue) {
                let refTargetNodeExists: boolean
                if (customGetSet) {
                    refTargetNodeExists = !!customGetSet.get(identifier, storedRefParentValue)
                } else {
                    refTargetNodeExists = storedRefNode.root.identifierCache!.has(
                        this.targetType,
                        normalizeIdentifier(identifier)
                    )
                }

                if (!refTargetNodeExists) {
                    // we cannot change the reference in sync mode
                    // since we are in the middle of a reconciliation/instantiation and the change would be overwritten
                    // for those cases just let the wrong reference be assigned and fail upon usage
                    // (like current references do)
                    // this means that effectively this code will only run when it is created from a snapshot
                    if (!sync) {
                        this.fireInvalidated(
                            "invalidSnapshotReference",
                            storedRefNode,
                            identifier,
                            null
                        )
                    }
                } else {
                    onRefTargetDestroyedHookDisposer = this.addTargetNodeWatcher(
                        storedRefNode,
                        identifier
                    )
                }
            }
        }

        if (storedRefNode.state === NodeLifeCycle.FINALIZED) {
            // already attached, so the whole tree is ready
            startWatching(true)
        } else {
            if (!storedRefNode.isRoot) {
                // start watching once the whole tree is ready
                storedRefNode.root.hookSubscribers[Hook.afterCreationFinalization].register(() => {
                    // make sure to attach it so it can start listening
                    if (storedRefNode.parent) {
                        storedRefNode.parent.createObservableInstanceIfNeeded()
                    }
                })
            }
            // start watching once the node is attached somewhere / parent changes
            storedRefNode.hookSubscribers[Hook.afterAttach].register(() => {
                startWatching(false)
            })
        }
    }
}

/**
 * @internal
 * @hidden
 */
export class IdentifierReferenceType<IT extends IAnyComplexType> extends BaseReferenceType<IT> {
    constructor(targetType: IT, onInvalidated?: OnReferenceInvalidated<ExtractT<IT>>) {
        super(targetType, onInvalidated)
    }

    getValue(storedRefNode: INode) {
        if (!storedRefNode.isAlive) return undefined
        const storedRef = storedRefNode.storedValue as StoredReference<IT>
        return storedRef.resolvedValue
    }

    getSnapshot(storedRefNode: INode) {
        const ref = storedRefNode.storedValue as StoredReference<IT>
        return ref.identifier
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        newValue: ExtractT<IT> | ReferenceIdentifier
    ): INode {
        const identifier = isStateTreeNode(newValue) ? getIdentifier(newValue)! : newValue
        const storedRef = new StoredReference(newValue, this.targetType)
        const storedRefNode = createNode(
            this,
            parent,
            subpath,
            environment,
            storedRef
        ) as ScalarNode
        storedRef.node = storedRefNode
        this.watchTargetNodeForInvalidations(storedRefNode, identifier, undefined)
        return storedRefNode
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
 * @hidden
 */
export class CustomReferenceType<IT extends IAnyComplexType> extends BaseReferenceType<IT> {
    constructor(
        targetType: IT,
        private readonly options: ReferenceOptionsGetSet<IT>,
        onInvalidated?: OnReferenceInvalidated<ExtractT<IT>>
    ) {
        super(targetType, onInvalidated)
    }

    getValue(storedRefNode: INode) {
        if (!storedRefNode.isAlive) return undefined
        const referencedNode = this.options.get(
            storedRefNode.storedValue,
            storedRefNode.parent ? storedRefNode.parent.storedValue : null
        )
        return referencedNode
    }

    getSnapshot(storedRefNode: INode) {
        return storedRefNode.storedValue as ReferenceIdentifier
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
        const storedRefNode = createNode(
            this,
            parent,
            subpath,
            environment,
            identifier
        ) as ScalarNode
        this.watchTargetNodeForInvalidations(storedRefNode, identifier, this.options)
        return storedRefNode
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

/** @hidden */
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
 * `types.reference` - Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
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
 * @param type
 * @returns
 */
export function isReferenceType<IT extends IReferenceType<any>>(type: IT): type is IT {
    return (type.flags & TypeFlags.Reference) > 0
}

/**
 * `types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default
 * and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps
 * when the reference it is pointing to gets detached/destroyed.
 *
 * Strictly speaking it is a `types.maybe(types.reference(X))` with a customized `onInvalidate` option.
 *
 * @param subType
 * @param options
 * @returns
 */
export function safeReference<IT extends IAnyComplexType>(
    subType: IT,
    options?: ReferenceOptionsGetSet<IT>
): IMaybe<IReferenceType<IT>> {
    return maybe(
        reference(subType, {
            ...options,
            onInvalidated(ev) {
                ev.removeRef()
            }
        })
    )
}
