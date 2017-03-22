import {isFactory, IFactory} from "../core/factories"
import {invariant, fail} from "../utils"
import {Type} from "../core/types"

export type IFactoryDispatcher = (snapshot: any) => IFactory<any, any>

export class Union extends Type {
    readonly dispatcher: IFactoryDispatcher | null = null
    readonly types: IFactory<any, any>[]

    constructor(name: string, types: IFactory<any, any>[], dispatcher: IFactoryDispatcher | null) {
        super(name)
        this.dispatcher = dispatcher
        this.types = types
    }

    describe() {
        return "(" + this.types.map(factory => factory.type.describe()).join(" | ") + ")"
    }

    create(value: any) {
        invariant(this.is(value), `Value ${JSON.stringify(value)} is not assignable to union ${this.name}`)

        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value)(value)
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value))
        if (applicableTypes.length > 1)
             return fail(`Ambiguos snapshot ${JSON.stringify(value)} for union ${this.name}. Please provide a dispatch in the union declaration.`)

        return applicableTypes[0](value)
    }

    is(value: any) {
        return this.types.some(type => type.is(value))
    }

}

export function createUnionFactory<SA, SB, TA, TB>(dispatch: IFactoryDispatcher, A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>
export function createUnionFactory<SA, SB, TA, TB>(A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>
export function createUnionFactory(dispatchOrType: IFactoryDispatcher | IFactory<any, any>, ...otherTypes: IFactory<any, any>[]): IFactory<any, any> {
    const dispatcher = isFactory(dispatchOrType) ? null : dispatchOrType
    const types = isFactory(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    const name = types.map(type => type.factoryName).join(" | ")
    return new Union(name, types, dispatcher).factory
}