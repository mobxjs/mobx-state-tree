import {runInAction, observable} from "mobx"
import {getMST} from "./core"
import {IJsonPatch} from "./core"
import {IDisposer, invariant} from "./utils"
import {IActionCall} from "./core"
import {IType, IMSTNode} from "./core"

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
export function onAction(target: IMSTNode, callback: (action: IActionCall, next: () => void) => void): IDisposer {
    return getMST(target).onAction(callback)
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
export function onPatch(target: IMSTNode, callback: (patch: IJsonPatch) => void): IDisposer {
    return getMST(target).onPatch(callback)
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
export function onSnapshot(target: IMSTNode, callback: (snapshot: any) => void): IDisposer {
    return getMST(target).onSnapshot(callback)
}

/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
export function applyPatch(target: IMSTNode, patch: IJsonPatch) {
    return getMST(target).applyPatch(patch)
}

/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
export function applyPatches(target: IMSTNode, patches: IJsonPatch[]) {
    const node = getMST(target)
    runInAction(() => {
        patches.forEach(p => node.applyPatch(p))
    })
}

export interface IPatchRecorder {
    patches: IJsonPatch[]
    stop(): any
    replay(target: IMSTNode): any
}

export function recordPatches(subject: IMSTNode): IPatchRecorder {
    let recorder = {
        patches: [] as IJsonPatch[],
        stop: () => disposer(),
        replay: (target: any) => {
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
 * Returns the value of the last actoin
 *
 * @export
 * @param {Object} target
 * @param {IActionCall} action
 * @param {IActionCallOptions} [options]
 * @returns
 */
export function applyAction(target: IMSTNode, action: IActionCall): any {
    return getMST(target).applyAction(action)
}

/**
 * Applies a series of actions in a single MobX transaction.
 *
 * Does not return any value
 *
 * @export
 * @param {Object} target
 * @param {IActionCall[]} actions
 * @param {IActionCallOptions} [options]
 */
export function applyActions(target: IMSTNode, actions: IActionCall[]): void {
    const node = getMST(target)
    runInAction(() => {
        actions.forEach(action => node.applyAction(action))
    })
}

export interface IActionRecorder {
    actions: IActionCall[]
    stop(): any
    replay(target: IMSTNode): any
}

export function recordActions(subject: IMSTNode): IActionRecorder {
    let recorder = {
        actions: [] as IActionCall[],
        stop: () => disposer(),
        replay: (target: any) => {
            applyActions(target, recorder.actions)
        }
    }
    let disposer = onAction(subject, (action, next) => {
        recorder.actions.push(action)
        return next()
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
export function applySnapshot<S, T>(target: T & IMSTNode, snapshot: S) {
    return getMST(target).applySnapshot(snapshot)
}

/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getSnapshot<S, T>(target: T & IMSTNode): S {
    return getMST(target).snapshot
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {boolean}
 */
export function hasParent(target: IMSTNode, strict: boolean = false): boolean {
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
export function getParent(target: IMSTNode, strict: boolean = false): IMSTNode {
    // const node = strict
    //     ? getNode(target).parent
    //     : findNode(getNode(target))
    const node = getMST(target)
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
export function getRoot(target: IMSTNode): IMSTNode {
    return getMST(target).root.target
}

/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export function getPath(target: IMSTNode): string {
    return getMST(target).path
}

/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export function getPathParts(target: IMSTNode): string[] {
    return getMST(target).pathParts
}

/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function isRoot(target: IMSTNode): boolean {
    return getMST(target).isRoot
}

/**
 * Resolves a path relatively to a given object.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
export function resolve(target: IMSTNode, path: string): IMSTNode | any {
    const node = getMST(target).resolve(path)
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
export function tryResolve(target: IMSTNode, path: string): IMSTNode | any {
    const node = getMST(target).resolve(path, false)
    if (node === undefined)
        return undefined
    return node ? node.target : undefined
}

/**
 *
 *
 * @export
 * @template T
 * @param {T} source
 * @returns {T}
 */
export function clone<T extends IMSTNode>(source: T): T {
    const node = getMST(source)
    return node.type.create(node.snapshot) as T
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
export function _getNode(thing: IMSTNode): any {
    return getMST(thing)
}

export function detach<T extends IMSTNode>(thing: T): T {
    getMST(thing).detach()
    return thing
}

export function testActions<S, T extends IMSTNode>(factory: IType<S, T>, initialState: S, ...actions: IActionCall[]): S {
    const testInstance = factory.create(initialState)
    applyActions(testInstance, actions)
    return getSnapshot<S, T>(testInstance)
}

const appState = observable.shallowBox<any>(undefined)

export function resetAppState() {
    appState.set(undefined)
}

export function initializeAppState<S, T>(factory: IType<S, T>, initialSnapshot?: S) {
    invariant(!appState, `Global app state was already initialized, use 'resetAppState' to reset it`)
    appState.set(factory.create(initialSnapshot))
}

export function getAppState<T>(): T {
    invariant(!!appState, `Global app state has not been initialized, use 'initializeAppState' for globally shared state`)
    return appState.get() as T
}
