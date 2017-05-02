import {
    action, observable,
    computed, reaction
} from "mobx"
import { typecheck, IType } from "../types/type"
import { isMST, getMSTAdministration } from "./mst-node"
import { IMiddleWareHandler } from "./action"
import {
    invariant, fail, extend,
    addHiddenFinalProp, IDisposer, registerEventHandler, isMutable
} from "../utils"
import { IJsonPatch, joinJsonPath, splitJsonPath, escapeJsonPath } from "./json-patch"
import { getIdentifierAttribute } from "../types/complex-types/object"
import { ComplexType } from "../types/complex-types/complex-type"

let nextNodeId = 1

export class MSTAdministration {
    readonly nodeId = ++nextNodeId
    readonly target: any
    @observable _parent: MSTAdministration | null = null
    @observable subpath: string = ""
    readonly type: ComplexType<any, any>
    isProtectionEnabled = true
    _environment: any = undefined
    _isRunningAction = false // only relevant for root
    private _isAlive = true // optimization: use binary flags for all these switches
    private _isDetaching = false

    readonly middlewares: IMiddleWareHandler[] = []
    private readonly snapshotSubscribers: ((snapshot: any) => void)[] = []
    private readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    private readonly disposers: (() => void)[] = []

    constructor(parent: MSTAdministration | null, subpath: string, initialState: any, type: ComplexType<any, any>, environment: any) {
        invariant(type instanceof ComplexType, "Uh oh")
        addHiddenFinalProp(initialState, "$treenode", this)
        this._parent = parent
        this.subpath = subpath
        this.type = type
        this.target = initialState
        this._environment = environment

        const snapshotDisposer = reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        snapshotDisposer.onError((e: any) => {
            throw e
        })
        this.addDisposer(snapshotDisposer)
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
        return this._parent === null
    }

    public get parent() {
        return this._parent
    }

    public get root() {
        // future optimization: store root ref in the node and maintain it
        let p, r: MSTAdministration = this
        while (p = r.parent)
            r = p
        return r
    }

    public get isAlive() {
        return this._isAlive
    }

    public die() {
        if (this._isDetaching)
            return

        // tslint:disable-next-line:no_unused-variable
        this.type.getChildMSTs(this).forEach(([_, node]) => {
            node.die()
        })

        // TODO: kill $mobx.values
        this.fireHook("beforeDestroy")
        this.disposers.splice(0).reverse().forEach(f => f())
        this.patchSubscribers.splice(0)
        this.snapshotSubscribers.splice(0)
        this.patchSubscribers.splice(0)
        this._isAlive = false
        this._parent = null
        this.subpath = ""
        // Post conditions, element will not be in the tree anymore...
    }

    public assertAlive() {
        if (!this._isAlive)
            fail(`The model cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`)
    }

