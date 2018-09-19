// noinspection ES6UnusedImports
import { action, computed, createAtom, reaction, IAtom } from "mobx"
import {
    addHiddenFinalProp,
    addReadOnlyProp,
    ComplexType,
    convertChildNodesToArray,
    createActionInvoker,
    EMPTY_OBJECT,
    escapeJsonPath,
    extend,
    fail,
    freeze,
    getStateTreeNode,
    IAnyType,
    IdentifierCache,
    IDisposer,
    IJsonPatch,
    IMiddleware,
    IMiddlewareHandler,
    INode,
    invalidateComputed,
    IReversibleJsonPatch,
    isStateTreeNode,
    NodeLifeCycle,
    registerEventHandler,
    resolveNodeByPathParts,
    splitJsonPath,
    splitPatch,
    toJSON,
    walk
} from "../../internal"

let nextNodeId = 1

export type LivelynessMode = "warn" | "error" | "ignore"
let livelynessChecking = "warn"

/**
 *  Defines what MST should do when running into reads / writes to objects that have died.
 * By default it will print a warning.
 * Use te `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place
 *
 * Possible values: `"warn"`, `"error"` and `"ignore"`
 *
 * @export
 * @param {LivelynessMode} mode
 */
export function setLivelynessChecking(mode: LivelynessMode) {
    livelynessChecking = mode
}

/**
 * @internal
 * @private
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
 * @private
 */
export class ObjectNode implements INode {
    nodeId = ++nextNodeId
    readonly type: IAnyType
    readonly identifierAttribute: string | undefined
    readonly identifier: string | null // Identifier is always normalized to string, even if the identifier property isn't

    subpathAtom = createAtom(`path`)
    subpath: string = ""
    escapedSubpath: string
    parent: ObjectNode | null = null
    state = NodeLifeCycle.INITIALIZING
    storedValue: any
    identifierCache: IdentifierCache | undefined
    isProtectionEnabled = true
    middlewares: IMiddleware[] | null = null

    applyPatches(patches: IJsonPatch[]): void {
        if (!this._observableInstanceCreated) this._createObservableInstance()
        this.applyPatches(patches)
    }
    applySnapshot(snapshot: any): void {
        if (!this._observableInstanceCreated) this._createObservableInstance()
        this.applySnapshot(snapshot)
    }

    _autoUnbox = true // unboxing is disabled when reading child nodes
    _environment: any = undefined
    _isRunningAction = false // only relevant for root
    _hasSnapshotReaction = false

    private _disposers: (() => void)[] | null = null
    private _patchSubscribers:
        | ((patch: IJsonPatch, reversePatch: IJsonPatch) => void)[]
        | null = null
    private _snapshotSubscribers: ((snapshot: any) => void)[] | null = null

    private _observableInstanceCreated: boolean = false
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
        this._environment = environment
        this._initialSnapshot = freeze(initialSnapshot)

        this.type = type
        this.parent = parent
        this.subpath = subpath
        this.escapedSubpath = escapeJsonPath(this.subpath)

        this.identifierAttribute = (type as any).identifierAttribute

        if (!parent) {
            this.identifierCache = new IdentifierCache()
        }

        this._childNodes = type.initializeChildNodes(this, this._initialSnapshot)

        // identifier can not be changed during lifecycle of a node
        // so we safely can read it from initial snapshot
        this.identifier = null
        if (this.identifierAttribute && this._initialSnapshot) {
            this.identifier = "" + this._initialSnapshot[this.identifierAttribute]
            let id = this._initialSnapshot[this.identifierAttribute]
            if (id === undefined) {
                // try with the actual node if not (for optional identifiers)
                const childNode = this._childNodes[this.identifierAttribute]
                if (childNode) {
                    id = childNode.value
                }
            }

            // normalize internal identifier to string
            this.identifier = "" + id
        }

