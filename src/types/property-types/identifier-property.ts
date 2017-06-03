import { getComplexNode } from "../../core"
import { extendObservable, observable, IObjectWillChange } from "mobx"
import { Property } from "./property"
import { ValueProperty } from "./value-property"
import { isValidIdentifier, fail } from "../../utils"
import { IType } from "../type"
import { typecheck, IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, getContextForPath } from "../type-checker"

export class IdentifierProperty extends ValueProperty {
    subtype: IType<any, any>

    constructor(propertyName: string, subtype: IType<any, any>) {
        super(propertyName, subtype)
        this.subtype = subtype
    }

    initialize(targetInstance: any, snapshot: any) {
        // TODO: don't inherit anymore, don't bother creating an observable for identifiers
        // TODO: valuecheck
        super.initialize(targetInstance, snapshot)
        const node = getComplexNode(targetInstance) // TODO: rename getComplexNode => Node
        const identifier = snapshot[this.name]
        if (!isValidIdentifier(identifier))
            fail(`Not a valid identifier: '${identifier}`)
        typecheck(this.subtype, identifier)
        node.identifierAttribute = this.name
    }

    // initialize(target: any, snapshot: any) {
    //     extendObservable(target, {
    //         [this.name]: observable.ref(snapshot[this.name])
    //     })
    // }

    // willChange(change: IObjectWillChange): IObjectWillChange | null {
    //     const identifier = change.newValue
    //     if (typeof identifier !== "number" && !isValidIdentifier(identifier))
    //         fail(`Not a valid identifier: '${identifier}`)
    //     typecheck(this.subtype, identifier)
    //     const node = getComplexNode(change.object)
    //     node.assertWritable()
    //     const oldValue = change.object[this.name]
    //     if (oldValue !== undefined && oldValue !== identifier)
    //         fail(`It is not allowed to change the identifier of an object, got: '${identifier}' but expected: '${oldValue}'`)

    //     return change
    // }

    // serialize(instance: any, snapshot: any) {
    //     const identifier = instance[this.name]
    //     if (!this.isValidIdentifier(identifier))
    //         fail(`Object does not have a valid identifier yet: '${identifier}'`)
    //     snapshot[this.name] = identifier
    // }

    // deserialize(instance: any, snapshot: any) {
    //     instance[this.name] = snapshot[this.name]
    // }

    // validate(snapshot: any, context: IContext): IValidationResult {
    //     if (!this.isValidIdentifier(snapshot[this.name])) {
    //         return typeCheckFailure(getContextForPath(context, this.name, this.subtype), snapshot[this.name], "The provided identifier is not valid")
    //     }

    //     return typeCheckSuccess()
    // }

    isValidIdentifier(identifier: any): boolean {
        // TODO: MWE, I don't think this isValidIdentifier things makes sense.
        // Who are we to decide? Maybe just rule out empty string
        // Making types.identifier(types.refinement(types.string, (v) => coolCheck(v))) work would be great!
        // On the other hand, this avoids problems with json paths, so maybe we should support all identifiers that don't require further escaping?
        if (!isValidIdentifier(identifier))
            return false
        return this.subtype.is(identifier)
    }
}
