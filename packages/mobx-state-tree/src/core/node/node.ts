import {
    NodeLifeCycle,
    Hook,
    escapeJsonPath,
    EventHandlers,
    IAnyType,
    IDisposer,
    SimpleType,
    ComplexType,
    freeze,
    IMiddlewareEvent,
    IJsonPatch,
    ReferenceIdentifier,
    IdentifierCache,
    IMiddleware,
    normalizeIdentifier,
    invalidateComputed,
    EMPTY_OBJECT,
    getLivelinessChecking,
    warnError,
    getCurrentActionContext,
    getPath,
    convertChildNodesToArray,
    createActionInvoker,
    splitJsonPath,
    resolveNodeByPathParts,
    addHiddenFinalProp,
    toJSON,
    IReversibleJsonPatch,
    extend,
    splitPatch,
    IMiddlewareHandler,
    ArgumentTypes,
    fail
} from "../../internal"
import {
    createAtom,
    IAtom,
    action,
    _allowStateChangesInsideComputed,
    computed,
    IComputedValue,
    reaction
} from "mobx"

// note about hooks for scalar nodes:
// - afterCreate is not emmited in scalar nodes, since it would be emitted in the
//   constructor, before it can be subscribed by anybody
// - afterCreationFinalization could be emitted, but there's no need for it right now
// - beforeDetach is never emitted for scalar nodes, since they cannot be detached

type HookSubscribers = {
    [Hook.afterAttach]: (node: Node, hook: Hook) => void
    [Hook.afterCreate]: (node: Node, hook: Hook) => void
    [Hook.afterCreationFinalization]: (node: Node, hook: Hook) => void
    [Hook.beforeDestroy]: (node: Node, hook: Hook) => void
    [Hook.beforeDetach]: (node: Node, hook: Hook) => void
}

/**
 * @internal
 * @hidden
 */
export const enum NodeKind {
    Scalar,
    Object
}

/**
 * @internal
 * @hidden
 */
export type ParentNode = NodeObj | null

/**
 * @internal
 * @hidden
 */
declare const $nodeTypes: unique symbol

/**
 * @internal
 * @hidden
 */
export interface Node<K extends NodeKind = any, C = any, S = any, T = any> {
    // fake, only for typings
    readonly [$nodeTypes]?: [C, S, T]

    readonly __isMstNode: true
    readonly kind: K
    _escapedSubpath?: string
    subpath: string
    subpathUponDeath?: string
    pathUponDeath?: string
    storedValue: T // usually the same type as the value, but not always (such as with references)
    _aliveAtom?: IAtom
    _state: NodeLifeCycle
    _hookSubscribers?: EventHandlers<HookSubscribers>
    parent: ParentNode
    readonly type: IAnyType
    environment: any
    _pathAtom?: IAtom
    snapshotPostProcessors?: ((sn: any) => S)[]
    toString(): string
}

/**
 * @internal
 * @hidden
 */
export interface NodeScalar<C = any, S = any, T = any> extends Node<NodeKind.Scalar, C, S, T> {
    readonly type: SimpleType<C, S, T>
}

/**
 * @internal
 * @hidden
 */
export interface NodeObj<C = any, S = any, T = any> extends Node<NodeKind.Object, C, S, T> {
    readonly type: ComplexType<C, S, T>
    readonly nodeId: number
    readonly identifierAttribute?: string
    identifier: string | null // Identifier is always normalized to string, even if the identifier property isn't
    unnormalizedIdentifier: ReferenceIdentifier | null
    identifierCache?: IdentifierCache
    isProtectionEnabled: boolean
    middlewares?: IMiddleware[]
    _applyPatches?: (patches: IJsonPatch[]) => void
    _applySnapshot?: (snapshot: C) => void
    _autoUnbox: boolean
    _isRunningAction: boolean // only relevant for root
    _hasSnapshotReaction: boolean
    _observableInstanceState: ObservableInstanceLifecycle
    _childNodes: IChildNodesMap
    readonly _initialSnapshot: C
    _cachedInitialSnapshot?: S
    _cachedInitialSnapshotCreated: boolean
    _snapshotUponDeath?: S
    readonly computedSnapshot: IComputedValue<S>
    readonly unbox: (childNode: Node) => any
    _internalEvents?: EventHandlers<InternalEventHandlers<S>>
}

