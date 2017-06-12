import { extras } from "mobx"
import { addHiddenFinalProp, createNamedFunction } from "../../utils"
import { IComplexValue, getStateTreeNode } from "../../core"
import { Property } from "./property"
import { IContext, IValidationResult, typeCheckFailure, typeCheckSuccess, getContextForPath } from "../type-checker"

export class ViewProperty extends Property {
    invokeView: Function

    constructor(name: string, fn: Function) {
        super(name)
        this.invokeView = createViewInvoker(name, fn)
    }

    initialize(target: any) {
        addHiddenFinalProp(target, this.name, this.invokeView.bind(target))
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if ( this.name in snapshot ) {
            return typeCheckFailure(getContextForPath(context, this.name), snapshot[this.name], "View properties should not be provided in the snapshot")
        }

        return typeCheckSuccess()
    }
}

export function createViewInvoker(name: string, fn: Function) {
    const viewInvoker = function (this: IComplexValue) {
        const args = arguments
        const adm = getStateTreeNode(this)
        adm.assertAlive()
        return extras.allowStateChanges(false, () => fn.apply(this, args))
    }

    // This construction helps producing a better function name in the stack trace, but could be optimized
    // away in prod builds, and `actionInvoker` be returned directly
    return createNamedFunction(name, viewInvoker)
}
