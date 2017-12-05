import { observable, computed } from "mobx"

import {
    INode,
    toJSON,
    escapeJsonPath,
    addHiddenFinalProp,
    fail,
    freeze,
    IType,
    NodeLifeCycle,
    noop,
    ObjectNode
} from "../../internal"

export class ScalarNode implements INode {
    readonly type: IType<any, any>
    readonly storedValue: any
    @observable subpath: string = ""

    private readonly _parent: ObjectNode | null

    private readonly _environment: any = undefined
    private _autoUnbox = true // unboxing is disabled when reading child nodes
    private state = NodeLifeCycle.INITIALIZING

    constructor(
        type: IType<any, any>,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any,
        storedValue: any,
        canAttachTreeNode: boolean,
        finalizeNewInstance: (node: INode, initialValue: any) => void = noop
    ) {
        this.type = type
        this.storedValue = storedValue
        this._parent = parent
        this.subpath = subpath
        this.storedValue = storedValue
        this._environment = environment
        this.unbox = this.unbox.bind(this)

        if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "$treenode", this)

        let sawException = true
        try {
            if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "toJSON", toJSON)

            finalizeNewInstance(this, initialValue)

            this.state = NodeLifeCycle.CREATED
            sawException = false
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                this.state = NodeLifeCycle.DEAD
            }
        }
    }

    /*
     * Returnes (escaped) path representation as string
     */
    @computed
    public get path(): string {
        if (!this.parent) return ""
        return this.parent.path + "/" + escapeJsonPath(this.subpath)
    }

    public get isRoot(): boolean {
        return this.parent === null
    }

    public get parent(): ObjectNode | null {
        return this._parent
    }

    public get root(): ObjectNode {
        // future optimization: store root ref in the node and maintain it
        if (!this._parent) return fail(`This scalar node is not part of a tree`)
        return this._parent.root
    }

    setParent(newParent: INode | null, subpath: string | null = null) {
        if (this.parent !== newParent) fail(`Cannot change parent of immutable node`)
        if (this.subpath === subpath) return
        this.subpath = subpath || ""
    }

    @computed
    public get value(): any {
        if (!this.isAlive) return undefined
        return this.type.getValue(this)
    }

    @computed
    public get snapshot() {
        if (!this.isAlive) return undefined
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        const snapshot = this.type.getSnapshot(this)
        // avoid any external modification in dev mode
        if (process.env.NODE_ENV !== "production") {
            return freeze(snapshot)
        }
        return snapshot
    }

    public get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    public assertAlive() {
        if (!this.isAlive)
            fail(
                `${this} cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`
            )
    }

    unbox(childNode: INode): any {
        if (childNode && this._autoUnbox === true) return childNode.value
        return childNode
    }

    toString(): string {
        return `${this.type.name}@${this.path || "<root>"}${this.isAlive ? "" : "[dead]"}`
    }

    die() {
        this.state = NodeLifeCycle.DEAD
    }
}