    @computed public get snapshot() {
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        // Optimization: only freeze on dev builds
        return Object.freeze(this.type.serialize(this))
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public applySnapshot(snapshot: any) {
        typecheck(this.type, snapshot)
        return this.type.applySnapshot(this, snapshot)
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

    emitPatch(patch: IJsonPatch, source: MSTAdministration) {
        if (this.patchSubscribers.length) {
            const localizedPatch: IJsonPatch = extend({}, patch, {
                    path: source.path.substr(this.path.length) + "/" + patch.path // calculate the relative path of the patch
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source)
    }

    setParent(newParent: MSTAdministration | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath)
            return
        if (this._parent && newParent && newParent !== this._parent) {
            fail(`A node cannot exists twice in the state tree. Failed to add object to path '${newParent.path}"/"${subpath}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && newParent.root === this) {
            fail(`A state tree is not allowed to contain itself. Cannot add root to path '${newParent.path}"/"${subpath}'`)
        }
        if (!this._parent && !!this._environment) {
            fail(`A state tree that has been initialized with an environment cannot be made part of another state tree.`)
        }
        if (this.parent && !newParent) {
            this.die()
        } else {
            this._parent = newParent
            this.subpath = subpath || "" // TODO: mweh
            this.fireHook("afterAttach")
        }
    }

    addDisposer(disposer: () => void) {
        this.disposers.push(disposer)
    }

    reconcileChildren<T>(childType: IType<any, T>, oldValues: T[], newValues: T[], newPaths: (string|number)[]): T[] {
        // optimization: overload for a single old / new value to avoid all the array allocations
        const res = new Array(newValues.length)
        const oldValuesByNode: any = {}
        const oldValuesById: any = {}
        const identifierAttribute = getIdentifierAttribute(childType)

        // Investigate which values we could reconcile
        oldValues.forEach(oldValue => {
            if (identifierAttribute) {
                const id = (oldValue as any)[identifierAttribute]
                if (id)
                    oldValuesById[id] = oldValue
            }
            if (isMST(oldValue)) {
                oldValuesByNode[getMSTAdministration(oldValue).nodeId] = oldValue
            }
        })

        // Prepare new values, try to reconcile
        newValues.forEach((newValue, index) => {
            const subPath = "" + newPaths[index]
            if (isMST(newValue)) {
                const childNode = getMSTAdministration(newValue)
                childNode.assertAlive()
                if (childNode.parent && (childNode.parent !== this || !oldValuesByNode[childNode.nodeId]))
                    return fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${this.path}/${subPath}', but it lives already at '${childNode.path}'`)

                // Try to reconcile based on already existing nodes
                oldValuesByNode[childNode.nodeId] = undefined
                childNode.setParent(this, subPath)
                res[index] = newValue
            } else if (identifierAttribute && isMutable(newValue)) {
                typecheck(childType, newValue)

                // Try to reconcile based on id
                const id = (newValue as any)[identifierAttribute]
                const existing = oldValuesById[id]
                const childNode = existing && getMSTAdministration(existing)
                if (existing && childNode.type.is(newValue)) {
                    oldValuesByNode[childNode.nodeId] = undefined
                    childNode.setParent(this, subPath)
                    childNode.applySnapshot(newValue)
                    res[index] = existing
                } else {
                    res[index] = (childType as any).create(newValue, undefined, this, subPath) // any -> we don't want this typing public
                }
            } else {
                typecheck(childType, newValue)

                // create a fresh MST node
                res[index] = (childType as any).create(newValue, undefined, this, subPath) // any -> we don't want this typing public
            }
        })

        // Kill non reconciled values
        for (let key in oldValuesByNode) if (oldValuesByNode[key])
            getMSTAdministration(oldValuesByNode[key]).die()

        return res
    }

    resolve(pathParts: string): MSTAdministration;
    resolve(pathParts: string, failIfResolveFails: boolean): MSTAdministration | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): MSTAdministration | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): MSTAdministration;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): MSTAdministration | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): MSTAdministration | undefined {
        this.assertAlive()
        // counter part of getRelativePath
        // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
        // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
        // so we treat leading ../ apart...
        let current: MSTAdministration | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "") // '/bla' or 'a//b' splits to empty strings
                current = current.root
            else if (pathParts[i] === "..")
                current = current!.parent
            else if (pathParts[i] === "." || pathParts[i] === "")
                continue
            else
                current = current!.getChildMST(pathParts[i])
            if (current === null) {
                if (failIfResolveFails)
                    return fail(`Could not resolve '${pathParts[i]}' in '${joinJsonPath(pathParts.slice(0, i - 1))}', path of the patch does not resolve`)
                else
                    return undefined
            }
        }
        return current!
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

    getChildMST(subpath: string): MSTAdministration | null {
        this.assertAlive()
        return this.type.getChildMST(this, subpath)
    }

    getChildMSTs(): [string, MSTAdministration][] {
        return this.type.getChildMSTs(this)
    }

    getChildType(key: string): IType<any, any> {
        return this.type.getChildType(key)
    }

    get isProtected(): boolean {
        let cur: MSTAdministration | null = this
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
            fail(`Cannot modify '${this.path}', the object is protected and can only be modified from model actions`)
        }
    }

    removeChild(subpath: string) {
        this.type.removeChild(this, subpath)
    }

    detach() {
        invariant(this._isAlive)
        if (this.isRoot)
            return
        else {
            this.fireHook("beforeDetach")
            this._environment = this.root._environment // make backup of environment
            this._isDetaching = true
            this.parent!.removeChild(this.subpath)
            this._parent = null
            this.subpath = ""
            this._isDetaching = false
        }
    }

    fireHook(name: string) {
        const fn = this.target[name]
        if (typeof fn === "function")
            fn.apply(this.target)
    }
    // TODO: give good toString, with type and path, and use it in errors
}
