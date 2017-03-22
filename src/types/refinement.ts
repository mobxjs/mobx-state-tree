import {IFactory} from "../core/factories"
import {invariant} from "../utils"
import {Type} from "../core/types"
import {hasNode, getNode} from "../core/node"

export type IPredicate = (snapshot: any) => boolean

export class Refinement extends Type {
    readonly type: IFactory<any, any>
    readonly predicate: IPredicate

    constructor(name: any, type: IFactory<any, any>, predicate: IPredicate) {
        super(name)
        this.type = type
        this.predicate = predicate
    }

    describe() {
        return this.name
    }

    create(value: any, environment?: any) {
        // create the child type
        const inst = this.type(value, environment)
        const snapshot = hasNode(inst) ? getNode(inst).snapshot : inst

        // check if pass the predicate
        invariant(this.is(snapshot), `Value ${JSON.stringify(snapshot)} is not assignable to type ${this.name}`)

        return inst
    }

    is(value: any) {
        return this.type.is(value) && this.predicate(value)
    }
}

export function createRefinementFactory<S, T>(name: string, type: IFactory<S, T>, predicate: IPredicate): IFactory<S, T> {
    // check if the subtype default value passes the predicate
    const inst = type()
    invariant(predicate(hasNode(inst) ? getNode(inst).snapshot : inst), `Default value for refinement type ` + name + ` does not pass the predicate.`)

    return new Refinement(name, type, predicate).factory
}