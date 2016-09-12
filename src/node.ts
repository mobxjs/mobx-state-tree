import {
    action, isObservableMap, isObservableArray,
    intercept, observe, computed, reaction, runInAction
} from "mobx"
import {INode} from "./inode"
import {
    isPlainObject, invariant, fail, extend,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "./utils"
import {ITypeHandler, getTypeHandler, determineNodeType} from "./types/type-handlers"
import {IJsonPatch, joinJsonPath, splitJsonPath} from "./json-patch"

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export class Node<T> implements INode<T> {
    private _state: T
    private _path: string[] = []
    private _parent: Node<any> | null = null
    private nodeType: NodeType
    typeHandler: ITypeHandler
    private interceptDisposer: IDisposer
    private snapshotSubscribers: ((snapshot) => void)[] = [];
    private patchSubscribers: ((patches: IJsonPatch[]) => void)[] = [];

    // TODO: fix type
    constructor(initialState: T, parent: Node<any> | null, subpath: string | null) {
        invariant((parent === null) === (subpath === null))
        console.log("creating node for  "+ JSON.stringify(initialState))
        addHiddenFinalProp(initialState, "$treenode", this)
        this.nodeType = determineNodeType(initialState)
        this.typeHandler = getTypeHandler(this.nodeType)
        if (parent !== null && subpath !== null) {
            this._parent = parent
            this._path = parent.pathParts.concat(subpath)
        }

        runInAction(() => {
            this._state = this.typeHandler.initialize(this, initialState)
        })

        this.interceptDisposer = intercept(this.state, this.typeHandler.interceptor)
        observe(this.state, this.typeHandler.observer)

        reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        // dispose reaction, observe, intercept somewhere?
    }

    public get state(): T {
        return this._state
    }
    public set state(_: T) {
        fail("it is not allowed to replace the state of a state-tree.")
    }

    /**
     * Returnes (escaped) path representation as string
     */
    public get path(): string {
        return joinJsonPath(this._path)
    }

    public get pathParts(): string[] {
        return this._path
    }

    public get isRoot(): boolean {
        return this._parent === null
    }

    public get parent() {
        return this._parent
    }

    @computed public get snapshot() {
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        return this.typeHandler.serialize(this._state)
    }

    @action public restoreSnapshot(snapshot) {
        return this.typeHandler.deserialize(this, snapshot)
    }

    @action public applyPatch(patch: IJsonPatch) {
        const path = splitJsonPath(patch.path)
        // TODO: extract resolve method
        let current: Node<any> = this
        for (let i = 0; i < path.length -1; i++) {
            current = current.typeHandler.getChild(current.state, path[i])
            invariant(!!current, `Could not apply patch for '${patch.path}' within '${this.path}', path of the patch does not resolve`)
        }
        this.typeHandler.applyPatch(current, path[path.length - 1], patch)
    }

    public intercept(handler: (change) => any): IDisposer {
        // TODO: don't fire normal mobx intercept handler, instead use middle ware mechanism, make sure to buble up..
        // make sure own intercept handler is always last!
        this.interceptDisposer()
        const res = intercept(this.state, handler)
        this.interceptDisposer = intercept(this.state, this.typeHandler.interceptor)
        return res
    }

    public subscribe(onChange: (snapshot) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    // TODO: alias as Symbol.observable?
    public patchStream(onPatch: (patches: IJsonPatch[]) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    emitPatch(patch: IJsonPatch, source: Node<T>, distance = 0) {
        if (this.patchSubscribers.length) {
            let localizedPatch;
            if (distance === 0)
                localizedPatch = patch
            else
                localizedPatch = extend({}, patch, {
                    path: joinJsonPath(source.pathParts.slice(-distance)) + patch.path
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source, distance + 1)
    }

    @action setParent(newParent: Node<T> | null, subpath: string | null = null): Node<T> {
        if (this._parent && newParent) {
            invariant(false, `A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        invariant(!!newParent === !!subpath, "if a parent is set, path must be provide (and vice versa)")
        this._parent = newParent
        if (newParent instanceof Node)
            this._path = newParent.pathParts.concat(subpath!)
        else
            this._path = []
        this.updatePathOfChildren()
        return this
    }

    protected updatePathOfChildren() {
        console.log("updated path to " + this.path)
        this.typeHandler.updatePathOfChildren(this._state, this._path)
    }

    updatePath(newPath: string[]) {
        // TODO: combine with setParent?
        this._path = newPath
        this.updatePathOfChildren()
    }
}

export function hasNode<T>(value): value is { $treenode: Node<T> } {
    return value && value.$treenode
}

export function asNode<T>(value, parent: Node<any> | null = null, subpath: string | null = null): Node<T> {
    invariant(isMutable(value), "asNode is only eligable for mutable types")
    if (hasNode(value)) {
        const node = value.$treenode
        invariant(parent === node.parent, "expected parents to be equal")
        invariant((node.isRoot && subpath === null) || (node.pathParts[node.pathParts.length - 1] === subpath), "expected subpath to equal " + subpath)
        return node
    } else {
        const node = new Node(value, parent, subpath)
        return node
    }
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeNode<T, R>(value: T, asNodeCb: (node: Node<T>, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // TODO: maybeNode might be quite inefficient runtime wise, might be factored out
    if (isMutable(value)) {
        const n = getNode<T>(value)
        return asNodeCb(n, n.state)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}

/**
 * Initialized tree administration if applicable
 */
export function initializeNode<T>(value: T): T {
    return maybeNode(value, (_, x) => x, x => x)
}

export function getNode<T>(value): Node<T> {
    if (hasNode(value))
        return value.$treenode
    else
        return fail("element has no Node")

}

export function getPath(thing): string {
    return getNode(thing).path
}

export function getParent(thing): any {
    const node = getNode(thing)
    return node.parent ? node.parent.state : null
}

export function resolve() {
    // TODO: see apply json patch
}

export function prepareChild<T>(parent: Node<any>, subpath: string, child: T): T {
    if (!isMutable(child)) {
        return child
    } else if (hasNode(child)) {
        const node = getNode<T>(child)
        node.setParent(parent, subpath)
        return node.state
    } else {
        const node = asNode<T>(child, parent, subpath)
        return node.state // value might be converted!
    }
}
