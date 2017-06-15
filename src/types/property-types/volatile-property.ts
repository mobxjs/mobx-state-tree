import { extendObservable, IObjectWillChange } from "mobx"
import { Property } from "./property"
import { IContext, IValidationResult, getContextForPath, typeCheckFailure, typeCheckSuccess } from "../type-checker"
import { fail } from "../../utils"

export class VolatileProperty extends Property {
    constructor(propertyName: string, private initialValue: any) {
        super(propertyName)
        if (initialValue !== null && typeof initialValue === "object")
            return fail(
                `Trying to declare property ${propertyName} with a non-primitive value. Please provide an initializer function to avoid accidental sharing of local state, like \`${propertyName}: () => initialValue\``
            )
    }

    initialize(instance: any, snapshot: any) {
        const v = typeof this.initialValue === "function"
            ? this.initialValue.call(instance, instance)
            : this.initialValue
        extendObservable(instance, { [this.name]: v })
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return change
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if (this.name in snapshot) {
            return typeCheckFailure(
                getContextForPath(context, this.name),
                snapshot[this.name],
                "volatile state should not be provided in the snapshot"
            )
        }
        return typeCheckSuccess()
    }
}
