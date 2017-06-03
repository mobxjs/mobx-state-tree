import { computed } from "mobx"
import { ISimpleType, TypeFlags, Type, IType, ComplexType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, typecheck } from "../type-checker"
import { isPrimitive, fail } from "../../utils"


export interface IReference {
    $ref: string
}

export type ReferenceSnapshot = string | null | IReference

export class ReferenceType<T> extends Type<ReferenceSnapshot, T> {
    readonly flags = TypeFlags.Reference

    constructor(
        private readonly targetType: IType<any, T>
    ) {
        super(`reference(${targetType.name})`)
    }

    @computed get resolvedValue() {
        return null
    }

    describe() {
        return this.name
    }

    getValue(storedValue: any) {
        return this.resolvedValue
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // TODO: check if reference is valid
        return typeCheckSuccess()
    }
}

// TODO: fix; handle paths deeply to elements with multiple id's in it correctly....
// TODO: fix, references are not mentioned in type.describe...
// TODO: make distinction between nullable and non-nullable refs?
// TODO: verify ref is requird in non-nullable snapshos and vice versa
// TODO support get / set
export function reference<T>(factory: IType<any, T>): IType<{ $ref: string }, T | null>;
export function reference<T>(factory: IType<any, T>): any {
    if (arguments.length === 2 && typeof arguments[1] === "string")
        fail("References with base path are no longer supported. Please remove the base path.")
    // FIXME: IType return type is inconsistent with what is actually returned, however, results in the best type-inference results for objects...
    return new ReferenceType(factory)
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & (TypeFlags.Reference)) > 0
}
