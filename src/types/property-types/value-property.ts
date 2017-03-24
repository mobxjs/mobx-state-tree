import { observable, IObjectWillChange, IObjectChange } from "mobx"
import { Property } from "./property"
import { getMST, maybeMST, valueToSnapshot, IType, escapeJsonPath } from "../../core"

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
        const node = getMST(change.object)
        const oldValue = change.object[this.name]

        // TODO check type
        // TODO: check if tree is editable
        maybeMST(oldValue, adm => adm.setParent(null))
        change.newValue = node.prepareChild(this.name, change.newValue)
        return change
    }

    didChange(change: IObjectChange) {
        const node = getMST(change.object)
        node.emitPatch({
            op: "replace",
            path: "/" + escapeJsonPath(this.name),
            value: valueToSnapshot(change.newValue)
        }, node)
    }

    serialize(instance: any, snapshot: any) {
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
