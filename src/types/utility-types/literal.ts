import { createDefaultValueFactory } from "./with-default"
import { ISimpleType, Type } from "../type"
import { invariant, isPrimitive } from "../../utils"

export class Literal<T> extends Type<T, T> {
    readonly value: any

    constructor(value: any) {
        super("" + value)
        this.value = value
    }

    create() {
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

export function createLiteralFactory<S>(value: S): ISimpleType<S> {
    invariant(isPrimitive(value), `Literal types can be built only on top of primitives`)
    return createDefaultValueFactory(new Literal<S>(value), value)
}
