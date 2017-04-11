import { IRawActionCall, ISerializedActionCall, applyAction, onAction } from "./action"
import { runInAction, IObservableArray, ObservableMap } from "mobx"
import { getMSTAdministration, IMSTNode } from "./mst-node"
import { MSTAdminisration } from "./mst-node-administration"
import { IJsonPatch, joinJsonPath } from "./json-patch"
import { IDisposer, invariant, fail } from "../utils"
import { ISnapshottable, IType } from "../types/type"

/**
 * TODO: update docs
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
export function addMiddleware(target: IMSTNode, middleware: (action: IRawActionCall, next: (call: IRawActionCall) => any) => any): IDisposer {
    const node = getMSTAdministration(target)
    if (!node.isProtected)
        console.warn("It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`")
    return node.addMiddleWare(middleware)
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
    return getMSTAdministration(target).onPatch(callback)
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
export function onSnapshot<S>(target: ObservableMap<S>, callback: (snapshot: { [key: string]: S }) => void): IDisposer;
export function onSnapshot<S>(target: IObservableArray<S>, callback: (snapshot: S[]) => void): IDisposer;
export function onSnapshot<S>(target: ISnapshottable<S>, callback: (snapshot: S) => void): IDisposer;
export function onSnapshot<S>(target: ISnapshottable<S>, callback: (snapshot: S) => void): IDisposer {
    return getMSTAdministration(target).onSnapshot(callback)
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
    return getMSTAdministration(target).applyPatch(patch)
}

/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
export function applyPatches(target: IMSTNode, patches: IJsonPatch[]) {
    const node = getMSTAdministration(target)
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
        replay: (target: IMSTNode) => {
            applyPatches(target, recorder.patches)
        }
    }
    let disposer = onPatch(subject, (patch) => {
        recorder.patches.push(patch)
    })
    return recorder
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
export function applyActions(target: IMSTNode, actions: ISerializedActionCall[]): void {
    runInAction(() => {
        actions.forEach(action => applyAction(target, action))
    })
}

export interface IActionRecorder {
    actions: ISerializedActionCall[]
    stop(): any
    replay(target: IMSTNode): any
}

export function recordActions(subject: IMSTNode): IActionRecorder {
    let recorder = {
        actions: [] as ISerializedActionCall[],
        stop: () => disposer(),
        replay: (target: IMSTNode) => {
            applyActions(target, recorder.actions)
        }
    }
    let disposer = onAction(subject, recorder.actions.push.bind(recorder.actions))
    return recorder
}

/**
 * By default it is allowed to both directly modify a model or through an action.
 * However, in some cases you want to guarantee that the state tree is only modified through actions.
 * So that replaying action will reflect everything that can possible have happened to your objects, or that every mutation passes through your action middleware etc.
 * To disable modifying data in the tree without action, simple call `protect(model)`. Protect protects the passed model an all it's children
 *
 * @example
 * const Todo = types.model({
 *     done: false,
 *     toggle() {
 *         this.done = !this.done
 *     }
 * })
 *
 * const todo = new Todo()
 * todo.done = true // OK
 * protect(todo)
 * todo.done = false // throws!
 * todo.toggle() // OK
 */
export function protect(target: IMSTNode) {
    getMSTAdministration(target).protect()
}

/**
 * Returns true if the object is in protected mode, @see protect
 */
export function isProtected(target: IMSTNode): boolean {
    return getMSTAdministration(target).isProtected
}

/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export function applySnapshot<S, T>(target: IMSTNode, snapshot: S) {
    return getMSTAdministration(target).applySnapshot(snapshot)
}

/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getSnapshot<S>(target: ObservableMap<S>): { [key: string]: S };
export function getSnapshot<S>(target: IObservableArray<S>): S[];
export function getSnapshot<S>(target: ISnapshottable<S>): S;
export function getSnapshot<S>(target: ISnapshottable<S>): S {
    return getMSTAdministration(target).snapshot
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
export function hasParent(target: IMSTNode, depth: number = 1): boolean {
    invariant(depth >= 0, `Invalid depth: ${depth}, should be >= 1`)
    let parent: MSTAdminisration | null = getMSTAdministration(target).parent
    while (parent) {
        if (--depth === 0)
            return true
        parent = parent.parent
    }
    return false
}

/**
 * Returns the immediate parent of this object, or null.
 *
 * Note that the immediate parent can be either an object, map or array, and
 * doesn't necessarily refer to the parent model
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {*}
 */
export function getParent(target: IMSTNode, depth?: number): (any & IMSTNode);
export function getParent<T>(target: IMSTNode, depth?: number): (T & IMSTNode);
export function getParent<T>(target: IMSTNode, depth = 1): (T & IMSTNode) {
    invariant(depth >= 0, `Invalid depth: ${depth}, should be >= 1`)
    let d = depth
    let parent: MSTAdminisration | null = getMSTAdministration(target).parent
    while (parent) {
        if (--d === 0)
            return parent.target
        parent = parent.parent
    }
    return fail(`Failed to find a parent for '${getPath(target)} with depth ${depth}`)
}

/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getRoot(target: IMSTNode): any & IMSTNode;
export function getRoot<T>(target: IMSTNode): T & IMSTNode;
export function getRoot(target: IMSTNode): IMSTNode {
    return getMSTAdministration(target).root.target
}

/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export function getPath(target: IMSTNode): string {
    return getMSTAdministration(target).path
}

/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export function getPathParts(target: IMSTNode): string[] {
    return getMSTAdministration(target).pathParts
}

export function getRelativePath(base: MSTAdminisration, target: MSTAdminisration): string {
    // PRE condition target is (a child of) base!
    invariant(
        base.root === target.root,
        `Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`
    )
    const baseParts = base.pathParts
    const targetParts = target.pathParts
    let common = 0
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common])
            break
    }
    // TODO: assert that no targetParts paths are "..", "." or ""!
    return baseParts.slice(common).map(_ => "..").join("/")
        + joinJsonPath(targetParts.slice(common))
}

/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function isRoot(target: IMSTNode): boolean {
    return getMSTAdministration(target).isRoot
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
    // TODO: give better error messages!
    const node = getMSTAdministration(target).resolve(path)
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
    const node = getMSTAdministration(target).resolve(path, false)
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
export function clone<T extends IMSTNode>(source: T, keepEnvironment: boolean | any = true): T {
    const node = getMSTAdministration(source)
    return node.type.create(
        node.snapshot,
        keepEnvironment === true
            ? node.root._environment
            : keepEnvironment === false
                ? undefined
                : keepEnvironment // it's an object or something else
    ) as T
}

/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 */
export function detach<T extends IMSTNode>(thing: T): T {
    getMSTAdministration(thing).detach()
    return thing
}

/**
 * Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore
 */
export function destroy(thing: IMSTNode) {
    const node = getMSTAdministration(thing)
    node.detach()
    node.die()
}

export function getEnv(thing: IMSTNode): any {
    const node = getMSTAdministration(thing)
    const env = node.root._environment
    invariant(!!env, `Node '${node.path}' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()`)
    return env
}

// TODO: remove or to test utils?
export function testActions<S, T>(factory: IType<S, IMSTNode>, initialState: S, ...actions: ISerializedActionCall[]): S {
    const testInstance = factory.create(initialState) as T
    applyActions(testInstance, actions)
    return getSnapshot(testInstance) as S
}