// #region Object node

let nextNodeId = 1

const enum ObservableInstanceLifecycle {
    // the actual observable instance has not been created yet
    UNINITIALIZED,
    // the actual observable instance is being created
    CREATING,
    // the actual observable instance has been created
    CREATED
}

const enum InternalEvents {
    Dispose = "dispose",
    Patch = "patch",
    Snapshot = "snapshot"
}

/**
 * @internal
 * @hidden
 */
export interface IChildNodesMap {
    [key: string]: Node
}

const snapshotReactionOptions = {
    onError(e: any) {
        throw e
    }
}

type InternalEventHandlers<S> = {
    [InternalEvents.Dispose]: IDisposer
    [InternalEvents.Patch]: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
    [InternalEvents.Snapshot]: (snapshot: S) => void
}

// #endregion

function isNodeObj<C, S, T>(node: Node<any, C, S, T>): node is NodeObj<C, S, T> {
    return node.kind === NodeKind.Object
}

function isNodeScalar<C, S, T>(node: Node<any, C, S, T>): node is NodeScalar<C, S, T> {
    return node.kind === NodeKind.Scalar
}

function nodeToString(node: Node): string {
    let identifier = ""
    if (isNodeObj(node)) {
        identifier = node.identifier ? `(id: ${node.identifier})` : ""
    }
    return `${node.type.name}@${nodeOps.getPath(node) || "<root>"}${identifier}${
        nodeOps.isAlive(node) ? "" : "[dead]"
    }`
}

/**
 * @internal
 * @hidden
 */
