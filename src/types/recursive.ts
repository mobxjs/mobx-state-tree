import {Type} from "../core/types"
import {IFactory} from "../core/factories"

export type IRecursiveDef<S, T> = (type: IFactory<S, T>) => IFactory<any, any>

class Recursive extends Type {
    readonly type: IFactory<any, any>

    constructor(name: string, def: IRecursiveDef<any, any>) {
        super(name)
        this.type = def(this.factory)
    }

    create(snapshot) {
        return this.type(snapshot)
    }

    is(thing: any): boolean {
        return this.type.is(thing)
    }

    describe(): string {
        return this.name
    }
}

export function recursive<S, T>(name: string, def: IRecursiveDef<S, T>) {
    return new Recursive(name, def).factory
}