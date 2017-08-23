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

// TODO: serializeArgument should not throw error, but indicate that the argument is unserializable and toString it or something
function serializeArgument(node: Node, actionName: string, index: number, arg: any): any {
    if (isPrimitive(arg)) return arg
    if (isStateTreeNode(arg)) {
        const targetNode = getStateTreeNode(arg)
        if (node.root !== targetNode.root)
            throw new Error(
                `Argument ${index} that was passed to action '${actionName}' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead`
            )
        return {
            $ref: node.getRelativePathTo(getStateTreeNode(arg))
        }
    }
    if (typeof arg === "function")
        throw new Error(
            `Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a function`
        )
    if (typeof arg === "object" && !isPlainObject(arg) && !isArray(arg))
        throw new Error(
            `Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a ${(arg as any) &&
            (arg as any).constructor
                ? (arg as any).constructor.name
                : "Complex Object"}`
        )
    if (isObservable(arg))
        throw new Error(
            `Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received an mobx observable.`
        )
    try {
        // Check if serializable, cycle free etc...
        // MWE: there must be a better way....
        JSON.stringify(arg) // or throws
        return arg
    } catch (e) {
        throw new Error(
            `Argument ${index} that was passed to action '${actionName}' is not serializable.`
        )
    }
}

function deserializeArgument(adm: Node, value: any): any {
    if (value && typeof value === "object") {
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === "$ref") return resolvePath(adm.storedValue, value.$ref)
    }
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
 * @export
 * @param {IStateTreeNode} target
 * @param {(call: ISerializedActionCall) => void} listener
 * @returns {IDisposer}
 */
export function onAction(
    target: IStateTreeNode,
    listener: (call: ISerializedActionCall) => void
): IDisposer {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead")
        if (!isRoot(target))
            console.warn(
                "[mobx-state-tree] Warning: Attaching onAction listeners to non root nodes is dangerous: No events will be emitted for actions initiated higher up in the tree."
            )
        if (!isProtected(target))
            console.warn(
                "[mobx-state-tree] Warning: Attaching onAction listeners to non protected nodes is dangerous: No events will be emitted for direct modifications without action."
            )
    }

    return addMiddleware(target, (rawCall, next) => {
        const sourceNode = getStateTreeNode(rawCall.context)
        if (rawCall.type === "action" && rawCall.id === rawCall.rootId) {
            listener({
                name: rawCall.name,
                path: getStateTreeNode(target).getRelativePathTo(sourceNode),
                args: rawCall.args.map((arg: any, index: number) =>
                    serializeArgument(sourceNode, rawCall.name, index, arg)
                )
            })
        }
        return next(rawCall)
    })
}

import { Node, getStateTreeNode, IStateTreeNode, isStateTreeNode } from "./node"
import {
    resolvePath,
    tryResolve,
    addMiddleware,
    applyPatch,
    applySnapshot,
    isRoot,
    isProtected
} from "./mst-operations"
import { fail, isPlainObject, isPrimitive, argsToArray, IDisposer } from "../utils"
