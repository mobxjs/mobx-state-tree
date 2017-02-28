import {IFactory} from "../core/factories"
import {invariant, isPrimitive} from "../utils"
import {Type} from "../core/types"

export class CoreType extends Type {
    readonly checker: (value: any) => boolean

    constructor(name, checker){
        super(name)
        this.checker = checker
    }

    describe(){
        return this.name
    }

    create(value) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        invariant(this.checker(value), 'Value is not assignable to ' + this.name)
        return value
    }

    is(thing) {
        return isPrimitive(thing) && this.checker(thing)
    }
}

export const string = new CoreType("string", v => typeof v === 'string').factory
export const number = new CoreType("number", v => typeof v === 'number').factory
export const boolean = new CoreType("boolean", v => typeof v === 'boolean').factory