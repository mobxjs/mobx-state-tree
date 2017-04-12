import { getMSTAdministration } from "../../core"
import { extendObservable, observable, IObjectWillChange } from "mobx"
import { Property } from "./property"
import { isValidIdentifier, fail } from "../../utils"

export class IdentifierProperty extends Property {
    constructor(propertyName: string) {
        super(propertyName)
    }

    initialize(target: any, snapshot: any) {
        extendObservable(target, {
            [this.name]: observable.ref(snapshot[this.name])
        })
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        if (!isValidIdentifier(change.newValue))
            fail(`Not a valid identifier: '${change.newValue}`)
        const node = getMSTAdministration(change.object)
        node.assertWritable()
        const oldValue = change.object[this.name]
        if (oldValue !== undefined && oldValue !== change.newValue)
            fail(`It is not allowed to change the identifier of an object, got: '${change.newValue}' but expected: '${oldValue}'`)

        return change
    }

    serialize(instance: any, snapshot: any) {
        if (!isValidIdentifier(instance[this.name]))
            fail(`Object does not have a valid identifier yet: '${instance[this.name]}'`)
        snapshot[this.name] = instance[this.name]
    }

    deserialize(instance: any, snapshot: any) {
        instance[this.name] = snapshot[this.name]
    }

    isValidSnapshot(snapshot: any) {
        return isValidIdentifier(snapshot[this.name])
    }
}
