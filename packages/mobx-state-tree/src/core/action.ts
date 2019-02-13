import { action as mobxAction } from "mobx"
import {
    getStateTreeNode,
    fail,
    argsToArray,
    IDisposer,
    getRoot,
    EMPTY_ARRAY,
    Hook,
    IAnyStateTreeNode,
    warnError,
    objNodeOps,
    NodeObj
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
    allParentIds: number[]
    context: IAnyStateTreeNode
    tree: IAnyStateTreeNode
    args: any[]
}

/**
 * @internal
 * @hidden
 */
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

/**
 * @internal
 * @hidden
 */
export function getCurrentActionContext() {
    return currentActionContext
}

/**
 * @internal
 * @hidden
 */
export function getNextActionId() {
    return nextActionId++
}

// TODO: optimize away entire action context if there is no middleware in tree?
/**
 * @internal
 * @hidden
 */
export function runWithActionContext(context: IMiddlewareEvent, fn: Function) {
    const node = getStateTreeNode(context.context)
    const baseIsRunningAction = node._isRunningAction
    const prevContext = currentActionContext

    if (context.type === "action") {
        objNodeOps.assertAlive(node, {
            actionContext: context
        })
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

/**
 * @internal
 * @hidden
 */
export function getActionContext(): IMiddlewareEvent {
    if (!currentActionContext) throw fail("Not running an action!")
    return currentActionContext
}

/**
 * @internal
 * @hidden
 */
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
                parentId: currentActionContext ? currentActionContext.id : 0,
                allParentIds: currentActionContext
                    ? [...currentActionContext.allParentIds, currentActionContext.id]
                    : []
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
 * For more details, see the [middleware docs](../middleware.md)
 *
 * @param target Node to apply the middleware to.
 * @param middleware Middleware to apply.
 * @returns A callable function to dispose the middleware.
 */
export function addMiddleware(
    target: IAnyStateTreeNode,
    handler: IMiddlewareHandler,
    includeHooks: boolean = true
): IDisposer {
    const node = getStateTreeNode(target)
    if (process.env.NODE_ENV !== "production") {
        if (!node.isProtectionEnabled) {
            warnError(
                "It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`"
            )
        }
    }
    return objNodeOps.addMiddleWare(node, handler, includeHooks)
}

/**
 * Binds middleware to a specific action.
 *
 * Example:
 * ```ts
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
 * ```
 *
 * @param handler
 * @param fn
 * @returns The original function
 */
export function decorate<T extends Function>(handler: IMiddlewareHandler, fn: T): T {
    const middleware: IMiddleware = { handler, includeHooks: true }
    if ((fn as any).$mst_middleware) (fn as any).$mst_middleware.push(middleware)
    else;
    ;(fn as any).$mst_middleware = [middleware]
    return fn
}

function collectMiddlewares(
    node: NodeObj,
    baseCall: IMiddlewareEvent,
    fn: Function
): IMiddleware[] {
    let middlewares: IMiddleware[] = (fn as any).$mst_middleware || EMPTY_ARRAY
    let n: NodeObj | null = node
    // Find all middlewares. Optimization: cache this?
    while (n) {
        if (n.middlewares) middlewares = middlewares.concat(n.middlewares)
        n = n.parent
    }
    return middlewares
}

function runMiddleWares(node: NodeObj, baseCall: IMiddlewareEvent, originalFn: Function): any {
    const middlewares = collectMiddlewares(node, baseCall, originalFn)
    // Short circuit
    if (!middlewares.length) return mobxAction(originalFn).apply(null, baseCall.args)

    let index = 0
    let result: any = null

    function runNextMiddleware(call: IMiddlewareEvent): any {
        const middleware = middlewares[index++]
        const handler = middleware && middleware.handler

        if (!handler) {
            return mobxAction(originalFn).apply(null, call.args)
        }

        // skip hooks if asked to
        if (!middleware.includeHooks && (Hook as any)[call.name]) {
            return runNextMiddleware(call)
        }

        let nextInvoked = false
        function next(call2: IMiddlewareEvent, callback?: (value: any) => any): void {
            nextInvoked = true
            // the result can contain
            // - the non manipulated return value from an action
            // - the non manipulated abort value
            // - one of the above but manipulated through the callback function
            const innerResult = runNextMiddleware(call2)
            if (callback) {
                result = callback(innerResult)
            } else {
                result = innerResult
            }
        }

        let abortInvoked = false
        function abort(value: any) {
            abortInvoked = true
            // overwrite the result
            // can be manipulated through middlewares earlier in the queue using the callback fn
            result = value
        }

        handler(call, next, abort)
        if (process.env.NODE_ENV !== "production") {
            if (!nextInvoked && !abortInvoked) {
                const node2 = getStateTreeNode(call.tree)
                throw fail(
                    `Neither the next() nor the abort() callback within the middleware ${
                        handler.name
                    } for the action: "${call.name}" on the node: ${node2.type.name} was invoked.`
                )
            } else if (nextInvoked && abortInvoked) {
                const node2 = getStateTreeNode(call.tree)
                throw fail(
                    `The next() and abort() callback within the middleware ${
                        handler.name
                    } for the action: "${call.name}" on the node: ${node2.type.name} were invoked.`
                )
            }
        }
        return result
    }
    return runNextMiddleware(baseCall)
}
