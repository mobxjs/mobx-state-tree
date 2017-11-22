import { observable, computed } from "mobx"

import {
    INode,
    toJSON,
    IdentifierCache,
    escapeJsonPath,
    splitJsonPath,
    IJsonPatch,
    IReversibleJsonPatch,
    joinJsonPath,
    EMPTY_ARRAY,
    noop,
    addHiddenFinalProp,
    fail,
    freeze,
    IDisposer,
    IType,
    IMiddlewareHandler
} from "../../internal"

let nextNodeId = 1
export class ScalarNode implements INode {
    // optimization: these fields make MST memory expensive for primitives. Most can be initialized lazily, or with EMPTY_ARRAY on prototype
    readonly nodeId = ++nextNodeId
    readonly type: IType<any, any>
    readonly storedValue: any
    @observable protected _parent: INode | null = null
    @observable subpath: string = ""
    _isRunningAction = false // only relevant for root

    identifierCache: IdentifierCache | undefined
    isProtectionEnabled = true
    identifierAttribute: string | undefined = undefined // not to be modified directly, only through model initialization
    _environment: any = undefined
    protected _autoUnbox = true // unboxing is disabled when reading child nodes
    protected _isAlive = true // optimization: use binary flags for all these switches
    protected _isDetaching = false

    middlewares = EMPTY_ARRAY as IMiddlewareHandler[]

    constructor(
        type: IType<any, any>,
        parent: INode | null,
        subpath: string,
        environment: any,
        initialValue: any,
        storedValue: any,
        canAttachTreeNode: boolean,
        finalizeNewInstance: (node: INode, initialValue: any) => void = noop
    ) {
        this.type = type
        this._parent = parent
        this.subpath = subpath
        this.storedValue = storedValue
        this._environment = environment
        this.unbox = this.unbox.bind(this)

        this.preboot()

        if (!parent) this.identifierCache = new IdentifierCache()
        if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "$treenode", this)

