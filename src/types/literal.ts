import { createDefaultValueFactory } from './with-default';
import {IFactory} from "../core/factories"
import {invariant, isPrimitive} from "../utils"
import {Type} from "../core/types"

export class Literal extends Type {
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

    is(value: any) {
        return value === this.value && isPrimitive(value)
    }

}

export function createLiteralFactory<S>(value: S): IFactory<S, S> {
    invariant(isPrimitive(value), `Literal types can be built only on top of primitives`)
    return createDefaultValueFactory(new Literal(value).factory, value)
}