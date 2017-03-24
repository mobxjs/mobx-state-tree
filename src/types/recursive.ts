import {Type} from "../core/types"
import {IFactory} from "../core/factories"

export type IRecursiveDef<S, T> = (type: IFactory<S, T>) => IFactory<any, any>

class Recursive<S, T> extends Type<S, T> {
    readonly type: IFactory<any, any>

    constructor(name: string, def: IRecursiveDef<any, any>) {
        super(name)
        this.type = def(this.factory)
    }

    create(snapshot: any) {
        return this.type.create(snapshot)
    }

    is(thing: any): thing is S | T {
        return this.type.is(thing)
    }

    describe(): string {
        return this.name
    }
}

export function recursive<S, T>(name: string, def: IRecursiveDef<S, T>) {
    return new Recursive(name, def).factory
}