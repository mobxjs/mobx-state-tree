import { computed } from "mobx"
import { Property } from "./property"

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

    isValidSnapshot(snapshot: any) {
        return !(this.name in snapshot)
    }
}
