import {isType, IType, IContext, IValidationResult, Type} from "../type"
import {invariant, fail} from "../../utils"

export type ITypeDispatcher = (snapshot: any) => IType<any, any>

export class Union extends Type<any, any> {
    readonly dispatcher: ITypeDispatcher | null = null
    readonly types: IType<any, any>[]

    constructor(name: string, types: IType<any, any>[], dispatcher: ITypeDispatcher | null) {
        super(name)
        this.dispatcher = dispatcher
        this.types = types
    }

    describe() {
        return "(" + this.types.map(factory => factory.describe()).join(" | ") + ")"
    }

    create(value: any) {
        invariant(this.is(value), `Value ${JSON.stringify(value)} is not assignable to union ${this.name}`)

        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value).create(value)
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value))
        if (applicableTypes.length > 1)
             return fail(`Ambiguos snapshot ${JSON.stringify(value)} for union ${this.name}. Please provide a dispatch in the union declaration.`)

        return applicableTypes[0].create(value)
    }

    validate(value: any, context: IContext): IValidationResult {
        if (this.types.some(type => type.is(value))) {
            return []
        }
        return [{ value, context }]
    }

    get identifierAttribute() {
        const identifier0 = this.types[0].identifierAttribute
        if (identifier0 && this.types.every(type => type.identifierAttribute === identifier0))
            return identifier0
        return null
    }
}

export function union<SA, SB, TA, TB>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>): IType<SA | SB, TA | TB>
export function union<SA, SB, TA, TB>(A: IType<SA, TA>, B: IType<SB, TB>): IType<SA | SB, TA | TB>
export function union(dispatchOrType: ITypeDispatcher | IType<any, any>, ...otherTypes: IType<any, any>[]): IType<any, any> {
    const dispatcher = isType(dispatchOrType) ? null : dispatchOrType
    const types = isType(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    const name = types.map(type => type.name).join(" | ")
    return new Union(name, types, dispatcher)
}