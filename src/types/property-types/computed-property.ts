import { computed } from "mobx"
import { Property } from "./property"

export class ComputedProperty extends Property {
    constructor(propertyName, public getter, public setter) {
        super(propertyName)
    }

    initializePrototype(proto) {
        Object.defineProperty(
            proto,
            this.name,
            computed(proto, this.name, { get: this.getter, set: this.setter, configurable: true, enumerable: false }) as any
        )
    }

    isValidSnapshot(snapshot) {
        return !(this.name in snapshot)
    }
}
