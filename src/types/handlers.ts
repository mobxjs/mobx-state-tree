import {
    isObservableArray, isObservableMap, isObservable, intercept,
    IObjectChange
} from "mobx"
import {isMutable, invariant, isPlainObject, fail} from "../utils"
import {ModelFactory} from "../factories";

// TODO: factories for map / array so multi dimensional structures are possible



export abstract class BaseHandler {

    /*readonly*/ factory: ModelFactory
    /*readonly*/ environment: any
    parent: BaseHandler
    target: any
    private _path: string[] = []

    constructor(factory: ModelFactory, environment, parent: BaseHandler, target) {
        invariant(isObservable(target), "Expected observable object")
        this.factory = factory
        this.environment = environment;
        this.parent = parent;
        this.target = target;
        intercept(target, (change) => this.interceptChange(change))
    }

    abstract interceptChange(change);

    prepareChild<T>(subpath: string, child: T): T {
        if (!isMutable(child)) {
            return child
        } else if (hasNode(child)) {
            // already converted object
            const node = getNode<T>(child)
            const childFactory = this.getChildFactory(subpath)
            invariant(node.factory === childFactory, `Unexpected child type`)
            node.setParent(this, subpath)
            return node.state
        } else {
            // convert object from snapshot
            const childFactory = this.getChildFactory(subpath)
            const instance = childFactory(child, this.environment)
            return instance
        }
    }

    @action setParent(newParent: Node<T> | null, subpath: string | null = null): Node<T> {
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

    protected updatePathOfChildren() {
        console.log("updated path to " + this.path)
        this.typeHandler.updatePathOfChildren(this._state, this._path)
    }

    updatePath(newPath: string[]) {
        // TODO: combine with setParent?
        this._path = newPath
        this.updatePathOfChildren()
    }

    abstract getChildFactory(key: string): ObjectFactory;
}

export class ObjectHandler extends BaseHandler<Object> {

    constructor(parent: BaseHandler<any>, target: Object) {
        super(parent, target)
    }


    interceptChange(change: IObjectChange) {
        const {newValue} = change
        const oldValue = change.object[change.name]
        if (newValue === oldValue)
            return null
        maybeNode(oldValue, adm => adm.setParent(null))
        const parent = getNode(change.object)
        change.newValue = this.prepareChild(parent, change.name, newValue)
        return change
    }
}


export function getNode<T>(value): BaseHandler {
    if (hasNode(value))
        return value.$treenode
    else
        return fail("element has no Node")
}

export function hasNode<T>(value): value is { $treenode: BaseHandler } {
    return value && value.$treenode
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeNode<T, R>(value: T, asNodeCb: (node: BaseHandler, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
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
