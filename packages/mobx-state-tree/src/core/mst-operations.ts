import { isComputedProp, isObservableProp } from "mobx"
import {
    ExtractT,
    IAnyStateTreeNode,
    IType,
    IAnyModelType,
    getStateTreeNode,
    IStateTreeNode,
    isStateTreeNode,
    IJsonPatch,
    splitJsonPath,
    asArray,
    EMPTY_OBJECT,
    fail,
    IDisposer,
    isType,
    resolveNodeByPath,
    getRelativePathBetweenNodes,
    freeze,
    IAnyType,
    isModelType,
    ModelPrimitive,
    ExtractNodeC,
    InvalidReferenceError,
    normalizeIdentifier,
    ReferenceIdentifier,
    AnyObjectNode,
    AnyModelType
} from "../internal"

/** @hidden */
export type TypeOrStateTreeNodeToStateTreeNode<
    T extends IAnyType | IAnyStateTreeNode
> = T extends IType<any, any, infer TT> ? TT : T

/**
 * Returns the _actual_ type of the given tree node. (Or throws)
 *
 * @param object
 * @returns
 */
export function getType(object: IAnyStateTreeNode): IAnyType {
    return getStateTreeNode(object).type
}

/**
 * Returns the _declared_ type of the given sub property of an object, array or map.
 *
 * Example:
 * ```ts
 * const Box = types.model({ x: 0, y: 0 })
 * const box = Box.create()
 *
 * console.log(getChildType(box, "x").name) // 'number'
 * ```
 *
 * @param object
 * @param child
 * @returns
 */
export function getChildType(object: IAnyStateTreeNode, child: string): IAnyType {
    return getStateTreeNode(object).getChildType(child)
}

/**
 * Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @param target the model instance from which to receive patches
 * @param callback the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch
 * @returns function to remove the listener
 */
export function onPatch(
    target: IAnyStateTreeNode,
    callback: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof callback !== "function")
            throw fail("expected second argument to be a function, got " + callback + " instead")
    }
    return getStateTreeNode(target).onPatch(callback)
}

/**
 * Registers a function that is invoked whenever a new snapshot for the given model instance is available.
 * The listener will only be fire at the and of the current MobX (trans)action.
 * See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.
 *
 * @param target
 * @param callback
 * @returns
 */
export function onSnapshot<S>(
    target: IStateTreeNode<any, S>,
    callback: (snapshot: S) => void
): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof callback !== "function")
            throw fail("expected second argument to be a function, got " + callback + " instead")
    }
    return getStateTreeNode(target).onSnapshot(callback)
}

/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.
 *
 * Can apply a single past, or an array of patches.
 *
 * @param target
 * @param patch
 * @returns
 */
export function applyPatch(
    target: IAnyStateTreeNode,
    patch: IJsonPatch | ReadonlyArray<IJsonPatch>
): void {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof patch !== "object")
            throw fail(
                "expected second argument to be an object or array, got " + patch + " instead"
            )
    }
    getStateTreeNode(target).applyPatches(asArray(patch))
}

export interface IPatchRecorder {
    patches: ReadonlyArray<IJsonPatch>
    inversePatches: ReadonlyArray<IJsonPatch>
    stop(): void
    resume(): void
    replay(target?: IAnyStateTreeNode): void
    undo(target?: IAnyStateTreeNode): void
}

/**
 * Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
 * Returns an recorder object with the following signature:
 *
 * Example:
 * ```ts
 * export interface IPatchRecorder {
 *      // the recorded patches
 *      patches: IJsonPatch[]
 *      // the inverse of the recorded patches
 *      inversePatches: IJsonPatch[]
 *      // stop recording patches
 *      stop(): void
 *      // resume recording patches
 *      resume()
 *      // apply all the recorded patches on the given target (the original subject if omitted)
 *      replay(target?: IAnyStateTreeNode): void
 *      // reverse apply the recorded patches on the given target  (the original subject if omitted)
 *      // stops the recorder if not already stopped
 *      undo(): void
 * }
 * ```
 *
 * @param subject
 * @returns
 */
export function recordPatches(subject: IAnyStateTreeNode): IPatchRecorder {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(subject))
            throw fail(
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
        replay(target?: IAnyStateTreeNode) {
            applyPatch(target || subject, recorder.patches)
        },
        undo(target?: IAnyStateTreeNode) {
            applyPatch(target || subject, recorder.inversePatches.slice().reverse())
        }
    }
    resume()
    return recorder
}

/**
 * The inverse of `unprotect`.
 *
 * @param target
 */
