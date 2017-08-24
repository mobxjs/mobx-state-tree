import { action as mobxAction, isObservable } from "mobx"
import { isArray } from "../utils"

export type ISerializedActionCall = {
    name: string
    path?: string
    args?: any[]
}

export type IMiddlewareEventType =
    | "action"
    | "process_spawn"
    | "process_yield"
    | "process_yield_error"
    | "process_return"
    | "process_throw"
// | "task_spawn"

export type IMiddleWareEvent = {
    type: IMiddlewareEventType
    name: string
    id: number
    rootId: number
    context: IStateTreeNode
    args: any[]
}

let nextActionId = 1
let currentActionContext: IMiddleWareEvent | null = null

export function getNextActionId() {
    return nextActionId++
}

export function runWithActionContext(context: IMiddleWareEvent, fn: Function) {
    const node = getStateTreeNode(context.context)
    const baseIsRunningAction = node._isRunningAction
    const prevContext = currentActionContext
    node.assertAlive()
    node._isRunningAction = true
    currentActionContext = context
    try {
        return runMiddleWares(node, context, fn)
    } finally {
        currentActionContext = prevContext
        node._isRunningAction = baseIsRunningAction
    }
}

export function getActionContext(): IMiddleWareEvent {
    if (!currentActionContext) return fail("Not running an action!")
    return currentActionContext
}

export function createActionInvoker<T extends Function>(
    target: IStateTreeNode,
    name: string,
    fn: T
) {
    return (mobxAction(name, function() {
        const id = getNextActionId()
        return runWithActionContext(
            {
                type: "action",
                name,
                id,
                args: argsToArray(arguments),
                context: target,
                rootId: currentActionContext ? currentActionContext.rootId : id
            },
            fn
        )
    }) as any) as T
}

export type IMiddleWareHandler = (
    actionCall: IMiddleWareEvent,
    next: (actionCall: IMiddleWareEvent) => any
) => any

function collectMiddlewareHandlers(node: Node): IMiddleWareHandler[] {
    let handlers = node.middlewares.slice()
    let n: Node = node
    // Find all middlewares. Optimization: cache this?
    while (n.parent) {
        n = n.parent
        handlers = handlers.concat(n.middlewares)
    }
    return handlers
}

function runMiddleWares(node: Node, baseCall: IMiddleWareEvent, originalFn: Function): any {
    const handlers = collectMiddlewareHandlers(node)
    // Short circuit
    if (!handlers.length) return originalFn.apply(baseCall.context, baseCall.args)

    function runNextMiddleware(call: IMiddleWareEvent): any {
        const handler = handlers.shift() // Optimization: counter instead of shift is probably faster
        if (handler) return handler(call, runNextMiddleware)
        else return originalFn.apply(baseCall.context, baseCall.args)
    }
    return runNextMiddleware(baseCall)
}

function serializeTheUnserializable(baseType: string) {
    return {
        $MST_UNSERIALIZABLE: true,
        type: baseType
    }
}

function serializeArgument(node: Node, actionName: string, index: number, arg: any): any {
    if (arg instanceof Date) return { $MST_DATE: arg.getTime() }
    if (isPrimitive(arg)) return arg
    // We should not serialize MST nodes, even if we can, because we don't know if the receiving party can handle a raw snapshot instead of an
    // MST type instance. So if one wants to serialize a MST node that was pass in, either explitly pass: 1: an id, 2: a (relative) path, 3: a snapshot
    if (isStateTreeNode(arg)) return serializeTheUnserializable(`[MSTNode: ${getType(arg).name}]`)
    if (typeof arg === "function") return serializeTheUnserializable(`[function]`)
    if (typeof arg === "object" && !isPlainObject(arg) && !isArray(arg))
        return serializeTheUnserializable(
            `[object ${(arg && arg.constructor && arg.constructor.name) || "Object"}]`
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

function deserializeArgument(adm: Node, value: any): any {
    if (value && typeof value === "object" && "$MST_DATE" in value)
        return new Date(value["$MST_DATE"])
    return value
}

export function applyAction(target: IStateTreeNode, action: ISerializedActionCall): any {
    const resolvedTarget = tryResolve(target, action.path || "")
    if (!resolvedTarget) return fail(`Invalid action path: ${action.path || ""}`)
    const node = getStateTreeNode(resolvedTarget)

    // Reserved functions
    if (action.name === "@APPLY_PATCHES") {
        return applyPatch.call(null, resolvedTarget, action.args![0])
    }
    if (action.name === "@APPLY_SNAPSHOT") {
        return applySnapshot.call(null, resolvedTarget, action.args![0])
    }

    if (!(typeof resolvedTarget[action.name] === "function"))
        fail(`Action '${action.name}' does not exist in '${node.path}'`)
    return resolvedTarget[action.name].apply(
        resolvedTarget,
        action.args ? action.args.map(v => deserializeArgument(node, v)) : []
    )
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
 * @export
 * @param {IStateTreeNode} target
 * @param {(call: ISerializedActionCall) => void} listener
 * @param attachAfter {boolean} (default false) fires the listener *after* the action has executed instead of before.
 * @returns {IDisposer}
 */
export function onAction(
    target: IStateTreeNode,
    listener: (call: ISerializedActionCall) => void,
    attachAfter = false
): IDisposer {
    if (!isRoot(target))
        console.warn(
            "[mobx-state-tree] Warning: Attaching onAction listeners to non root nodes is dangerous: No events will be emitted for actions initiated higher up in the tree."
        )
    if (!isProtected(target))
        console.warn(
            "[mobx-state-tree] Warning: Attaching onAction listeners to non protected nodes is dangerous: No events will be emitted for direct modifications without action."
        )

    function fireListener(rawCall: IMiddleWareEvent) {
        if (rawCall.type === "action" && rawCall.id === rawCall.rootId) {
            const sourceNode = getStateTreeNode(rawCall.context)
            listener({
                name: rawCall.name,
                path: getStateTreeNode(target).getRelativePathTo(sourceNode),
                args: rawCall.args.map((arg: any, index: number) =>
                    serializeArgument(sourceNode, rawCall.name, index, arg)
                )
            })
        }
    }

    return addMiddleware(
        target,
        attachAfter
            ? function onActionMiddleware(rawCall, next) {
                  const res = next(rawCall)
                  fireListener(rawCall)
                  return res
              }
            : function onActionMiddleware(rawCall, next) {
                  fireListener(rawCall)
                  return next(rawCall)
              }
    )
}

import { Node, getStateTreeNode, IStateTreeNode, isStateTreeNode } from "./node"
import {
    tryResolve,
    addMiddleware,
    applyPatch,
    getType,
    applySnapshot,
    isRoot,
    isProtected
} from "./mst-operations"
import { fail, isPlainObject, isPrimitive, argsToArray, IDisposer } from "../utils"
