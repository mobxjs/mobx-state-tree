import { action as mobxAction, isObservable } from "mobx"

export type IActionCall = {
    name: string;
    path?: string;
    args?: any[];
}

export type IActionHandler  = (actionCall: IActionCall, next: () => void) => void

export function createActionInvoker(name: string, fn: Function) {
    const action = mobxAction(name, fn)

    const actionInvoker = function () {
        const adm = getMST(this)
        if (adm.isRunningAction()) {
            // an action is already running in this tree, invoking this action does not emit a new action
            return action.apply(this, arguments)
        } else {
            // start the action!
            const root = adm.root
            const args = arguments
            root._isRunningAction = true
            try {
                return adm.emitAction(
                    adm,
                    {
                        name: name,
                        path: "",
                        args: argsToArray(args).map((arg, index) => serializeArgument(adm, name, index, arg))
                    },
                    () => action.apply(this, args)
                )
            } finally {
                root._isRunningAction = false
            }
        }
    }

    // This construction helps producing a better function name in the stack trace, but could be optimized
    // away in prod builds, and `invoker` be returned directly
    return createNamedFunction(name, actionInvoker)
}


function serializeArgument(adm: MSTAdminisration, actionName: string, index: number, arg: any): any {
    if (isPrimitive(arg))
        return arg
    if (isMST(arg)) {
        const targetNode = getMST(arg)
        if (adm.root !== targetNode.root)
            throw new Error(`Argument ${index} that was passed to action '${actionName}' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead`)
        return ({
            $ref: getRelativePath(adm, getMST(arg))
        })
    }
    if (typeof arg === "function")
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a function`)
    if (typeof arg === "object" && !isPlainObject(arg))
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a ${(arg as any && (arg as any).constructor) ? (arg as any).constructor.name : "Complex Object"}`)
    if (isObservable(arg))
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received an mobx observable.`)
    try {
        // Check if serializable, cycle free etc...
        // MWE: there must be a better way....
        JSON.stringify(arg) // or throws
        return arg
    } catch (e) {
        throw new Error(`Argument ${index} that was passed to action '${actionName}' is not serializable.`)
    }
}

function deserializeArgument(adm: MSTAdminisration, value: any): any {
    if (typeof value === "object") {
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === "$ref")
            return resolve(adm.target, value.$ref)
    }
    return value
}

export function applyActionLocally(node: MSTAdminisration, instance: any, action: IActionCall) {
    invariant(typeof instance[action.name] === "function", `Action '${action.name}' does not exist in '${node.path}'`)
    instance[action.name].apply(
        instance,
        action.args ? action.args.map(v => deserializeArgument(node, v)) : []
    )
}

import {isMST, getMST, getRelativePath} from "./mst-node"
import {MSTAdminisration} from "./mst-node-administration"
import {resolve} from "../top-level-api"
import {invariant, isPlainObject, isPrimitive, argsToArray, createNamedFunction} from "../utils"
