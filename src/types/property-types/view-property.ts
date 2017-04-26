import { addHiddenFinalProp } from "../../utils"
import { createActionInvoker } from "../../core"
import { Property } from "./property"

export class ViewProperty extends Property {
    invokeAction: Function

    constructor(name: string, fn: Function) {
        super(name)
        this.invokeAction = createActionInvoker(name, fn)
        throw new Error("oops")
    }

    initialize(target: any) {
        addHiddenFinalProp(target, this.name, this.invokeAction.bind(target))
    }

    isValidSnapshot(snapshot: any) {
        return !(this.name in snapshot)
    }
}
