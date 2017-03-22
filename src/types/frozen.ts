import {IFactory} from "../core/factories"
import {invariant, isMutable, isSerializable, isPlainObject} from "../utils"
import {Type} from "../core/types"

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

export class Frozen extends Type {

    constructor() {
        super("frozen")
    }

    describe() {
        return "frozen"
    }

    create(value: any) {
        invariant(isSerializable(value), "Given value should be serializable")
        // deep freeze the object/array
        return isMutable(value) ? freeze(value) : value
    }

    is(value: any) {
        return isSerializable(value)
    }

}

export const frozen: IFactory<any, any> = new Frozen().factory