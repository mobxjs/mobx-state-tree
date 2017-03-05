import {IFactory} from "../core/factories"
import {invariant, isPrimitive} from "../utils"
import {Type} from "../core/types"

export class CoreType extends Type {
    readonly checker: (value: any) => boolean

    constructor(name, checker) {
        super(name)
        this.checker = checker
    }

    describe() {
        return this.name
    }

    create(value) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        invariant(this.checker(value), `Value is not assignable to '` + this.name + `'`)
        return value
    }

    is(thing) {
        return isPrimitive(thing) && this.checker(thing)
    }
}

// tslint:disable-next-line:variable-name
export const string: IFactory<string, string> = new CoreType("string", v => typeof v === "string").factory
// tslint:disable-next-line:variable-name
export const number: IFactory<number, number> = new CoreType("number", v => typeof v === "number").factory
// tslint:disable-next-line:variable-name
export const boolean: IFactory<boolean, boolean> = new CoreType("boolean", v => typeof v === "boolean").factory