import { reaction, observable, computed, action, getAtom } from "mobx"
import {
    INode,
    isStateTreeNode,
    getStateTreeNode,
    IJsonPatch,
    IReversibleJsonPatch,
    splitJsonPath,
    splitPatch,
    IType,
    IDisposer,
    extend,
    fail,
    registerEventHandler,
    addReadOnlyProp,
    walk,
    IMiddleware,
    IMiddlewareHandler,
    createActionInvoker,
    NodeLifeCycle,
    IdentifierCache,
    escapeJsonPath,
    addHiddenFinalProp,
    toJSON,
    freeze,
    resolveNodeByPathParts,
    convertChildNodesToArray,
    ModelType,
    identity,
    noop
} from "../../internal"

let nextNodeId = 1

export interface IChildNodesMap {
    [key: string]: INode
}

export class ObjectNode implements INode {
    nodeId = ++nextNodeId
    readonly type: IType<any, any>
    storedValue: any
    @observable subpath: string = ""
    @observable protected _parent: ObjectNode | null = null
    _isRunningAction = false // only relevant for root

    identifierCache: IdentifierCache | undefined
    isProtectionEnabled = true
    readonly identifierAttribute: string | undefined
    _environment: any = undefined
    protected _autoUnbox = true // unboxing is disabled when reading child nodes
    state = NodeLifeCycle.INITIALIZING

    middlewares: IMiddleware[] | null = null
    private snapshotSubscribers: ((snapshot: any) => void)[] | null = null
    private patchSubscribers:
        | ((patch: IJsonPatch, reversePatch: IJsonPatch) => void)[]
        | null = null
    private disposers: (() => void)[] | null = null

    applyPatches: (patches: IJsonPatch[]) => void
    applySnapshot: (snapshot: any) => void

    observableInstanceCreated: boolean = false
    private _childNodes: IChildNodesMap | null = null
    private _initialSnapshot: any
    private _createNewInstance: (initialValue: any) => any
    private _finalizeNewInstance: (node: INode, initialValue: any) => void

    constructor(
        type: IType<any, any>,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialSnapshot: any,
        createNewInstance: (initialValue: any) => any,
        finalizeNewInstance: (node: INode, initialValue: any) => void
    ) {
        this._parent = parent
        this._environment = environment
        this._createNewInstance = createNewInstance
        this._finalizeNewInstance = finalizeNewInstance

        this.type = type
        this.subpath = subpath
        this.identifierAttribute = type instanceof ModelType ? type.identifierAttribute : undefined
        this.unbox = this.unbox.bind(this)

        this._initialSnapshot = initialSnapshot

        if (!parent) {
            this.identifierCache = new IdentifierCache()
        }

        this._childNodes = type.initializeChildNodes(this, this._initialSnapshot)

        if (!parent) {
            this.identifierCache!.addNodeToCache(this)
        } else {
            parent.root.identifierCache!.addNodeToCache(this)
        }
    }

    @action
    createObservableInstance() {
        this.storedValue = this._createNewInstance(this._childNodes)
        this.preboot()

        addHiddenFinalProp(this.storedValue, "$treenode", this)
        addHiddenFinalProp(this.storedValue, "toJSON", toJSON)

        this.observableInstanceCreated = true
        let sawException = true
        try {
            this._isRunningAction = true
            this._finalizeNewInstance(this, this._childNodes)
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
        const snapshotAtom = getAtom(this, "snapshot") as any
        snapshotAtom.trackAndCompute()

        const snapshotDisposer = reaction(
            () => this.snapshot,
            snapshot => {
                this.emitSnapshot(snapshot)
            },
            {
                onError(e) {
                    throw e
                }
            }
        )
        this.addDisposer(snapshotDisposer)
        this.finalizeCreation()
    }

    /*
     * Returnes (escaped) path representation as string
     */
    @computed
    public get path(): string {
        if (!this.parent) return ""
        return this.parent.path + "/" + escapeJsonPath(this.subpath)
    }

    public get isRoot(): boolean {
        return this.parent === null
    }

    public get parent(): ObjectNode | null {
        return this._parent
    }

    // Optimization: make computed
    public get root(): ObjectNode {
        let p,
            r: ObjectNode = this
        while ((p = r.parent)) r = p
        return r
    }

    setParent(newParent: ObjectNode | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath) return
        if (newParent) {
            if (this._parent && newParent !== this._parent) {
                fail(
                    `A node cannot exists twice in the state tree. Failed to add ${this} to path '${newParent.path}/${subpath}'.`
                )
            }
            if (!this._parent && newParent.root === this) {
                fail(
                    `A state tree is not allowed to contain itself. Cannot assign ${this} to path '${newParent.path}/${subpath}'`
                )
            }
            if (
                !this._parent &&
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
            this.subpath = subpath || ""
            if (newParent && newParent !== this._parent) {
                newParent.root.identifierCache!.mergeCache(this)
                this._parent = newParent
                this.fireHook("afterAttach")
            }
        }
    }

    fireHook(name: string) {
        const fn =
            this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function") fn.apply(this.storedValue)
    }

    public get value() {
        if (!this.observableInstanceCreated) this.createObservableInstance()
        return this._value
    }

    @computed
    private get _value(): any {
        if (!this.isAlive) return undefined
        return this.type.getValue(this)
    }
    // advantage of using computed for a snapshot is that nicely respects transactions etc.
    @computed
    public get snapshot(): any {
        if (!this.isAlive) return undefined
        const snapshot = this.observableInstanceCreated
            ? this._getActualSnapshot()
            : this._getInitialSnapshot()
        return freeze(snapshot)
    }

    private _getActualSnapshot() {
        return this.type.getSnapshot(this)
    }

    private _getInitialSnapshot() {
        const snapshot = this._initialSnapshot
        return this.type instanceof ModelType
            ? this.type.applySnapshotPostProcessor(snapshot)
            : snapshot
    }

    isRunningAction(): boolean {
        if (this._isRunningAction) return true
        if (this.isRoot) return false
        return this.parent!.isRunningAction()
    }

    get identifier(): string | null {
        // identifier can not be changed during lifecycle of a node
        // so we safely can read it from initial snapshot
        return this.identifierAttribute ? this._initialSnapshot[this.identifierAttribute] : null
    }

    public get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    public assertAlive() {
        if (!this.isAlive)
            fail(
                `${this} cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`
            )
    }

    getChildNode(subpath: string): INode {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this.observableInstanceCreated
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
            return this.observableInstanceCreated
                ? this.type.getChildren(this)
                : this._getChildNodesArray()
        } finally {
            this._autoUnbox = true
        }
    }

