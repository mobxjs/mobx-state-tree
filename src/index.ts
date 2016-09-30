import {IJsonPatch} from "./core/json-patch"
import {IDisposer} from "./utils"
import {getNode} from "./core/node"
import {getObjectNode} from "./types/object-node"
import {IActionCall, IActionCallOptions} from "./core/action"
import {ModelFactory, primitiveFactory} from "./core/factories"
import {createMapFactory} from "./types/map-node"
import {createArrayFactory} from "./types/array-node"

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

export function onAction(target: Object, callback: (action: IActionCall) => void): IDisposer {
    return getObjectNode(target).onAction(callback);
}

export function onPatch(target: Object, callback: (patch: IJsonPatch) => void): IDisposer {
    return getNode(target).onPatch(callback)
}

export function onSnapshot(target: Object, callback: (snapshot: any) => void): IDisposer {
    return getNode(target).onSnapshot(callback)
}

export function subscribe(target: Object, callback: (snapshot: any) => void): IDisposer {
    return onSnapshot(target, callback)
}

export function applyPatch(target: Object, patch: IJsonPatch) {
    return getNode(target).applyPatch(patch)
}

export function applyAction(target: Object, action: IActionCall, options?: IActionCallOptions): IJsonPatch[] {
    return getObjectNode(target).applyAction(action, options)
}

export function applySnapshot(target: Object, snapshot: Object) {
    return getNode(target).applySnapshot(snapshot)
}

export function intercept(target: Object, interceptor: (change) => Object | null): IDisposer {
    return getNode(target).intercept(interceptor)
}

export function getSnapshot(target: Object): any {
    return getNode(target).snapshot
}

export function getParent(target: Object): any {
    return getNode(target).parent
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