import {isObservable} from "mobx"
import {isModel} from "../"
import {addHiddenFinalProp, invariant, isPlainObject, isPrimitive} from "../utils"
import {Node, getNode, getRelativePath} from "./node"
import {splitJsonPath} from "../core/json-patch"

let _isRunningActionGlobally = false

export function isRunningAction(): boolean {
    return _isRunningActionGlobally
}

export type IActionCall = {
    name: string;
    path?: string;
    args?: any[];
}

export type IActionHandler  = (actionCall: IActionCall, next: () => void) => void

export function createNonActionWrapper(instance, key, func) {
    addHiddenFinalProp(instance, key, func.bind(instance))
}

export function createActionWrapper(instance, key, action: Function) {
    addHiddenFinalProp(instance, key, function(...args: any[]) {
        const adm = getNode(instance)
        const runAction = () => {
            const res = action.apply(instance, args)
            invariant(res === undefined, `action '${key}' should not return a value but got '${res}'`)
        }
        if (_isRunningActionGlobally) {
            // an action is running, invoking this action
            invariant(instance.isRunningAction(), `Action ${key} was invoked on ${instance.path}. However another action is already running, and this object is not part of the tree it is allowed to modify`)
            runAction()
        } else {
            // an action is started!
            try {
                _isRunningActionGlobally = true
                adm._isRunningAction = true
                adm.emitAction(
                    adm,
                    {
                        name: key,
                        path: "",
                        args: args.map((arg, index) => serializeArgument(adm, key, index, arg))
                    },
                    runAction
                )
            } finally {
                adm._isRunningAction = false
                _isRunningActionGlobally = false
            }
        }
    })
}

function serializeArgument(adm: Node, actionName: string, index: number, arg: any): any {
    if (isPrimitive(arg))
        return arg
    if (isModel(arg)) {
        return ({
            $path: getRelativePath(adm.target, getNode(arg))
        })
    }
    if (typeof arg === "function")
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a function`)
    if (typeof arg === "object" && !isPlainObject(arg))
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received a ${(arg && arg.constructor) ? arg.constructor.name : "Complex Object"}`)
    if (isObservable(arg))
        throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive, model object or plain object, received an mobx observable.`)
    try {
        // Check if serializable, cycle free etc...
        // MWE: there must be a better way....
        JSON.stringify(arg)
        return arg
    } catch (e) {
        throw new Error(`Argument ${index} that was passed to action '${actionName}' is not serializable.`)
    }
}

function deserializeArgument(adm: Node, value: any): any {
    if (typeof value === "object") {
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === "$path")
            return adm.resolvePath(splitJsonPath(value.$path))
    }
    return value
}

export function applyActionLocally(node: Node, instance, action: IActionCall) {
    invariant(typeof instance[action.name] === "function", `Action '${action.name}' does not exist in '${node.path}'`)
    instance[action.name].apply(
        instance,
        action.args ? action.args.map(v => deserializeArgument(node, v)) : []
    )
}
