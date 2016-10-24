import {addHiddenFinalProp, invariant} from "../utils"
import {getObjectNode, ObjectNode} from "../types/object-node"
import {clone} from "../index"
import {IJsonPatch} from "./json-patch"

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

// TODO: return snapshot!
export function applyActionLocally(target: ObjectNode, action: IActionCall): IJsonPatch[] {
    invariant(typeof target.state[action.name] === "function", `Action '${action.name}' does not exist in '${target.path}'`)
    return target.state[action.name].apply(target.state, action.args || [])
}