export function protect(target: IAnyStateTreeNode): void {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    const node = getStateTreeNode(target)
    if (!node.isRoot) throw fail("`protect` can only be invoked on root nodes")
    node.isProtectionEnabled = true
}

/**
 * By default it is not allowed to directly modify a model. Models can only be modified through actions.
 * However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields.
 * For example because you are building a PoC or don't have any middleware attached to your tree.
 *
 * In that case you can disable this protection by calling `unprotect` on the root of your tree.
 *
 * Example:
 * ```ts
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
 * ```
 */
export function unprotect(target: IAnyStateTreeNode): void {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    const node = getStateTreeNode(target)
    if (!node.isRoot) throw fail("`unprotect` can only be invoked on root nodes")
    node.isProtectionEnabled = false
}

/**
 * Returns true if the object is in protected mode, @see protect
 */
export function isProtected(target: IAnyStateTreeNode): boolean {
    return getStateTreeNode(target).isProtected
}

/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @param target
 * @param snapshot
 * @returns
 */
export function applySnapshot<C>(target: IStateTreeNode<C, any>, snapshot: C) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return getStateTreeNode(target).applySnapshot(snapshot)
}

/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @param target
 * @param applyPostProcess If true (the default) then postProcessSnapshot gets applied.
 * @returns
 */
export function getSnapshot<S>(target: IStateTreeNode<any, S>, applyPostProcess = true): S {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    const node = getStateTreeNode(target)
    if (applyPostProcess) return node.snapshot

    return freeze(node.type.getSnapshot(node, false))
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array.
 *
 * @param target
 * @param depth How far should we look upward? 1 by default.
 * @returns
 */
export function hasParent(target: IAnyStateTreeNode, depth: number = 1): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof depth !== "number")
            throw fail("expected second argument to be a number, got " + depth + " instead")
        if (depth < 0) throw fail(`Invalid depth: ${depth}, should be >= 1`)
    }
    let parent: AnyObjectNode | null = getStateTreeNode(target).parent
    while (parent) {
        if (--depth === 0) return true
        parent = parent.parent
    }
    return false
}

/**
 * Returns the immediate parent of this object, or throws.
 *
 * Note that the immediate parent can be either an object, map or array, and
 * doesn't necessarily refer to the parent model.
 *
 * Please note that in child nodes access to the root is only possible
 * once the `afterAttach` hook has fired.
 *
 * @param target
 * @param depth How far should we look upward? 1 by default.
 * @returns
 */
export function getParent<IT extends IAnyStateTreeNode | IAnyType>(
    target: IAnyStateTreeNode,
    depth = 1
): TypeOrStateTreeNodeToStateTreeNode<IT> {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof depth !== "number")
            throw fail("expected second argument to be a number, got " + depth + " instead")
        if (depth < 0) throw fail(`Invalid depth: ${depth}, should be >= 1`)
    }
    let d = depth
    let parent: AnyObjectNode | null = getStateTreeNode(target).parent
    while (parent) {
        if (--d === 0) return parent.storedValue as any
        parent = parent.parent
    }
    throw fail(`Failed to find the parent of ${getStateTreeNode(target)} at depth ${depth}`)
}

/**
 * Given a model instance, returns `true` if the object has a parent of given type, that is, is part of another object, map or array
 *
 * @param target
 * @param type
 * @returns
 */
export function hasParentOfType(target: IAnyStateTreeNode, type: IAnyType): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (!isType(type))
            throw fail(
                "expected second argument to be a mobx-state-tree type, got " + type + " instead"
            )
    }
    let parent: AnyObjectNode | null = getStateTreeNode(target).parent
    while (parent) {
        if (type.is(parent.storedValue)) return true
        parent = parent.parent
    }
    return false
}

/**
 * Returns the target's parent of a given type, or throws.
 *
 * @param target
 * @param type
 * @returns
 */
export function getParentOfType<IT extends IAnyType>(
    target: IAnyStateTreeNode,
    type: IT
): ExtractT<IT> {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (!isType(type))
            throw fail(
                "expected second argument to be a mobx-state-tree type, got " + type + " instead"
            )
    }

    let parent: AnyObjectNode | null = getStateTreeNode(target).parent
    while (parent) {
        if (type.is(parent.storedValue)) return parent.storedValue
        parent = parent.parent
    }
    throw fail(`Failed to find the parent of ${getStateTreeNode(target)} of a given type`)
}

/**
 * Given an object in a model tree, returns the root object of that tree.
 *
 * Please note that in child nodes access to the root is only possible
 * once the `afterAttach` hook has fired.
 *
 * @param target
 * @returns
 */
