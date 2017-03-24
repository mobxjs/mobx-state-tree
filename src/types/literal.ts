import { createDefaultValueFactory } from './with-default';
import {IType} from "../core/type"
import {invariant, isPrimitive} from "../utils"
import {Type} from "../core/type"

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

}

export function createLiteralFactory<S>(value: S): IType<S, S> {
    invariant(isPrimitive(value), `Literal types can be built only on top of primitives`)
    return createDefaultValueFactory(new Literal(value), value)
}