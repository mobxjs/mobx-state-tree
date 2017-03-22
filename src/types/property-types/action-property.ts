import { addHiddenFinalProp } from "../../utils"
import { createActionInvoker } from "../../core/action"
import { Property } from "./property"

export class ActionProperty extends Property {
    invokeAction: Function

    constructor(name: string, fn: Function) {
        super(name)
        this.invokeAction =  createActionInvoker(name, fn)
    }

    initialize(target: any) {
        addHiddenFinalProp(target, this.name, this.invokeAction)
    }

    isValidSnapshot(snapshot: any) {
        return !(this.name in snapshot)
    }
}
