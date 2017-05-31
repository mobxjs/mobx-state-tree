import { ISimpleType, TypeFlags, Type } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { fail, isMutable, isSerializable, isPlainObject } from "../../utils"
import { Node } from '../../core'

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

    instantiate(parent: Node, subpath: string, environment: any, value: any): Node {
        if (!isSerializable(value)) fail("Given value should be serializable")
        // deep freeze the object/array
        return new Node(this, parent, subpath, environment, isMutable(value) ? freeze(value) : value)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
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
