// noinspection ES6UnusedImports
import { action, computed, reaction, _allowStateChangesInsideComputed } from "mobx"
import {
    addHiddenFinalProp,
    addReadOnlyProp,
    ComplexType,
    convertChildNodesToArray,
    createActionInvoker,
    EMPTY_OBJECT,
    extend,
    fail,
    freeze,
    IAnyType,
    IdentifierCache,
    IDisposer,
    IJsonPatch,
    IMiddleware,
    IMiddlewareHandler,
    INode,
    invalidateComputed,
    IReversibleJsonPatch,
    NodeLifeCycle,
    resolveNodeByPathParts,
    splitJsonPath,
    splitPatch,
    toJSON,
    EventHandlers,
    Hook,
    BaseNode,
    getLivelinessChecking,
    normalizeIdentifier,
    ReferenceIdentifier
} from "../../internal"

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
    [key: string]: INode
}

const snapshotReactionOptions = {
    onError(e: any) {
        throw e
    }
}

/**
 * @internal
 * @hidden
 */
export class ObjectNode extends BaseNode {
    readonly nodeId = ++nextNodeId
    readonly identifierAttribute: string | undefined
    readonly identifier: string | null // Identifier is always normalized to string, even if the identifier property isn't
    readonly unnormalizedIdentifier: ReferenceIdentifier | null

    identifierCache: IdentifierCache | undefined
    isProtectionEnabled = true
    middlewares: IMiddleware[] | null = null

    _applyPatches?: (patches: IJsonPatch[]) => void

    applyPatches(patches: IJsonPatch[]): void {
        this.createObservableInstanceIfNeeded()
        this._applyPatches!(patches)
    }

    _applySnapshot?: (snapshot: any) => void

    applySnapshot(snapshot: any): void {
        this.createObservableInstanceIfNeeded()
        this._applySnapshot!(snapshot)
    }

    private _autoUnbox = true // unboxing is disabled when reading child nodes
    _isRunningAction = false // only relevant for root
    private _hasSnapshotReaction = false

    private readonly _internalEvents = new EventHandlers<{
        [InternalEvents.Dispose]: () => void
        [InternalEvents.Patch]: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
        [InternalEvents.Snapshot]: (snapshot: any) => void
    }>()

    private _observableInstanceState = ObservableInstanceLifecycle.UNINITIALIZED
    private _childNodes: IChildNodesMap
    private _initialSnapshot: any
    private _cachedInitialSnapshot: any = null

    constructor(
        type: IAnyType,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialSnapshot: any
    ) {
        super(type, parent, subpath, environment)

        this._initialSnapshot = freeze(initialSnapshot)
        this.identifierAttribute = (type as any).identifierAttribute

        if (!parent) {
            this.identifierCache = new IdentifierCache()
        }

        this._childNodes = type.initializeChildNodes(this, this._initialSnapshot)

        // identifier can not be changed during lifecycle of a node
        // so we safely can read it from initial snapshot
        this.identifier = null
        this.unnormalizedIdentifier = null
        if (this.identifierAttribute && this._initialSnapshot) {
            let id = this._initialSnapshot[this.identifierAttribute]
            if (id === undefined) {
                // try with the actual node if not (for optional identifiers)
                const childNode = this._childNodes[this.identifierAttribute]
                if (childNode) {
                    id = childNode.value
                }
            }

            if (typeof id !== "string" && typeof id !== "number") {
                fail(
                    `Instance identifier '${this.identifierAttribute}' for type '${
                        this.type.name
                    }' must be a string or a number`
                )
            }

            // normalize internal identifier to string
            this.identifier = normalizeIdentifier(id)
            this.unnormalizedIdentifier = id
        }

        if (!parent) {
            this.identifierCache!.addNodeToCache(this)
        } else {
            parent.root.identifierCache!.addNodeToCache(this)
        }
    }

