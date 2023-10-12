import { runInAction } from "mobx"

import {
  getStateTreeNode,
  isStateTreeNode,
  addMiddleware,
  tryResolve,
  applyPatch,
  getType,
  applySnapshot,
  isRoot,
  isProtected,
  fail,
  isPlainObject,
  isPrimitive,
  IDisposer,
  isArray,
  asArray,
  getRelativePathBetweenNodes,
  IAnyStateTreeNode,
  warnError,
  AnyNode,
  assertIsStateTreeNode,
  devMode,
  assertArg,
  IActionContext,
  getRunningActionContext
} from "../internal"

export interface ISerializedActionCall {
  name: string
  path?: string
  args?: any[]
}

export interface IActionRecorder {
  actions: ReadonlyArray<ISerializedActionCall>
  readonly recording: boolean
  stop(): void
  resume(): void
  replay(target: IAnyStateTreeNode): void
}

function serializeArgument(node: AnyNode, actionName: string, index: number, arg: any): any {
  if (arg instanceof Date) return { $MST_DATE: arg.getTime() }
  if (isPrimitive(arg)) return arg
  // We should not serialize MST nodes, even if we can, because we don't know if the receiving party can handle a raw snapshot instead of an
  // MST type instance. So if one wants to serialize a MST node that was pass in, either explitly pass: 1: an id, 2: a (relative) path, 3: a snapshot
  if (isStateTreeNode(arg)) return serializeTheUnserializable(`[MSTNode: ${getType(arg).name}]`)
  if (typeof arg === "function") return serializeTheUnserializable(`[function]`)
  if (typeof arg === "object" && !isPlainObject(arg) && !isArray(arg))
    return serializeTheUnserializable(
      `[object ${
        (arg && (arg as any).constructor && (arg as any).constructor.name) || "Complex Object"
      }]`
    )
  try {
    // Check if serializable, cycle free etc...
    // MWE: there must be a better way....
    JSON.stringify(arg) // or throws
    return arg
  } catch (e) {
    return serializeTheUnserializable("" + e)
  }
}

function deserializeArgument(adm: AnyNode, value: any): any {
  if (value && typeof value === "object" && "$MST_DATE" in value)
    return new Date(value["$MST_DATE"])
  return value
}

function serializeTheUnserializable(baseType: string) {
  return {
    $MST_UNSERIALIZABLE: true,
    type: baseType
  }
}

/**
 * Applies an action or a series of actions in a single MobX transaction.
 * Does not return any value
 * Takes an action description as produced by the `onAction` middleware.
 *
 * @param target
 * @param actions
 */
export function applyAction(
  target: IAnyStateTreeNode,
  actions: ISerializedActionCall | ISerializedActionCall[]
): void {
  // check all arguments
  assertIsStateTreeNode(target, 1)
  assertArg(actions, (a) => typeof a === "object", "object or array", 2)

  runInAction(() => {
    asArray(actions).forEach((action) => baseApplyAction(target, action))
  })
}

function baseApplyAction(target: IAnyStateTreeNode, action: ISerializedActionCall): any {
  const resolvedTarget = tryResolve(target, action.path || "")
  if (!resolvedTarget) throw fail(`Invalid action path: ${action.path || ""}`)
  const node = getStateTreeNode(resolvedTarget)

  // Reserved functions
  if (action.name === "@APPLY_PATCHES") {
    return applyPatch.call(null, resolvedTarget, action.args![0])
  }
  if (action.name === "@APPLY_SNAPSHOT") {
    return applySnapshot.call(null, resolvedTarget, action.args![0])
  }

  if (!(typeof resolvedTarget[action.name] === "function"))
    throw fail(`Action '${action.name}' does not exist in '${node.path}'`)
  return resolvedTarget[action.name].apply(
    resolvedTarget,
    action.args ? action.args.map((v) => deserializeArgument(node, v)) : []
  )
}

