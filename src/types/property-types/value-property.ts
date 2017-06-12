import { observable, IObjectWillChange, IObjectChange, extras } from "mobx"
import { Property } from "./property"
import { getStateTreeNode, escapeJsonPath, Node } from "../../core"
import { IType } from "../type"
import { IContext, IValidationResult, getContextForPath, typecheck } from "../type-checker"
import { fail } from "../../utils"
import { literal } from "../utility-types/literal"

const undefinedType = literal(undefined)

export class ValueProperty extends Property {
    constructor(propertyName: string, public type: IType<any, any>) {
        super(propertyName)
    }

    initializePrototype(proto: any) {
        observable.ref(proto, this.name, { value: undefinedType.instantiate(null, "", null, undefined) }) // TODO: undefined type should not be needed
    }

    initialize(instance: any, snapshot: any) {
        const node = getStateTreeNode(instance)
        instance[this.name] = this.type.instantiate(node, this.name, node._environment, snapshot[this.name])
        extras.interceptReads(instance, this.name, node.unbox)
    }

    getValueNode(targetInstance: any): Node {
        const node = targetInstance.$mobx.values[this.name].value // TODO: blegh!
        if (!node)
            return fail("Node not available for property " + this.name)
        return node
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getStateTreeNode(change.object) // TODO: pass node in from object property
        typecheck(this.type, change.newValue)
        change.newValue = this.type.reconcile(node.getChildNode(change.name), change.newValue)
        return change
    }

    didChange(change: IObjectChange) {
        const node = getStateTreeNode(change.object)
        node.emitPatch({
            op: "replace",
            path: escapeJsonPath(this.name),
            value: this.getValueNode(change.object).snapshot
        }, node)
    }

    serialize(instance: any, snapshot: any) {
        if (this.getValueNode(instance).type.snapshottable) {
            // TODO: FIXME, make sure the observable ref is used!
            (extras.getAtom(instance, this.name) as any).reportObserved()

            snapshot[this.name] = this.getValueNode(instance).snapshot
        }
    }

    deserialize(instance: any, snapshot: any) {
        // TODO: was a maybeMST here first...
        instance[this.name] = snapshot[this.name]
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        return this.type.validate(snapshot[this.name], getContextForPath(context, this.name, this.type))
    }
}