export function getRoot<IT extends IAnyType | IAnyStateTreeNode>(
    target: IAnyStateTreeNode
): TypeOrStateTreeNodeToStateTreeNode<IT> {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return getStateTreeNode(target).root.storedValue
}

/**
 * Returns the path of the given object in the model tree
 *
 * @param target
 * @returns
 */
export function getPath(target: IAnyStateTreeNode): string {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return getStateTreeNode(target).path
}

/**
 * Returns the path of the given object as unescaped string array.
 *
 * @param target
 * @returns
 */
export function getPathParts(target: IAnyStateTreeNode): string[] {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return splitJsonPath(getStateTreeNode(target).path)
}

/**
 * Returns true if the given object is the root of a model tree.
 *
 * @param target
 * @returns
 */
export function isRoot(target: IAnyStateTreeNode): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return getStateTreeNode(target).isRoot
}

/**
 * Resolves a path relatively to a given object.
 * Returns undefined if no value can be found.
 *
 * @param target
 * @param path escaped json path
 * @returns
 */
export function resolvePath(target: IAnyStateTreeNode, path: string): any {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof path !== "string")
            throw fail("expected second argument to be a number, got " + path + " instead")
    }

    const node = resolveNodeByPath(getStateTreeNode(target), path)
    return node ? node.value : undefined
}

/**
 * Resolves a model instance given a root target, the type and the identifier you are searching for.
 * Returns undefined if no value can be found.
 *
 * @param type
 * @param target
 * @param identifier
 * @returns
 */
export function resolveIdentifier<IT extends IAnyType>(
    type: IT,
    target: IAnyStateTreeNode,
    identifier: ReferenceIdentifier
): ExtractT<IT> | undefined {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            throw fail(
                "expected first argument to be a mobx-state-tree type, got " + type + " instead"
            )
        if (!isStateTreeNode(target))
            throw fail(
                "expected second argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (!(typeof identifier === "string" || typeof identifier === "number"))
            throw fail(
                "expected third argument to be a string or number, got " + identifier + " instead"
            )
    }
    const node = getStateTreeNode(target).root.identifierCache!.resolve(
        type,
        normalizeIdentifier(identifier)
    )
    return node ? node.value : undefined
}

/**
 * Returns the identifier of the target node.
 * This is the *string normalized* identifier, which might not match the type of the identifier attribute
 *
 * @param target
 * @returns
 */
export function getIdentifier(target: IAnyStateTreeNode): string | null {
    // check all arguments

    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }

    return getStateTreeNode(target).identifier
}

/**
 * Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns such reference if it the check passes,
 * else it returns undefined.
 *
 * @param getter Function to access the reference.
 * @param checkIfAlive true to also make sure the referenced node is alive (default), false to skip this check.
 * @returns
 */
export function tryReference<N extends IAnyStateTreeNode>(
    getter: () => N | null | undefined,
    checkIfAlive = true
): N | undefined {
    try {
        const node = getter()
        if (node === undefined || node === null) {
            return undefined
        } else if (isStateTreeNode(node)) {
            if (!checkIfAlive) {
                return node
            } else {
                return isAlive(node) ? node : undefined
            }
        } else {
            throw fail("The reference to be checked is not one of node, null or undefined")
        }
    } catch (e) {
        if (e instanceof InvalidReferenceError) {
            return undefined
        }
        throw e
    }
}

/**
 * Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns if the check passes or not.
 *
 * @param getter Function to access the reference.
 * @param checkIfAlive true to also make sure the referenced node is alive (default), false to skip this check.
 * @returns
 */
export function isValidReference<N extends IAnyStateTreeNode>(
    getter: () => N | null | undefined,
    checkIfAlive = true
): boolean {
    try {
        const node = getter()
        if (node === undefined || node === null) {
            return false
        } else if (isStateTreeNode(node)) {
            return checkIfAlive ? isAlive(node) : true
        } else {
            throw fail("The reference to be checked is not one of node, null or undefined")
        }
    } catch (e) {
        if (e instanceof InvalidReferenceError) {
            return false
        }
        throw e
    }
}

/**
 * Try to resolve a given path relative to a given node.
 *
 * @param target
 * @param path
 * @returns
 */
export function tryResolve(target: IAnyStateTreeNode, path: string): any {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof path !== "string")
            throw fail("expected second argument to be a string, got " + path + " instead")
    }
    const node = resolveNodeByPath(getStateTreeNode(target), path, false)
    if (node === undefined) return undefined
    try {
        return node.value
    } catch (e) {
        // For what ever reason not resolvable (e.g. totally not existing path, or value that cannot be fetched)
        // see test / issue: 'try resolve doesn't work #686'
        return undefined
    }
}

