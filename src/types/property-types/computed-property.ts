import { computed } from "mobx"
import { Property } from "./property"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, getContextForPath } from "../type-checker"

export class ComputedProperty extends Property {
    constructor(propertyName: string, public getter: () => any, public setter?: (value: any) => void) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        Object.defineProperty(
            proto,
            this.name,
            computed(proto, this.name, {
                get: this.getter,
                set: this.setter,
                configurable: true,
                enumerable: false
            }) as any
        )
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if (this.name in snapshot) {
            return typeCheckFailure(
                getContextForPath(context, this.name),
                snapshot[this.name],
                "Computed properties should not be provided in the snapshot"
            )
        }

        return typeCheckSuccess()
    }
}
