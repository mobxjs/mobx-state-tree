import { IType, Type } from "../type"
import { isType, TypeFlags } from "../type-flags"
import {
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    flattenTypeErrors
} from "../type-checker"
import { fail } from "../../utils"
import { Node } from "../../core"

export type ITypeDispatcher = (snapshot: any) => IType<any, any>

export class Union extends Type<any, any> {
    readonly dispatcher: ITypeDispatcher | null = null
    readonly types: IType<any, any>[]

    get flags() {
        let result: TypeFlags = TypeFlags.Union

        this.types.forEach(type => {
            result |= type.flags
        })

        return result
    }

    constructor(name: string, types: IType<any, any>[], dispatcher: ITypeDispatcher | null) {
        super(name)
        this.dispatcher = dispatcher
        this.types = types
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.types.some(subType => subType.isAssignableFrom(type))
    }

    describe() {
        return "(" + this.types.map(factory => factory.describe()).join(" | ") + ")"
    }

    instantiate(parent: Node, subpath: string, environment: any, value: any): Node {
        return this.determineType(value).instantiate(parent, subpath, environment, value)
    }

    reconcile(current: Node, newValue: any): Node {
        return this.determineType(newValue).reconcile(current, newValue)
    }

    determineType(value: any): IType<any, any> {
        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value)
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value))
        if (applicableTypes.length > 1)
            return fail(
                `Ambiguos snapshot ${JSON.stringify(value)} for union ${this
                    .name}. Please provide a dispatch in the union declaration.`
            )

        return applicableTypes[0]
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (this.dispatcher !== null) {
            return this.dispatcher(value).validate(value, context)
        }

        const errors = this.types.map(type => type.validate(value, context))
        const applicableTypes = errors.filter(errorArray => errorArray.length === 0)

        if (applicableTypes.length > 1) {
            return typeCheckFailure(
                context,
                value,
                "Multiple types are applicable for the union (hint: provide a dispatch function)"
            )
        } else if (applicableTypes.length === 0) {
            return typeCheckFailure(context, value, "No type is applicable for the union").concat(
                flattenTypeErrors(errors)
            )
        }

        return typeCheckSuccess()
    }
}

export function union<SA, SB, TA, TB>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>
): IType<SA | SB, TA | TB>
export function union<SA, SB, TA, TB>(A: IType<SA, TA>, B: IType<SB, TB>): IType<SA | SB, TA | TB>

export function union<SA, SB, SC, TA, TB, TC>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
): IType<SA | SB | SC, TA | TB | TC>
export function union<SA, SB, SC, TA, TB, TC>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
): IType<SA | SB | SC, TA | TB | TC>

export function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
): IType<SA | SB | SC | SD, TA | TB | TC | TD>
export function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
): IType<SA | SB | SC | SD, TA | TB | TC | TD>

export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>

export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>
): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>
): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>

export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>
): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>
): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>

export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>
): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>
): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>

export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>
): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>
): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>

export function union<
    SA,
    SB,
    SC,
    SD,
    SE,
    SF,
    SG,
    SH,
    SI,
    SJ,
    TA,
    TB,
    TC,
    TD,
    TE,
    TF,
    TG,
    TH,
    TI,
    TJ
>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>,
    J: IType<SJ, TJ>
): IType<
    SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ,
    TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ
>
export function union<
    SA,
    SB,
    SC,
    SD,
    SE,
    SF,
    SG,
    SH,
    SI,
    SJ,
    TA,
    TB,
    TC,
    TD,
    TE,
    TF,
    TG,
    TH,
    TI,
    TJ
>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>,
    J: IType<SJ, TJ>
): IType<
    SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ,
    TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ
>

export function union(...types: IType<any, any>[]): IType<any, any>
export function union(
    dispatchOrType: ITypeDispatcher | IType<any, any>,
    ...otherTypes: IType<any, any>[]
): IType<any, any>

/**
 * types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.
 *
 * @export
 * @alias types.union
 * @param {(ITypeDispatcher | IType<any, any>)} dispatchOrType
 * @param {...IType<any, any>[]} otherTypes
 * @returns {IType<any, any>}
 */
export function union(
    dispatchOrType: ITypeDispatcher | IType<any, any>,
    ...otherTypes: IType<any, any>[]
): IType<any, any> {
    const dispatcher = isType(dispatchOrType) ? null : dispatchOrType
    const types = isType(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    const name = "(" + types.map(type => type.name).join(" | ") + ")"

    // check all options
    if (process.env.NODE_ENV !== "production") {
        types.forEach(type => {
            if (!isType(type))
                fail(
                    "expected all possible types to be a mobx-state-tree type, got " +
                        type +
                        " instead"
                )
        })
    }
    return new Union(name, types, dispatcher)
}
