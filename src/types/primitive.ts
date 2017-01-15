import {IModelFactory, ConcreteType} from "../core/factories"
import {invariant, isPrimitive, extend, fail} from "../utils"
import {Node} from "../core/node"

// TODO: inherited for specific primitive types
export class PrimitiveType extends ConcreteType {
    name: string

    create(value) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        return value
    }

    is(thing) {
        return isPrimitive(thing)
    }

    // TODO:
    // subType<T>(name: predicate: (value) => boolean): IModelFactory<T, T> {

    // }
}

export const primitiveFactory = new PrimitiveType("primitive").factory

// TODO:
// export const String = primitiveFactory.subType("String", t => typeof t === "string")