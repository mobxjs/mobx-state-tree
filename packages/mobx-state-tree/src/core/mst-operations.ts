/**
 * Returns the _actual_ type of the given tree node. (Or throws)
 *
 * @export
 * @param {IStateTreeNode} object
 * @returns {IType<S, T>}
 */
export function getType<S, T>(object: IStateTreeNode): IType<S, T> {
    return getStateTreeNode(object).type
}

/**
 * Returns the _declared_ type of the given sub property of an object, array or map.
 *
 * @example
 * const Box = types.model({ x: 0, y: 0 })
 * const box = Box.create()
 *
 * console.log(getChildType(box, "x").name) // 'number'
 *
 * @export
 * @param {IStateTreeNode} object
 * @param {string} child
 * @returns {IType<any, any>}
 */
export function getChildType(object: IStateTreeNode, child: string): IType<any, any> {
    return getStateTreeNode(object).getChildType(child)
}

/**
 * Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @export
 * @param {Object} target the model instance from which to receive patches
 * @param {(patch: IJsonPatch, reversePatch) => void} callback the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch
 * @param {includeOldValue} boolean if oldValue is included in the patches, they can be inverted. However patches will become much bigger and might not be suitable for efficient transport
 * @returns {IDisposer} function to remove the listener
 */
export function onPatch(
    target: IStateTreeNode,
    callback: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof callback !== "function")
            fail("expected second argument to be a function, got " + callback + " instead")
    }
    return getStateTreeNode(target).onPatch(callback)
}

export function onSnapshot<S>(
    target: ObservableMap<S>,
    callback: (snapshot: { [key: string]: S }) => void
): IDisposer
export function onSnapshot<S>(
    target: IObservableArray<S>,
    callback: (snapshot: S[]) => void
): IDisposer
export function onSnapshot<S>(target: ISnapshottable<S>, callback: (snapshot: S) => void): IDisposer
/**
 * Registers a function that is invoked whenever a new snapshot for the given model instance is available.
 * The listener will only be fire at the and of the current MobX (trans)action.
 * See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.
 *
 * @export
 * @param {Object} target
 * @param {(snapshot: any) => void} callback
 * @returns {IDisposer}
 */
export function onSnapshot<S>(
    target: ISnapshottable<S>,
    callback: (snapshot: S) => void
): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof callback !== "function")
            fail("expected second argument to be a function, got " + callback + " instead")
    }
    return getStateTreeNode(target).onSnapshot(callback)
}

/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.
 *
 * Can apply a single past, or an array of patches.
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
export function applyPatch(target: IStateTreeNode, patch: IJsonPatch | IJsonPatch[]) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof patch !== "object")
            fail("expected second argument to be an object or array, got " + patch + " instead")
    }
    getStateTreeNode(target).applyPatches(asArray(patch))
}

export interface IPatchRecorder {
    patches: ReadonlyArray<IJsonPatch>
    inversePatches: ReadonlyArray<IJsonPatch>
    stop(): any
    replay(target?: IStateTreeNode): any
    undo(target?: IStateTreeNode): void
}

/**
 * Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
 * Returns an recorder object with the following signature:
 *
 * @example
 * export interface IPatchRecorder {
 *      // the recorded patches
 *      patches: IJsonPatch[]
 *      // the inverse of the recorded patches
 *      inversePatches: IJsonPatch[]
 *      // stop recording patches
 *      stop(target?: IStateTreeNode): any
 *      // resume recording patches
 *      resume()
 *      // apply all the recorded patches on the given target (the original subject if omitted)
 *      replay(target?: IStateTreeNode): any
 *      // reverse apply the recorded patches on the given target  (the original subject if omitted)
 *      // stops the recorder if not already stopped
 *      undo(): void
 * }
 *
 * @export
 * @param {IStateTreeNode} subject
 * @returns {IPatchRecorder}
 */
export function recordPatches(subject: IStateTreeNode): IPatchRecorder {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(subject))
            fail(
                "expected first argument to be a mobx-state-tree node, got " + subject + " instead"
            )
    }

    let disposer: IDisposer | null = null
    function resume() {
        if (disposer) return
        disposer = onPatch(subject, (patch, inversePatch) => {
            recorder.rawPatches.push([patch, inversePatch])
        })
    }

    let recorder = {
        rawPatches: [] as [IJsonPatch, IJsonPatch][],
        get patches() {
            return this.rawPatches.map(([a]) => a)
        },
        get inversePatches() {
            return this.rawPatches.map(([_, b]) => b)
        },
        stop() {
            if (disposer) disposer()
            disposer = null
        },
        resume,
        replay(target?: IStateTreeNode) {
            applyPatch(target || subject, recorder.patches)
        },
        undo(target?: IStateTreeNode) {
            applyPatch(target || subject, recorder.inversePatches.slice().reverse())
        }
    }
    resume()
    return recorder
}

