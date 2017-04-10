import { ISimpleType, Type } from "../core";
import {invariant, isMutable, isSerializable, isPlainObject} from "../utils"

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

    is(value: any): value is T {
        return isSerializable(value)
    }

}

export const frozen: ISimpleType<any> = new Frozen()