    @action
    createObservableInstanceIfNeeded() {
        if (this._observableInstanceState !== ObservableInstanceLifecycle.UNINITIALIZED) {
            return
        }
        this._observableInstanceState = ObservableInstanceLifecycle.CREATING

        // make sure the parent chain is created as well

        // array with parent chain from parent to child
        const parentChain = []

        let parent = this.parent
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
            p.createObservableInstanceIfNeeded()
        }

        const type = this.type

        try {
            this.storedValue = type.createNewInstance(this, this._childNodes, this._initialSnapshot)
            this.preboot()

            this._isRunningAction = true
            type.finalizeNewInstance(this, this.storedValue)
        } catch (e) {
            // short-cut to die the instance, to avoid the snapshot computed starting to throw...
            this.state = NodeLifeCycle.DEAD
            throw e
        } finally {
            this._isRunningAction = false
        }

        this._observableInstanceState = ObservableInstanceLifecycle.CREATED

        // NOTE: we need to touch snapshot, because non-observable
        // "_observableInstanceState" field was touched
        invalidateComputed(this, "snapshot")

        if (this.isRoot) this._addSnapshotReaction()

        this._childNodes = EMPTY_OBJECT

        this.state = NodeLifeCycle.CREATED
        this.fireHook(Hook.afterCreate)

