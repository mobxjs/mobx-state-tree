import {
    action, observable,
    intercept, observe, computed, reaction,
    isObservableArray,
    isObservableMap
} from "mobx"

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export abstract class Node {
    readonly state: any
    readonly environment: any
    @observable _parent: Node | null = null
    readonly factory: ModelFactory
    private  interceptDisposer: IDisposer
    readonly snapshotSubscribers: ((snapshot) => void)[] = []
    readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = []

    @computed get pathParts(): string[]{
        // no parent? you are root!
        if (this._parent === null) {
            return []
        }

        // get the key
        // optimize: maybe this shouldn't be computed, this is called often and pretty expensive lookup ...
        const keys = this._parent.getChildNodes()
            .filter(([key, node]) => node === this)
        if (keys.length > 0) {
            const [key] = keys[0]
            return this._parent.pathParts.concat([key])
        }

        return fail("Illegal state")
    }

    constructor(initialState: any, environment: any, factory: ModelFactory) {
        addHiddenFinalProp(initialState, "$treenode", this)
        this.environment = environment
        this.factory = factory
        this.state = initialState

        this.interceptDisposer = intercept(this.state, ((c) => this.willChange(c)) as any)
        observe(this.state, (c) => this.didChange(c))
        reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        // dispose reaction, observe, intercept somewhere explicitly? Should strictly speaking not be needed for GC
    }

    abstract getChildNodes(): [string, Node][]
    abstract getChildNode(key): Node
    abstract willChange(change): Object | null
    abstract didChange(change): void
    abstract serialize(): any
    abstract applyPatchLocally(subpath, patch): void
    abstract getChildFactory(key: string): ModelFactory
    abstract applySnapshot(snapshot): void

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
        return Object.freeze(this.serialize())
    }

    @action public applyPatch(patch: IJsonPatch) {
        const parts = splitJsonPath(patch.path)
        const node = this.resolvePath(parts.slice(0, -1))
        node.applyPatchLocally(parts[parts.length - 1], patch)
    }

    public onSnapshot(onChange: (snapshot) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
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
                    // TODO: use relativePath(this, source)
                    path: joinJsonPath(source.pathParts.slice(-distance)) + patch.path
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source, distance + 1)
    }

    // TODO: needs improvements, now called too often. Should be set propertly when applying snapshots / calling factories immediately!
    // TODO: should not be possible to change just subpath?
    setParent(newParent: Node | null, subpath: string | null = null) {
        if (this.parent === newParent)
            return
        // TODO: fix check so that things like this work:     this.todos = this.todos.filter(todo => todo.completed === false)
        if (this._parent && newParent) {
            invariant(false, `A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && getRootNode(newParent) === this) {
            invariant(false, `A state tree is not allowed to contain itself. Cannot add root to path '/${newParent.pathParts.concat(subpath!).join("/")}'`)
        }
        if (this.parent && !newParent && (
                this.patchSubscribers.length > 0 || this.snapshotSubscribers.length > 0 ||
                 (this instanceof ObjectNode && this.actionSubscribers.length > 0)
        )) {
            console.warn("An object with active event listeners was removed from the tree. This might introduce a memory leak. Use detach() if this is intentional")
        }

        this._parent = newParent
    }

    prepareChild(subpath: string, child: any): any {
        if (!isMutable(child)) {
            return child
        } else if (hasNode(child)) {
            // already converted object
            const node = getNode(child)
            const childFactory = this.getChildFactory(subpath)
            invariant(node.factory === childFactory, `Unexpected child type`)
            node.setParent(this, subpath)
            return node.state
        } else {
            const childFactory = this.getChildFactory(subpath)
            // convert object from snapshot
            const instance = childFactory(child, this.environment) // optimization: pass in parent as third arg
            const node = getNode(instance)
            node.setParent(this, subpath)
            return instance
        }
    }

    detach() {
        if (this.isRoot)
            return
        if (isObservableArray(this.parent!.state))
            this.parent!.state.splice(parseInt(this.subpath), 1)
        else if (isObservableMap(this.parent!.state))
            this.parent!.state.delete(this.subpath)
        else // Object
            this.parent!.state[this.subpath] = null
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
        if (this.isRoot)
            return false
        return this.parent!.isRunningAction()
    }

    getFromEnvironment(key: string): any {
        if (this.environment && this.environment.hasOwnProperty(key))
            return this.environment[key]
        if (this.isRoot)
            return fail(`Undefined environment variable '${key}'`)
        return this.parent!.getFromEnvironment(key)
    }
}

export function hasNode(value): value is { $treenode: Node } {
    return value && value.$treenode
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeNode<T, R>(value: T, asNodeCb: (node: Node, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (isMutable(value)) {
        const n = getNode(value)
        return asNodeCb(n, n.state)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}

export function getNode(value): Node {
    if (hasNode(value))
        return value.$treenode
    else
        return fail("element has no Node")

}

export function getPath(thing): string {
    return getNode(thing).path
}

export function getRelativePath(base: Node, target: Node): string {
    // PRE condition target is (a child of) base!
    return target.path.substr(base.path.length)
}

export function getParent(thing): any {
    const node = getNode(thing)
    return node.parent ? node.parent.state : null
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

// Late require for early Node declare
import {
    invariant, fail, extend,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "../utils"
import {IJsonPatch, joinJsonPath, splitJsonPath} from "./json-patch"
import {ModelFactory} from "./factories"
import {ObjectNode} from "../types/object-node"
