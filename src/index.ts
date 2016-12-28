import {getNode, getRootNode} from "./core/node"
import {transaction} from "mobx"
import {IJsonPatch} from "./core/json-patch"
import {IDisposer} from "./utils"
import {getObjectNode, findEnclosingObjectNode} from "./types/object-node"
import {IActionCall} from "./core/action"
import {ModelFactory} from "./core/factories"
import {createMapFactory} from "./types/map-node"
import {createArrayFactory} from "./types/array-node"
import {primitiveFactory} from "./types/primitive"

// TODO: improve all typings
export {
    action /* TODO: export action.bound instead? */
} from "mobx"

export * from "./core/json-patch"
export {
    ModelFactory,
    composeFactory,
    isModelFactory,
    getModelFactory,
    getChildModelFactory
} from "./core/factories"
export {
    IActionCall
} from "./core/action"

export {
    primitiveFactory
} from "./types/primitive"

export {
    createFactory
} from "./types/object-node"

export {
    referenceTo
} from "./types/reference"

export {
    asReduxStore,
    ReduxStore
} from "./interop/redux"

export {
    connectReduxDevtools
} from "./interop/redux-devtools"

/**
 * Registers middleware on a model instance that is invoked whenever one of it's actions is called, or an action on one of it's children.
 * Will only be invoked on 'root' actions, not on actions called from existing actions.
 *
 * The callback receives two parameter: the `action` parameter describes the action being invoked. The `next()` function can be used
 * to kick off the next middleware in the chain. Not invoking `next()` prevents the action from actually being executed!
 *
 * Action calls have the following signature:
 *
 * ```
 * export type IActionCall = {
 *    name: string; // TODO: rename to type
 *    path?: string;
 *    args?: any[];
 * }
 * ```
 *
 * Example of a logging middleware:
 * ```
 * function logger(action, next) {
 *   console.dir(action)
 *   return next()
 * }
 *
 * onAction(myStore, logger)
 *
 * myStore.user.setAge(17)
 *
 * // emits:
 * {
 *    name: "setAge"
 *    path: "/user",
 *    args: [17]
 * }
 * ```
 *
 * @export
 * @param {Object} target model to intercept actions on
 * @param {(action: IActionCall, next: () => void) => void} callback the middleware that should be invoked whenever an action is triggered.
 * @returns {IDisposer} function to remove the middleware
 */
export function onAction(target: Object, callback: (action: IActionCall, next: () => void) => void): IDisposer {
    return getObjectNode(target).onAction(callback);
}

/**
 * Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
 * See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @export
 * @param {Object} target the model instance from which to receive patches
 * @param {(patch: IJsonPatch) => void} callback the callback that is invoked for each patch
 * @returns {IDisposer} function to remove the listener
 */
export function onPatch(target: Object, callback: (patch: IJsonPatch) => void): IDisposer {
    return getNode(target).onPatch(callback)
}

/**
 * Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
 * The listener will only be fire at the and a MobX (trans)action
 *
 * @export
 * @param {Object} target
 * @param {(snapshot: any) => void} callback
 * @returns {IDisposer}
 */
export function onSnapshot(target: Object, callback: (snapshot: any) => void): IDisposer {
    return getNode(target).onSnapshot(callback)
}

/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
export function applyPatch(target: Object, patch: IJsonPatch) {
    return getNode(target).applyPatch(patch)
}

/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
export function applyPatches(target: Object, patches: IJsonPatch[]) {
    const node = getNode(target)
    transaction(() => {
        patches.forEach(p => node.applyPatch(p))
    })
}


export function recordPatches(subject: Object):
    { patches: IJsonPatch[], stop(); replay(target: Object); }
{
    let recorder = {
        patches: [] as IJsonPatch[],
        stop: () => disposer(),
        replay: (target) => {
            applyPatches(target, recorder.patches)
        }
    }
    let disposer = onPatch(subject, recorder.patches.push.bind(recorder.patches))
    return recorder
}

