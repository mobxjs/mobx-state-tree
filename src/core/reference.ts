import { isObservableArray, isObservableMap, observable, computed } from "mobx"
import { getMSTAdministration, getRelativePathForNodes, isMST, IMSTNode } from "./mst-node"
import { fail } from "../utils"
import { getIdentifierAttribute } from "../types/complex-types/object"
import { IType } from "../types/type"
import { typecheck } from "../types/type-checker"
import { resolve } from "./mst-operations"

export interface IReference {
    $ref: string
}

export class Reference {
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
                if (!(!child || child[targetIdAttribute] === identifier)) fail(`Inconsistent collection, the map entry under key '${identifier}' should have property '${targetIdAttribute}' set to value '${identifier}`)
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
            if (this.targetIdAttribute)
                this.identifier = (value as any)[this.targetIdAttribute]
            else {
                if (base.root !== target.root) fail(`Failed to assign a value to a reference; the value should already be part of the same model tree`)
                this.identifier = getRelativePathForNodes(base, target)
            }
        } else if (this.targetIdAttribute) {
            if (typeof value !== "string") fail("Expected an identifier, got: " + value)
            this.identifier = value
        }
        else {
            if (!(typeof value === "object" && typeof value.$ref === "string")) fail("Expected a reference in the format `{ $ref: ... }`, got: " + value)
            this.identifier = value.$ref
        }
    }

    serialize() {
        if (this.basePath)
            return this.identifier
        return this.identifier ? { $ref: this.identifier } as IReference : null
    }
}
