import {isType, IType, Type} from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure, getContextForPath } from "../type-checker"
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
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
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

export function union<SA, SB, SC, TA, TB, TC>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>): IType<SA | SB | SC, TA | TB | TC>
export function union<SA, SB, SC, TA, TB, TC>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>): IType<SA | SB | SC, TA | TB | TC>

export function union<SA, SB, SC, SD, TA, TB, TC, TD>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>): IType<SA | SB | SC | SD, TA | TB | TC | TD>
export function union<SA, SB, SC, SD, TA, TB, TC, TD>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>): IType<SA | SB | SC | SD, TA | TB | TC | TD>

export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>

export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>

export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>

export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>

export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>, I: IType<SI, TI>): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>, I: IType<SI, TI>): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>

export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, SJ, TA, TB, TC, TD, TE, TF, TG, TH, TI, TJ>(dispatch: ITypeDispatcher, A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>, I: IType<SI, TI>, J: IType<SJ, TJ>): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ, TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ>
export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, SJ, TA, TB, TC, TD, TE, TF, TG, TH, TI, TJ>(A: IType<SA, TA>, B: IType<SB, TB>, C: IType<SC, TC>, D: IType<SD, TD>, E: IType<SE, TE>, F: IType<SF, TF>, G: IType<SG, TG>, H: IType<SH, TH>, I: IType<SI, TI>, J: IType<SJ, TJ>): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ, TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ>

export function union(dispatchOrType: ITypeDispatcher | IType<any, any>, ...otherTypes: IType<any, any>[]): IType<any, any>

export function union(dispatchOrType: ITypeDispatcher | IType<any, any>, ...otherTypes: IType<any, any>[]): IType<any, any> {
    const dispatcher = isType(dispatchOrType) ? null : dispatchOrType
    const types = isType(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    const name = types.map(type => type.name).join(" | ")
    return new Union(name, types, dispatcher)
}