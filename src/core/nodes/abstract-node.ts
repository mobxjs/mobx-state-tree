import {
    observable,
    computed
} from "mobx"

let nextNodeId = 1

export abstract class AbstractNode  {
    readonly nodeId = ++nextNodeId
    readonly type: IType<any, any>
    readonly storedValue: any
    @observable protected _parent: ComplexNode | null = null
    @observable subpath: string = ""

    // TODO: should have environment as well?
    constructor(type: IType<any, any>, parent: ComplexNode | null, subpath: string, storedValue: any) {
        this.type = type
        this._parent = parent
        this.subpath = subpath
        this.storedValue = storedValue
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

    getRelativePathTo(target: AbstractNode): string {
        // PRE condition target is (a child of) base!
        if (this.root !== target.root) fail(`Cannot calculate relative path: objects '${this}' and '${target}' are not part of the same object tree`)

        const baseParts = splitJsonPath(this.path)
        const targetParts = splitJsonPath(target.path)
        let common = 0
        for (; common < baseParts.length; common++) {
            if (baseParts[common] !== targetParts[common])
                break
        }
        // TODO: assert that no targetParts paths are "..", "." or ""!
        return baseParts.slice(common).map(_ => "..").join("/")
            + joinJsonPath(targetParts.slice(common))
    }

    resolve(pathParts: string): AbstractNode;
    resolve(pathParts: string, failIfResolveFails: boolean): AbstractNode | undefined;
    resolve(path: string, failIfResolveFails: boolean = true): AbstractNode | undefined {
        return this.resolvePath(splitJsonPath(path), failIfResolveFails)
    }

    resolvePath(pathParts: string[]): AbstractNode;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): AbstractNode | undefined;
    resolvePath(pathParts: string[], failIfResolveFails: boolean = true): AbstractNode | undefined {
        // counter part of getRelativePath
        // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
        // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
        // so we treat leading ../ apart...
        let current: AbstractNode | null = this
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "") // '/bla' or 'a//b' splits to empty strings
                current = current!.root
            else if (pathParts[i] === "..")
                current = current!.parent
            else if (pathParts[i] === "." || pathParts[i] === "")
                continue
            else if (current) {
                current = current.getChildNode(pathParts[i])
                continue
            }

            if (!current) {
                if (failIfResolveFails)
                    return fail(`Could not resolve '${pathParts[i]}' in '${joinJsonPath(pathParts.slice(0, i - 1))}', path of the patch does not resolve`)
                else
                    return undefined
            }
        }
        return current!
    }

    getValue(): any {
        return this.type.readValue(this.storedValue)
    }

    toString(): string {
        return `${this.type.name}@${this.path || "<root>"}:${this.snapshot}`
    }

    abstract get snapshot(): any;
    abstract isLeaf(): boolean
    abstract getChildren(): AbstractNode[]
    abstract getChildNode(name: string): AbstractNode | null
    abstract setParent(newParent: ComplexNode, subpath: string): void
}

import { IType } from "../../types/type"
import { escapeJsonPath, splitJsonPath, joinJsonPath } from "../json-patch"
import { ComplexNode } from "./complex-node"
import { fail } from "../../utils"
