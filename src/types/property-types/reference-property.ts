import { Property } from "./property"
import { addHiddenFinalProp } from "../../utils"
import { getMSTAdministration, escapeJsonPath } from "../../core"
import { IType, IContext, IValidationResult } from "../type"
import { Reference } from "../../core/reference"

export class ReferenceProperty extends Property {
    constructor(propertyName: string, private type: IType<any, any>, private basePath: string) {
        super(propertyName)
    }

    initialize(targetInstance: any, snapshot: any) {
        const ref = new Reference(targetInstance, this.type, this.basePath, snapshot[this.name])
        addHiddenFinalProp(targetInstance, this.name + "$value", ref)
        const self = this
        Object.defineProperty(targetInstance, this.name, {
            get: function() {
                // TODO: factor those functions out to statics
                getMSTAdministration(this).assertAlive() // Expensive for each read, so optimize away in prod builds!
                return ref.get
            },
            set: function(v) {
                const node = getMSTAdministration(this)
                node.assertWritable()
                const baseValue = ref.identifier
                ref.setNewValue(v)
                if (ref.identifier !== baseValue) {
                    node.emitPatch({
                        op: "replace",
                        path: escapeJsonPath(self.name),
                        value: ref.serialize
                    }, node)
                }
            }
        })
        targetInstance[this.name] = snapshot[this.name]
    }

    serialize(instance: any, snapshot: any) {
        snapshot[this.name] = (instance[this.name + "$value"] as Reference).serialize()
    }

    deserialize(instance: any, snapshot: any) {
        (instance[this.name + "$value"] as Reference).setNewValue(snapshot[this.name])
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        // TODO: and check name is string or $ref object
        if (this.name in snapshot) {
            return []
        }
        return [{ snapshot, context: context.concat([ {path: this.name, type: this.type} ]) }]
    }
}
