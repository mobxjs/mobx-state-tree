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
    isPlainObject,
    IAnyType,
    IValidationError,
    IComplexType,
    IModelType,
    ModelProperties
} from "../../internal"

export type ITypeDispatcher = (snapshot: any) => IAnyType

export interface UnionOptions {
    eager?: boolean
    dispatcher?: ITypeDispatcher
}

/**
 * @internal
 * @private
 */
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
        const type = this.determineType(value)
        if (!type) return fail("No matching type for union " + this.describe()) // can happen in prod builds
        return type.instantiate(parent, subpath, environment, value)
    }

    reconcile(current: INode, newValue: any): INode {
        const type = this.determineType(newValue)
        if (!type) return fail("No matching type for union " + this.describe()) // can happen in prod builds
        return type.reconcile(current, newValue)
    }

    determineType(value: any): IAnyType | undefined {
        // try the dispatcher, if defined
        if (this.dispatcher) {
            return this.dispatcher(value)
        }

        // find the most accomodating type
        return this.types.find(type => type.is(value))
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (this.dispatcher) {
            return this.dispatcher(value).validate(value, context)
        }

        const allErrors: IValidationError[][] = []
        let applicableTypes = 0
        for (let i = 0; i < this.types.length; i++) {
            const type = this.types[i]
            const errors = type.validate(value, context)
            if (errors.length === 0) {
                if (this.eager) return typeCheckSuccess()
                else applicableTypes++
            } else {
                allErrors.push(errors)
            }
        }

        if (applicableTypes === 1) return typeCheckSuccess()
        return typeCheckFailure(context, value, "No type is applicable for the union").concat(
            flattenTypeErrors(allErrors)
        )
    }
}

// generated with mobx-state-tree\packages\mobx-state-tree\scripts\generate-union-types.js
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>): IModelType<PA | PB, OA | OB, CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>): IModelType<PA | PB, OA | OB, CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>): IModelType<PA | PB | PC, OA | OB | OC, CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>): IModelType<PA | PB | PC, OA | OB | OC, CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>): IModelType<PA | PB | PC | PD, OA | OB | OC |
    OD, CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>): IModelType<PA | PB | PC | PD, OA | OB | OC | OD, CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>): IModelType<PA | PB | PC | PD | PE, OA | OB | OC | OD | OE, CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>): IModelType<PA | PB | PC | PD | PE, OA | OB | OC | OD | OE, CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>): IModelType<PA | PB | PC | PD | PE | PF, OA | OB | OC | OD | OE | OF, CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>): IModelType<PA | PB | PC | PD | PE | PF, OA | OB | OC | OD | OE | OF, CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>): IModelType<PA | PB | PC | PD | PE | PF | PG, OA | OB | OC | OD | OE | OF | OG, CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>): IModelType<PA | PB | PC | PD | PE | PF | PG, OA | OB | OC | OD | OE | OF | OG, CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>): IModelType<PA | PB | PC | PD | PE | PF | PG | PH, OA | OB | OC | OD | OE | OF | OG | OH, CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>): IModelType<PA | PB | PC | PD | PE | PF | PG | PH, OA | OB | OC | OD | OE | OF | OG | OH, CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH, PI extends ModelProperties, OI, CI, SI, TI>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>, I: IModelType<PI, OI, CI, SI, TI>): IModelType<PA | PB | PC | PD | PE
    | PF | PG | PH | PI, OA | OB | OC | OD | OE | OF | OG | OH | OI, CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH, PI extends ModelProperties, OI, CI, SI, TI>(options: UnionOptions, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>, I: IModelType<PI, OI, CI, SI, TI>): IModelType<PA | PB | PC | PD | PE | PF | PG | PH | PI, OA | OB | OC | OD | OE | OF | OG | OH | OI, CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>): IComplexType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>): IComplexType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>): IComplexType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>): IComplexType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>): IComplexType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>): IComplexType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>): IComplexType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>): IComplexType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>): IComplexType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>): IComplexType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>): IComplexType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>): IComplexType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>, H: IComplexType<CH, SH, TH>): IComplexType<CA | CB | CC | CD |
    CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>, H: IComplexType<CH, SH, TH>): IComplexType<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>, H: IComplexType<CH, SH, TH>, I: IComplexType<CI, SI, TI>): IComplexType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(options: UnionOptions, A: IComplexType<CA, SA, TA>, B: IComplexType<CB, SB, TB>, C: IComplexType<CC, SC, TC>, D: IComplexType<CD, SD, TD>, E: IComplexType<CE, SE, TE>, F: IComplexType<CF, SF, TF>, G: IComplexType<CG, SG, TG>, H: IComplexType<CH, SH, TH>, I: IComplexType<CI, SI, TI>): IComplexType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): IType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): IType<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): IType<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): IType<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): IType<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): IType<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): IType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): IType<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): IType<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA |
    TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): IType<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): IType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA |
    SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): IType<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>

// manually written
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
        if (!isType(optionsOrType) && !isPlainObject(optionsOrType))
            fail(
                "First argument to types.union should either be a type, or an objects object of the form: { eager?: boolean, dispatcher?: Function }"
            )
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

export function isUnionType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Union) > 0
}