        if (!parent) {
            this.identifierCache!.addNodeToCache(this)
        } else {
            parent.root.identifierCache!.addNodeToCache(this)
        }
    }

    @action
    private _createObservableInstance() {
        const type = this.type
        this.storedValue = type.createNewInstance(this, this._childNodes, this._initialSnapshot)
        this.preboot()

        let sawException = true
        this._observableInstanceCreated = true
        try {
            this._isRunningAction = true
            type.finalizeNewInstance(this, this.storedValue)
            this._isRunningAction = false

            this.fireHook("afterCreate")
            this.state = NodeLifeCycle.CREATED
            sawException = false
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                this.state = NodeLifeCycle.DEAD
            }
        }
        // NOTE: we need to touch snapshot, because non-observable
        // "observableInstanceCreated" field was touched
        invalidateComputed(this, "snapshot")

        if (this.isRoot) this._addSnapshotReaction()

        this.finalizeCreation()

        this._childNodes = EMPTY_OBJECT
    }

    /*
     * Returnes (escaped) path representation as string
     */
    public get path(): string {
        this.subpathAtom.reportObserved()
        if (!this.parent) return ""
        return this.parent.path + "/" + this.escapedSubpath
    }

    public get root(): ObjectNode {
        const parent = this.parent
        return parent ? parent.root : this
    }

    public get isRoot(): boolean {
        return this.parent === null
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
                !!this.root._environment &&
                this.root._environment !== newParent.root._environment
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
            if (this.subpath !== newPath) {
                this.subpath = newPath
                this.escapedSubpath = escapeJsonPath(this.subpath)
                this.subpathAtom.reportChanged()
            }
            if (newParent && newParent !== this.parent) {
                newParent.root.identifierCache!.mergeCache(this)
                this.parent = newParent
                this.subpathAtom.reportChanged()
                this.fireHook("afterAttach")
            }
        }
    }

    fireHook(name: string) {
        const fn =
            this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function") fn.apply(this.storedValue)
    }

    public createObservableInstanceIfNeeded() {
        if (!this._observableInstanceCreated) this._createObservableInstance()
    }

    public get isObservableInstanceCreated() {
        return this._observableInstanceCreated
    }

    public get value(): any {
        this.createObservableInstanceIfNeeded()
        if (!this.isAlive) return undefined
        return this.type.getValue(this)
    }

    // advantage of using computed for a snapshot is that nicely respects transactions etc.
    @computed
    public get snapshot(): any {
        if (!this.isAlive) return undefined
        return freeze(this.getSnapshot())
    }

    // NOTE: we use this method to get snapshot without creating @computed overhead
    public getSnapshot(): any {
        if (!this.isAlive) return undefined
        return this._observableInstanceCreated
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

    isRunningAction(): boolean {
        if (this._isRunningAction) return true
        if (this.isRoot) return false
        return this.parent!.isRunningAction()
    }

    public get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    public assertAlive() {
        if (!this.isAlive) {
            const baseMsg = `[mobx-state-tree][error] You are trying to read or write to an object that is no longer part of a state tree. (Object type was '${
                this.type.name
            }'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.`
            switch (livelynessChecking) {
                case "error":
                    throw new Error(baseMsg)
                case "warn":
                    console.warn(
                        baseMsg +
                            ' Use setLivelynessChecking("error") to simplify debugging this error.'
                    )
            }
        }
    }

    getChildNode(subpath: string): INode {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this._observableInstanceCreated
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
            return this._observableInstanceCreated
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

    unbox(childNode: INode): any {
        if (childNode && childNode.parent) childNode.parent.assertAlive()
        if (childNode && childNode.parent && childNode.parent._autoUnbox) return childNode.value
        return childNode
    }

    toString(): string {
        const identifier = this.identifier ? `(id: ${this.identifier})` : ""
        return `${this.type.name}@${this.path || "<root>"}${identifier}${
            this.isAlive ? "" : "[dead]"
        }`
    }

    finalizeCreation() {
        // goal: afterCreate hooks runs depth-first. After attach runs parent first, so on afterAttach the parent has completed already
        if (this.state === NodeLifeCycle.CREATED) {
            if (this.parent) {
                if (this.parent.state !== NodeLifeCycle.FINALIZED) {
                    // parent not ready yet, postpone
                    return
                }
                this.fireHook("afterAttach")
            }
            this.state = NodeLifeCycle.FINALIZED
            for (let child of this.getChildren()) {
                if (child instanceof ObjectNode) child.finalizeCreation()
            }
        }
    }

    @action
    detach() {
        if (!this.isAlive) fail(`Error while detaching, node is not alive.`)
        if (this.isRoot) return
        else {
            this.fireHook("beforeDetach")
            this._environment = this.root._environment // make backup of environment
            this.state = NodeLifeCycle.DETACHING
            this.identifierCache = this.root.identifierCache!.splitCache(this)
            this.parent!.removeChild(this.subpath)
            this.parent = null
            this.subpath = this.escapedSubpath = ""
            this.subpathAtom.reportChanged()
            this.state = NodeLifeCycle.FINALIZED
        }
    }

    preboot() {
        const self = this
        this.applyPatches = createActionInvoker(
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
        this.applySnapshot = createActionInvoker(
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
    public die() {
        if (this.state === NodeLifeCycle.DETACHING) return

        if (isStateTreeNode(this.storedValue)) {
            // optimization: don't use walk, but getChildNodes for more efficiency
            walk(this.storedValue, child => {
                const node = getStateTreeNode(child)
                if (node instanceof ObjectNode) node.aboutToDie()
            })
            walk(this.storedValue, child => {
                const node = getStateTreeNode(child)
                if (node instanceof ObjectNode) node.finalizeDeath()
            })
        }
    }

    public aboutToDie() {
        if (this._disposers) {
            this._disposers.forEach(f => f())
            this._disposers = null
        }
        this.fireHook("beforeDestroy")
    }

    public finalizeDeath() {
        // invariant: not called directly but from "die"
        this.root.identifierCache!.notifyDied(this)
        addReadOnlyProp(this, "snapshot", this.snapshot) // kill the computed prop and just store the last snapshot

        if (this._patchSubscribers) this._patchSubscribers = null
        if (this._snapshotSubscribers) this._snapshotSubscribers = null
        this.state = NodeLifeCycle.DEAD
        this.subpath = this.escapedSubpath = ""
        this.parent = null
        this.subpathAtom.reportChanged()
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        this._addSnapshotReaction()
        if (!this._snapshotSubscribers) this._snapshotSubscribers = []
        return registerEventHandler(this._snapshotSubscribers, onChange)
    }

    public emitSnapshot(snapshot: any) {
        if (this._snapshotSubscribers)
            this._snapshotSubscribers.forEach((f: Function) => f(snapshot))
    }

    public onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
        if (!this._patchSubscribers) this._patchSubscribers = []
        return registerEventHandler(this._patchSubscribers, handler)
    }

    emitPatch(basePatch: IReversibleJsonPatch, source: INode) {
        const patchSubscribers = this._patchSubscribers
        if (patchSubscribers && patchSubscribers.length) {
            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
            })
            const [patch, reversePatch] = splitPatch(localizedPatch)
            patchSubscribers.forEach(f => f(patch, reversePatch))
        }
        if (this.parent) this.parent.emitPatch(basePatch, source)
    }

    addDisposer(disposer: () => void) {
        if (!this._disposers) this._disposers = [disposer]
        else this._disposers.unshift(disposer)
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
        if (!this._observableInstanceCreated) this._createObservableInstance()
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