/**
 * The inverse of `unprotect`
 *
 * @export
 * @param {IStateTreeNode} target
 *
 */
export function protect(target: IStateTreeNode) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    const node = getStateTreeNode(target)
    if (!node.isRoot) fail("`protect` can only be invoked on root nodes")
    node.isProtectionEnabled = true
}

/**
 * By default it is not allowed to directly modify a model. Models can only be modified through actions.
 * However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields.
 * For example because you are building a PoC or don't have any middleware attached to your tree.
 *
 * In that case you can disable this protection by calling `unprotect` on the root of your tree.
 *
 * @example
 * const Todo = types.model({
 *     done: false
 * }).actions(self => ({
 *     toggle() {
 *         self.done = !self.done
 *     }
 * }))
 *
 * const todo = Todo.create()
 * todo.done = true // throws! 
 * todo.toggle() // OK 
 * unprotect(todo) 
 * todo.done = false // OK 
 */
export function unprotect(target: IStateTreeNode) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    const node = getStateTreeNode(target)
    if (!node.isRoot) fail("`unprotect` can only be invoked on root nodes")
    node.isProtectionEnabled = false
}

/**
 * Returns true if the object is in protected mode, @see protect
 */
export function isProtected(target: IStateTreeNode): boolean {
    return getStateTreeNode(target).isProtected
}

/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export function applySnapshot<S, T>(target: IStateTreeNode, snapshot: S) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).applySnapshot(snapshot)
}

export function getSnapshot<S>(target: ObservableMap<S>): { [key: string]: S }
export function getSnapshot<S>(target: IObservableArray<S>): S[]
export function getSnapshot<S>(target: ISnapshottable<S>): S
/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getSnapshot<S>(target: ISnapshottable<S>): S {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).snapshot
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
export function hasParent(target: IStateTreeNode, depth: number = 1): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead")
        if (depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`)
    }
    let parent: Node | null = getStateTreeNode(target).parent
    while (parent) {
        if (--depth === 0) return true
        parent = parent.parent
    }
    return false
}

export function getParent(target: IStateTreeNode, depth?: number): any & IStateTreeNode
export function getParent<T>(target: IStateTreeNode, depth?: number): T & IStateTreeNode
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
export function getParent<T>(target: IStateTreeNode, depth = 1): T & IStateTreeNode {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead")
        if (depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`)
    }
    let d = depth
    let parent: Node | null = getStateTreeNode(target).parent
    while (parent) {
        if (--d === 0) return parent.storedValue
        parent = parent.parent
    }
    return fail(`Failed to find the parent of ${getStateTreeNode(target)} at depth ${depth}`)
}

export function getRoot(target: IStateTreeNode): any & IStateTreeNode
export function getRoot<T>(target: IStateTreeNode): T & IStateTreeNode
/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getRoot(target: IStateTreeNode): IStateTreeNode {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).root.storedValue
}

/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export function getPath(target: IStateTreeNode): string {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).path
}

/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export function getPathParts(target: IStateTreeNode): string[] {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return splitJsonPath(getStateTreeNode(target).path)
}

/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export function isRoot(target: IStateTreeNode): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).isRoot
}

/**
 * Resolves a path relatively to a given object.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
export function resolvePath(target: IStateTreeNode, path: string): IStateTreeNode | any {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof path !== "string")
            fail("expected second argument to be a number, got " + path + " instead")
    }
    const node = getStateTreeNode(target).resolve(path)
    return node ? node.value : undefined
}

/**
 * Resolves a model instance given a root target, the type and the identifier you are searching for.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {IType<any, any>} type
 * @param {IStateTreeNode} target
 * @param {(string | number)} identifier
 * @returns {*}
 */
export function resolveIdentifier(
    type: IType<any, any>,
    target: IStateTreeNode,
    identifier: string | number
): any {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected first argument to be a mobx-state-tree type, got " + type + " instead")
        if (!isStateTreeNode(target))
            fail(
                "expected second argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (!(typeof identifier === "string" || typeof identifier === "number"))
            fail("expected third argument to be a string or number, got " + identifier + " instead")
    }
    const node = getStateTreeNode(target).root.identifierCache!.resolve(type, "" + identifier)
    return node ? node.value : undefined
}

