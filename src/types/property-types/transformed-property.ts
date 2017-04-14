import { Property } from "./property"
import { addHiddenFinalProp, addHiddenWritableProp } from '../../utils';
import { MSTAdminisration } from "../../core/mst-node-administration"
import { isObservableArray, isObservableMap, observable, computed } from "mobx"
import { resolve, getMSTAdministration, getRelativePathForNodes, isMST, IMSTNode, escapeJsonPath } from "../../core"
import { invariant, fail } from "../../utils"
import { getIdentifierAttribute } from "../complex-types/object"
import { IType, typecheck } from "../type"

export interface IReference {
    $ref: string
}

// TODO: rename file to reference property

class Reference {
    private targetIdAttribute: string
    @observable public identifier: string | null = null

    constructor(
        private owner: IMSTNode, // TODO: mst MSTAdminisration instead of node
        private type: IType<any, any>,
        private basePath: string,
        identifier: string
    ) {
        if (basePath) {
            this.targetIdAttribute = getIdentifierAttribute(type) || ""
            if (!this.targetIdAttribute)
                return fail(`Cannot create reference to path '${basePath}'; the targeted type, ${type.describe()}, does not specify an identifier property`)
        }
        this.setNewValue(identifier)
    }

    @computed get get() {
        debugger;
        const { targetIdAttribute, identifier } = this
        if (identifier === null)
            return null
        if (!this.basePath)
            return resolve(this.owner, identifier) // generic form
        else {
            const targetCollection = resolve(this.owner, this.basePath)
            if (isObservableArray(targetCollection)) {
                return targetCollection.find(item => item && item[targetIdAttribute] === identifier)
            } else if (isObservableMap(targetCollection)) {
                const child = targetCollection.get(identifier)
                invariant(!child || child[targetIdAttribute] === identifier, `Inconsistent collection, the map entry under key '${identifier}' should have property '${targetIdAttribute}' set to value '${identifier}`)
                return child
            } else
                return fail("References with base paths should point to either an `array` or `map` collection")
        }
    }

    setNewValue(value: any) {
        if (!value) {
            this.identifier = null
        } else if (isMST(value)) {
            typecheck(this.type, value)
            const base = getMSTAdministration(this.owner)
            const target = getMSTAdministration(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            if (this.targetIdAttribute)
                this.identifier = (value as any)[this.targetIdAttribute]
            else
                this.identifier = getRelativePathForNodes(base, target)
        } else if (this.targetIdAttribute) {
            invariant(typeof value === "string", "Expected an identifier, got: " + value)
            this.identifier = value
        }
        else {
            invariant(typeof value === "object" && typeof value.$ref === "string", "Expected a reference in the format `{ $ref: ... }`, got: " + value)
            this.identifier = value.$ref
        }
    }

    serialize() {
        if (this.basePath)
            return this.identifier
        return this.identifier ? { $ref: this.identifier } as IReference : null
    }
}

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

    isValidSnapshot(snapshot: any) {
        // TODO: and check name is string or $ref object
        return this.name in snapshot
    }
}