// TODO: return the action description (possibly as returned by the middleware)
/**
 * Dispatches an Action on a model instance. All middlewares will be triggered.
 *
 * @export
 * @param {Object} target
 * @param {IActionCall} action
 * @param {IActionCallOptions} [options]
 * @returns
 */
export function applyAction(target: Object, action: IActionCall) {
    return getObjectNode(target).applyAction(action)
}

/**
 * Applies a series of actions in a single MobX transaction.
 *
 * @export
 * @param {Object} target
 * @param {IActionCall[]} actions
 * @param {IActionCallOptions} [options]
 */
export function applyActions(target: Object, actions: IActionCall[]): void {
    const node = getObjectNode(target)
    transaction(() => {
        actions.forEach(action => node.applyAction(action))
    })
}

export function recordActions(subject: Object):
    { actions: IActionCall[]; stop(); replay(target: Object); }
{
    let recorder = {
        actions: [] as IActionCall[],
        stop: () => disposer(),
        replay: (target) => {
            applyActions(target, recorder.actions)
        }
    }
    let disposer = onAction(subject, (action, next) => {
        recorder.actions.push(action)
        next()
    })
    return recorder
}

/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export function applySnapshot(target: Object, snapshot: Object) {
    return getNode(target).applySnapshot(snapshot)
}

/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getSnapshot(target: Object): any {
    return getNode(target).snapshot
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {boolean}
 */
export function hasParent(target: Object, strict: boolean = false): boolean {
    return getParent(target, strict) !== null
}

/**
 * Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
 * map or array.
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function hasParentObject(target: Object): boolean {
    return getParentObject(target !== null)
}

/**
 * Returns the immediate parent of this object, or null. Parent can be either an object, map or array
 *
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {*}
 */
export function getParent(target: Object, strict: boolean = false): any {
    const node = strict
        ? getNode(target).parent
        : findEnclosingObjectNode(getNode(target))
    return node ? node.state : null
}

/**
 * Returns the closest parent that is a model instance, but which isn't an array or map.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getParentObject(target: Object): any {
    const node = findEnclosingObjectNode(getNode(target))
    return node ? node.state : null
}

/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getRoot(target: Object): any {
    return getRootNode(getNode(target)).state
}

/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export function getPath(target: Object): string {
    return getNode(target).path
}

/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export function getPathParts(target: Object): string[] {
    return getNode(target).pathParts
}

/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function isRoot(target: Object): boolean {
    return getNode(target).isRoot
}

/**
 * Resolves a path relatively to a given object.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
export function resolve(target: Object, path: string): any {
    const node = getNode(target).resolve(path)
    return node ? node.state : undefined
}

/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
export function tryResolve(target: Object, path: string): any {
    const node = getNode(target).resolve(path, false)
    if (node === undefined)
        return undefined
    return node ? node.state : undefined
}

/**
 *
 *
 * @export
 * @param {Object} target
 * @returns {Object}
 */
export function getFromEnvironment(target: Object, key: string): Object {
    return getNode(target).getFromEnvironment(key)
}

/**
 *
 *
 * @export
 * @template T
 * @param {T} source
 * @param {*} [customEnvironment]
 * @returns {T}
 */
export function clone<T>(source: T, customEnvironment?: any): T {
    const node = getNode(source)
    return node.factory(node.snapshot, customEnvironment || node.environment) as T
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function mapOf(subFactory: ModelFactory = primitiveFactory) {
    return createMapFactory(subFactory)
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function arrayOf(subFactory: ModelFactory = primitiveFactory) {
    return createArrayFactory(subFactory)
}

/**
 * Internal function, use with care!
 */
/**
 *
 *
 * @export
 * @param {any} thing
 * @returns {*}
 */
export function _getNode(thing): any {
    return getNode(thing)
}

// - getModelFactory
// - getChildModelFactory

/**
 *
 *
 * @export
 * @param {*} thing
 * @returns {boolean}
 */
export function isModel(thing: any): boolean {
    // TODO:
    return true
}

export function testActions(factory: ModelFactory, initialState, ...actions: IActionCall[]): Object {
    const testInstance = factory(initialState)
    applyActions(testInstance, actions)
    return getSnapshot(testInstance)
}
