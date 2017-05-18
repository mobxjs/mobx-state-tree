import { action as mobxAction, isObservable } from "mobx"

export type ISerializedActionCall = {
    name: string;
    path?: string;
    args?: any;
}

export type IRawActionCall = {
    name: string;
    object: any & IMSTNode,
    args: any[]
}

export type IMiddlewareActionCall = {
    name: string;
    object: any & IMSTNode,
    args: any[]
    fn: Function
}

export type IMiddleWareHandler = (actionCall: IMiddlewareActionCall, next: (actionCall: IMiddlewareActionCall) => any) => any

function runRawAction(actioncall: IRawActionCall): any {
    return actioncall.object[actioncall.name].apply(actioncall.object, actioncall.args)
}

function collectMiddlewareHandlers(node: MSTAdministration): IMiddleWareHandler[] {
    let handlers = node.middlewares.slice()
    let n: MSTAdministration | null = node
    // Find all middlewares. Optimization: cache this?
    while (n.parent) {
        n = n.parent
        handlers = handlers.concat(n.middlewares)
    }
    return handlers
}

function runMiddleWares(node: MSTAdministration, baseCall: IMiddlewareActionCall): any {
    const handlers = collectMiddlewareHandlers(node)
    // Short circuit
    if (!handlers.length)
        return runRawAction(baseCall)

    function runNextMiddleware(call: IMiddlewareActionCall): any {
        const handler = handlers.shift() // Optimization: counter instead of shift is probably faster
        if (handler) {
            return handler(call, runNextMiddleware)
        }
        else {
          const rawCall: IRawActionCall = {
            name: call.name,
            object: call.object,
            args: call.args
          }
          return runRawAction(rawCall)
        }
    }

    return runNextMiddleware(baseCall)
}

export function createActionInvoker(name: string, fn: Function) {
    const action = mobxAction(name, fn)

    const actionInvoker = function (this: IMSTNode) {
        const adm = getMSTAdministration(this)
        adm.assertAlive()
        if (adm.isRunningAction()) {
            // an action is already running in this tree, invoking this action does not emit a new action
            return action.apply(this, arguments)
        } else {
            // outer action, run middlewares and start the action!
            const call: IMiddlewareActionCall = {
                name,
                object: adm.target,
                args: (Array as any).from(arguments),
                fn: fn
            }
            const root = adm.root
            root._isRunningAction = true
            try {
                return runMiddleWares(adm, call)
            } finally {
                root._isRunningAction = false
            }
        }
    }

    // This construction helps producing a better function name in the stack trace, but could be optimized
    // away in prod builds, and `actionInvoker` be returned directly
    return createNamedFunction(name, actionInvoker)
}

function serializeArguments(adm: MSTAdministration, actionName: string, args: any): any {
    const res: any = {};
    (Object as any).entries(args).forEach(([argName, arg]: [string, any]) => {
        res[argName] = serializeArgument(adm, actionName, argName, arg)
    })
    return res
}

function serializeArgument(adm: MSTAdministration, actionName: string, argName: string, arg: any): any {
    if (isPrimitive(arg))
        return arg
    if (isMST(arg)) {
        const targetNode = getMSTAdministration(arg)
        if (adm.root !== targetNode.root)
            throw new Error(`Argument ${argName} that was passed to action '${actionName}' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead`)
        return ({
            $ref: getRelativePathForNodes(adm, getMSTAdministration(arg))
        })
    }
    if (typeof arg === "function")
        throw new Error(`Argument ${argName} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a function`)
    if (typeof arg === "object" && !isPlainObject(arg))
        throw new Error(`Argument ${argName} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a ${(arg as any && (arg as any).constructor) ? (arg as any).constructor.name : "Complex Object"}`)
    if (isObservable(arg))
        throw new Error(`Argument ${argName} that was passed to action '${actionName}' should be a primitive, model object or plain object, received an mobx observable.`)
    try {
        // Check if serializable, cycle free etc...
        // MWE: there must be a better way....
        JSON.stringify(arg) // or throws
        return arg
    } catch (e) {
        throw new Error(`Argument ${argName} that was passed to action '${actionName}' is not serializable.`)
    }
}

function deserializeArgument(adm: MSTAdministration, value: any): any {
    if (typeof value === "object") {
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === "$ref")
            return resolve(adm.target, value.$ref)
    }
    return value
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
export function applyAction(target: IMSTNode, action: ISerializedActionCall): any {
    const resolvedTarget = tryResolve(target, action.path || "")
    if (!resolvedTarget)
        return fail(`Invalid action path: ${action.path || ""}`)
    const node = getMSTAdministration(resolvedTarget)
    invariant(typeof resolvedTarget[action.name] === "function", `Action '${action.name}' does not exist in '${node.path}'`)
    return resolvedTarget[action.name].apply(
        resolvedTarget,
        action.args ? ((Object as any).values(action.args) as any[]).map(v => deserializeArgument(node, v)) : []
    )
}

export function onAction(target: IMSTNode, listener: (call: ISerializedActionCall) => void): IDisposer {
    return addMiddleware(target, (middlewareCall, next) => {
        const sourceNode = getMSTAdministration(middlewareCall.object)
        const args = getArgs(middlewareCall.args, middlewareCall.fn)
        const serializedArgs = serializeArguments(sourceNode, middlewareCall.name, args)
        listener({
            name: middlewareCall.name,
            path: getRelativePathForNodes(getMSTAdministration(target), sourceNode),
            args: serializedArgs
        })
        return next(middlewareCall)
    })
}

import { getMSTAdministration, IMSTNode, isMST, getRelativePathForNodes } from "./mst-node"
import { MSTAdministration } from "./mst-node-administration"
import { resolve, tryResolve, addMiddleware } from "./mst-operations"
import { fail, invariant, isPlainObject, isPrimitive, getArgs, createNamedFunction, IDisposer } from "../utils"
