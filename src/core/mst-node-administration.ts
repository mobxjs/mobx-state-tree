import {
    action, observable,
    computed, reaction,
    IReactionDisposer
} from "mobx"
import { typecheck, IType } from "../types/type"
import { isMST, getMSTAdministration } from "./mst-node"
import { IMiddleWareHandler } from "./action"
import {
    invariant, fail, extend,
    addHiddenFinalProp, IDisposer, registerEventHandler
} from "../utils"
import { IJsonPatch, joinJsonPath, splitJsonPath } from "./json-patch"
import { ObjectType } from "../types/complex-types/object"
import { ComplexType } from "../types/complex-types/complex-type"

export class MSTAdminisration {
    readonly target: any
    @observable _parent: MSTAdminisration | null = null
    readonly type: ComplexType<any, any>
    _environment: any = undefined
    _isRunningAction = false // only relevant for root
    private _isAlive = true
    private _isProtected = false

    readonly middlewares: IMiddleWareHandler[] = []
    private readonly snapshotSubscribers: ((snapshot: any) => void)[] = []
    private readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    private readonly snapshotDisposer: IReactionDisposer

    constructor(initialState: any, type: ComplexType<any, any>, environment: any) {
        invariant(type instanceof ComplexType, "Uh oh")
        addHiddenFinalProp(initialState, "$treenode", this)
        this.type = type
        this.target = initialState
        this._environment = environment

        this.snapshotDisposer = reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        this.snapshotDisposer.onError((e: any) => {
            throw e
        })
    }

    @computed get pathParts(): string[]{
        // no parent? you are root!
        if (this._parent === null) {
            return []
        }

        // get the key
        // optimize: maybe this shouldn't be computed, this is called often and pretty expensive lookup ...
        const keys = this._parent.getChildMSTs()
            .filter(entry => entry[1] === this)
        if (keys.length > 0) {
            const [key] = keys[0]
            return this._parent.pathParts.concat([key])
        }

        return fail("Illegal state")
    }

    /**
     * Returnes (escaped) path representation as string
     */
    @computed public get path(): string {
        this.assertAlive()
        return joinJsonPath(this.pathParts)
    }

    @computed public get subpath(): string {
        this.assertAlive()
        if (this.isRoot)
            return ""
        const parts = this.pathParts
        return parts[parts.length - 1]
    }

    public get isRoot(): boolean {
        return this._parent === null
    }

    public get parent() {
        return this._parent
    }

    public get root() {
        // future optimization: store root ref in the node and maintain it
        let p, r: MSTAdminisration = this
        while (p = r.parent)
            r = p
        return r
    }

    public die() {
        if (!this.isRoot)
            fail(`Model ${this.path} cannot die while it is still in a tree`)
        this.snapshotDisposer()
        this.patchSubscribers.splice(0)
        this.snapshotSubscribers.splice(0)
        this.patchSubscribers.splice(0)
        this._isAlive = false
    }

    public assertAlive() {
        if ((this.isRoot && !this._isAlive) || !this.root._isAlive)
            fail(`The model cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach'`)
    }

    @computed public get snapshot() {
        this.assertAlive()
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        return Object.freeze(this.type.serialize(this))
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public applySnapshot(snapshot: any) {
        this.assertWritable()
        typecheck(this.type, snapshot)
        return this.type.applySnapshot(this, snapshot)
    }

    @action public applyPatch(patch: IJsonPatch) {
        const parts = splitJsonPath(patch.path)
        const node = this.resolvePath(parts.slice(0, -1))
        node.applyPatchLocally(parts[parts.length - 1], patch)
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.assertWritable()
        this.type.applyPatchLocally(this, subpath, patch)
    }

    public onPatch(onPatch: (patches: IJsonPatch) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    emitPatch(patch: IJsonPatch, source: MSTAdminisration) {
        if (this.patchSubscribers.length) {
            const localizedPatch: IJsonPatch = extend({}, patch, {
                    path: source.path.substr(this.path.length) + "/" + patch.path // calculate the relative path of the patch
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source)
    }

    setParent(newParent: MSTAdminisration | null, subpath: string | null = null) {
        // TODO: factor out subpath? It is not updated in this function, which is confusing
        if (this.parent === newParent)
            return
        if (this._parent && newParent) {
            fail(`A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && newParent.root === this) {
            fail(`A state tree is not allowed to contain itself. Cannot add root to path '/${newParent.pathParts.concat(subpath!).join("/")}'`)
        }
        if (!this._parent && !!this._environment) {
            fail(`A state tree that has been initialized with an environment cannot be made part of another state tree.`)
        }
        if (this.parent && !newParent) {
            if (
                 this.patchSubscribers.length > 0 ||
                 this.snapshotSubscribers.length > 0 ||
                 (this instanceof ObjectType && this.middlewares.length > 0)
            ) {
                console.warn("An object with active event listeners was removed from the tree. The subscriptions have been disposed.")
            }
            this._parent = newParent
            this.die()
        } else {
            this._parent = newParent
        }

    }

    prepareChild(subpath: string, child: any): any {
        const childFactory = this.getChildType(subpath)
        typecheck(childFactory, child)

        if (isMST(child)) {
            const childNode = getMSTAdministration(child)

            if (childNode.isRoot) {
                // we are adding a node with no parent (first insert in the tree)
                childNode.setParent(this, subpath)
                return child
            }

            return fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${this.path}/${subpath}', but it lives already at '${childNode.path}'`)
        }
        const existingNode = this.getChildMST(subpath)
        const newInstance = childFactory.create(child)

        if (existingNode && existingNode.type === newInstance.factory) {
            // recycle instance..
            existingNode.applySnapshot(child)
            return existingNode.target
        } else {
            if (existingNode)
                existingNode.setParent(null) // TODO: or delete / remove / whatever is a more explicit clean up
            if (isMST(newInstance)) {
                const node = getMSTAdministration(newInstance)
                node.setParent(this, subpath)
            }
            return newInstance
        }
    }

    resolve(pathParts: string): MSTAdminisration;
    resolve(pathParts: string, failIfResolveFails: boolean): MSTAdminisration | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): MSTAdminisration | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): MSTAdminisration;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): MSTAdminisration | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): MSTAdminisration | undefined {
        this.assertAlive()
        // counter part of getRelativePath
        // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
        // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
        // so we treat leading ../ apart...
        let current: MSTAdminisration | null = this
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

    getChildMST(subpath: string): MSTAdminisration | null {
        this.assertAlive()
        return this.type.getChildMST(this, subpath)
    }

    getChildMSTs(): [string, MSTAdminisration][] {
        return this.type.getChildMSTs(this)
    }

    getChildType(key: string): IType<any, any> {
        return this.type.getChildType(key)
    }

    get isProtected(): boolean {
        let cur: MSTAdminisration | null = this
        while (cur) {
            if (cur._isProtected === true)
                return true
            cur = cur.parent
        }
        return false
    }

    protect() {
        this._isProtected = true
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
            this._environment = this.root._environment // make backup of environment
            this.parent!.removeChild(this.subpath)
            this._isAlive = true
        }
    }

    // TODO: give good toString, with type and path, and use it in errors
}