        let sawException = true
        try {
            if (canAttachTreeNode) addHiddenFinalProp(this.storedValue, "toJSON", toJSON)

            this._isRunningAction = true
            finalizeNewInstance(this, initialValue)
            this._isRunningAction = false

            if (parent) parent.root.identifierCache!.addNodeToCache(this)
            else this.identifierCache!.addNodeToCache(this)

            this.fireHook("afterCreate")
            if (parent) this.fireHook("afterAttach")
            sawException = false
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                this._isAlive = false
            }
        }
    }

    preboot() {}

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

    public get parent(): INode | null {
        return this._parent
    }

    // TODO: make computed
    public get root(): INode {
        // future optimization: store root ref in the node and maintain it
        let p,
            r: INode = this
        while ((p = r.parent)) r = p
        return r as INode
    }

    setParent(newParent: INode | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath) return
        if (newParent) {
            if (this._parent && newParent !== this._parent) {
                fail(
                    `A node cannot exists twice in the state tree. Failed to add ${this} to path '${newParent.path}/${subpath}'.`
                )
            }
            if (!this._parent && newParent.root === this) {
                fail(
                    `A state tree is not allowed to contain itself. Cannot assign ${this} to path '${newParent.path}/${subpath}'`
                )
            }
            if (
                !this._parent &&
                !!this.root._environment &&
                this.root._environment !== newParent.root._environment
            ) {
                fail(
                    `A state tree cannot be made part of another state tree as long as their environments are different.`
                )
            }
        }
        if (this.parent && !newParent) {
            this.die()
        } else {
            this.subpath = subpath || ""
            if (newParent && newParent !== this._parent) {
                newParent.root.identifierCache!.mergeCache(this)
                this._parent = newParent
                this.fireHook("afterAttach")
            }
        }
    }

    // TODO: lift logic outside this file
    getRelativePathTo(target: INode): string {
        // PRE condition target is (a child of) base!
        if (this.root !== target.root)
            fail(
                `Cannot calculate relative path: objects '${this}' and '${target}' are not part of the same object tree`
            )

        const baseParts = splitJsonPath(this.path)
        const targetParts = splitJsonPath(target.path)
        let common = 0
        for (; common < baseParts.length; common++) {
            if (baseParts[common] !== targetParts[common]) break
        }
        // TODO: assert that no targetParts paths are "..", "." or ""!
        return (
            baseParts
                .slice(common)
                .map(_ => "..")
                .join("/") + joinJsonPath(targetParts.slice(common))
        )
    }

    resolve(pathParts: string): INode
    resolve(pathParts: string, failIfResolveFails: boolean): INode | undefined
    resolve(path: string, failIfResolveFails: boolean = true): INode | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    // TODO: lift logic outside this file
    resolvePath(pathParts: string[]): INode
    resolvePath(pathParts: string[], failIfResolveFails: boolean): INode | undefined
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): INode | undefined {
        // counter part of getRelativePath
        // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
        // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
        // so we treat leading ../ apart...
        let current: INode | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "") current = current!.root
            else if (pathParts[i] === "..") current = current!.parent
            else if (pathParts[i] === "." || pathParts[i] === "")
                // '/bla' or 'a//b' splits to empty strings
                continue
            else if (current) {
                current = current.getChildNode(pathParts[i])
                continue
            }

            if (!current) {
                if (failIfResolveFails)
                    return fail(
                        `Could not resolve '${pathParts[i]}' in '${joinJsonPath(
                            pathParts.slice(0, i - 1)
                        )}', path of the patch does not resolve`
                    )
                else return undefined
            }
        }
        return current!
    }

    fireHook(name: string) {
        const fn =
            this.storedValue && typeof this.storedValue === "object" && this.storedValue[name]
        if (typeof fn === "function") fn.apply(this.storedValue)
    }

    @computed
    public get value(): any {
        if (!this._isAlive) return undefined
        return this.type.getValue(this)
    }

    @computed
    public get snapshot() {
        if (!this._isAlive) return undefined
        // advantage of using computed for a snapshot is that nicely respects transactions etc.
        const snapshot = this.type.getSnapshot(this)
        // avoid any external modification in dev mode
        if (process.env.NODE_ENV !== "production") {
            return freeze(snapshot)
        }
        return snapshot
    }

    isRunningAction(): boolean {
        if (this._isRunningAction) return true
        if (this.isRoot) return false
        return this.parent!.isRunningAction()
    }

    get identifier(): string | null {
        return this.identifierAttribute ? this.storedValue[this.identifierAttribute] : null
    }

    public get isAlive() {
        return this._isAlive
    }

    public assertAlive() {
        if (!this._isAlive)
            fail(
                `${this} cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`
            )
    }

    getChildNode(subpath: string): INode {
        this.assertAlive()
        this._autoUnbox = false
        const res = this.type.getChildNode(this, subpath)
        this._autoUnbox = true
        return res
    }

    getChildren(): INode[] {
        this.assertAlive()
        this._autoUnbox = false
        const res = this.type.getChildren(this)
        this._autoUnbox = true
        return res
    }

    getChildType(key: string): IType<any, any> {
        return this.type.getChildType(key)
    }

    get isProtected(): boolean {
        return this.root.isProtectionEnabled
    }

    assertWritable() {
        this.assertAlive()
        if (!this.isRunningAction() && this.isProtected) {
            fail(
                `Cannot modify '${this}', the object is protected and can only be modified by using an action.`
            )
        }
    }

    removeChild(subpath: string) {
        this.type.removeChild(this, subpath)
    }

    unbox(childNode: INode): any {
        if (childNode && this._autoUnbox === true) return childNode.value
        return childNode
    }

    toString(): string {
        const identifier = this.identifier ? `(id: ${this.identifier})` : ""
        return `${this.type.name}@${this.path || "<root>"}${identifier}${this.isAlive
            ? ""
            : "[dead]"}`
    }

    die() {
        // ImmutableNode never dies! (just detaches)
    }

    emitPatch(basePatch: IReversibleJsonPatch, source: INode) {
        throw fail(`ImmutableNode does not support the emitPatch operation`)
    }

    finalizeDeath() {
        throw fail(`ImmutableNode does not support the finalizeDeath operation`)
    }

    aboutToDie() {
        throw fail(`ImmutableNode does not support the aboutToDie operation`)
    }

    addMiddleWare(handler: IMiddlewareHandler): IDisposer {
        throw fail(`ImmutableNode does not support the addMiddleWare operation`)
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        throw fail(`ImmutableNode does not support the applyPatchLocally operation`)
    }

    onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
        throw fail(`ImmutableNode does not support the onPatch operation`)
    }

    applyPatches(patches: IJsonPatch[]): void {
        throw fail(`ImmutableNode does not support the applyPatches operation`)
    }

    applySnapshot(snapshot: any): void {
        throw fail(`ImmutableNode does not support the applySnapshot operation`)
    }

    onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        throw fail(`ImmutableNode does not support the onSnapshot operation`)
    }

    detach() {
        if (!this._isAlive) fail(`Error while detaching, node is not alive.`)
        if (this.isRoot) return
        else {
            this.fireHook("beforeDetach")
            this._environment = (this.root as INode)._environment // make backup of environment
            this._isDetaching = true
            this.identifierCache = this.root.identifierCache!.splitCache(this)
            this.parent!.removeChild(this.subpath)
            this._parent = null
            this.subpath = ""
            this._isDetaching = false
        }
    }

    addDisposer(disposer: () => void) {
        throw fail(`ImmutableNode does not support the addDisposer operation`)
    }
}