    private _getChildNodesArray(): ReadonlyArray<INode> {
        return convertChildNodesToArray(this._childNodes)
    }

    getChildType(key: string): IType<any, any> {
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
        if (childNode && this._autoUnbox) return childNode.value
        return childNode
    }

    toString(): string {
        const identifier = this.identifier ? `(id: ${this.identifier})` : ""
        return `${this.type.name}@${this.path || "<root>"}${identifier}${this.isAlive
            ? ""
            : "[dead]"}`
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

    detach() {
        if (!this.isAlive) fail(`Error while detaching, node is not alive.`)
        if (this.isRoot) return
        else {
            this.fireHook("beforeDetach")
            this._environment = this.root._environment // make backup of environment
            this.state = NodeLifeCycle.DETACHING
            this.identifierCache = this.root.identifierCache!.splitCache(this)
            this.parent!.removeChild(this.subpath)
            this._parent = null
            this.subpath = ""
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
    }

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
        if (this.disposers) {
            this.disposers.splice(0).forEach(f => f())
        }
        this.fireHook("beforeDestroy")
    }

    public finalizeDeath() {
        // invariant: not called directly but from "die"
        this.root.identifierCache!.notifyDied(this)
        const self = this
        const oldPath = this.path
        addReadOnlyProp(this, "snapshot", this.snapshot) // kill the computed prop and just store the last snapshot

        if (this.patchSubscribers) this.patchSubscribers.splice(0)
        if (this.snapshotSubscribers) this.snapshotSubscribers.splice(0)
        this.state = NodeLifeCycle.DEAD
        this.subpath = ""
        this._parent = null

        // This is quite a hack, once interceptable objects / arrays / maps are extracted from mobx,
        // we could express this in a much nicer way
        // TODO: should be possible to obtain id's still...
        Object.defineProperty(this.storedValue, "$mobx", {
            get() {
                fail(
                    `This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '${self
                        .type
                        .name}') used to live at '${oldPath}'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.`
                )
            }
        })
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        if (!this.snapshotSubscribers) this.snapshotSubscribers = []
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public emitSnapshot(snapshot: any) {
        if (this.snapshotSubscribers) this.snapshotSubscribers.forEach((f: Function) => f(snapshot))
    }

    public onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
        if (!this.patchSubscribers) this.patchSubscribers = []
        return registerEventHandler(this.patchSubscribers, handler)
    }

    emitPatch(basePatch: IReversibleJsonPatch, source: INode) {
        if (this.patchSubscribers && this.patchSubscribers.length) {
            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
            })
            const [patch, reversePatch] = splitPatch(localizedPatch)
            this.patchSubscribers.forEach(f => f(patch, reversePatch))
        }
        if (this.parent) this.parent.emitPatch(basePatch, source)
    }

    addDisposer(disposer: () => void) {
        if (!this.disposers) this.disposers = [disposer]
        else this.disposers.unshift(disposer)
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
        if (!this.observableInstanceCreated) this.createObservableInstance()
        this.type.applyPatchLocally(this, subpath, patch)
    }
}
