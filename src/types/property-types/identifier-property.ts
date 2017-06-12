import { getStateTreeNode } from "../../core"
import { ValueProperty } from "./value-property"
import { IType } from "../type"
import { typecheck } from "../type-checker"

export class IdentifierProperty extends ValueProperty {
    subtype: IType<any, any>

    constructor(propertyName: string, subtype: IType<any, any>) {
        super(propertyName, subtype)
        this.subtype = subtype
    }

    initialize(targetInstance: any, snapshot: any) {
        super.initialize(targetInstance, snapshot)
        const node = getStateTreeNode(targetInstance)
        const identifier = snapshot[this.name]
        typecheck(this.subtype, identifier)
        node.identifierAttribute = this.name
    }

    isValidIdentifier(identifier: any): boolean {
        return this.subtype.is(identifier)
    }
}
