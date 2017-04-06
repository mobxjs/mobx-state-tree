import {Type} from "../core/type"
import {ISimpleType} from "../core/type"
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
}

export type IPrimitive = string | boolean | number | Date

export type IPrimitiveFactory<T extends IPrimitive> = ISimpleType<T>

export const primitiveFactory: IPrimitiveFactory<any> = new PrimitiveType("primitive")
