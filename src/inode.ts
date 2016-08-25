import {
    action, isObservableObject, isObservableMap, isObservableArray,
    intercept, observe, computed
} from "mobx"
import {
    isPlainObject, invariant, escapeString, unescapeString, fail,
    addHiddenFinalProp, isMutable, IDisposer, registerEventHandler
} from "./utils"
import {ITypeHandler, getTypeHandler} from "./type-handlers"

export enum NodeType { ComplexObject, Map, Array, PlainObject };

export interface INode<T> {
    state: T
    path: string
    pathParts: string[]
    isRoot: boolean
    parent: INode<any>
    snapshot: any
    restoreSnapshot(snapshot: any): void
    applyPatch(patch: JsonPatch): void
    intercept(handler: (change) => any): IDisposer
    subscribe(onChange: (snapshot) => void): IDisposer
    patchStream(onPatch: (patches: JsonPatch[]) => void): IDisposer
}