/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
export function tryResolve(target: IStateTreeNode, path: string): IStateTreeNode | any {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof path !== "string")
            fail("expected second argument to be a string, got " + path + " instead")
    }
    const node = getStateTreeNode(target).resolve(path, false)
    if (node === undefined) return undefined
    return node ? node.value : undefined
}

/**
 * Given two state tree nodes that are part of the same tree,
 * returns the shortest jsonpath needed to navigate from the one to the other
 *
 * @export
 * @param {IStateTreeNode} base
 * @param {IStateTreeNode} target
 * @returns {string}
 */
export function getRelativePath(base: IStateTreeNode, target: IStateTreeNode): string {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail(
                "expected second argument to be a mobx-state-tree node, got " + target + " instead"
            )

        if (!isStateTreeNode(base))
            fail("expected first argument to be a mobx-state-tree node, got " + base + " instead")
    }
    return getStateTreeNode(base).getRelativePathTo(getStateTreeNode(target))
}

/**
 * Returns a deep copy of the given state tree node as new tree.
 * Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`
 *
 * _Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_
 *
 * @export
 * @template T
 * @param {T} source
 * @param {boolean | any} keepEnvironment indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree.
 * @returns {T}
 */
export function clone<T extends IStateTreeNode>(
    source: T,
    keepEnvironment: boolean | any = true
): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(source))
            fail("expected first argument to be a mobx-state-tree node, got " + source + " instead")
    }
    const node = getStateTreeNode(source)
    return node.type.create(
        node.snapshot,
        keepEnvironment === true
            ? node.root._environment
            : keepEnvironment === false ? undefined : keepEnvironment
    ) as T // it's an object or something else
}

/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 */
export function detach<T extends IStateTreeNode>(target: T): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    getStateTreeNode(target).detach()
    return target
}

/**
 * Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore
 */
export function destroy(target: IStateTreeNode) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    const node = getStateTreeNode(target)
    if (node.isRoot) node.die()
    else node.parent!.removeChild(node.subpath)
}

/**
 * Returns true if the given state tree node is not killed yet.
 * This means that the node is still a part of a tree, and that `destroy`
 * has not been called. If a node is not alive anymore, the only thing one can do with it
 * is requesting it's last path and snapshot
 *
 * @export
 * @param {IStateTreeNode} target
 * @returns {boolean}
 */
export function isAlive(target: IStateTreeNode): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    return getStateTreeNode(target).isAlive
}

/**
 * Use this utility to register a function that should be called whenever the
 * targeted state tree node is destroyed. This is a useful alternative to managing
 * cleanup methods yourself using the `beforeDestroy` hook.
 *
 * @example
 * const Todo = types.model({
 *   title: types.string
 * }, {
 *   afterCreate() {
 *     const autoSaveDisposer = reaction(
 *       () => getSnapshot(this),
 *       snapshot => sendSnapshotToServerSomehow(snapshot)
 *     )
 *     // stop sending updates to server if this
 *     // instance is destroyed
 *     addDisposer(this, autoSaveDisposer)
 *   }
 * })
 *
 * @export
 * @param {IStateTreeNode} target
 * @param {() => void} disposer
 */
export function addDisposer(target: IStateTreeNode, disposer: () => void) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof disposer !== "function")
            fail("expected second argument to be a function, got " + disposer + " instead")
    }
    getStateTreeNode(target).addDisposer(disposer)
}

/**
 * Returns the environment of the current state tree. For more info on environments,
 * see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)
 *
 * Returns an empty environment if the tree wasn't initialized with an environment
 *
 * @export
 * @param {IStateTreeNode} target
 * @returns {*}
 */
export function getEnv<T = any>(target: IStateTreeNode): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
    }
    const node = getStateTreeNode(target)
    const env = node.root._environment
    if (!!!env) return EMPTY_OBJECT as T
    return env
}

/**
 * Performs a depth first walk through a tree
 */
export function walk(target: IStateTreeNode, processor: (item: IStateTreeNode) => void) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (typeof processor !== "function")
            fail("expected second argument to be a function, got " + processor + " instead")
    }
    const node = getStateTreeNode(target)
    // tslint:disable-next-line:no_unused-variable
    node.getChildren().forEach(child => {
        if (isStateTreeNode(child.storedValue)) walk(child.storedValue, processor)
    })
    processor(node.storedValue)
}

import { IObservableArray, ObservableMap } from "mobx"
import { Node, getStateTreeNode, IStateTreeNode, isStateTreeNode } from "./node"
import { IJsonPatch, splitJsonPath } from "./json-patch"
import { asArray, EMPTY_OBJECT, fail, IDisposer } from "../utils"
import { ISnapshottable, IType } from "../types/type"
import { isType } from "../types/type-flags"