/**
 * Given two state tree nodes that are part of the same tree,
 * returns the shortest jsonpath needed to navigate from the one to the other
 *
 * @param base
 * @param target
 * @returns
 */
export function getRelativePath(base: IAnyStateTreeNode, target: IAnyStateTreeNode): string {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected second argument to be a mobx-state-tree node, got " + target + " instead"
            )

        if (!isStateTreeNode(base))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + base + " instead"
            )
    }
    return getRelativePathBetweenNodes(getStateTreeNode(base), getStateTreeNode(target))
}

/**
 * Returns a deep copy of the given state tree node as new tree.
 * Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`
 *
 * _Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_
 *
 * @param source
 * @param keepEnvironment indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree.
 * @returns
 */
export function clone<T extends IAnyStateTreeNode>(
    source: T,
    keepEnvironment: boolean | any = true
): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(source))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + source + " instead"
            )
    }
    const node = getStateTreeNode(source)
    return node.type.create(
        node.snapshot,
        keepEnvironment === true
            ? node.root.environment
            : keepEnvironment === false
            ? undefined
            : keepEnvironment
    ) // it's an object or something else
}

/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 */
export function detach<T extends IAnyStateTreeNode>(target: T): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    getStateTreeNode(target).detach()
    return target
}

/**
 * Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore
 */
export function destroy(target: IAnyStateTreeNode): void {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
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
 * @param target
 * @returns
 */
export function isAlive(target: IAnyStateTreeNode): boolean {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    return getStateTreeNode(target).observableIsAlive
}

/**
 * Use this utility to register a function that should be called whenever the
 * targeted state tree node is destroyed. This is a useful alternative to managing
 * cleanup methods yourself using the `beforeDestroy` hook.
 *
 * This methods returns the same disposer that was passed as argument.
 *
 * Example:
 * ```ts
 * const Todo = types.model({
 *   title: types.string
 * }).actions(self => ({
 *   afterCreate() {
 *     const autoSaveDisposer = reaction(
 *       () => getSnapshot(self),
 *       snapshot => sendSnapshotToServerSomehow(snapshot)
 *     )
 *     // stop sending updates to server if this
 *     // instance is destroyed
 *     addDisposer(self, autoSaveDisposer)
 *   }
 * }))
 * ```
 *
 * @param target
 * @param disposer
 * @returns The same disposer that was passed as argument
 */
export function addDisposer(target: IAnyStateTreeNode, disposer: IDisposer): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof disposer !== "function")
            throw fail("expected second argument to be a function, got " + disposer + " instead")
    }
    const node = getStateTreeNode(target)
    node.addDisposer(disposer)
    return disposer
}

/**
 * Returns the environment of the current state tree. For more info on environments,
 * see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)
 *
 * Please note that in child nodes access to the root is only possible
 * once the `afterAttach` hook has fired
 *
 * Returns an empty environment if the tree wasn't initialized with an environment
 *
 * @param target
 * @returns
 */
export function getEnv<T = any>(target: IAnyStateTreeNode): T {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
    }
    const node = getStateTreeNode(target)
    const env = node.root.environment
    if (!!!env) return EMPTY_OBJECT as T
    return env
}

/**
 * Performs a depth first walk through a tree.
 */
export function walk(
    target: IAnyStateTreeNode,
    processor: (item: IAnyStateTreeNode) => void
): void {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            throw fail(
                "expected first argument to be a mobx-state-tree node, got " + target + " instead"
            )
        if (typeof processor !== "function")
            throw fail("expected second argument to be a function, got " + processor + " instead")
    }
    const node = getStateTreeNode(target)
    // tslint:disable-next-line:no_unused-variable
    node.getChildren().forEach(child => {
        if (isStateTreeNode(child.storedValue)) walk(child.storedValue, processor)
    })
    processor(node.storedValue)
}

export interface IModelReflectionPropertiesData {
    name: string
    properties: { [K: string]: IAnyType }
}

/**
 * Returns a reflection of the model type properties and name for either a model type or model node.
 *
 * @param typeOrNode
 * @returns
 */
export function getPropertyMembers(
    typeOrNode: IAnyModelType | IStateTreeNode
): IModelReflectionPropertiesData {
    let type

    if (isStateTreeNode(typeOrNode)) {
        type = getType(typeOrNode) as IAnyModelType
    } else {
        type = typeOrNode
    }

    if (process.env.NODE_ENV !== "production") {
        if (!isModelType(type)) throw fail("expected a model type, but got " + type + " instead.")
    }

    return {
        name: type.name,
        properties: { ...type.properties }
    }
}

