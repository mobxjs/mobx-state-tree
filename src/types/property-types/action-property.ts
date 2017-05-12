import { addHiddenFinalProp } from "../../utils"
import { createActionInvoker } from "../../core"
import { Property } from "./property"
import { IContext, IValidationResult } from "../type"

export class ActionProperty extends Property {
    invokeAction: Function

    constructor(name: string, fn: Function) {
        super(name)
        this.invokeAction = createActionInvoker(name, fn)
    }

    initialize(target: any) {
        addHiddenFinalProp(target, this.name, this.invokeAction.bind(target))
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if( this.name in snapshot ) {
            return [{ context: context.concat([ { path: this.name } ]), value: snapshot[this.name], message: "Action properties should not be provided in the snapshot" }]
        }

        return []
    }
}
