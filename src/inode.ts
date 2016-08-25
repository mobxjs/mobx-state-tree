import {IJsonPatch} from "./json-patch"
import {IDisposer} from "./utils"

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export interface INode<T> {
    state: T
    path: string
    pathParts: string[]
    isRoot: boolean
    parent: INode<any> | null
    snapshot: any
    restoreSnapshot(snapshot: any): void
    applyPatch(patch: IJsonPatch): void
    intercept(handler: (change) => any): IDisposer
    subscribe(onChange: (snapshot) => void): IDisposer
    patchStream(onPatch: (patches: IJsonPatch[]) => void): IDisposer
}