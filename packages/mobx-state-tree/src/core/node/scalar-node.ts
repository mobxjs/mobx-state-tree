import {
    INode,
    escapeJsonPath,
    fail,
    freeze,
    NodeLifeCycle,
    noop,
    ObjectNode,
    IAnyType
} from "../../internal"

export class ScalarNode implements INode {
    readonly type: IAnyType
    readonly storedValue: any
    readonly parent: ObjectNode | null
    readonly subpath: string = ""

    private state = NodeLifeCycle.INITIALIZING
    private readonly _initialSnapshot: any
    _environment: any = undefined

    constructor(
        type: IAnyType,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialSnapshot: any,
        createNewInstance: (initialValue: any) => any,
        finalizeNewInstance: (node: INode, initialValue: any) => void = noop
    ) {
        this._initialSnapshot = initialSnapshot

        this.type = type
        this.parent = parent
        this.subpath = subpath
        this.storedValue = createNewInstance(initialSnapshot)

        let sawException = true
        try {
            finalizeNewInstance(this, initialSnapshot)

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
    public get path(): string {
        if (!this.parent) return ""
        return this.parent.path + "/" + escapeJsonPath(this.subpath)
    }

    public get isRoot(): boolean {
        return this.parent === null
    }

    public get root(): ObjectNode {
        // future optimization: store root ref in the node and maintain it
        if (!this.parent) return fail(`This scalar node is not part of a tree`)
        return this.parent.root
    }

    setParent(newParent: INode | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath) return
        fail("setParent is not supposed to be called on scalar nodes")
    }

    public get value(): any {
        return this.type.getValue(this)
    }

    public get snapshot(): any {
        const snapshot = this.getSnapshot()
        // avoid any external modification in dev mode
        return freeze(snapshot)
    }

    public getSnapshot(): any {
        return this.type.getSnapshot(this)
    }

    public get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    toString(): string {
        return `${this.type.name}@${this.path || "<root>"}${this.isAlive ? "" : "[dead]"}`
    }

    die() {
        this.state = NodeLifeCycle.DEAD
    }
}
