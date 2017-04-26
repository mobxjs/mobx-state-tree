import { extras } from "mobx"
import { addHiddenFinalProp, createNamedFunction } from "../../utils"
import { IMSTNode, getMSTAdministration } from "../../core"
import { Property } from "./property"

export class ViewProperty extends Property {
    invokeView: Function

    constructor(name: string, fn: Function) {
        super(name)
        this.invokeView = createViewInvoker(name, fn)
    }

    initialize(target: any) {
        addHiddenFinalProp(target, this.name, this.invokeView.bind(target))
    }

    isValidSnapshot(snapshot: any) {
        return !(this.name in snapshot)
    }
}

export function createViewInvoker(name: string, fn: Function) {
    const viewInvoker = function (this: IMSTNode) {
        const args = arguments
        const adm = getMSTAdministration(this)
        adm.assertAlive()
        return extras.allowStateChanges(false, () => fn.apply(this, args))
    }

    // This construction helps producing a better function name in the stack trace, but could be optimized
    // away in prod builds, and `actionInvoker` be returned directly
    return createNamedFunction(name, viewInvoker)
}
