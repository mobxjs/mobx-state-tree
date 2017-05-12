import { observable, IObjectWillChange, IObjectChange } from "mobx"
import { Property } from "./property"
import { getMSTAdministration, maybeMST, valueToSnapshot, escapeJsonPath } from "../../core"
import { IType } from "../type"
import { IContext, IValidationResult, getContextForPath } from "../type-checker"

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
        change.newValue = node.reconcileChildren(this.type, [change.object[change.name]], [change.newValue], [change.name])[0]
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
        snapshot[this.name] = valueToSnapshot(instance[this.name])
    }

    deserialize(instance: any, snapshot: any) {
        maybeMST(
            instance[this.name],
            propertyNode => { propertyNode.applySnapshot(snapshot[this.name]) },
            () => { instance[this.name] = snapshot[this.name] }
        )
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        return this.type.validate(snapshot[this.name], getContextForPath(context, this.name, this.type))
    }
}
