import { ISimpleType, IContext, IValidationResult, Type } from "../type"
import { invariant, isMutable, isSerializable, isPlainObject } from "../../utils"

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

    constructor() {
        super("frozen")
    }

    describe() {
        return "<any immutable value>"
    }

    create(value: any) {
        invariant(isSerializable(value), "Given value should be serializable")
        // deep freeze the object/array
        return isMutable(value) ? freeze(value) : value
    }

    validate(snapshot: any, context: IContext): IValidationResult {
        if (!isSerializable(snapshot)) {
            return [ {snapshot, context} ]
        }
        return []
    }

    get identifierAttribute() {
        return null
    }
}

export const frozen: ISimpleType<any> = new Frozen()
