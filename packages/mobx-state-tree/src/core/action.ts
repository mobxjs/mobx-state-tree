import { action as mobxAction } from "mobx"

export type IMiddlewareEventType =
    | "action"
    | "process_spawn"
    | "process_resume"
    | "process_resume_error"
    | "process_return"
    | "process_throw"
// | "task_spawn TODO, see #273"

export type IMiddlewareEvent = {
    type: IMiddlewareEventType
    name: string
    id: number
    parentId: number
    rootId: number
    context: IStateTreeNode
    tree: IStateTreeNode
    args: any[]
}

export type IMiddlewareHandler = (
    actionCall: IMiddlewareEvent,
    next: (actionCall: IMiddlewareEvent) => any
) => any

let nextActionId = 1
let currentActionContext: IMiddlewareEvent | null = null

export function getNextActionId() {
    return nextActionId++
}

export function runWithActionContext(context: IMiddlewareEvent, fn: Function) {
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

export function getActionContext(): IMiddlewareEvent {
    if (!currentActionContext) return fail("Not running an action!")
    return currentActionContext
}

export function createActionInvoker<T extends Function>(
    target: IStateTreeNode,
    name: string,
    fn: T
) {
    const wrappedFn = mobxAction(name, fn)
    ;(wrappedFn as any).$mst_middleware = (fn as any).$mst_middleware

    return function() {
        const id = getNextActionId()
        return runWithActionContext(
            {
                type: "action",
                name,
                id,
                args: argsToArray(arguments),
                context: target,
                tree: getRoot(target),
                rootId: currentActionContext ? currentActionContext.rootId : id,
                parentId: currentActionContext ? currentActionContext.id : 0
            },
            wrappedFn
        )
    }
}

/**
 * Middleware can be used to intercept any action is invoked on the subtree where it is attached.
 * If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.
 *
 * For more details, see the [middleware docs](docs/middleware.md)
 *
 * @export
 * @param {IStateTreeNode} target
 * @param {(action: IRawActionCall, next: (call: IRawActionCall) => any) => any} middleware
 * @returns {IDisposer}
 */
export function addMiddleware(target: IStateTreeNode, middleware: IMiddlewareHandler): IDisposer {
    const node = getStateTreeNode(target)
    if (process.env.NODE_ENV !== "production") {
        if (!node.isProtectionEnabled)
            console.warn(
                "It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`"
            )
    }
    return node.addMiddleWare(middleware)
}

export function decorate<T extends Function>(middleware: IMiddlewareHandler, fn: T): T
/**
 * Binds middleware to a specific action
 *
 * @example
 * type.actions(self => {
 *   function takeA____() {
 *       self.toilet.donate()
 *       self.wipe()
 *       self.wipe()
 *       self.toilet.flush()
 *   }
 *   return {
 *     takeA____: decorate(atomic, takeA____)
 *   }
 * })
 *
 * @export
 * @template T
 * @param {IMiddlewareHandler} middleware
 * @param Function} fn
 * @returns the original function
 */
export function decorate<T extends Function>(middleware: IMiddlewareHandler, fn: any) {
    if (fn.$mst_middleware) fn.$mst_middleware.push(middleware)
    else fn.$mst_middleware = [middleware]
    return fn
}

function collectMiddlewareHandlers(
    node: Node,
    baseCall: IMiddlewareEvent,
    fn: Function
): IMiddlewareHandler[] {
    let handlers: IMiddlewareHandler[] = (fn as any).$mst_middleware || []
    let n: Node | null = node
    // Find all middlewares. Optimization: cache this?
    while (n) {
        handlers = handlers.concat(n.middlewares)
        n = n.parent
    }
    return handlers
}

function runMiddleWares(node: Node, baseCall: IMiddlewareEvent, originalFn: Function): any {
    const handlers = collectMiddlewareHandlers(node, baseCall, originalFn)
    // Short circuit
    if (!handlers.length) return originalFn.apply(null, baseCall.args)

    function runNextMiddleware(call: IMiddlewareEvent): any {
        const handler = handlers.shift() // Optimization: counter instead of shift is probably faster
        if (handler) return handler(call, runNextMiddleware)
        else return originalFn.apply(null, baseCall.args)
    }
    return runNextMiddleware(baseCall)
}

import { Node, getStateTreeNode, IStateTreeNode } from "./node"
import { fail, argsToArray, IDisposer } from "../utils"
import { getRoot } from "./mst-operations"
