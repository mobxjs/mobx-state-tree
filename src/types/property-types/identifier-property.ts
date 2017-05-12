import { getMSTAdministration } from "../../core"
import { extendObservable, observable, IObjectWillChange } from "mobx"
import { Property } from "./property"
import { isValidIdentifier, fail } from "../../utils"
import { IType } from "../type"
import { typecheck, IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, getContextForPath } from "../type-checker"

export class IdentifierProperty extends Property {
    subtype: IType<any, any>

    constructor(propertyName: string, subtype: IType<any, any>) {
        super(propertyName)
        this.subtype = subtype
    }

    initialize(target: any, snapshot: any) {
        extendObservable(target, {
            [this.name]: observable.ref(snapshot[this.name])
        })
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const identifier = change.newValue
        if (typeof identifier !== "number" && !isValidIdentifier(identifier))
            fail(`Not a valid identifier: '${identifier}`)
        typecheck(this.subtype, identifier)
        const node = getMSTAdministration(change.object)
        node.assertWritable()
        const oldValue = change.object[this.name]
        if (oldValue !== undefined && oldValue !== identifier)
            fail(`It is not allowed to change the identifier of an object, got: '${identifier}' but expected: '${oldValue}'`)

        return change
    }

    serialize(instance: any, snapshot: any) {
        const identifier = instance[this.name]
        if (!this.isValidIdentifier(identifier))
            fail(`Object does not have a valid identifier yet: '${identifier}'`)
        snapshot[this.name] = identifier
    }

    deserialize(instance: any, snapshot: any) {
        instance[this.name] = snapshot[this.name]
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if (!this.isValidIdentifier(snapshot[this.name])) {
            return typeCheckFailure(getContextForPath(context, this.name, this.subtype), snapshot[this.name], "The provided identifier is not valid")
        }

        return typeCheckSuccess()
    }

    isValidIdentifier(identifier: any): boolean {
        if (typeof identifier !== "number" && !isValidIdentifier(identifier))
            return false
        return this.subtype.is(identifier)
    }
}
