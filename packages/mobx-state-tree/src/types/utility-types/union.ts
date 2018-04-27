import {
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    flattenTypeErrors,
    isType,
    TypeFlags,
    IType,
    Type,
    INode,
    fail,
    IAnyType
} from "../../internal"

export type ITypeDispatcher = (snapshot: any) => IAnyType

export class Union extends Type<any, any, any> {
    readonly dispatcher: ITypeDispatcher | null = null
    readonly types: IAnyType[]

    get flags() {
        let result: TypeFlags = TypeFlags.Union

        this.types.forEach(type => {
            result |= type.flags
        })

        return result
    }

    get shouldAttachNode() {
        return this.types.some(type => type.shouldAttachNode)
    }

    constructor(name: string, types: IAnyType[], dispatcher: ITypeDispatcher | null) {
        super(name)
        this.dispatcher = dispatcher
        this.types = types
    }

    isAssignableFrom(type: IAnyType) {
        return this.types.some(subType => subType.isAssignableFrom(type))
    }

    describe() {
        return "(" + this.types.map(factory => factory.describe()).join(" | ") + ")"
    }

    instantiate(parent: INode, subpath: string, environment: any, value: any): INode {
        return this.determineType(value).instantiate(parent, subpath, environment, value)
    }

    reconcile(current: INode, newValue: any): INode {
        return this.determineType(newValue).reconcile(current, newValue)
    }

    determineType(value: any): IAnyType {
        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value)
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value))
        if (applicableTypes.length > 1)
            return fail(
                `Ambiguos snapshot ${JSON.stringify(value)} for union ${
                    this.name
                }. Please provide a dispatch in the union declaration.`
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

// Generator for the union types:
// const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
// let str = ""
// function withChars(amount: number, fn: (char: string) => string): string[] {
//     return alfa
//         .substr(0, amount)
//         .split("")
//         .map(fn)
// }
// function getNames(char: string) {
//     return `C${char}, S${char}, T${char}`
// }
// for (let i = 2; i < 10; i++) {
//     str += `
// export function union<${withChars(i, getNames).join(", ")}>(
//     dispatch: ITypeDispatcher,
//     ${withChars(i, char => `${char}: IType<${getNames(char)}>`).join(",\n")}
// ): IType<${withChars(i, char => "C" + char).join(" | ")}, ${withChars(i, char => "S" + char).join(
//         " | "
//     )}, ${withChars(i, char => "T" + char).join(" | ")}>
// export function union<${withChars(i, getNames).join(", ")}>(
//     ${withChars(i, char => `${char}: IType<${getNames(char)}>`).join(",\n")}
// ): IType<${withChars(i, char => "C" + char).join(" | ")}, ${withChars(i, char => "S" + char).join(
//         " | "
//     )}, ${withChars(i, char => "T" + char).join(" | ")}>
// `
// }
// console.log(str)
export function union<CA, SA, TA, CB, SB, TB>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>
): IType<CA | CB, SA | SB, TA | TB>
export function union<CA, SA, TA, CB, SB, TB>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>
): IType<CA | CB, SA | SB, TA | TB>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>
): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>
): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>
): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>
): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>
): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>
): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>
): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>
): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG
>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>
): IType<
    CA | CB | CC | CD | CE | CF | CG,
    SA | SB | SC | SD | SE | SF | SG,
    TA | TB | TC | TD | TE | TF | TG
>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG
>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>
): IType<
    CA | CB | CC | CD | CE | CF | CG,
    SA | SB | SC | SD | SE | SF | SG,
    TA | TB | TC | TD | TE | TF | TG
>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG,
    CH,
    SH,
    TH
>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>,
    H: IType<CH, SH, TH>
): IType<
    CA | CB | CC | CD | CE | CF | CG | CH,
    SA | SB | SC | SD | SE | SF | SG | SH,
    TA | TB | TC | TD | TE | TF | TG | TH
>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG,
    CH,
    SH,
    TH
>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>,
    H: IType<CH, SH, TH>
): IType<
    CA | CB | CC | CD | CE | CF | CG | CH,
    SA | SB | SC | SD | SE | SF | SG | SH,
    TA | TB | TC | TD | TE | TF | TG | TH
>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG,
    CH,
    SH,
    TH,
    CI,
    SI,
    TI
>(
    dispatch: ITypeDispatcher,
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>,
    H: IType<CH, SH, TH>,
    I: IType<CI, SI, TI>
): IType<
    CA | CB | CC | CD | CE | CF | CG | CH | CI,
    SA | SB | SC | SD | SE | SF | SG | SH | SI,
    TA | TB | TC | TD | TE | TF | TG | TH | TI
>
export function union<
    CA,
    SA,
    TA,
    CB,
    SB,
    TB,
    CC,
    SC,
    TC,
    CD,
    SD,
    TD,
    CE,
    SE,
    TE,
    CF,
    SF,
    TF,
    CG,
    SG,
    TG,
    CH,
    SH,
    TH,
    CI,
    SI,
    TI
>(
    A: IType<CA, SA, TA>,
    B: IType<CB, SB, TB>,
    C: IType<CC, SC, TC>,
    D: IType<CD, SD, TD>,
    E: IType<CE, SE, TE>,
    F: IType<CF, SF, TF>,
    G: IType<CG, SG, TG>,
    H: IType<CH, SH, TH>,
    I: IType<CI, SI, TI>
): IType<
    CA | CB | CC | CD | CE | CF | CG | CH | CI,
    SA | SB | SC | SD | SE | SF | SG | SH | SI,
    TA | TB | TC | TD | TE | TF | TG | TH | TI
>
export function union(...types: IAnyType[]): IAnyType
export function union(
    dispatchOrType: ITypeDispatcher | IAnyType,
    ...otherTypes: IAnyType[]
): IAnyType

/**
 * types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.
 *
 * @export
 * @alias types.union
 * @param {(ITypeDispatcher | IAnyType)} dispatchOrType
 * @param {...IAnyType[]} otherTypes
 * @returns {IAnyType}
 */
export function union(
    dispatchOrType: ITypeDispatcher | IAnyType,
    ...otherTypes: IAnyType[]
): IAnyType {
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

export function isUnionType(type: any): type is Union {
    return (type.flags & TypeFlags.Union) > 0
}