        this.finalizeCreation()
    }

    get root(): ObjectNode {
        const parent = this.parent
        return parent ? parent.root : this
    }

    setParent(newParent: ObjectNode | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath) return
        if (newParent && process.env.NODE_ENV !== "production") {
            if (this.parent && newParent !== this.parent) {
                fail(
                    `A node cannot exists twice in the state tree. Failed to add ${this} to path '${
                        newParent.path
                    }/${subpath}'.`
                )
            }
            if (!this.parent && newParent.root === this) {
                fail(
                    `A state tree is not allowed to contain itself. Cannot assign ${this} to path '${
                        newParent.path
                    }/${subpath}'`
                )
            }
            if (
                !this.parent &&
                !!this.root.environment &&
                this.root.environment !== newParent.root.environment
            ) {
                fail(
                    `A state tree cannot be made part of another state tree as long as their environments are different.`
                )
            }
        }
        if (this.parent && !newParent) {
            this.die()
        } else {
            const newPath = subpath === null ? "" : subpath
            if (newParent && newParent !== this.parent) {
                newParent.root.identifierCache!.mergeCache(this)
                this.baseSetParent(newParent, newPath)
                this.fireHook(Hook.afterAttach)
            } else if (this.subpath !== newPath) {
                this.baseSetParent(this.parent, newPath)
            }
        }
    }

    protected fireHook(name: Hook) {
        this.fireInternalHook(name)

        const fn =
            this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function") {
            // we check for it to allow old mobx peer dependencies that don't have the method to work (even when still bugged)
            if (_allowStateChangesInsideComputed) {
                _allowStateChangesInsideComputed(() => {
                    fn.apply(this.storedValue)
                })
            } else {
                fn.apply(this.storedValue)
            }
        }
    }

    get value(): any {
        this.createObservableInstanceIfNeeded()
        if (!this.isAlive) return undefined
        return this.type.getValue(this)
    }

    // advantage of using computed for a snapshot is that nicely respects transactions etc.
    @computed
    get snapshot(): any {
        if (!this.isAlive) return undefined
        return freeze(this.getSnapshot())
    }

    // NOTE: we use this method to get snapshot without creating @computed overhead
    getSnapshot(): any {
        if (!this.isAlive) return undefined
        return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
            ? this._getActualSnapshot()
            : this._getInitialSnapshot()
    }

    private _getActualSnapshot(): any {
        return this.type.getSnapshot(this)
    }

    private _getInitialSnapshot(): any {
        if (!this.isAlive) return undefined
        if (!this._initialSnapshot) return this._initialSnapshot
        if (this._cachedInitialSnapshot) return this._cachedInitialSnapshot

        const type = this.type as ComplexType<any, any, any>
        const childNodes = this._childNodes!
        const snapshot = this._initialSnapshot

        this._cachedInitialSnapshot = type.processInitialSnapshot(childNodes, snapshot)
        return this._cachedInitialSnapshot
    }

    private isRunningAction(): boolean {
        if (this._isRunningAction) return true
        if (this.isRoot) return false
        return this.parent!.isRunningAction()
    }

    assertAlive() {
        if (!this.isAlive) {
            const error = new Error(
                `[mobx-state-tree][error] You are trying to read or write to an object that is no longer part of a state tree. (Object type was '${
                    this.type.name
                }'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.`
            )
            switch (getLivelinessChecking()) {
                case "error":
                    throw error
                case "warn":
                    console.warn(error)
            }
        }
    }

    getChildNode(subpath: string): INode {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
                ? this.type.getChildNode(this, subpath)
                : this._childNodes![subpath]
        } finally {
            this._autoUnbox = true
        }
    }

    getChildren(): ReadonlyArray<INode> {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
                ? this.type.getChildren(this)
                : convertChildNodesToArray(this._childNodes)
        } finally {
            this._autoUnbox = true
        }
    }

    getChildType(key: string): IAnyType {
        return this.type.getChildType(key)
    }

    get isProtected(): boolean {
        return this.root.isProtectionEnabled
    }

    assertWritable() {
        this.assertAlive()
        if (!this.isRunningAction() && this.isProtected) {
            fail(
                `Cannot modify '${this}', the object is protected and can only be modified by using an action.`
            )
        }
    }

    removeChild(subpath: string) {
        this.type.removeChild(this, subpath)
    }

    // this method must be bound
    unbox = (childNode: INode): any => {
        if (childNode) this.assertAlive()
        if (childNode && this._autoUnbox) return childNode.value
        return childNode
    }

    toString(): string {
        const identifier = this.identifier ? `(id: ${this.identifier})` : ""
        return `${this.type.name}@${this.path || "<root>"}${identifier}${
            this.isAlive ? "" : "[dead]"
        }`
    }

    finalizeCreation() {
        this.baseFinalizeCreation(() => {
            for (let child of this.getChildren()) {
                child.finalizeCreation()
            }

            this.fireInternalHook(Hook.afterCreationFinalization)
        })
    }

    @action
    detach() {
        if (!this.isAlive) fail(`Error while detaching, node is not alive.`)
        if (this.isRoot) return

        this.fireHook(Hook.beforeDetach)
        this.state = NodeLifeCycle.DETACHING

        this.environment = this.root.environment // make backup of environment
        this.identifierCache = this.root.identifierCache!.splitCache(this)
        this.parent!.removeChild(this.subpath)
        this.baseSetParent(null, "")

        this.state = NodeLifeCycle.FINALIZED
    }

    private preboot() {
        const self = this
        this._applyPatches = createActionInvoker(
            this.storedValue,
            "@APPLY_PATCHES",
            (patches: IJsonPatch[]) => {
                patches.forEach(patch => {
                    const parts = splitJsonPath(patch.path)
                    const node = resolveNodeByPathParts(self, parts.slice(0, -1)) as ObjectNode
                    node.applyPatchLocally(parts[parts.length - 1], patch)
                })
            }
        )
        this._applySnapshot = createActionInvoker(
            this.storedValue,
            "@APPLY_SNAPSHOT",
            (snapshot: any) => {
                // if the snapshot is the same as the current one, avoid performing a reconcile
                if (snapshot === self.snapshot) return
                // else, apply it by calling the type logic
                return self.type.applySnapshot(self, snapshot)
            }
        )

        addHiddenFinalProp(this.storedValue, "$treenode", this)
        addHiddenFinalProp(this.storedValue, "toJSON", toJSON)
    }

    @action
    die() {
        if (this.state === NodeLifeCycle.DETACHING) return
        if (this._observableInstanceState === ObservableInstanceLifecycle.CREATED) {
            this.aboutToDie()
            this.finalizeDeath()
        } else {
            // get rid of own and child ids at least
            this.unregisterIdentifiers()
        }
    }

    aboutToDie() {
        this.getChildren().forEach(node => {
            node.aboutToDie()
        })

        // beforeDestroy should run before the disposers since else we could end up in a situation where
        // a disposer added with addDisposer at this stage (beforeDestroy) is actually never released
        this.baseAboutToDie()

        this._internalEvents.emit(InternalEvents.Dispose)
        this._internalEvents.clear(InternalEvents.Dispose)
    }

    private unregisterIdentifiers() {
        Object.keys(this._childNodes).forEach(k => {
            const childNode = this._childNodes[k]
            if (childNode instanceof ObjectNode) {
                childNode.unregisterIdentifiers()
            }
        })
        this.root.identifierCache!.notifyDied(this)
    }

    finalizeDeath() {
        // invariant: not called directly but from "die"
        this.getChildren().forEach(node => {
            node.finalizeDeath()
        })
        this.root.identifierCache!.notifyDied(this)
        addReadOnlyProp(this, "snapshot", this.snapshot) // kill the computed prop and just store the last snapshot

        this._internalEvents.clearAll()

        this.baseFinalizeDeath()
    }

    onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        this._addSnapshotReaction()
        return this._internalEvents.register(InternalEvents.Snapshot, onChange)
    }

    protected emitSnapshot(snapshot: any) {
        this._internalEvents.emit(InternalEvents.Snapshot, snapshot)
    }

    onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
        return this._internalEvents.register(InternalEvents.Patch, handler)
    }

    emitPatch(basePatch: IReversibleJsonPatch, source: INode) {
        const intEvs = this._internalEvents
        if (intEvs.hasSubscribers(InternalEvents.Patch)) {
            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
            })
            const [patch, reversePatch] = splitPatch(localizedPatch)
            intEvs.emit(InternalEvents.Patch, patch, reversePatch)
        }
        if (this.parent) this.parent.emitPatch(basePatch, source)
    }

    hasDisposer(disposer: () => void): boolean {
        return this._internalEvents.has(InternalEvents.Dispose, disposer)
    }

    addDisposer(disposer: () => void): void {
        if (!this.hasDisposer(disposer)) {
            this._internalEvents.register(InternalEvents.Dispose, disposer, true)
            return
        }
        fail("cannot add a disposer when it is already registered for execution")
    }

    removeDisposer(disposer: () => void): void {
        if (!this._internalEvents.has(InternalEvents.Dispose, disposer)) {
            return fail("cannot remove a disposer which was never registered for execution")
        }
        this._internalEvents.unregister(InternalEvents.Dispose, disposer)
    }

    removeMiddleware(handler: IMiddlewareHandler) {
        if (this.middlewares)
            this.middlewares = this.middlewares.filter(middleware => middleware.handler !== handler)
    }

    addMiddleWare(handler: IMiddlewareHandler, includeHooks: boolean = true) {
        if (!this.middlewares) this.middlewares = [{ handler, includeHooks }]
        else this.middlewares.push({ handler, includeHooks })

        return () => {
            this.removeMiddleware(handler)
        }
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.assertWritable()
        this.createObservableInstanceIfNeeded()
        this.type.applyPatchLocally(this, subpath, patch)
    }

    private _addSnapshotReaction() {
        if (!this._hasSnapshotReaction) {
            const snapshotDisposer = reaction(
                () => this.snapshot,
                snapshot => this.emitSnapshot(snapshot),
                snapshotReactionOptions
            )
            this.addDisposer(snapshotDisposer)
            this._hasSnapshotReaction = true
        }
    }
}
