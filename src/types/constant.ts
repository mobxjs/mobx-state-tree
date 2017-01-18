import {isFactory, IFactory} from "../core/factories"
import {invariant, fail, isPrimitive} from "../utils"
import {PrimitiveType} from "./primitive"

export class Constant extends PrimitiveType {
    readonly value: any

    constructor(value: any) {
        super("" + value)
        this.value = value
    }

    describe(){
        return this.value
    }

    is(value) {
        return value === this.value && super.is(value)
    }

}

export function createConstantFactory(value: any): any {
    invariant(isPrimitive(value), 'Constant types can be built only on top of primitives')
    return new Constant(value).factory
}