/**
 * Small abstraction around `onAction` and `applyAction`, attaches an action listener to a tree and records all the actions emitted.
 * Returns an recorder object with the following signature:
 *
 * Example:
 * ```ts
 * export interface IActionRecorder {
 *      // the recorded actions
 *      actions: ISerializedActionCall[]
 *      // true if currently recording
 *      recording: boolean
 *      // stop recording actions
 *      stop(): void
 *      // resume recording actions
 *      resume(): void
 *      // apply all the recorded actions on the given object
 *      replay(target: IAnyStateTreeNode): void
 * }
 * ```
 *
 * The optional filter function allows to skip recording certain actions.
 *
 * @param subject
 * @returns
 */
export function recordActions(
  subject: IAnyStateTreeNode,
  filter?: (action: ISerializedActionCall, actionContext: IActionContext | undefined) => boolean
): IActionRecorder {
  // check all arguments
  assertIsStateTreeNode(subject, 1)

  const actions: ISerializedActionCall[] = []
  const listener = (call: ISerializedActionCall) => {
    const recordThis = filter ? filter(call, getRunningActionContext()) : true
    if (recordThis) {
      actions.push(call)
    }
  }

  let disposer: IDisposer | undefined
  const recorder: IActionRecorder = {
    actions,
    get recording() {
      return !!disposer
    },
    stop() {
      if (disposer) {
        disposer()
        disposer = undefined
      }
    },
    resume() {
      if (disposer) return
      disposer = onAction(subject, listener)
    },
    replay(target) {
      applyAction(target, actions)
    }
  }

  recorder.resume()
  return recorder
}

/**
 * Registers a function that will be invoked for each action that is called on the provided model instance, or to any of its children.
 * See [actions](https://github.com/mobxjs/mobx-state-tree#actions) for more details. onAction events are emitted only for the outermost called action in the stack.
 * Action can also be intercepted by middleware using addMiddleware to change the function call before it will be run.
 *
 * Not all action arguments might be serializable. For unserializable arguments, a struct like `{ $MST_UNSERIALIZABLE: true, type: "someType" }` will be generated.
 * MST Nodes are considered non-serializable as well (they could be serialized as there snapshot, but it is uncertain whether an replaying party will be able to handle such a non-instantiated snapshot).
 * Rather, when using `onAction` middleware, one should consider in passing arguments which are 1: an id, 2: a (relative) path, or 3: a snapshot. Instead of a real MST node.
 *
 * Example:
 * ```ts
 * const Todo = types.model({
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.array(Todo)
 * }).actions(self => ({
 *   add(todo) {
 *     self.todos.push(todo);
 *   }
 * }))
 *
 * const s = TodoStore.create({ todos: [] })
 *
 * let disposer = onAction(s, (call) => {
 *   console.log(call);
 * })
 *
 * s.add({ task: "Grab a coffee" })
 * // Logs: { name: "add", path: "", args: [{ task: "Grab a coffee" }] }
 * ```
 *
 * @param target
 * @param listener
 * @param attachAfter (default false) fires the listener *after* the action has executed instead of before.
 * @returns
 */
export function onAction(
  target: IAnyStateTreeNode,
  listener: (call: ISerializedActionCall) => void,
  attachAfter = false
): IDisposer {
  // check all arguments
  assertIsStateTreeNode(target, 1)
  if (devMode()) {
    if (!isRoot(target))
      warnError(
        "Warning: Attaching onAction listeners to non root nodes is dangerous: No events will be emitted for actions initiated higher up in the tree."
      )
    if (!isProtected(target))
      warnError(
        "Warning: Attaching onAction listeners to non protected nodes is dangerous: No events will be emitted for direct modifications without action."
      )
  }

  return addMiddleware(target, function handler(rawCall, next) {
    if (rawCall.type === "action" && rawCall.id === rawCall.rootId) {
      const sourceNode = getStateTreeNode(rawCall.context)
      const info = {
        name: rawCall.name,
        path: getRelativePathBetweenNodes(getStateTreeNode(target), sourceNode),
        args: rawCall.args.map((arg: any, index: number) =>
          serializeArgument(sourceNode, rawCall.name, index, arg)
        )
      }
      if (attachAfter) {
        const res = next(rawCall)
        listener(info)
        return res
      } else {
        listener(info)
        return next(rawCall)
      }
    } else {
      return next(rawCall)
    }
  })
}
