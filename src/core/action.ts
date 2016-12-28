import {isObservable} from "mobx"
import {isModel, getModelFactory} from "../"
import {addHiddenFinalProp, invariant, isPlainObject, isPrimitive} from "../utils"
import {getObjectNode, ObjectNode} from "../types/object-node"

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
        const adm = getObjectNode(instance)
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
                verifyArgumentsAreStringifyable(key, args)
                adm.emitAction(
                    adm,
                    { name: key, path: "", args: args },
                    runAction
                )
            } finally {
                adm._isRunningAction = false
                _isRunningActionGlobally = false
            }
        }
    })
}

function verifyArgumentsAreStringifyable(actionName: string, args: any[]) {
    args.forEach((arg, index) => {
        if (isPrimitive(arg))
            return
        if (isModel(arg))
            throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive or plain object, received a ${getModelFactory(arg).factoryName} model.`)
        if (!isPlainObject(arg))
            throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive or plain object, received a ${(arg && arg.constructor) ? arg.constructor.name : "Complex Object"}`)
        if (isObservable(arg))
            throw new Error(`Argument ${index} that was passed to action '${actionName}' should be a primitive or plain object, received an mobx observable.`)
        try {
            // MWE: there must be a better way....
            JSON.stringify(arg)
        } catch (e) {
            throw new Error(`Argument ${index} that was passed to action '${actionName}' is not serializable.`)
        }
    })
}

export function applyActionLocally(target: ObjectNode, action: IActionCall) {
    invariant(typeof target.state[action.name] === "function", `Action '${action.name}' does not exist in '${target.path}'`)
    target.state[action.name].apply(target.state, action.args || [])
}
