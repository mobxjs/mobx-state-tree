import {isFactory, IFactory} from "../core/factories"
import {hasNode, getNode} from "../core/node"
import {invariant, fail, isMutable, isSerializable, isPlainObject} from "../utils"
import {Type} from "../core/types"

function freeze(value){
    Object.freeze(value)

    if(isPlainObject(value)){
        Object.keys(value).forEach(propKey => {
            if (!Object.isFrozen(value[propKey])) {
                freeze(value[propKey])
            }
        })
    }

    return value
}

export class Frozen extends Type {

    constructor(){
        super("frozen")
    }

    describe(){
        return "frozen"
    }

    create(value, environment?) {
        invariant(isSerializable(value), 'Given value should be serializable')
        // deep freeze the object/array
        return isMutable(value) ? freeze(value) : value
    }

    is(value) {
        return isSerializable(value)
    }

}

export const frozen = new Frozen().factory