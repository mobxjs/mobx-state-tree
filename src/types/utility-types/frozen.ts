import { ISimpleType, TypeFlags, Type } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { fail, isMutable, isSerializable, isPlainObject } from "../../utils"

function freeze(value: any) {
    Object.freeze(value)

    if (isPlainObject(value)) {
        Object.keys(value).forEach(propKey => {
            if (!Object.isFrozen(value[propKey])) {
                freeze(value[propKey])
            }
        })
    }

    return value
}

export class Frozen<T> extends Type<T, T> {
    flags = TypeFlags.Frozen

    constructor() {
        super("frozen")
    }

    describe() {
        return "<any immutable value>"
    }

    create(value: any) {
        if (!isSerializable(value)) fail("Given value should be serializable")
        // deep freeze the object/array
        return isMutable(value) ? freeze(value) : value
    }

    validate(value: any, context: IContext): IValidationResult {
        if (!isSerializable(value)) {
            return typeCheckFailure(context, value)
        }
        return typeCheckSuccess()
    }

    get identifierAttribute() {
        return null
    }
}

export const frozen: ISimpleType<any> = new Frozen()
