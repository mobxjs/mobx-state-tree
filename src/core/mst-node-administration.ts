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
    addHiddenFinalProp, IDisposer, registerEventHandler, isMutable
} from "../utils"
import { IJsonPatch, joinJsonPath, splitJsonPath, escapeJsonPath } from "./json-patch"
import { getIdentifierAttribute, ObjectType } from "../types/complex-types/object"
import { ComplexType } from "../types/complex-types/complex-type"

let nextNodeId = 1

export class MSTAdminisration {
    readonly nodeId = ++nextNodeId
    readonly target: any
    @observable _parent: MSTAdminisration | null = null
    @observable subpath: string = ""
    readonly type: ComplexType<any, any>
    _environment: any = undefined
    _isRunningAction = false // only relevant for root
    private _isAlive = true
    private _isProtected = false

    readonly middlewares: IMiddleWareHandler[] = []
    private readonly snapshotSubscribers: ((snapshot: any) => void)[] = []
    private readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    private readonly snapshotDisposer: IReactionDisposer

    constructor(parent: MSTAdminisration | null, subpath: string, initialState: any, type: ComplexType<any, any>, environment: any) {
        invariant(type instanceof ComplexType, "Uh oh")
        addHiddenFinalProp(initialState, "$treenode", this)
        this._parent = parent
        this.subpath = subpath
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
        let p, r: MSTAdminisration = this
        while (p = r.parent)
            r = p
        return r
    }

    public get isAlive() {
        return this._isAlive
    }

    public die() {
        // TODO: kill $mobx.values
        this.snapshotDisposer()
        this.patchSubscribers.splice(0)
        this.snapshotSubscribers.splice(0)
        this.patchSubscribers.splice(0)
        this._isAlive = false
        // Post conditions, element will not be in the tree anymore...
    }

    public assertAlive() {
        if (!this._isAlive || (this.root && !this.root._isAlive))
            fail(`The model cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`)
    }

    @computed public get snapshot() {
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
            this.subpath = subpath || "" // TODO: mweh
        }
    }

    reconcileChildren(childType: IType<any, any>, oldValues: any[], newValues: any[], newPaths: (string|number)[]): any {
        // optimization: overload for a single old / new value to avoid all the array allocations
        const res = new Array(newValues.length)
        const oldValuesByNode: any = {}
        const oldValuesById: any = {}
        const identifierAttribute = getIdentifierAttribute(childType)

        // Investigate which values we could reconcile
        oldValues.forEach(oldValue => {
            if (identifierAttribute) {
                const id = oldValue[identifierAttribute]
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
                    return fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${this.path}/${subPath}', but it lives already at '${getPath(newValue)}'`)

                // Try to reconcile based on already existing nodes
                oldValuesByNode[childNode.nodeId] = undefined
                childNode.setParent(this, subPath)
                res[index] = newValue
            } else if (identifierAttribute && isMutable(newValue)) {
                typecheck(childType, newValue)

                // Try to reconcile based on id
                const id = newValue[identifierAttribute]
                const existing = oldValuesById[id]
                if (existing) {
                    const childNode = getMSTAdministration(existing)
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

import { hasParent, getPath } from "./mst-operations"