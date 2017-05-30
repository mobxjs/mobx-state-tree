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


//     @computed get get() {
//         const { targetIdAttribute, identifier } = this
//         if (identifier === null)
//             return null
//         if (!this.basePath)
//             return resolve(this.owner, identifier) // generic form
//         else {
//             const targetCollection = resolve(this.owner, this.basePath)
//             if (isObservableArray(targetCollection)) {
//                 return targetCollection.find(item => item && item[targetIdAttribute] === identifier)
//             } else if (isObservableMap(targetCollection)) {
//                 const child = targetCollection.get(identifier)
//                 if (!(!child || child[targetIdAttribute] === identifier)) fail(`Inconsistent collection, the map entry under key '${identifier}' should have property '${targetIdAttribute}' set to value '${identifier}`)
//                 return child
//             } else
//                 return fail("References with base paths should point to either an `array` or `map` collection")
//         }
//     }

//     setNewValue(value: any) {
//         if (!value) {
//             this.identifier = null
//         } else if (isMST(value)) {
//             typecheck(this.type, value)
//             const base = getMSTAdministration(this.owner)
//             const target = getMSTAdministration(value)
//             if (this.targetIdAttribute)
//                 this.identifier = (value as any)[this.targetIdAttribute]
//             else {
//                 if (base.root !== target.root) fail(`Failed to assign a value to a reference; the value should already be part of the same model tree`)
//                 this.identifier = getRelativePathForNodes(base, target)
//             }
//         } else if (this.targetIdAttribute) {
//             if (typeof value !== "string") fail("Expected an identifier, got: " + value)
//             this.identifier = value
//         }
//         else {
//             if (!(typeof value === "object" && typeof value.$ref === "string")) fail("Expected a reference in the format `{ $ref: ... }`, got: " + value)
//             this.identifier = value.$ref
//         }
//     }

//     serialize() {
//         if (this.basePath)
//             return this.identifier
//         return this.identifier ? { $ref: this.identifier } as IReference : null
//     }
// }
