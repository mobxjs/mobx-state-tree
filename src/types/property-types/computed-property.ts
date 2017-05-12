import { computed } from "mobx"
import { Property } from "./property"
import { IContext, IValidationResult } from "../type"

export class ComputedProperty extends Property {
    constructor(propertyName: string, public getter: () => any, public setter?: (value: any) => void) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        Object.defineProperty(
            proto,
            this.name,
            computed(proto, this.name, { get: this.getter, set: this.setter, configurable: true, enumerable: false }) as any
        )
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if ( this.name in snapshot ) {
            return [{ context: context.concat([ { path: this.name } ]), snapshot: snapshot[this.name], message: "Computed properties should not be provided in the snapshot" }]
        }

        return []
    }
}
