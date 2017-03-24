import {Type} from "../core/types"
import {IType} from "../core/types"
import {invariant, isPrimitive} from "../utils"

export class PrimitiveType<T> extends Type<T, T> {
    name: string

    describe() {
        return "primitive"
    }

    create(value: any) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        return value
    }

    is(thing: any): thing is T {
        return isPrimitive(thing)
    }

    // TODO:
    // subType<T>(name: predicate: (value) => boolean): IModelFactory<T, T> {

    // }
}

export type IPrimitive = string | boolean | number | Date

export type IPrimitiveFactory<T extends IPrimitive> = IType<T, T>

export const primitiveFactory: IPrimitiveFactory<any> = new PrimitiveType("primitive")

// TODO:
// export const String = primitiveFactory.subType("String", t => typeof t === "string")