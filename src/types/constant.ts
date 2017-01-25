import {isFactory, IFactory} from "../core/factories"
import {invariant, fail, isPrimitive} from "../utils"
import {Type} from "../core/types"

export class Constant extends Type {
    readonly value: any

    constructor(value: any) {
        super("" + value)
        this.value = value
    }

    create(value) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        return value
    }

    describe(){
        return JSON.stringify(this.value)
    }

    is(value) {
        return value === this.value && isPrimitive(value)
    }

}

export function createConstantFactory(value: any): any {
    invariant(isPrimitive(value), 'Constant types can be built only on top of primitives')
    return new Constant(value).factory
}