export interface IModelReflectionData extends IModelReflectionPropertiesData {
    actions: string[]
    views: string[]
    volatile: string[]
}

/**
 * Returns a reflection of the model node, including name, properties, views, volatile and actions.
 *
 * @param target
 * @returns
 */
export function getMembers(target: IAnyStateTreeNode): IModelReflectionData {
    const type = getStateTreeNode(target).type as AnyModelType

    const reflected: IModelReflectionData = {
        ...getPropertyMembers(type),
        actions: [],
        volatile: [],
        views: []
    }

    const props = Object.getOwnPropertyNames(target)
    props.forEach(key => {
        if (key in reflected.properties) return
        const descriptor = Object.getOwnPropertyDescriptor(target, key)!
        if (descriptor.get) {
            if (isComputedProp(target, key)) reflected.views.push(key)
            else reflected.volatile.push(key)
            return
        }
        if (descriptor.value._isMSTAction === true) reflected.actions.push(key)
        else if (isObservableProp(target, key)) reflected.volatile.push(key)
        else reflected.views.push(key)
    })
    return reflected
}

export function cast<O extends ModelPrimitive = never>(snapshotOrInstance: O): O
export function cast<I extends ExtractNodeC<O>, O = never>(snapshotOrInstance: I): O
export function cast<I extends ExtractNodeC<O>, O = never>(snapshotOrInstance: I | O): O
/**
 * Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance.
 * Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance,
 * but just fool typescript into thinking so.
 * Either way, casting when outside an assignation operation won't compile.
 *
 * Example:
 * ```ts
 * const ModelA = types.model({
 *   n: types.number
 * }).actions(self => ({
 *   setN(aNumber: number) {
 *     self.n = aNumber
 *   }
 * }))
 *
 * const ModelB = types.model({
 *   innerModel: ModelA
 * }).actions(self => ({
 *   someAction() {
 *     // this will allow the compiler to assign a snapshot to the property
 *     self.innerModel = cast({ a: 5 })
 *   }
 * }))
 * ```
 *
 * @param snapshotOrInstance Snapshot or instance
 * @returns The same object casted as an instance
 */
export function cast(snapshotOrInstance: any): any {
    return snapshotOrInstance as any
}

/**
 * Casts a node instance type to an snapshot type so it can be assigned to a type snapshot (e.g. to be used inside a create call).
 * Note that this is just a cast for the type system, this is, it won't actually convert an instance to a snapshot,
 * but just fool typescript into thinking so.
 *
 * Example:
 * ```ts
 * const ModelA = types.model({
 *   n: types.number
 * }).actions(self => ({
 *   setN(aNumber: number) {
 *     self.n = aNumber
 *   }
 * }))
 *
 * const ModelB = types.model({
 *   innerModel: ModelA
 * })
 *
 * const a = ModelA.create({ n: 5 });
 * // this will allow the compiler to use a model as if it were a snapshot
 * const b = ModelB.create({ innerModel: castToSnapshot(a)})
 * ```
 *
 * @param snapshotOrInstance Snapshot or instance
 * @returns The same object casted as an input (creation) snapshot
 */
export function castToSnapshot<I>(
    snapshotOrInstance: I
): Extract<I, IAnyStateTreeNode> extends never ? I : ExtractNodeC<I> {
    return snapshotOrInstance as any
}

/**
 * Casts a node instance type to a reference snapshot type so it can be assigned to a refernence snapshot (e.g. to be used inside a create call).
 * Note that this is just a cast for the type system, this is, it won't actually convert an instance to a refererence snapshot,
 * but just fool typescript into thinking so.
 *
 * Example:
 * ```ts
 * const ModelA = types.model({
 *   id: types.identifier,
 *   n: types.number
 * }).actions(self => ({
 *   setN(aNumber: number) {
 *     self.n = aNumber
 *   }
 * }))
 *
 * const ModelB = types.model({
 *   refA: types.reference(ModelA)
 * })
 *
 * const a = ModelA.create({ id: 'someId', n: 5 });
 * // this will allow the compiler to use a model as if it were a reference snapshot
 * const b = ModelB.create({ refA: castToReference(a)})
 * ```
 *
 * @param instance Instance
 * @returns The same object casted as an reference snapshot (string or number)
 */
export function castToReferenceSnapshot<I>(
    instance: I
): Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier {
    return instance as any
}
