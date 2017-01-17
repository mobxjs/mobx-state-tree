import {
    action, observable,
    intercept, observe, computed, reaction,
    isObservableArray,
    isObservableMap
} from "mobx"

import {ComplexType} from "./types"
import {IModel, IFactory} from "./factories"
import {IActionHandler} from "./action"
import {
    invariant, fail, extend,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "../utils"
import {IJsonPatch, joinJsonPath, splitJsonPath} from "./json-patch"
import {IActionCall, applyActionLocally} from "./action"
import {ObjectType} from "../types/object"

// TODO: make Node more like a struct, extract the methods to snapshots.js, actions.js etc..
export class Node {
    readonly target: any
    readonly environment: any
    @observable _parent: Node | null = null
    readonly factory: IFactory<any, any>
    private  interceptDisposer: IDisposer
    readonly snapshotSubscribers: ((snapshot) => void)[] = []
    readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []
    readonly actionSubscribers: IActionHandler[] = []
    _isRunningAction = false


    constructor(initialState: any, environment, factory: IFactory<any, any>) {
        invariant(factory.type instanceof ComplexType, "Uh oh")
        addHiddenFinalProp(initialState, "$treenode", this)
        this.factory = factory
        this.environment = environment
        this.target = initialState

        this.interceptDisposer = intercept(this.target, ((c) => this.type.willChange(this, c)) as any)
        observe(this.target, (c) => this.type.didChange(this, c))
        reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        // dispose reaction, observe, intercept somewhere explicitly? Should strictly speaking not be needed for GC
    }

    get type(): ComplexType {
        return this.factory.type as ComplexType
    }

    @computed get pathParts(): string[]{
        // no parent? you are root!
        if (this._parent === null) {
            return []
        }

        // get the key
        // optimize: maybe this shouldn't be computed, this is called often and pretty expensive lookup ...
        const keys = this._parent.getChildNodes()
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
        return joinJsonPath(this.pathParts)
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

    @computed public get snapshot() {
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        return Object.freeze(this.type.serialize(this, this.target))
    }

    public onSnapshot(onChange: (snapshot) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public applySnapshot(snapshot) {
        invariant(this.type.is(snapshot), `Snapshot ${JSON.stringify(snapshot)} is not assignable to type ${this.factory.type.name}. Expected ${this.factory.type.describe()} instead.`)
        return this.type.applySnapshot(this, this.target, snapshot)
    }

    @action public applyPatch(patch: IJsonPatch) {
        const parts = splitJsonPath(patch.path)
        const node = this.resolvePath(parts.slice(0, -1))
        node.applyPatchLocally(parts[parts.length - 1], patch)
    }

    applyPatchLocally(subpath, patch: IJsonPatch): void {
        this.type.applyPatchLocally(this, this.target, subpath, patch)
    }

    public onPatch(onPatch: (patches: IJsonPatch) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    emitPatch(patch: IJsonPatch, source: Node, distance = 0) {
        if (this.patchSubscribers.length) {
            let localizedPatch
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

    setParent(newParent: Node | null, subpath: string | null = null) {
        if (this.parent === newParent)
            return
        if (this._parent && newParent) {
            invariant(false, `A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && getRootNode(newParent) === this) {
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
        if (!isMutable(child)) {
            return child
        }
        
        const childFactory = this.getChildFactory(subpath)

        if (hasNode(child)) {
            const node = getNode(child)

            if(node.parent === null){
                // we are adding a node with no parent (first insert in the tree)
                node.setParent(this, subpath)
                return child
            }

            return fail("A node cannot exists twice in the state tree. Failed to add object to path '" + this.path + '/' + subpath + "', it exists already at '" + getPath(child) + "'")
        }
        const existingNode = this.getChildNode(subpath)
        const newInstance = childFactory(child)
        if (existingNode && existingNode.factory === newInstance.factory) {
            // recycle instance..
            existingNode.applySnapshot(child)
            return existingNode.target
        } else {
            if (existingNode)
                existingNode.setParent(null) // TODO: or delete / remove / whatever is a more explicit clean up
            const node = getNode(newInstance)
            node.setParent(this, subpath)
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

    resolve(pathParts: string): Node;
    resolve(pathParts: string, failIfResolveFails: boolean): Node | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): Node | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): Node;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): Node | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): Node | undefined {
        let current: Node | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "..")
                current = current!.parent
            else if (pathParts[i] === ".")
                continue
            else
                current = current!.getChildNode(pathParts[i])
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

    emitAction(instance: Node, action: IActionCall, next) {
        let idx = -1
        const correctedAction: IActionCall = this.actionSubscribers.length
            ? extend({} as any, action, { path: getRelativePath(this, instance) })
            : null
        let n = () => {
            // optimization: use tail recursion / trampoline
            idx++
            if (idx < this.actionSubscribers.length) {
                this.actionSubscribers[idx](correctedAction!, n)
            } else {
                const parent = this.parent
                if (parent)
                    parent.emitAction(instance, action, next)
                else
                    next()
            }
        }
        n()
    }

    onAction(listener: (action: IActionCall, next: () => void) => void): IDisposer {
        return registerEventHandler(this.actionSubscribers, listener)
    }

    getFromEnvironment(key: string): any {
        if (this.environment && this.environment.hasOwnProperty(key))
            return this.environment[key]
        if (this.isRoot)
            return fail(`Undefined environment variable '${key}'`)
        return this.parent!.getFromEnvironment(key)
    }

    getChildNode(subpath: string): Node | null {
        return this.type.getChildNode(this, this.target, subpath)
    }

    getChildNodes(): [string, Node][] {
        return this.type.getChildNodes(this, this.target)
    }

    getChildFactory(key: string): IFactory<any, any> {
        return this.type.getChildFactory(key)
    }
}

// TODO: duplicate with isModel
export function hasNode(value): value is IModel {
    return value && value.$treenode
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeNode<T, R>(value: T & IModel, asNodeCb: (node: Node, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (isMutable(value)) {
        const n = getNode(value)
        return asNodeCb(n, n.target)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}

export function getNode(value: IModel): Node {
    if (hasNode(value))
        return value.$treenode
    else
        return fail("element has no Node")

}

export function getPath(thing: IModel): string {
    return getNode(thing).path
}

export function getRelativePath(base: Node, target: Node): string {
    // PRE condition target is (a child of) base!
    invariant(target.path.length >= base.path.length, 'getRelativePath received a target path "'+target.path+'" shorter than the base path "'+base.path+'".')
    return target.path.substr(base.path.length)
}

export function getParent(thing: IModel): IModel {
    const node = getNode(thing)
    return node.parent ? node.parent.target : null
}

export function getRootNode(node: Node) {
    let p, r = node
    while (p = r.parent)
        r = p
    return r
}

export function valueToSnapshot(thing) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        }
    }
    if (isMutable(thing))
        return getNode(thing).snapshot
    return thing
}