export const nodeOps = {
    isNodeObj,
    isNodeScalar,

    createScalarNode<C, S, T>(
        type: SimpleType<C, S, T>,
        parent: ParentNode,
        subpath: string,
        environment: any,
        initialValue: C
    ): NodeScalar<C, S, T> {
        const node: NodeScalar<C, S, T> = {
            __isMstNode: true,
            kind: NodeKind.Scalar,
            type,
            toString() {
                return nodeToString(node)
            },
            parent,
            subpath,
            environment,
            _state: NodeLifeCycle.INITIALIZING,
            storedValue: undefined as any // set later
        }

        try {
            node.storedValue = type.createNewInstance(initialValue)
        } catch (e) {
            // short-cut to die the instance, to avoid the snapshot computed starting to throw...
            nodeOps.setState(node, NodeLifeCycle.DEAD)
            throw e
        }

        nodeOps.setState(node, NodeLifeCycle.CREATED)

        // for scalar nodes there's no point in firing this event since it would fire on the constructor, before
        // anybody can actually register for/listen to it
        // nodeOps.fireHook(node, Hook.AfterCreate)

        nodeOps.finalizeCreation(node)

        return node
    },

    createObjectNode<C, S, T>(
        type: ComplexType<C, S, T>,
        parent: ParentNode,
        subpath: string,
        environment: any,
        initialValue: C
    ): NodeObj<C, S, T> {
        const initialSnapshot = freeze(initialValue)

        const node: NodeObj<C, S, T> = {
            __isMstNode: true,
            kind: NodeKind.Object,
            type,
            toString() {
                return nodeToString(node)
            },
            parent,
            subpath,
            environment,
            _state: NodeLifeCycle.INITIALIZING,
            storedValue: undefined as any, // set later

            // object node stuff
            nodeId: nextNodeId++,
            isProtectionEnabled: true,
            _autoUnbox: true,
            _isRunningAction: false,
            _hasSnapshotReaction: false,
            _observableInstanceState: ObservableInstanceLifecycle.UNINITIALIZED,
            _cachedInitialSnapshotCreated: false,
            _initialSnapshot: initialSnapshot,
            identifierAttribute: type.identifierAttribute,
            identifierCache: !parent ? new IdentifierCache() : undefined,
            identifier: null,
            unnormalizedIdentifier: null,

            // advantage of using computed for a snapshot is that nicely respects transactions etc.
            computedSnapshot: computed(() => freeze(nodeOps.getSnapshot(node))),
            unbox: childNode => {
                if (childNode)
                    objNodeOps.assertAlive(node, {
                        subpath: childNode.subpath || childNode.subpathUponDeath
                    })
                if (childNode && node._autoUnbox) return nodeOps.valueOf(childNode)
                return childNode
            },

            _childNodes: undefined as any // set later
        }

        node._childNodes = type.initializeChildNodes(node, initialSnapshot)

        // identifier can not be changed during lifecycle of a node
        // so we safely can read it from initial snapshot
        if (node.identifierAttribute && node._initialSnapshot) {
            let id = (node._initialSnapshot as any)[node.identifierAttribute]
            if (id === undefined) {
                // try with the actual node if not (for optional identifiers)
                const childNode = node._childNodes[node.identifierAttribute]
                if (childNode) {
                    id = nodeOps.valueOf(childNode)
                }
            }

            if (typeof id !== "string" && typeof id !== "number") {
                throw fail(
                    `Instance identifier '${node.identifierAttribute}' for type '${
                        node.type.name
                    }' must be a string or a number`
                )
            }

            // normalize internal identifier to string
            node.identifier = normalizeIdentifier(id)
            node.unnormalizedIdentifier = id
        }

        if (!parent) {
            node.identifierCache!.addNodeToCache(node)
        } else {
            nodeOps.getRoot(parent)!.identifierCache!.addNodeToCache(node)
        }

        return node
    },

    valueOf(node: Node) {
        return (node.type as SimpleType<any, any, any> | ComplexType<any, any, any>).getValue(
            node as any
        )
    },

    setState(node: Node, val: NodeLifeCycle) {
        const wasAlive = nodeOps.isAlive(node)
        node._state = val
        const isAlive = nodeOps.isAlive(node)

        if (node._aliveAtom && wasAlive !== isAlive) {
            node._aliveAtom.reportChanged()
        }
    },

    isAlive(node: Node) {
        return node._state !== NodeLifeCycle.DEAD
    },

    observableIsAlive(node: Node) {
        if (!node._aliveAtom) {
            node._aliveAtom = createAtom("alive")
        }
        node._aliveAtom.reportObserved()
        return nodeOps.isAlive(node)
    },

    isDetaching(node: Node) {
        return node._state === NodeLifeCycle.DETACHING
    },

    registerHook<H extends Hook>(node: Node, hook: H, hookHandler: HookSubscribers[H]): IDisposer {
        if (!node._hookSubscribers) {
            node._hookSubscribers = new EventHandlers()
        }
        return node._hookSubscribers.register(hook, hookHandler)
    },

    baseSetParent(node: Node, parent: ParentNode, subpath: string) {
        node.parent = parent
        node.subpath = subpath
        node._escapedSubpath = undefined // regenerate when needed
        if (node._pathAtom) {
            node._pathAtom.reportChanged()
        }
    },

    getPath(node: Node) {
        return nodeOps.getEscapedPath(node, true)
    },

    getEscapedPath(node: Node, reportObserved: boolean): string {
        if (reportObserved) {
            if (!node._pathAtom) {
                node._pathAtom = createAtom("path")
            }
            node._pathAtom.reportObserved()
        }
        if (!node.parent) return ""
        // regenerate escaped subpath if needed
        if (node._escapedSubpath === undefined) {
            node._escapedSubpath = !node.subpath ? "" : escapeJsonPath(node.subpath)
        }
        return nodeOps.getEscapedPath(node.parent, reportObserved) + "/" + node._escapedSubpath
    },

    isRoot(node: Node) {
        return node.parent === null
    },

    finalizeDeath(node: Node) {
        if (isNodeObj(node)) {
            // invariant: not called directly but from "die"
            objNodeOps.getChildren(node).forEach(n => {
                nodeOps.finalizeDeath(n)
            })
            nodeOps.getRoot(node).identifierCache!.notifyDied(node)

            // "kill" the computed prop and just store the last snapshot
            const snapshot = nodeOps.snapshotOf(node)
            node._snapshotUponDeath = snapshot

            objNodeOps._internalEventsClearAll(node)
        }

        if (node._hookSubscribers) {
            node._hookSubscribers.clearAll()
        }

        node.subpathUponDeath = node.subpath
        node.pathUponDeath = nodeOps.getEscapedPath(node, false)
        nodeOps.baseSetParent(node, null, "")
        nodeOps.setState(node, NodeLifeCycle.DEAD)
    },

    fireHook(node: Node, name: Hook) {
        if (node._hookSubscribers) {
            node._hookSubscribers.emit(name, node, name)
        }

        if (isNodeObj(node)) {
            const fn =
                node.storedValue &&
                typeof node.storedValue === "object" &&
                (node.storedValue as any)[name]
            if (typeof fn === "function") {
                // we check for it to allow old mobx peer dependencies that don't have the method to work (even when still bugged)
                if (_allowStateChangesInsideComputed) {
                    _allowStateChangesInsideComputed(() => {
                        fn.apply(node.storedValue)
                    })
                } else {
                    fn.apply(node.storedValue)
                }
            }
        }
    },

    getRoot(node: Node): NodeObj {
        if (isNodeObj(node)) {
            return node.parent ? nodeOps.getRoot(node.parent) : node
        } else {
            // future optimization: store root ref in the node and maintain it
            if (!node.parent) throw fail("This scalar node is not part of a tree")
            return nodeOps.getRoot(node.parent)
        }
    },

    setParent(node: Node, newParent: ParentNode, subpath: string | null): void {
        if (node.parent === newParent && node.subpath === subpath) return

        if (node.kind === NodeKind.Object) {
            if (newParent && process.env.NODE_ENV !== "production") {
                if (node.parent && newParent !== node.parent) {
                    throw fail(
                        `A node cannot exists twice in the state tree. Failed to add ${node} to path '${nodeOps.getPath(
                            newParent
                        )}/${subpath}'.`
                    )
                }
                const newParentRoot = nodeOps.getRoot(newParent)
                if (!node.parent && newParentRoot === node) {
                    throw fail(
                        `A state tree is not allowed to contain itself. Cannot assign ${node} to path '${nodeOps.getPath(
                            newParent
                        )}/${subpath}'`
                    )
                }
                const root = nodeOps.getRoot(node)
                if (
                    !node.parent &&
                    !!root.environment &&
                    root.environment !== newParentRoot.environment
                ) {
                    throw fail(
                        `A state tree cannot be made part of another state tree as long as their environments are different.`
                    )
                }
            }
        }

        if (node.parent && !newParent) {
            nodeOps.die(node)
        } else {
            const newPath = subpath === null ? "" : subpath
            if (newParent && newParent !== node.parent) {
                if (isNodeObj(node)) {
                    nodeOps.getRoot(newParent).identifierCache!.mergeCache(node)
                    nodeOps.baseSetParent(node, newParent, newPath)
                    nodeOps.fireHook(node, Hook.afterAttach)
                } else {
                    throw fail("assertion failed: scalar nodes cannot change their parent")
                }
            } else if (node.subpath !== newPath) {
                nodeOps.baseSetParent(node, node.parent, newPath)
            }
        }
    },

    snapshotOf<S>(node: Node<any, any, S, any>): S {
        if (isNodeObj(node)) {
            return node.computedSnapshot.get()
        } else {
            return freeze(nodeOps.getSnapshot(node))
        }
    },

    // NOTE: we use this method to get snapshot without creating @computed overhead
    getSnapshot<S>(node: Node<any, any, S, any>): S {
        let sn: S

        if (isNodeObj(node)) {
            if (!nodeOps.isAlive(node)) return node._snapshotUponDeath!

            if (node._observableInstanceState === ObservableInstanceLifecycle.CREATED) {
                sn = node.type.getSnapshot(node)
            } else {
                if (!node._cachedInitialSnapshotCreated) {
                    const type = node.type
                    const childNodes = node._childNodes
                    const snapshot = node._initialSnapshot

                    node._cachedInitialSnapshot = type.processInitialSnapshot(childNodes, snapshot)
                    node._cachedInitialSnapshotCreated = true
                }

                sn = node._cachedInitialSnapshot!
            }
        } else {
            sn = node.type.getSnapshot(node)
        }

        if (node.snapshotPostProcessors) {
            node.snapshotPostProcessors.forEach(snapshotPostProcessor => {
                sn = snapshotPostProcessor(sn)
            })
        }

        return sn
    },

    die: action((node: Node) => {
        if (nodeOps.isDetaching(node)) return

        if (
            isNodeObj(node) &&
            node._observableInstanceState !== ObservableInstanceLifecycle.CREATED
        ) {
            // get rid of own and child ids at least
            objNodeOps.unregisterIdentifiers(node)
        } else {
            nodeOps.aboutToDie(node)
            nodeOps.finalizeDeath(node)
        }
    }),

    finalizeCreation(node: Node) {
        // goal: afterCreate hooks runs depth-first. After attach runs parent first, so on afterAttach the parent has completed already
        if (node._state === NodeLifeCycle.CREATED) {
            if (node.parent) {
                if (node.parent._state !== NodeLifeCycle.FINALIZED) {
                    // parent not ready yet, postpone
                    return
                }
                nodeOps.fireHook(node, Hook.afterAttach)
            }

            nodeOps.setState(node, NodeLifeCycle.FINALIZED)

            if (isNodeObj(node)) {
                for (let child of objNodeOps.getChildren(node)) {
                    nodeOps.finalizeCreation(child)
                }

                // could be called for scalar, but it would be called on the constructor
                nodeOps.fireHook(node, Hook.afterCreationFinalization)
            }
        }
    },

    aboutToDie(node: Node) {
        if (isNodeObj(node)) {
            objNodeOps.getChildren(node).forEach(n => {
                nodeOps.aboutToDie(n)
            })
        }

        // beforeDestroy should run before the disposers since else we could end up in a situation where
        // a disposer added with addDisposer at this stage (beforeDestroy) is actually never released
        nodeOps.fireHook(node, Hook.beforeDestroy)

        if (isNodeObj(node)) {
            objNodeOps._internalEventsEmit(node, InternalEvents.Dispose)
            objNodeOps._internalEventsClear(node, InternalEvents.Dispose)
        }
    }
}

