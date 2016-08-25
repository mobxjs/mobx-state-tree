import {
    action, isObservableObject, isObservableMap, isObservableArray,
    intercept, observe, computed
} from "mobx"
import {INode} from "./inode"
import {
    isPlainObject, invariant, escapeString, unescapeString, fail,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "./utils"
import {ITypeHandler, getTypeHandler} from "./type-handlers"

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export class Node<T> implements INode<T> {
    private _state: T
    private _path: string[] = []
    private _parent: Node<any> | null = null
    private nodeType: NodeType
    typeHandler: ITypeHandler
    private interceptDisposer: IDisposer
    private snapshotSubscribers: ((snapshot) => void)[] = [];
    private patchSubscribers: ((patches: JsonPatch[]) => void)[] = [];

    constructor(initialState: T) {
        addHiddenFinalProp(initialState, "$treenode", this)
        this.nodeType = determineNodeType(initialState)
        this.typeHandler = getTypeHandler(this.nodeType)
        this._state = this.typeHandler.initialize(initialState)

        // need dispose anywhere? should not be needed strictly speaking
        this.interceptDisposer = intercept(this.state, this.typeHandler.interceptor)
        observe(this.state, this.typeHandler.observer)
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
        return this.isRoot ? "/" : this._path.map(escapeString).join("/")
    }

    public get pathParts(): string[] {
        return this._path
    }

    public get isRoot(): boolean {
        return this._parent === null
    }

    public get parent(): Node<any> {
        return this._parent
    }

    @computed public get snapshot() {
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        return this.typeHandler.serialize(this.state)
    }

    @action public restoreSnapshot(snapshot) {
        return this.typeHandler.deserialize(this.state, snapshot)
    }

    @action public applyPatch(patch: JsonPatch) {
        this.typeHandler.applyPatch(this.state, patch)
    }

    public intercept(handler: (change) => any): IDisposer {
        // make sure own intercept handler is always last!
        this.interceptDisposer()
        const res = intercept(this.state, handler)
        this.interceptDisposer = intercept(this.state, this.typeHandler.interceptor)
        return res
    }

    public subscribe(onChange: (snapshot) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public patchStream(onPatch: (patches: JsonPatch[]) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, onPatch)
    }

    @action setParent(newParent: Node<T> | null, subpath = null) {
        invariant(!this._parent || !newParent, "object cannot be contained in a state tree twice")
        invariant(!!newParent === !!subpath, "if a parent is set, path must be provide (and vice versa)")
        this._parent = newParent
        if (!newParent)
            this._path = []
        else
            this._path = newParent.pathParts.concat(subpath)
        this.updatePathOfChildren()
    }

    protected updatePathOfChildren() {
        this.typeHandler.updatePathOfChildren(this._state, this._path)
    }

    protected updateSubPath(newSubPath: string) {
        invariant(!this.isRoot, "cannot update sub path of root")
        this._path[this._path.length - 1] = newSubPath
        this.updatePathOfChildren()
    }
}

export function hasNode<T>(value): value is { $treenode: Node<T> } {
    return value && value.$treenode
}

export function asNode<T>(value): Node<T> {
    invariant(isMutable(value), "asNode is only eligable for mutable types")
    if (hasNode(value)) {
        return value.$treenode
    } else {
        const node = new Node(value)
        return node
    }
}

export function getNode<T>(value): Node<T> {
    if (hasNode(value))
        return value.$treenode
    else
        fail("element has no Node")

}

export function getPath(thing): string {
    return getNode(thing).path
}

export function getParent(thing): any {
    const node = getNode(thing)
    return node.isRoot ? null : node.parent.state
}

export function prepareChild(parent: Node<any>, subpath: string, child: any) {
    if (!isMutable(child))
        return
    const node = asNode(child)
    node.setParent(parent, subpath)
}

function determineNodeType(value): NodeType {
    invariant(!!value, "Cannot convert a falsy value to a state tree")
    invariant(typeof value === "object", "State trees can only be created from objects")
    if (Array.isArray(value) || isObservableArray(value))
        return NodeType.Array
    if (isPlainObject(value))
        return NodeType.PlainObject
    if (isObservableMap(value))
        return NodeType.Map
    return NodeType.ComplexObject
}
