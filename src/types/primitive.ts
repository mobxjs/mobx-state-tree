import {IFactory} from "../core/factories"
import {invariant, isPrimitive} from "../utils"
import {Type} from "../core/types"

export class PrimitiveType extends Type {
    name: string

    describe() {
        return "primitive"
    }

    create(value: any) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        return value
    }

    is(thing: any) {
        return isPrimitive(thing)
    }

    // TODO:
    // subType<T>(name: predicate: (value) => boolean): IModelFactory<T, T> {

    // }
}

export type IPrimitive = string | boolean | number | Date
export const primitiveFactory: IFactory<IPrimitive, IPrimitive> = new PrimitiveType("primitive").factory

// TODO:
// export const String = primitiveFactory.subType("String", t => typeof t === "string")