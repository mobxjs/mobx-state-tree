import { reaction, computed, getAtom } from "mobx"
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
    noop,
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
    resolveNodeByPathParts
} from "../../internal"

let nextNodeId = 1

export class ObjectNode implements INode {
    nodeId = ++nextNodeId
    readonly type: IType<any, any>
    readonly storedValue: any
    subpath: string = ""
    protected _parent: ObjectNode | null = null
    _isRunningAction = false // only relevant for root

    identifierCache: IdentifierCache | undefined
    isProtectionEnabled = true
    identifierAttribute: string | undefined = undefined // not to be modified directly, only through model initialization
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

    constructor(
        type: IType<any, any>,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any,
        storedValue: any,
        canAttachTreeNode: boolean,
        finalizeNewInstance: (node: INode, initialValue: any) => void = noop
    ) {
        this.type = type
        this.storedValue = storedValue
        this._parent = parent
        this.subpath = subpath
        this._environment = environment

        this.preboot()

        if (!parent) this.identifierCache = new IdentifierCache()
        if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "$treenode", this)

        let sawException = true
        try {
            if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "toJSON", toJSON)

            this._isRunningAction = true
            finalizeNewInstance(this, initialValue)
            this._isRunningAction = false

            if (parent) parent.root.identifierCache!.addNodeToCache(this)
            else this.identifierCache!.addNodeToCache(this)

            this.fireHook("afterCreate")
            this.state = NodeLifeCycle.CREATED
            sawException = false
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                this.state = NodeLifeCycle.DEAD
            }
        }

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
            this._invalidateComputed("path")
        }
    }

    fireHook(name: string) {
        const fn =
            this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function") fn.apply(this.storedValue)
    }

    @computed
    public get value(): any {
        if (!this.isAlive) return undefined
        return this.type.getValue(this)
    }

    @computed
    public get snapshot() {
        if (!this.isAlive) return undefined
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        const snapshot = this.type.getSnapshot(this)
        // avoid any external modification in dev mode
        return freeze(snapshot)
    }

    isRunningAction(): boolean {
        if (this._isRunningAction) return true
        if (this.isRoot) return false
        return this.parent!.isRunningAction()
    }

    get identifier(): string | null {
        // RF: do not read from the snapshot here, it can lead to cycle computations
        // using bidirectional references
        return this.identifierAttribute ? this.storedValue[this.identifierAttribute] : null
    }

    public get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    public assertAlive() {
        if (!this.isAlive)
            fail(
                `You are trying to read or write to an object that is no longer part of a state tree. (Object type was '${this
                    .type.name}').`
            )
    }

    getChildNode(subpath: string): INode {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this.type.getChildNode(this, subpath)
        } finally {
            this._autoUnbox = true
        }
    }

    getChildren(): ReadonlyArray<INode> {
        this.assertAlive()
        this._autoUnbox = false
        try {
            return this.type.getChildren(this)
        } finally {
            this._autoUnbox = true
        }
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
        if (childNode && childNode.parent) childNode.parent.assertAlive()
        if (childNode && childNode.parent && childNode.parent._autoUnbox) return childNode.value
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
            this._invalidateComputed("path")
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
        if (this.disposers) this.disposers.splice(0).forEach(f => f())
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
        this._parent = null
        this.subpath = ""
        this._invalidateComputed("path")
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
        if (!this.disposers) this.disposers = []
        this.disposers.unshift(disposer)
    }

    removeMiddleware(handler: IMiddlewareHandler) {
        if (this.middlewares)
            this.middlewares = this.middlewares.filter(middleware => middleware.handler !== handler)
    }

    addMiddleWare(handler: IMiddlewareHandler, includeHooks: boolean = true) {
        if (!this.middlewares) this.middlewares = []
        this.middlewares.push({ handler, includeHooks })
        return () => {
            this.removeMiddleware(handler)
        }
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.assertWritable()
        this.type.applyPatchLocally(this, subpath, patch)
    }

    private _invalidateComputed(prop: string) {
        const atom = getAtom(this, prop) as any
        atom.trackAndCompute()
    }
}
