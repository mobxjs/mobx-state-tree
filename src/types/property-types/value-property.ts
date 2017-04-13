import { observable, IObjectWillChange, IObjectChange } from "mobx"
import { Property } from "./property"
import { getMSTAdministration, maybeMST, valueToSnapshot, escapeJsonPath } from "../../core"
import { IType } from "../type"

export class ValueProperty extends Property {
    constructor(propertyName: string, public type: IType<any, any>) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        observable.ref(proto, this.name, { value: undefined })
    }

    initialize(targetInstance: any, snapshot: any) {
        targetInstance[this.name] = this.type.create(snapshot[this.name])
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getMSTAdministration(change.object)
        change.newValue = node.prepareChild(this.name, change.newValue)
        return change
    }

    didChange(change: IObjectChange) {
        const node = getMSTAdministration(change.object)
        node.emitPatch({
            op: "replace",
            path: escapeJsonPath(this.name),
            value: valueToSnapshot(change.newValue)
        }, node)
    }

    serialize(instance: any, snapshot: any) {
        getMSTAdministration(instance).assertAlive()
        snapshot[this.name] = valueToSnapshot(instance[this.name])
    }

    deserialize(instance: any, snapshot: any) {
        maybeMST(
            instance[this.name],
            propertyNode => { propertyNode.applySnapshot(snapshot[this.name]) },
            () => { instance[this.name] = snapshot[this.name] }
        )
    }

    isValidSnapshot(snapshot: any) {
        return this.type.is(snapshot[this.name])
    }
}
