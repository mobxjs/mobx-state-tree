import { ISimpleType, Type, typecheck } from "../type"
import { invariant, isPrimitive } from "../../utils"

export class Literal<T> extends Type<T, T> {
    readonly value: any

    constructor(value: any) {
        super("" + value)
        this.value = value
    }

    create(snapshot: any) {
        typecheck(this, snapshot)
        return this.value
    }

    describe() {
        return JSON.stringify(this.value)
    }

    is(value: any): value is T {
        return value === this.value && isPrimitive(value)
    }

    get identifierAttribute() {
        return null
    }
}

export function literal<S>(value: S): ISimpleType<S> {
    invariant(isPrimitive(value), `Literal types can be built only on top of primitives`)
    return new Literal<S>(value)
}
