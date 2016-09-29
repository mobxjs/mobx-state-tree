import {extras} from "mobx"
import {addHiddenFinalProp, invariant} from "../utils"
import {getObjectNode} from "../types/object-node"

export type IActionCall = {
    name: string;
    path: string;
    args: any[];
}

export type IActionCallOptions = {
    supressPatchEvents?: boolean
    supressActionEvents?: boolean
    dryRun?: boolean
}

export function createNonActionWrapper(instance, key, func) {
    addHiddenFinalProp(instance, key, function () {
        invariant(
            extras.isComputingDerivation() || getObjectNode(instance).isExecutingAction(),
            "Functions stored in models are only allowed to be invoked from either computed values or actions"
        )
        return func.apply(instance, arguments)
    })
}

export function createActionWrapper(instance, key, action: Function) {
    addHiddenFinalProp(instance, key, function() {
        const adm = getObjectNode(instance)
        // TODO: check if all arguments are plain (Factory based objects not supported atm, how would the type be known?)
        let hasError = true
        try {
            adm.notifyActionStart(key, arguments)
            const res = action.apply(this, arguments)
            invariant(res === undefined, `action '${key}' should not return a value but got '${res}'`)
            hasError = false
        } finally {
            adm.notifyActionEnd()
        }
    })
}
