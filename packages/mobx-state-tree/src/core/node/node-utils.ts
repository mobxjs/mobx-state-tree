export interface INode {
    readonly type: IType<any, any>

    readonly storedValue: any
    readonly _environment: any
    readonly path: string
    readonly isRoot: boolean
    readonly parent: INode | null
    readonly root: INode
    subpath: string

    isRunningAction(): boolean
    _isRunningAction: boolean
    isProtectionEnabled: boolean
    isProtected: boolean
    assertWritable(): void

    identifier: string | null

    isAlive: boolean
    assertAlive(): void

    identifierAttribute: string | undefined
    identifierCache: IdentifierCache | undefined

    readonly value: any
    readonly snapshot: any

    resolve(pathParts: string): INode
    resolve(pathParts: string, failIfResolveFails: boolean): INode | undefined
    resolve(path: string, failIfResolveFails?: boolean): INode | undefined

    resolvePath(pathParts: string[]): INode
    resolvePath(pathParts: string[], failIfResolveFails: boolean): INode | undefined
    resolvePath(pathParts: string[], failIfResolveFails?: boolean): INode | undefined

    getRelativePathTo(target: INode): string
    setParent(newParent: INode | null, subpath: string | null): void

    getChildNode(subpath: string): INode
    getChildren(): INode[]
    getChildType(key: string): IType<any, any>
    removeChild(subpath: string): void

    unbox(childNode: INode): any
    detach(): void

    die(): void
    aboutToDie(): void
    finalizeDeath(): void

    emitPatch(basePatch: IReversibleJsonPatch, source: INode): void

    readonly middlewares: IMiddlewareHandler[]

    addMiddleWare(handler: IMiddlewareHandler): IDisposer

    applyPatchLocally(subpath: string, patch: IJsonPatch): void
    onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer
    applyPatches(patches: IJsonPatch[]): void

    applySnapshot(snapshot: any): void
    onSnapshot(onChange: (snapshot: any) => void): IDisposer
    addDisposer(disposer: () => void): void
}

export type IStateTreeNode = {
    readonly $treenode?: any
}

/**
 * Returns true if the given value is a node in a state tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IStateTreeNode}
 */
export function isStateTreeNode(value: any): value is IStateTreeNode {
    return !!(value && value.$treenode)
}

export function getStateTreeNode(value: IStateTreeNode): INode {
    if (isStateTreeNode(value)) return value.$treenode!
    else return fail(`Value ${value} is no MST Node`)
}

export function canAttachNode(value: any) {
    return (
        value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !isStateTreeNode(value) &&
        !Object.isFrozen(value)
    )
}

export function toJSON(this: IStateTreeNode) {
    return getStateTreeNode(this).snapshot
}

import { IType } from "../type"
import { IdentifierCache } from "./identifier-cache"
import { IJsonPatch, IReversibleJsonPatch } from "../json-patch"
import { IDisposer, fail } from "../../utils"
import { IMiddlewareHandler } from "../action"
