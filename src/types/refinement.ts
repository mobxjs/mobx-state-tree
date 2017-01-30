import {isFactory, IFactory} from "../core/factories"
import {invariant, fail} from "../utils"
import {Type} from "../core/types"

export type IPredicate = (snapshot: any) => boolean

export class Refinement extends Type {
    readonly type: IFactory<any, any>
    readonly predicate: IPredicate

    constructor(name, type: IFactory<any, any>, predicate: IPredicate) {
        super(name)
        this.type = type
        this.predicate = predicate
    }

    describe(){
        return "( " + this.name + " & " + this.factory.type.describe() + " )"
    }

    create(value, environment?) {
        invariant(this.is(value), `Value ${JSON.stringify(value)} is not assignable to type ${this.name}`)

        return this.type(value, environment)
    }

    is(value) {
        return this.type.is(value) && this.predicate(value)
    }
}

export function createRefinementFactory<S, T>(name: string, type: IFactory<S, T>, predicate: IPredicate): IFactory<S, T> {
    return new Refinement(name, type, predicate).factory
}