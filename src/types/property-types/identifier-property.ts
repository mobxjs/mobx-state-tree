import { observable, IObjectWillChange } from "mobx"
import { Property } from "./property"
import { isValidIdentifier, fail } from "../../utils"

export class IdentifierProperty extends Property {
    constructor(propertyName: string) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        observable.ref(proto, this.name, { value: undefined })
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        if (!isValidIdentifier(change.newValue))
            fail(`Not a valid identifier: '${change.newValue}`)
        const oldValue = change.object[this.name]
        if (oldValue !== undefined && oldValue !== change.newValue)
            fail(`It is not allowed to change the identifier of an object, got: '${change.newValue}'`)

        return change
    }

    serialize(instance: any, snapshot: any) {
        if (!isValidIdentifier(instance[this.name]))
            fail(`Object does not have a valid identifier yet: '${instance[this.name]}`)
        snapshot[this.name] = instance[this.name]
    }

    deserialize(instance: any, snapshot: any) {
        instance[this.name] = snapshot[this.name]
    }

    isValidSnapshot(snapshot: any) {
        return isValidIdentifier(snapshot[this.name])
    }
}
