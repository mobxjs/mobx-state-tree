import { IType, Type } from "../type"

export type IRecursiveDef<S, T> = (type: IType<S, T>) => IType<any, any>

class Recursive<S, T> extends Type<S, T> {
    readonly type: IType<any, any>

    constructor(name: string, def: IRecursiveDef<any, any>) {
        super(name)
        this.type = def(this.type)
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
    return new Recursive(name, def).type
}
