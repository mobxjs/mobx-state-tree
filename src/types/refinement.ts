import {IType} from "../core/types"
import {invariant} from "../utils"
import {Type} from "../core/types"
import {hasNode, getNode} from "../core/node"

export class Refinement extends Type<any, any> {
    readonly type: IType<any, any>
    readonly predicate: (v: any) => boolean

    constructor(name: string, type: IType<any, any>, predicate: (v: any) => boolean) {
        super(name)
        this.type = type
        this.predicate = predicate
    }

    describe() {
        return this.name
    }

    create(value: any) {
        // create the child type
        const inst = this.type.create(value)
        const snapshot = hasNode(inst) ? getNode(inst).snapshot : inst

        // check if pass the predicate
        invariant(this.is(snapshot), `Value ${JSON.stringify(snapshot)} is not assignable to type ${this.name}`)

        return inst
    }

    is(value: any): value is any {
        return this.type.is(value) && this.predicate(value)
    }
}

export function createRefinementFactory<T>(name: string, type: IType<T, T>, predicate: (snapshot: T) => boolean): IType<T, T>
export function createRefinementFactory<S, T extends S, U extends S>(name: string, type: IType<S, T>, predicate: (snapshot: S) => snapshot is U): IType<S, U>
export function createRefinementFactory(name: string, type: IType<any, any>, predicate: (snapshot: any) => boolean): IType<any, any> {
    // check if the subtype default value passes the predicate
    const inst = type.create()
    invariant(predicate(hasNode(inst) ? getNode(inst).snapshot : inst), `Default value for refinement type ` + name + ` does not pass the predicate.`)

    return new Refinement(name, type, predicate)
}