import {
    observable,
    computed,
    action,
    reaction
} from "mobx"

let nextNodeId = 1

export class Node  {
    // optimization: these fields make MST memory expensive for primitives. Most can be initialized lazily, or with EMPTY_ARRAY on prototype
    readonly nodeId = ++nextNodeId
    readonly type: IType<any, any>
    readonly storedValue: any
    @observable protected _parent: Node | null = null
    @observable subpath: string = ""

    identifierCache = new IdentifierCache()
    isProtectionEnabled = true
    identifierAttribute: string | undefined = undefined // not to be modified directly, only through model initialization
    _environment: any = undefined
    _isRunningAction = false // only relevant for root
    private _isAlive = true // optimization: use binary flags for all these switches
    private _isDetaching = false

    readonly middlewares: IMiddleWareHandler[] = []
    private readonly snapshotSubscribers: ((snapshot: any) => void)[] = []
    private readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    private readonly disposers: (() => void)[] = []

    // TODO: should have environment as well?
    constructor(type: IType<any, any>, parent: Node | null, subpath: string, environment: any, storedValue: any) {
        this.type = type
        this._parent = parent
        this.subpath = subpath
        this.storedValue = storedValue
        this._environment = environment

        // optimization: don't keep the snapshot by default alive with a reaction by default
        // in prod mode. This saves lot of GC overhead (important for e.g. React Native)
        // if the feature is not actively used
        // downside; no structural sharing if getSnapshot is called incidently
        const snapshotDisposer = reaction(() => this.snapshot, snapshot => {
            this.emitSnapshot(snapshot)
        })
        snapshotDisposer.onError((e: any) => {
            throw e
        })
        this.addDisposer(snapshotDisposer)
    }

    get identifier(): string | null {
        return this.identifierAttribute ? this.storedValue[this.identifierAttribute] : null
    }

    /**
     * Returnes (escaped) path representation as string
     */
    @computed public get path(): string {
        if (!this.parent)
            return ""
        return this.parent.path + "/" + escapeJsonPath(this.subpath)
    }

    public get isRoot(): boolean {
        return this.parent === null
    }

    public get parent(): Node | null {
        return this._parent
    }

    public get root(): Node {
        // future optimization: store root ref in the node and maintain it
        let p, r: Node = this
        while (p = r.parent)
            r = p
        return r as Node
    }

    getRelativePathTo(target: Node): string {
        // PRE condition target is (a child of) base!
        if (this.root !== target.root) fail(`Cannot calculate relative path: objects '${this}' and '${target}' are not part of the same object tree`)

        const baseParts = splitJsonPath(this.path)
        const targetParts = splitJsonPath(target.path)
        let common = 0
        for (; common < baseParts.length; common++) {
            if (baseParts[common] !== targetParts[common])
                break
        }
        // TODO: assert that no targetParts paths are "..", "." or ""!
        return baseParts.slice(common).map(_ => "..").join("/")
            + joinJsonPath(targetParts.slice(common))
    }

