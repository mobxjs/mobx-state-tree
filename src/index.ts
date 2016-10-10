import {getNode} from "./core/node"
import {transaction} from "mobx"
import {IJsonPatch} from "./core/json-patch"
import {IDisposer} from "./utils"
import {getObjectNode, findEnclosingObjectNode} from "./types/object-node"
import {IActionCall, IActionCallOptions} from "./core/action"
import {ModelFactory, primitiveFactory} from "./core/factories"
import {createMapFactory} from "./types/map-node"
import {createArrayFactory} from "./types/array-node"

// TODO: improve all typings

export * from "./core/json-patch"
export {
    ModelFactory,
    createFactory,
    isModelFactory,
    generateFactory
} from "./core/factories"

export {
    IActionCall,
    IActionCallOptions
} from "./core/action"

export {
    referenceTo
} from "./core/reference"

export {
    asReduxStore,
    ReduxStore
} from "./interop/redux"

export function onAction(target: Object, callback: (action: IActionCall) => void): IDisposer {
    return getObjectNode(target).onAction(callback);
}

export function onPatch(target: Object, callback: (patch: IJsonPatch) => void): IDisposer {
    return getNode(target).onPatch(callback)
}

export function onSnapshot(target: Object, callback: (snapshot: any) => void): IDisposer {
    return getNode(target).onSnapshot(callback)
}

export function applyPatch(target: Object, patch: IJsonPatch) {
    return getNode(target).applyPatch(patch)
}

export function applyPatches(target: Object, patches: IJsonPatch[]) {
    const node = getNode(target)
    transaction(() => {
        patches.forEach(p => node.applyPatch(p))
    })
}

// TODO: actions return snapshot
export function applyAction(target: Object, action: IActionCall, options?: IActionCallOptions) {
    return getObjectNode(target).applyAction(action, options)
}

export function applyActions(target: Object, actions: IActionCall[], options?: IActionCallOptions): IJsonPatch[] {
    const node = getObjectNode(target)
    // TODO: return snapshot or patches? if the latter, flatten!
    transaction(() => {
        actions.forEach(action => node.applyAction(action, options))
    })
    return [] // TODO!
}

// TODO: rename to restoreSnapshot
// TODO: if target is not set, snapshot restores to it's original
export function applySnapshot(target: Object, snapshot: Object) {
    return getNode(target).applySnapshot(snapshot)
}

export function getSnapshot(target: Object): any {
    return getNode(target).snapshot
}

// TODO: hasParentObject
export function hasParent(target: Object, strict: boolean = false): boolean {
    return getParent(target) !== null
}

// TODO: getParentObject
export function getParent(target: Object, strict: boolean = false): any {
    const node = strict
        ? getNode(target).parent
        : findEnclosingObjectNode(getNode(target))
    return node ? node.state : null
}

export function getPath(target: Object): string {
    return getNode(target).path
}

export function getPathParts(target: Object): string[] {
    return getNode(target).pathParts
}

export function isRoot(target: Object): boolean {
    return getNode(target).isRoot
}

export function resolve(target: Object, path: string): any {
    const node = getNode(target).resolve(path)
    return node ? node.state : undefined
}

export function tryResolve(target: Object, path: string): any {
    const node = getNode(target).resolve(path, false)
    if (node === undefined)
        return undefined
    return node ? node.state : undefined
}

// TODO: require second arg, getFromEnvironment(target, field) ?
export function getEnvironment(target: Object): Object {
    return getNode(target).environment
}

export function clone<T>(source: T, customEnvironment?: any): T {
    const node = getNode(source)
    return node.factory(node.snapshot, customEnvironment || node.environment) as T
}

export function mapOf(subFactory: ModelFactory = primitiveFactory) {
    return createMapFactory(subFactory)
}

export function arrayOf(subFactory: ModelFactory = primitiveFactory) {
    return createArrayFactory(subFactory)
}

/**
 * Internal function, use with care!
 */
export function _getNode(thing): any {
    return getNode(thing)
}

// TODO:
// - setGlobalDefaultStore(factory, initialData)
// - getGlobalDefaultStore
// - dispatch?
// - connect({ propName: (stateTree) => value })
// - RootComponent
// - isModel
// - isModelFactory
// - getModelFactory
// - getChildModelFactory

export function isModel(thing: any): boolean {
    // TODO:
    return true
}

// TODO: support observables