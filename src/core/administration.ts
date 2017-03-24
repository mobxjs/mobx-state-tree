import {
    action, observable,
    computed, reaction,
    isObservableArray,
    isObservableMap
} from "mobx"

import { ComplexType, typecheck, IModel, IType } from './type';
import {IActionHandler} from "./action"
import {
    invariant, fail, extend,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler, isSerializable
} from "../utils"
import {IJsonPatch, joinJsonPath, splitJsonPath} from "./json-patch"
import {IActionCall, applyActionLocally} from "./action"
import {ObjectType} from "../types/object"

// TODO: make Node more like a struct, extract the methods to snapshots.js, actions.js etc..
// TODO: make Node generic?
// TODO: introduce IComplexInstance instead of IModel?
export class MSTAdminisration {
    readonly target: any
    @observable _parent: MSTAdminisration | null = null
    readonly type: ComplexType<any, any>
    readonly snapshotSubscribers: ((snapshot: any) => void)[] = []
    readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    readonly actionSubscribers: IActionHandler[] = []
    _isRunningAction = false // only relevant for root

    constructor(initialState: any, type: ComplexType<any, any>) {
        invariant(type instanceof ComplexType, "Uh oh")
        addHiddenFinalProp(initialState, "$treenode", this)
        this.type = type
        this.target = initialState

        reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        // dispose reaction, observe, intercept somewhere explicitly? Should strictly speaking not be needed for GC
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
        return "/" + joinJsonPath(this.pathParts)
    }

    @computed public get subpath(): string {
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

    @computed public get snapshot() {
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        return Object.freeze(this.type.serialize(this, this.target))
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public applySnapshot(snapshot: any) {
        typecheck(this.type, snapshot)
        return this.type.applySnapshot(this, this.target, snapshot)
    }

    @action public applyPatch(patch: IJsonPatch) {
        const parts = splitJsonPath(patch.path)
        const node = this.resolvePath(parts.slice(0, -1))
        node.applyPatchLocally(parts[parts.length - 1], patch)
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.type.applyPatchLocally(this, this.target, subpath, patch)
    }

    public onPatch(onPatch: (patches: IJsonPatch) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    emitPatch(patch: IJsonPatch, source: MSTAdminisration, distance = 0) {
        if (this.patchSubscribers.length) {
            let localizedPatch: IJsonPatch
            if (distance === 0)
                localizedPatch = patch
            else
                localizedPatch = extend({}, patch, {
                    path: getRelativePath(this, source) + patch.path
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, this, distance + 1)
    }

    setParent(newParent: MSTAdminisration | null, subpath: string | null = null) {
        if (this.parent === newParent)
            return
        if (this._parent && newParent) {
            invariant(false, `A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && newParent.root === this) {
            invariant(false, `A state tree is not allowed to contain itself. Cannot add root to path '/${newParent.pathParts.concat(subpath!).join("/")}'`)
        }
        if (this.parent && !newParent && (
                this.patchSubscribers.length > 0 || this.snapshotSubscribers.length > 0 ||
                 (this instanceof ObjectType && this.actionSubscribers.length > 0)
        )) {
            console.warn("An object with active event listeners was removed from the tree. This might introduce a memory leak. Use detach() if this is intentional")
        }

        this._parent = newParent
    }

    prepareChild(subpath: string, child: any): any {
        const childFactory = this.getChildType(subpath)

        if (hasMST(child)) {
            const node = getMST(child)

            if (node.isRoot) {
                // we are adding a node with no parent (first insert in the tree)
                node.setParent(this, subpath)
                return child
            }

            return fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${this.path}/${subpath}', but it lives already at '${getPath(child)}'`)
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
            if (hasMST(newInstance)) {
                const node = getMST(newInstance)
                node.setParent(this, subpath)
            }
            return newInstance
        }
    }

    detach() {
        // TODO: change to return a clone
        // TODO: detach / remove marks as End of life!...
        if (this.isRoot)
            return
        if (isObservableArray(this.parent!.target))
            this.parent!.target.splice(parseInt(this.subpath), 1)
        else if (isObservableMap(this.parent!.target))
            this.parent!.target.delete(this.subpath)
        else // Object
            this.parent!.target[this.subpath] = null
    }

    resolve(pathParts: string): MSTAdminisration;
    resolve(pathParts: string, failIfResolveFails: boolean): MSTAdminisration | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): MSTAdminisration | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): MSTAdminisration;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): MSTAdminisration | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): MSTAdminisration | undefined {
        let current: MSTAdminisration | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "") // '/bla' or 'a//b' splits to empty strings
                current = current.root
            else if (pathParts[i] === "..")
                current = current!.parent
            else if (pathParts[i] === ".")
                continue
            else
                current = current!.getChildMST(pathParts[i])
            if (current === null) {
                if (failIfResolveFails)
                    return fail(`Could not resolve'${pathParts[i]}' in '${joinJsonPath(pathParts.slice(0, i - 1))}', path of the patch does not resolve`)
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

    applyAction(action: IActionCall): void {
        const targetNode = this.resolve(action.path || "")
        if (targetNode)
            applyActionLocally(targetNode, targetNode.target, action)
        else
            fail(`Invalid action path: ${action.path || ""}`)
    }

    emitAction(instance: MSTAdminisration, action: IActionCall, next: () => any): any {
        let idx = -1
        const correctedAction: IActionCall = this.actionSubscribers.length
            ? extend({} as any, action, { path: getRelativePath(this, instance) })
            : null
        let n = () => {
            // optimization: use tail recursion / trampoline
            idx++
            if (idx < this.actionSubscribers.length) {
                return this.actionSubscribers[idx](correctedAction!, n)
            } else {
                const parent = this.parent
                if (parent)
                    return parent.emitAction(instance, action, next)
                else
                    return next()
            }
        }
        return n()
    }

    onAction(listener: (action: IActionCall, next: () => void) => void): IDisposer {
        return registerEventHandler(this.actionSubscribers, listener)
    }

    getChildMST(subpath: string): MSTAdminisration | null {
        return this.type.getChildMST(this, this.target, subpath)
    }

    getChildMSTs(): [string, MSTAdminisration][] {
        return this.type.getChildMSTs(this, this.target)
    }

    getChildType(key: string): IType<any, any> {
        return this.type.getChildType(key)
    }
}

// TODO: duplicate with isModel
export function hasMST(value: any): value is IModel {
    return value && value.$treenode
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeMST<T, R>(value: T & IModel, asNodeCb: (node: MSTAdminisration, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (isMutable(value)) {
        const n = getMST(value)
        return asNodeCb(n, n.target)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}

export function getMST(value: any): MSTAdminisration {
    if (hasMST(value))
        return value.$treenode
    else
        return fail("element has no Node")

}

export function getPath(thing: IModel): string {
    return getMST(thing).path
}

export function getRelativePath(base: MSTAdminisration, target: MSTAdminisration): string {
    // PRE condition target is (a child of) base!
    invariant(
        base.root === target.root,
        `Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`
    )
    const baseParts = base.pathParts
    const targetParts = target.pathParts
    let common = 0
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common])
            break
    }
    return joinJsonPath(
        baseParts
        .slice(common).map(_ => "..")
        .concat(
            targetParts.slice(common)
        )
    )
}

export function getParent(thing: IModel): IModel {
    const node = getMST(thing)
    return node.parent ? node.parent.target : null
}

export function valueToSnapshot(thing: any) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        }
    }
    if (hasMST(thing))
        return getMST(thing).snapshot
    if (isSerializable(thing))
        return thing
    fail("Unable to convert value to snapshot.")
}
