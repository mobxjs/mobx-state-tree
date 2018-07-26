import { action as mobxAction } from "mobx"
import {
    getStateTreeNode,
    fail,
    argsToArray,
    IDisposer,
    getRoot,
    EMPTY_ARRAY,
    ObjectNode,
    HookNames,
    IAnyStateTreeNode
} from "../internal"

export type IMiddlewareEventType =
    | "action"
    | "flow_spawn"
    | "flow_resume"
    | "flow_resume_error"
    | "flow_return"
    | "flow_throw"
// | "task_spawn TODO, see #273"

export type IMiddlewareEvent = {
    type: IMiddlewareEventType
    name: string
    id: number
    parentId: number
    rootId: number
    context: IAnyStateTreeNode
    tree: IAnyStateTreeNode
    args: any[]
}

export type IMiddleware = {
    handler: IMiddlewareHandler
    includeHooks: boolean
}
export type IMiddlewareHandler = (
    actionCall: IMiddlewareEvent,
    next: (actionCall: IMiddlewareEvent, callback?: (value: any) => any) => void,
    abort: (value: any) => void
) => any

let nextActionId = 1
let currentActionContext: IMiddlewareEvent | null = null

export function getNextActionId() {
    return nextActionId++
}

// TODO: optimize away entire action context if there is no middleware in tree?
export function runWithActionContext(context: IMiddlewareEvent, fn: Function) {
    const node = getStateTreeNode(context.context)
    const baseIsRunningAction = node._isRunningAction
    const prevContext = currentActionContext

    if (context.type === "action") {
        node.assertAlive()
    }

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
    target: IAnyStateTreeNode,
    name: string,
    fn: T
) {
    const res = function() {
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
            fn
        )
    }
    ;(res as any)._isMSTAction = true
    return res
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
export function addMiddleware(
    target: IAnyStateTreeNode,
    handler: IMiddlewareHandler,
    includeHooks: boolean = true
): IDisposer {
    const node = getStateTreeNode(target)
    if (process.env.NODE_ENV !== "production") {
        if (!node.isProtectionEnabled)
            console.warn(
                "It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`"
            )
    }
    return node.addMiddleWare(handler, includeHooks)
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
 * @param {IMiddlewareHandler} handler
 * @param Function} fn
 * @returns the original function
 */
export function decorate<T extends Function>(handler: IMiddlewareHandler, fn: any) {
    const middleware: IMiddleware = { handler, includeHooks: true }
    if (fn.$mst_middleware) fn.$mst_middleware.push(middleware)
    else fn.$mst_middleware = [middleware]
    return fn
}

function collectMiddlewares(
    node: ObjectNode,
    baseCall: IMiddlewareEvent,
    fn: Function
): IMiddleware[] {
    let middlewares: IMiddleware[] = (fn as any).$mst_middleware || EMPTY_ARRAY
    let n: ObjectNode | null = node
    // Find all middlewares. Optimization: cache this?
    while (n) {
        if (n.middlewares) middlewares = middlewares.concat(n.middlewares)
        n = n.parent
    }
    return middlewares
}

function runMiddleWares(node: ObjectNode, baseCall: IMiddlewareEvent, originalFn: Function): any {
    const middlewares = collectMiddlewares(node, baseCall, originalFn)
    // Short circuit
    if (!middlewares.length) return mobxAction(originalFn).apply(null, baseCall.args)
    let index = 0
    let result: any = null

    function runNextMiddleware(call: IMiddlewareEvent): any {
        const middleware = middlewares[index++]
        const handler = middleware && middleware.handler
        let nextInvoked = false
        let abortInvoked = false

        function next(call: IMiddlewareEvent): void
        function next(call: IMiddlewareEvent, callback: (value: any) => any): void
        function next(call: IMiddlewareEvent, callback?: (value: any) => any) {
            nextInvoked = true
            // the result can contain
            // - the non manipulated return value from an action
            // - the non manipulated abort value
            // - one of the above but manipulated through the callback function
            if (callback) {
                result = callback(runNextMiddleware(call) || result)
            } else {
                result = runNextMiddleware(call)
            }
        }
        function abort(value: any) {
            abortInvoked = true
            // overwrite the result
            // can be manipulated through middlewares earlier in the queue using the callback fn
            result = value
        }
        const invokeHandler = () => {
            handler(call, next, abort)
            if (process.env.NODE_ENV !== "production") {
                if (!nextInvoked && !abortInvoked) {
                    const node = getStateTreeNode(call.tree)
                    fail(
                        `Neither the next() nor the abort() callback within the middleware ${
                            handler.name
                        } for the action: "${call.name}" on the node: ${
                            node.type.name
                        } was invoked.`
                    )
                }
                if (nextInvoked && abortInvoked) {
                    const node = getStateTreeNode(call.tree)
                    fail(
                        `The next() and abort() callback within the middleware ${
                            handler.name
                        } for the action: "${call.name}" on the node: ${
                            node.type.name
                        } were invoked.`
                    )
                }
            }
            return result
        }

        if (handler && middleware.includeHooks) {
            return invokeHandler()
        } else if (handler && !middleware.includeHooks) {
            if ((HookNames as any)[call.name]) return runNextMiddleware(call)
            return invokeHandler()
        } else {
            return mobxAction(originalFn).apply(null, call.args)
        }
    }
    return runNextMiddleware(baseCall)
}
