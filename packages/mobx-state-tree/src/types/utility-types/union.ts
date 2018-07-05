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

export type UnionOptions = { eager?: boolean; dispatcher?: ITypeDispatcher }

export class Union extends Type<any, any, any> {
    readonly dispatcher?: ITypeDispatcher
    readonly eager: boolean = true
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

    constructor(name: string, types: IAnyType[], options?: UnionOptions) {
        super(name)
        this.dispatcher = options && options.dispatcher
        if (options && !options.eager) this.eager = false
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
        if (this.dispatcher) {
            return this.dispatcher(value)
        }

        // find the most accomodating type
        const applicableTypes = this.types.filter(type => type.is(value))
        if (!this.eager && applicableTypes.length > 1)
            return fail(
                `Ambiguos snapshot ${JSON.stringify(value)} for union ${
                    this.name
                }. Please provide a dispatch in the union declaration.`
            )

        return applicableTypes[0]
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (this.dispatcher) {
            return this.dispatcher(value).validate(value, context)
        }

        const errors = this.types.map(type => type.validate(value, context))
        const applicableTypes = errors.filter(errorArray => errorArray.length === 0)

        if (!this.eager && applicableTypes.length > 1) {
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

// generated with /home/michel/mobservable/mobx-state-tree/packages/mobx-state-tree/scripts/generate-union-types.js
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): IType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): IType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): IType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): IType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): IType<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): IType<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): IType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): IType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// manual written
export function union(...types: IAnyType[]): IAnyType
export function union(dispatchOrType: UnionOptions | IAnyType, ...otherTypes: IAnyType[]): IAnyType
/**
 * types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.
 *
 * @export
 * @alias types.union
 * @param {(ITypeDispatcher | IAnyType)} optionsOrType
 * @param {...IAnyType[]} otherTypes
 * @returns {IAnyType}
 */
export function union(optionsOrType: UnionOptions | IAnyType, ...otherTypes: IAnyType[]): IAnyType {
    const options = isType(optionsOrType) ? undefined : optionsOrType
    const types = isType(optionsOrType) ? [optionsOrType, ...otherTypes] : otherTypes
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
    return new Union(name, types, options)
}

export function isUnionType(type: any): type is Union {
    return (type.flags & TypeFlags.Union) > 0
}
