import { observable, IObjectWillChange, IObjectChange, extras } from "mobx"
import { Property } from "./property"
import { getComplexNode, escapeJsonPath, AbstractNode } from "../../core"
import { IType } from "../type"
import { IContext, IValidationResult, getContextForPath } from "../type-checker"
import { fail } from "../../utils"

function unbox(b: AbstractNode): any {
    return b.getValue()
}

export class ValueProperty extends Property {
    constructor(propertyName: string, public type: IType<any, any>) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        observable.ref(proto, this.name, { value: undefined })
    }

    initialize(targetInstance: any, snapshot: any) {
        const adm = getComplexNode(targetInstance)
        targetInstance[this.name] = this.type.instantiate(adm, this.name, adm._environment, snapshot[this.name])
        extras.getAdministration(targetInstance, this.name).dehancer = unbox
    }

    getValueNode(targetInstance: any): AbstractNode {
        const node = targetInstance.$mobx.values[this.name].value // TODO: blegh!
        if (!node)
            return fail("Node not available")
        return node
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getComplexNode(change.object)
        change.newValue = node.reconcileChildren(this.type, [node.getChildNode(change.name)!], [change.newValue], [change.name])[0]
        return change
    }

    didChange(change: IObjectChange) {
        const node = getComplexNode(change.object)
        node.emitPatch({
            op: "replace",
            path: escapeJsonPath(this.name),
            value: this.getValueNode(change.object).snapshot
        }, node)
    }

    serialize(instance: any, snapshot: any) {
        snapshot[this.name] = this.getValueNode(instance).snapshot
    }

    deserialize(instance: any, snapshot: any) {
        // TODO: was a maybeMST here first...
        instance[this.name] = snapshot[this.name]
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        return this.type.validate(snapshot[this.name], getContextForPath(context, this.name, this.type))
    }
}
