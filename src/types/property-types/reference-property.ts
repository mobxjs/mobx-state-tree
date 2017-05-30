import { Property } from "./property"
import { addHiddenFinalProp } from "../../utils"
import { getComplexNode, escapeJsonPath } from "../../core"
import { IType } from "../type"
// import { Reference } from "../../core/reference"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, getContextForPath } from "../type-checker"

export class ReferenceProperty extends Property {
    constructor(propertyName: string, private type: IType<any, any>, private basePath: string) {
        super(propertyName)
    }

    initialize(targetInstance: any, snapshot: any) {
        // TODO
        // const ref = new Reference(targetInstance, this.type, this.basePath, snapshot[this.name])
        // addHiddenFinalProp(targetInstance, this.name + "$value", ref)
        // const self = this
        // Object.defineProperty(targetInstance, this.name, {
        //     get: function() {
        //         // TODO: factor those functions out to statics
        //         getMSTAdministration(this).assertAlive() // Expensive for each read, so optimize away in prod builds!
        //         return ref.get
        //     },
        //     set: function(v) {
        //         const node = getMSTAdministration(this)
        //         node.assertWritable()
        //         const baseValue = ref.identifier
        //         ref.setNewValue(v)
        //         if (ref.identifier !== baseValue) {
        //             node.emitPatch({
        //                 op: "replace",
        //                 path: escapeJsonPath(self.name),
        //                 value: ref.serialize
        //             }, node)
        //         }
        //     }
        // })
        // targetInstance[this.name] = snapshot[this.name]
    }

    serialize(instance: any, snapshot: any) {
        // snapshot[this.name] = (instance[this.name + "$value"] as Reference).serialize()
    }

    deserialize(instance: any, snapshot: any) {
        // (instance[this.name + "$value"] as Reference).setNewValue(snapshot[this.name])
    }

    validate(value: any, context: IContext): IValidationResult {
        // TODO: and check name is string or $ref object
        if (this.name in value) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(getContextForPath(context, this.name, this.type), undefined, "Reference is required.")
    }
}
