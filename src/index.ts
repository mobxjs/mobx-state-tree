import {getNode, getRootNode} from "./core/node"
import {runInAction, IObservableArray, ObservableMap, observable} from "mobx"
import {IJsonPatch} from "./core/json-patch"
import {IDisposer, invariant} from "./utils"
import {IActionCall} from "./core/action"
import {IFactory, IModel} from "./core/factories"
import {createMapFactory} from "./types/map"
import {createArrayFactory} from "./types/array"
import {primitiveFactory} from "./types/primitive"

export {
    action
} from "mobx"

export * from "./core/json-patch"
export {
    IModel,
    isModel,
    IFactory,
    isFactory,
    getFactory,
    getChildFactory
} from "./core/factories"
export {
    IActionCall
} from "./core/action"

export {
    primitiveFactory
} from "./types/primitive"

export {
    createModelFactory as createFactory,
    composeFactory,
} from "./types/object"

export {
    referenceTo
} from "./types/reference"

export {
    asReduxStore,
    IReduxStore
} from "./interop/redux"

export {
    connectReduxDevtools
} from "./interop/redux-devtools"

export {
    createUnionFactory as unionOf
} from "./types/union"

export {
    createDefaultValueFactory as withDefault
} from "./types/with-default"

export {
    createLiteralFactory as literal
} from "./types/literal"

export {
    createMaybeFactory as maybe
} from "./types/maybe"

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
 *    name: string;
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
export function onAction(target: IModel, callback: (action: IActionCall, next: () => void) => void): IDisposer {
    return getNode(target).onAction(callback)
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
export function onPatch(target: IModel, callback: (patch: IJsonPatch) => void): IDisposer {
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
export function onSnapshot(target: IModel, callback: (snapshot: any) => void): IDisposer {
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
export function applyPatch(target: IModel, patch: IJsonPatch) {
    return getNode(target).applyPatch(patch)
}

/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
export function applyPatches(target: IModel, patches: IJsonPatch[]) {
    const node = getNode(target)
    runInAction(() => {
        patches.forEach(p => node.applyPatch(p))
    })
}

export interface IPatchRecorder {
    patches: IJsonPatch[]
    stop()
    replay(target: IModel)
}

export function recordPatches(subject: IModel): IPatchRecorder {
    let recorder = {
        patches: [] as IJsonPatch[],
        stop: () => disposer(),
        replay: (target) => {
            applyPatches(target, recorder.patches)
        }
    }
    let disposer = onPatch(subject, (patch) => {
        recorder.patches.push(patch)
    })
    return recorder
}

/**
 * Dispatches an Action on a model instance. All middlewares will be triggered.
 *
 * @export
 * @param {Object} target
 * @param {IActionCall} action
 * @param {IActionCallOptions} [options]
 * @returns
 */
export function applyAction(target: IModel, action: IActionCall): void {
    getNode(target).applyAction(action)
}

/**
 * Applies a series of actions in a single MobX transaction.
 *
 * @export
 * @param {Object} target
 * @param {IActionCall[]} actions
 * @param {IActionCallOptions} [options]
 */
export function applyActions(target: IModel, actions: IActionCall[]): void {
    const node = getNode(target)
    runInAction(() => {
        actions.forEach(action => node.applyAction(action))
    })
}

export interface IActionRecorder {
    actions: IActionCall[]
    stop()
    replay(target: IModel)
}

export function recordActions(subject: IModel): IActionRecorder {
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
export function applySnapshot<S, T>(target: T & IModel, snapshot: S) {
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
export function getSnapshot<S, T>(target: T & IModel): S {
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
export function hasParent(target: IModel, strict: boolean = false): boolean {
    return getParent(target, strict) !== null
}

/**
 * TODO:
 * Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
 * map or array.
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
// export function hasParentObject(target: IModel): boolean {
//     return getParentObject(target) !== null
// }

/**
 * Returns the immediate parent of this object, or null. Parent can be either an object, map or array
 * TODO:? strict mode?
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {*}
 */
export function getParent(target: IModel, strict: boolean = false): IModel {
    // const node = strict
    //     ? getNode(target).parent
    //     : findNode(getNode(target))
    const node = getNode(target)
    return node.parent ? node.parent.target : null
}

/**
 * TODO:
 * Returns the closest parent that is a model instance, but which isn't an array or map.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
// export function getParentObject(target: IModel): IModel {
//     // TODO: remove this special notion of closest object node?
//     const node = findEnclosingObjectNode(getNode(target))
//     return node ? node.state : null
// }

/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getRoot(target: IModel): IModel {
    return getRootNode(getNode(target)).target
}

/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export function getPath(target: IModel): string {
    return getNode(target).path
}

/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export function getPathParts(target: IModel): string[] {
    return getNode(target).pathParts
}

/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function isRoot(target: IModel): boolean {
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
export function resolve(target: IModel, path: string): IModel | any {
    const node = getNode(target).resolve(path)
    return node ? node.target : undefined
}

/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
export function tryResolve(target: IModel, path: string): IModel | any {
    const node = getNode(target).resolve(path, false)
    if (node === undefined)
        return undefined
    return node ? node.target : undefined
}

/**
 *
 *
 * @export
 * @param {Object} target
 * @returns {Object}
 */
export function getFromEnvironment(target: IModel, key: string): any {
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
export function clone<T extends IModel>(source: T, customEnvironment?: any): T {
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
export function mapOf<S, T>(subFactory: IFactory<S, T> = primitiveFactory as any): ObservableMap<T> {
    return createMapFactory(subFactory) as any
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function arrayOf<S, T>(subFactory: IFactory<S, T> = primitiveFactory as any): IObservableArray<T> {
    return createArrayFactory(subFactory as any) as any
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
export function _getNode(thing: IModel): any {
    return getNode(thing)
}

export function detach<T extends IModel>(thing: T): T {
    getNode(thing).detach()
    return thing
}

export function testActions<S, T extends IModel>(factory: IFactory<S, T>, initialState: S, ...actions: IActionCall[]): S {
    const testInstance = factory(initialState)
    applyActions(testInstance, actions)
    return getSnapshot<S, T>(testInstance)
}

const appState = observable.shallowBox<any>(undefined)

export function resetAppState() {
    appState.set(undefined)
}

export function initializeAppState<S, T>(factory: IFactory<S, T>, initialSnapshot?: S, environment?: Object) {
    invariant(!appState, `Global app state was already initialized, use 'resetAppState' to reset it`)
    appState.set(factory(initialSnapshot, environment))
}

export function getAppState<T>(): T {
    invariant(!!appState, `Global app state has not been initialized, use 'initializeAppState' for globally shared state`)
    return appState.get() as T
}

