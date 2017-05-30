import {
    observable,
    computed
} from "mobx"

let nextNodeId = 1

export abstract class AbstractNode  {
    readonly nodeId = ++nextNodeId
    readonly type: IType<any, any>
    @observable protected _parent: ComplexNode | null = null
    @observable subpath: string = ""

    // TODO: should have environment as well?
    constructor(type: IType<any, any>, parent: ComplexNode | null, subpath: string) {
        this.type = type
        this._parent = parent
        this.subpath = subpath
    }

    /**
     * Returnes (escaped) path representation as string
     */
    @computed public get path(): string {
        if (!this.parent)
            return ""
        return this.parent.path + "/" + escapeJsonPath(this.subpath)
    }

    public get isRoot(): boolean {
        return this.parent === null
    }

    public get parent(): ComplexNode | null {
        return this._parent
    }

    public get root(): ComplexNode {
        // future optimization: store root ref in the node and maintain it
        let p, r: AbstractNode = this
        while (p = r.parent)
            r = p
        return r as ComplexNode
    }

    abstract getValue(): any
    abstract isLeaf(): boolean
    abstract getChildren(): AbstractNode[]
    abstract getChildNode(name: string): AbstractNode | null
    abstract setParent(newParent: ComplexNode, subpath: string): void
}

import { IType } from "../../types/type"
import { escapeJsonPath } from "../json-patch"
import { ComplexNode } from "./complex-node"