    resolve(pathParts: string): Node;
    resolve(pathParts: string, failIfResolveFails: boolean): Node | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): Node | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): Node;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): Node | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): Node | undefined {
        // counter part of getRelativePath
        // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
        // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
        // so we treat leading ../ apart...
        let current: Node | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "") // '/bla' or 'a//b' splits to empty strings
                current = current!.root
            else if (pathParts[i] === "..")
                current = current!.parent
            else if (pathParts[i] === "." || pathParts[i] === "")
                continue
            else if (current) {
                current = current.getChildNode(pathParts[i])
                continue
            }

            if (!current) {
                if (failIfResolveFails)
                    return fail(`Could not resolve '${pathParts[i]}' in '${joinJsonPath(pathParts.slice(0, i - 1))}', path of the patch does not resolve`)
                else
                    return undefined
            }
        }
        return current!
    }

    getValue(): any {
        return this.type.getValue(this)
    }

    public get isAlive() {
        return this._isAlive
    }

    public die() {
        if (this._isDetaching)
            return

        if (isStateTreeNode(this.storedValue)) {
            walk(this.storedValue, child => getStateTreeNode(child).aboutToDie())
            this.root.identifierCache.unregister(this)
            walk(this.storedValue, child => getStateTreeNode(child).finalizeDeath())
        }
    }

    public aboutToDie() {
        this.disposers.splice(0).forEach(f => f())
        this.fireHook("beforeDestroy")
    }

    public finalizeDeath() {
        // invariant: not called directly but from "die"
        const self = this
        const oldPath = this.path
        addReadOnlyProp(this, "snapshot", this.snapshot) // kill the computed prop and just store the last snapshot

        this.patchSubscribers.splice(0)
        this.snapshotSubscribers.splice(0)
        this.patchSubscribers.splice(0)
        this._isAlive = false
        this._parent = null
        this.subpath = ""

        // This is quite a hack, once interceptable objects / arrays / maps are extracted from mobx,
        // we could express this in a much nicer way
        Object.defineProperty(this.storedValue, "$mobx", {
            get() {
                fail(`This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '${self.type.name}') used to live at '${oldPath}'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.`)
            }
        })
    }

    public assertAlive() {
        if (!this._isAlive)
            fail(`${this} cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`)
    }

    @computed public get snapshot() {
        if (!this._isAlive)
            return undefined
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        // Optimization: only freeze on dev builds
        return Object.freeze(this.type.getSnapshot(this))
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public applySnapshot(snapshot: any) {
        typecheck(this.type, snapshot)
        return this.type.applySnapshot(this, snapshot)
    }

    public emitSnapshot(snapshot: any) {
        this.snapshotSubscribers.forEach((f: Function) => f(snapshot))
    }

    @action public applyPatch(patch: IJsonPatch) {
        const parts = splitJsonPath(patch.path)
        const node = this.resolvePath(parts.slice(0, -1))

        node.pseudoAction(() => {
            node.applyPatchLocally(parts[parts.length - 1], patch)
        })
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.assertWritable()
        this.type.applyPatchLocally(this, subpath, patch)
    }

    public onPatch(onPatch: (patches: IJsonPatch) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    emitPatch(patch: IJsonPatch, source: Node) {
        if (this.patchSubscribers.length) {
            const localizedPatch: IJsonPatch = extend({}, patch, {
                    path: source.path.substr(this.path.length) + "/" + patch.path // calculate the relative path of the patch
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source)
    }

    setParent(newParent: Node | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath)
            return
        if (this._parent && newParent && newParent !== this._parent) {
            fail(`A node cannot exists twice in the state tree. Failed to add ${this} to path '${newParent.path}/${subpath}'.`)
        }
        if (!this._parent && newParent && newParent.root === this) {
            fail(`A state tree is not allowed to contain itself. Cannot assign ${this} to path '${newParent.path}/${subpath}'`)
        }
        if (!this._parent && !!this._environment) {
            fail(`A state tree that has been initialized with an environment cannot be made part of another state tree.`)
        }
        if (this.parent && !newParent) {
            this.die()
        } else {
            this._parent = newParent
            if (newParent && !this._parent)
                newParent.root.identifierCache.register(this)
            this.subpath = subpath || ""
            this.fireHook("afterAttach")
        }
    }

    addDisposer(disposer: () => void) {
        this.disposers.unshift(disposer)
    }

    reconcileChildren<T>(parent: Node, childType: IType<any, T>, oldNodes: Node[], newValues: T[], newPaths: (string|number)[]): Node[] {
        // TODO: move to array, rewrite to use type.reconcile
        // TODO: pick identifiers based on actual type instead of declared type
        // optimization: overload for a single old / new value to avoid all the array allocations
        // optimization: skip reconciler for non-complex types
        const res = new Array(newValues.length)
        const nodesToBeKilled: { [nodeId: string]: Node | undefined } = {}
        const oldNodesByIdentifier: {
            [identifierAttribute: string]: {
                [identifier: string]: Node
            }
        } = {}

        function findReconcilationCandidates(snapshot: any): Node | null {
            for (let attr in oldNodesByIdentifier) {
                const id = snapshot[attr]
                if ((typeof id === "string" || typeof id === "number") && oldNodesByIdentifier[attr][id])
                    return oldNodesByIdentifier[attr][id]
            }
            return null
        }

        // Investigate which values we could reconcile, and mark them all as potentially dead
        oldNodes.forEach(oldNode => {
            if (oldNode.identifierAttribute)
                (oldNodesByIdentifier[oldNode.identifierAttribute] || (oldNodesByIdentifier[oldNode.identifierAttribute] = {}))[oldNode.identifier!] = oldNode
            nodesToBeKilled[oldNode.nodeId] = oldNode
        })

        // Prepare new values, try to reconcile
        newValues.forEach((newValue, index) => {
            const subPath = "" + newPaths[index]
            if (isStateTreeNode(newValue)) {
                // A tree node...
                const childNode = getStateTreeNode(newValue)
                childNode.assertAlive()
                if (childNode.parent === parent) {
                    // Came from this array already
                    if (!nodesToBeKilled[childNode.nodeId]) {
                        // this node is owned by this parent, but not in the reconcilable set, so it must be double
                        fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent.path}/${subPath}', but it lives already at '${childNode.path}'`)
                    }
                    nodesToBeKilled[childNode.nodeId] = undefined
                    childNode.setParent(parent, subPath)
                    res[index] = childNode // reuse node
                } else {
                    // Lives somewhere else (note that instantiate might still reconcile for complex types!)
                    res[index] = childType.instantiate(this, subPath, undefined, newValue)
                }
            } else if (isMutable(newValue)) {
                // The snapshot of a tree node, try to reconcile based on id
                const reconcilationCandidate = findReconcilationCandidates(newValue)
                if (reconcilationCandidate) {
                    const childNode = childType.reconcile(reconcilationCandidate, newValue)
                    nodesToBeKilled[reconcilationCandidate.nodeId] = undefined
                    childNode.setParent(this, subPath)
                    res[index] = childNode
                } else {
                    res[index] = childType.instantiate(this, subPath, undefined, newValue)
                }
            } else {
                // create a fresh MST node
                res[index] = childType.instantiate(this, subPath, undefined, newValue)
            }
        })

        // Kill non reconciled values
        for (let key in nodesToBeKilled)
            if (nodesToBeKilled[key] !== undefined)
                nodesToBeKilled[key]!.die()

        return res
    }

    isRunningAction(): boolean {
        if (this._isRunningAction)
            return true
        if (this.isRoot)
            return false
        return this.parent!.isRunningAction()
    }

    addMiddleWare(handler: IMiddleWareHandler) {
        // TODO: check / warn if not protected!
        return registerEventHandler(this.middlewares, handler)
    }

    getChildNode(subpath: string): Node {
        this.assertAlive()
        return this.type.getChildNode(this, subpath)
    }

    getChildren(): Node[] {
        return this.type.getChildren(this)
    }

    getChildType(key: string): IType<any, any> {
        return this.type.getChildType(key)
    }

    get isProtected(): boolean {
        let cur: Node | null = this
        while (cur) {
            if (cur.isProtectionEnabled === false)
                return false
            cur = cur.parent
        }
        return true
    }

    /**
     * Pseudo action is an action that is not named, does not trigger middleware but does unlock the tree.
     * Used for applying (initial) snapshots and patches
     */
    pseudoAction(fn: () => void) {
        const inAction = this._isRunningAction
        this._isRunningAction = true
        fn()
        this._isRunningAction = inAction
    }

    assertWritable() {
        this.assertAlive()
        if (!this.isRunningAction() && this.isProtected) {
            fail(`Cannot modify '${this}', the object is protected and can only be modified by using an action.`)
        }
    }

    removeChild(subpath: string) {
        this.type.removeChild(this, subpath)
    }

    detach() {
        if (!this._isAlive) fail(`Error while detaching, node is not alive.`)
        if (this.isRoot)
            return
        else {
            this.fireHook("beforeDetach")
            this._environment = (this.root as Node)._environment // make backup of environment
            this._isDetaching = true
            this.root.identifierCache.unregister(this)
            this.parent!.removeChild(this.subpath)
            this._parent = null
            this.subpath = ""
            this._isDetaching = false
        }
    }

    fireHook(name: string) {
        const fn = this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function")
            fn.apply(this.storedValue)
    }

    toString(): string {
        const identifier = this.identifier ? `(id: ${this.identifier})` : ""
        return `${this.type.name}@${this.path || "<root>"}${identifier}${this.isAlive ? "" : "[dead]"}`
    }
}

export interface IComplexValue {
    readonly $treenode?: Node
}

export function isStateTreeNode(value: any): value is IComplexValue {
    return !!(value && value.$treenode)
}

export function getStateTreeNode(value: IComplexValue): Node {
    if (isStateTreeNode(value))
        return value.$treenode!
    else
        return fail("element has no Node")
}

export function unbox(b: Node): any {
    return b.getValue()
}

import { IType } from "../types/type"
import { escapeJsonPath, splitJsonPath, joinJsonPath, IJsonPatch } from "./json-patch"
import { typecheck } from "../types/type-checker"
import { walk } from "./mst-operations"
import { IMiddleWareHandler } from "./action"
import {
    addReadOnlyProp,
    extend,
    fail,
    IDisposer,
    isMutable,
    registerEventHandler
} from "../utils"
import { IdentifierCache } from "./identifier-cache"