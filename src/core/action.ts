import {extras} from "mobx"
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
    path: string;
    args: any[];
}

export type IActionHandler  = (instance: any, actionCall: IActionCall, next: () => void) => void

export type IActionCallOptions = {
    supressPatchEvents?: boolean
    supressActionEvents?: boolean
    dryRun?: boolean
}

export function createNonActionWrapper(instance, key, func) {
    addHiddenFinalProp(instance, key, func.bind(instance))
}

export function createActionWrapper(instance, key, action: Function) {
    addHiddenFinalProp(instance, key, function(...args: any[]) {
        const adm = getObjectNode(instance)
        const run = () => {
            const res = action.apply(instance, args)
            invariant(res === undefined, `action '${key}' should not return a value but got '${res}'`)
        }
        if (_isRunningActionGlobally) {
            // an action is running, invoking this action
            invariant(instance.isRunningAction(), `Action ${key} was invoked on ${instance.path}. However another action is already running, and this object is not part of the tree it is allowed to modify`)
            run()
        } else {
            // an action is started!
            try {
                _isRunningActionGlobally = true
                adm._isRunningAction = true
                adm.emitAction(
                    instance,
                    { name: key, path: "", args: args },
                    run
                )
            } finally {
                adm._isRunningAction = false
                _isRunningActionGlobally = false
            }
        }
    })
}

// TODO: return snapshot!
export function applyActionLocally(node: ObjectNode, action: IActionCall, options?: IActionCallOptions): IJsonPatch[] {
    // TODO: move to action.ts
    const supressActionEvents = (options && options.supressActionEvents) || true
    const supressPatchEvents = (options && options.supressPatchEvents) || false
    const dryRun = (options && options.dryRun) || false
    const target = dryRun ? getObjectNode(clone(node.state)) : node
    invariant(typeof target.state[action.name] === "function", `Action '${action.name}' does not exist in '${target.path}'`)
    const actionSubscriptions = supressActionEvents ? target.actionSubscribers.splice(0) : []
    const patchSubscriptions  = supressPatchEvents  ? target.patchSubscribers.splice(0)  : []
    // TODO set global flag action is running
    // TODO: disable all modifications if no action is running!
    try {
        return target.state[action.name].apply(target.state, action.args)
    } finally {
        target.patchSubscribers.push(...patchSubscriptions)
        target.actionSubscribers.push(...actionSubscriptions)
    }
}