/**
 * @internal
 * @hidden
 */
export const objNodeOps = {
    applyPatches(node: NodeObj, patches: IJsonPatch[]): void {
        objNodeOps.createObservableInstanceIfNeeded(node)
        node._applyPatches!(patches)
    },

    applySnapshot<C>(node: NodeObj<C>, snapshot: C): void {
        objNodeOps.createObservableInstanceIfNeeded(node)
        node._applySnapshot!(snapshot)
    },

    createObservableInstanceIfNeeded: action((node: NodeObj) => {
        if (node._observableInstanceState !== ObservableInstanceLifecycle.UNINITIALIZED) {
            return
        }
        node._observableInstanceState = ObservableInstanceLifecycle.CREATING

        // make sure the parent chain is created as well

        // array with parent chain from parent to child
        const parentChain = []

        let parent = node.parent
        // for performance reasons we never go back further than the most direct
        // uninitialized parent
        // this is done to avoid traversing the whole tree to the root when using
        // the same reference again
        while (
            parent &&
            parent._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED
        ) {
            parentChain.unshift(parent)
            parent = parent.parent
        }

        // initialize the uninitialized parent chain from parent to child
        for (const p of parentChain) {
            objNodeOps.createObservableInstanceIfNeeded(p)
        }

        const type = node.type as ComplexType<any, any, any>

        try {
            node.storedValue = type.createNewInstance(node, node._childNodes, node._initialSnapshot)
            objNodeOps.preboot(node)

            node._isRunningAction = true
            type.finalizeNewInstance(node, node.storedValue)
        } catch (e) {
            // short-cut to die the instance, to avoid the snapshot computed starting to throw...
            nodeOps.setState(node, NodeLifeCycle.DEAD)
            throw e
        } finally {
            node._isRunningAction = false
        }

        node._observableInstanceState = ObservableInstanceLifecycle.CREATED

        // NOTE: we need to touch snapshot, because non-observable
        // "_observableInstanceState" field was touched
        invalidateComputed(node.computedSnapshot)

        if (nodeOps.isRoot(node)) objNodeOps._addSnapshotReaction(node)

        node._childNodes = EMPTY_OBJECT

        nodeOps.setState(node, NodeLifeCycle.CREATED)
        nodeOps.fireHook(node, Hook.afterCreate)

        nodeOps.finalizeCreation(node)
    }),

    isRunningAction(node: NodeObj): boolean {
        if (node._isRunningAction) return true
        if (nodeOps.isRoot(node)) return false
        return objNodeOps.isRunningAction(node.parent!)
    },

    assertAlive(node: NodeObj, context: AssertAliveContext): void {
        const livelinessChecking = getLivelinessChecking()
        if (!nodeOps.isAlive(node) && livelinessChecking !== "ignore") {
            const error = objNodeOps._getAssertAliveError(node, context)
            switch (livelinessChecking) {
                case "error":
                    throw fail(error)
                case "warn":
                    warnError(error)
            }
        }
    },

    _getAssertAliveError(node: NodeObj, context: AssertAliveContext): string {
        const escapedPath = nodeOps.getEscapedPath(node, false) || node.pathUponDeath || ""
        const subpath = (context.subpath && escapeJsonPath(context.subpath)) || ""

        const actionContext = context.actionContext || getCurrentActionContext()
        let actionFullPath = ""
        if (actionContext && actionContext.name != null) {
            // try to use the context, and if it not available use the node one
            const actionPath =
                (actionContext && actionContext.context && getPath(actionContext.context)) ||
                escapedPath
            actionFullPath = `${actionPath}.${actionContext.name}()`
        }

        return `You are trying to read or write to an object that is no longer part of a state tree. (Object type: '${
            node.type.name
        }', Path upon death: '${escapedPath}', Subpath: '${subpath}', Action: '${actionFullPath}'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.`
    },

    getChildNode(node: NodeObj, subpath: string): Node {
        objNodeOps.assertAlive(node, {
            subpath
        })
        node._autoUnbox = false
        try {
            return node._observableInstanceState === ObservableInstanceLifecycle.CREATED
                ? node.type.getChildNode(node, subpath)
                : node._childNodes![subpath]
        } finally {
            node._autoUnbox = true
        }
    },

    getChildren(node: NodeObj): ReadonlyArray<Node> {
        objNodeOps.assertAlive(node, EMPTY_OBJECT)
        node._autoUnbox = false
        try {
            return node._observableInstanceState === ObservableInstanceLifecycle.CREATED
                ? node.type.getChildren(node)
                : convertChildNodesToArray(node._childNodes)
        } finally {
            node._autoUnbox = true
        }
    },

    getChildType(node: NodeObj, propertyName?: string): IAnyType {
        return node.type.getChildType(propertyName)
    },

    isProtected(node: NodeObj): boolean {
        return nodeOps.getRoot(node).isProtectionEnabled
    },

    assertWritable(node: NodeObj, context: AssertAliveContext): void {
        objNodeOps.assertAlive(node, context)
        if (!objNodeOps.isRunningAction(node) && objNodeOps.isProtected(node)) {
            throw fail(
                `Cannot modify '${node}', the object is protected and can only be modified by using an action.`
            )
        }
    },

    removeChild(node: NodeObj, subpath: string): void {
        node.type.removeChild(node, subpath)
    },

    detach: action((node: NodeObj) => {
        if (!nodeOps.isAlive(node)) throw fail("Error while detaching, node is not alive.")
        if (nodeOps.isRoot(node)) return

        nodeOps.fireHook(node, Hook.beforeDetach)
        nodeOps.setState(node, NodeLifeCycle.DETACHING)

        const root = nodeOps.getRoot(node)
        const newEnv = root.environment
        const newIdCache = root.identifierCache!.splitCache(node)

        try {
            objNodeOps.removeChild(node.parent!, node.subpath)
            nodeOps.baseSetParent(node, null, "")
            node.environment = newEnv
            node.identifierCache = newIdCache
        } finally {
            nodeOps.setState(node, NodeLifeCycle.FINALIZED)
        }
    }),

    preboot<C>(node: NodeObj<C>): void {
        node._applyPatches = createActionInvoker(
            node.storedValue,
            "@APPLY_PATCHES",
            (patches: IJsonPatch[]) => {
                patches.forEach(patch => {
                    const parts = splitJsonPath(patch.path)
                    const node2 = resolveNodeByPathParts(node, parts.slice(0, -1)) as NodeObj
                    objNodeOps.applyPatchLocally(node2, parts[parts.length - 1], patch)
                })
            }
        )
        node._applySnapshot = createActionInvoker(
            node.storedValue,
            "@APPLY_SNAPSHOT",
            (snapshot: C) => {
                // if the snapshot is the same as the current one, avoid performing a reconcile
                if (snapshot === (nodeOps.snapshotOf(node) as any)) return
                // else, apply it by calling the type logic
                return node.type.applySnapshot(node, snapshot as any)
            }
        )

        addHiddenFinalProp(node.storedValue, "$treenode", node)
        addHiddenFinalProp(node.storedValue, "toJSON", toJSON)
    },

    unregisterIdentifiers(node: NodeObj): void {
        Object.keys(node._childNodes).forEach(k => {
            const childNode = node._childNodes[k]
            if (isNodeObj(childNode)) {
                objNodeOps.unregisterIdentifiers(childNode)
            }
        })
        nodeOps.getRoot(node).identifierCache!.notifyDied(node)
    },

    onSnapshot<S>(node: NodeObj<any, S>, onChange: (snapshot: S) => void): IDisposer {
        objNodeOps._addSnapshotReaction(node)
        return objNodeOps._internalEventsRegister(node, InternalEvents.Snapshot, onChange)
    },

    emitSnapshot<S>(node: NodeObj<any, S>, snapshot: S): void {
        objNodeOps._internalEventsEmit(node, InternalEvents.Snapshot, snapshot)
    },

    onPatch(
        node: NodeObj,
        handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
    ): IDisposer {
        return objNodeOps._internalEventsRegister(node, InternalEvents.Patch, handler)
    },

    emitPatch(node: NodeObj, basePatch: IReversibleJsonPatch, source: Node): void {
        if (objNodeOps._internalEventsHasSubscribers(node, InternalEvents.Patch)) {
            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
                path:
                    nodeOps.getPath(source).substr(nodeOps.getPath(node).length) +
                    "/" +
                    basePatch.path // calculate the relative path of the patch
            })
            const [patch, reversePatch] = splitPatch(localizedPatch)
            objNodeOps._internalEventsEmit(node, InternalEvents.Patch, patch, reversePatch)
        }
        if (node.parent) objNodeOps.emitPatch(node.parent, basePatch, source)
    },

    hasDisposer(node: NodeObj, disposer: () => void): boolean {
        return objNodeOps._internalEventsHas(node, InternalEvents.Dispose, disposer)
    },

    addDisposer(node: NodeObj, disposer: () => void): void {
        if (!objNodeOps.hasDisposer(node, disposer)) {
            objNodeOps._internalEventsRegister(node, InternalEvents.Dispose, disposer, true)
            return
        }
        throw fail("cannot add a disposer when it is already registered for execution")
    },

    removeDisposer(node: NodeObj, disposer: () => void): void {
        if (!objNodeOps._internalEventsHas(node, InternalEvents.Dispose, disposer)) {
            throw fail("cannot remove a disposer which was never registered for execution")
        }
        objNodeOps._internalEventsUnregister(node, InternalEvents.Dispose, disposer)
    },

    removeMiddleware(node: NodeObj, handler: IMiddlewareHandler): void {
        if (node.middlewares)
            node.middlewares = node.middlewares.filter(middleware => middleware.handler !== handler)
    },

    addMiddleWare(
        node: NodeObj,
        handler: IMiddlewareHandler,
        includeHooks: boolean = true
    ): IDisposer {
        if (!node.middlewares) node.middlewares = [{ handler, includeHooks }]
        else node.middlewares.push({ handler, includeHooks })

        return () => {
            objNodeOps.removeMiddleware(node, handler)
        }
    },

    applyPatchLocally(node: NodeObj, subpath: string, patch: IJsonPatch): void {
        objNodeOps.assertWritable(node, {
            subpath
        })
        objNodeOps.createObservableInstanceIfNeeded(node)
        node.type.applyPatchLocally(node, subpath, patch)
    },

    _addSnapshotReaction(node: NodeObj): void {
        if (!node._hasSnapshotReaction) {
            const snapshotDisposer = reaction(
                () => nodeOps.snapshotOf(node),
                snapshot => objNodeOps.emitSnapshot(node, snapshot),
                snapshotReactionOptions
            )
            objNodeOps.addDisposer(node, snapshotDisposer)
            node._hasSnapshotReaction = true
        }
    },

    // #region internal event handling

    // we proxy the methods to avoid creating an EventHandlers instance when it is not needed

    _internalEventsHasSubscribers(node: NodeObj, event: InternalEvents): boolean {
        return !!node._internalEvents && node._internalEvents.hasSubscribers(event)
    },

    _internalEventsRegister<IE extends InternalEvents, S>(
        node: NodeObj<any, S>,
        event: IE,
        eventHandler: InternalEventHandlers<S>[IE],
        atTheBeginning = false
    ): IDisposer {
        if (!node._internalEvents) {
            node._internalEvents = new EventHandlers()
        }
        return node._internalEvents.register(event, eventHandler, atTheBeginning)
    },

    _internalEventsHas<IE extends InternalEvents, S>(
        node: NodeObj<any, S>,
        event: IE,
        eventHandler: InternalEventHandlers<S>[IE]
    ): boolean {
        return !!node._internalEvents && node._internalEvents.has(event, eventHandler)
    },

    _internalEventsUnregister<IE extends InternalEvents, S>(
        node: NodeObj<any, S>,
        event: IE,
        eventHandler: InternalEventHandlers<S>[IE]
    ): void {
        if (node._internalEvents) {
            node._internalEvents.unregister(event, eventHandler)
        }
    },

    _internalEventsEmit<IE extends InternalEvents, S>(
        node: NodeObj,
        event: IE,
        ...args: ArgumentTypes<InternalEventHandlers<S>[IE]>
    ): void {
        if (node._internalEvents) {
            node._internalEvents.emit(event, ...args)
        }
    },

    _internalEventsClear(node: NodeObj, event: InternalEvents): void {
        if (node._internalEvents) {
            node._internalEvents.clear(event)
        }
    },

    _internalEventsClearAll(node: NodeObj): void {
        if (node._internalEvents) {
            node._internalEvents.clearAll()
        }
    }

    // #endregion
}

/**
 * @internal
 * @hidden
 */
export interface AssertAliveContext {
    subpath?: string
    actionContext?: IMiddlewareEvent
}
