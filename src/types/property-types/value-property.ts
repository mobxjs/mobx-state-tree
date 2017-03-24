import { observable, IObjectWillChange, IObjectChange } from "mobx"
import { Property } from "./property"
import { getNode, maybeNode, valueToSnapshot } from "../../core/node"
import { IFactory } from "../../core/factories"
import { escapeJsonPath } from "../../core/json-patch"

export class ValueProperty extends Property {
    constructor(propertyName: string, public factory: IFactory<any, any>) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        observable.ref(proto, this.name, { value: undefined })
    }

    initialize(targetInstance: any) {
        targetInstance[this.name] = this.factory.create()
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getNode(change.object)
        const oldValue = change.object[this.name]

        // TODO check type
        // TODO: check if tree is editable
        maybeNode(oldValue, adm => adm.setParent(null))
        change.newValue = node.prepareChild(this.name, change.newValue)
        return change
    }

    didChange(change: IObjectChange) {
        const node = getNode(change.object)
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
        maybeNode(
            instance[this.name],
            propertyNode => { propertyNode.applySnapshot(snapshot[this.name]) },
            () => { instance[this.name] = snapshot[this.name] }
        )
    }

    isValidSnapshot(snapshot: any) {
        return this.factory.is(snapshot[this.name])
    }
}
