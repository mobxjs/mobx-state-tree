import {
    action,
    intercept, observe, computed, reaction
} from "mobx"
import {
    invariant, fail, extend,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "./utils"
import {IJsonPatch, joinJsonPath, splitJsonPath} from "./json-patch"
import {ModelFactory} from "./factories";

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export abstract class Node /* TODO: implements INode*/ {
    readonly state: any
    readonly environment: any
    _path: string[] = []
    _parent: Node | null = null
    readonly factory: ModelFactory
    readonly interceptDisposer: IDisposer
    readonly snapshotSubscribers: ((snapshot) => void)[] = [];
    readonly patchSubscribers: ((patches: IJsonPatch) => void)[] = [];

    // TODO: is parent / subpath required here?
    constructor(initialState: any, parent: Node | null, environment: any, factory: ModelFactory, subpath: string | null) {
        invariant((parent === null) === (subpath === null))
        addHiddenFinalProp(initialState, "$treenode", this)
        this.environment = environment
        this.factory = factory
        if (parent !== null && subpath !== null) {
            this._parent = parent
            this._path = parent.pathParts.concat(subpath)
        }

        this.interceptDisposer = intercept(this.state, ((c) => this.willChange(c)) as any)
        observe(this.state, (c) => this.didChange(c))

        reaction(() => this.snapshot, snapshot => {
            this.snapshotSubscribers.forEach(f => f(snapshot))
        })
        // dispose reaction, observe, intercept somewhere?
    }

    abstract getChildNodes(): [string, Node][]
    abstract getChildNode(key): Node
    abstract willChange(change): Object | null
    abstract didChange(change): void
    abstract serialize(): any
    //abstract deserialize(target, snapshot): void
    //abstract isDeserializableFrom(snapshot): boolean
    abstract applyPatchLocally(subpath, patch): void
    abstract getChildFactory(key: string): ModelFactory;

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
        return this.serialize()
    }

    // @action public restoreSnapshot(snapshot) {
    //     return this.typeHandler.deserialize(this, snapshot)
    // }

    @action public applyPatch(patch: IJsonPatch) {
        const path = splitJsonPath(patch.path)
        // TODO: extract resolve method
        let current: Node = this
        for (let i = 0; i < path.length - 1; i++) {
            current = current.getChildNode(path[i])
            invariant(!!current, `Could not apply patch for '${patch.path}' within '${this.path}', path of the patch does not resolve`)
        }
        current.applyPatchLocally(path[path.length - 1], patch)
    }

    // public intercept(handler: (change) => any): IDisposer {
    //     // TODO: don't fire normal mobx intercept handler, instead use middle ware mechanism, make sure to buble up..
    //     // make sure own intercept handler is always last!
    //     this.interceptDisposer()
    //     const res = intercept(this.state, handler)
    //     this.interceptDisposer = intercept(this.state, this.typeHandler.interceptor)
    //     return res
    // }

    public onSnapshot(onChange: (snapshot) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    // TODO: alias as Symbol.observable?
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
                    path: joinJsonPath(source.pathParts.slice(-distance)) + patch.path
                })
            this.patchSubscribers.forEach(f => f(localizedPatch))
        }
        if (this.parent)
            this.parent.emitPatch(patch, source, distance + 1)
    }

    @action setParent(newParent: Node | null, subpath: string | null = null): Node {
        if (this._parent && newParent) {
            invariant(false, `A node cannot exists twice in the state tree. Failed to add object to path '/${newParent.pathParts.concat(subpath!).join("/")}', it exists already at '${this.path}'`)
        }
        if (!this._parent && newParent && getRoot(newParent) === this) {
            invariant(false, `A state tree is not allowed to contain itself. Cannot add root to path '/${newParent.pathParts.concat(subpath!).join("/")}'`)
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

    prepareChild(subpath: string, child: any): any {
        if (!isMutable(child)) {
            return child
        } else if (hasNode(child)) {
            // already converted object
            const node = getNode(child)
            const childFactory = this.getChildFactory(subpath)
            invariant(node.factory === childFactory, `Unexpected child type`)
            node.setParent(this, subpath)
            node.setParent(this, subpath)
            return node.state
        } else {
            const childFactory = this.getChildFactory(subpath)
            // convert object from snapshot
            const instance = childFactory(child, this.environment)
            return instance
        }
    }

    protected updatePathOfChildren() {
        console.log("updated path to " + this.path)
        this.getChildNodes().forEach(([subpath, child]) => child.updatePath(this.pathParts.concat(subpath)))
    }

    updatePath(newPath: string[]) {
        // TODO: combine with setParent?
        this._path = newPath
        this.updatePathOfChildren()
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
    // TODO: maybeNode might be quite inefficient runtime wise, might be factored out
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

export function getParent(thing): any {
    const node = getNode(thing)
    return node.parent ? node.parent.state : null
}

export function resolve() {
    // TODO: see apply json patch
}

function getRoot(node: Node) {
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
