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
    fail,
    isPlainObject,
    IAnyType,
    IValidationError,
    IModelType,
    ModelProperties,
    ModelInstanceType,
    ModelSnapshotType2,
    ModelCreationType2,
    _NotCustomized,
    RedefineIStateTreeNode,
    IStateTreeNode,
    BaseNode,
    AnyObjectNode
} from "../../internal"

export type ITypeDispatcher = (snapshot: any) => IAnyType

export interface UnionOptions {
    eager?: boolean
    dispatcher?: ITypeDispatcher
}

/**
 * @internal
 * @hidden
 */
export class Union<N extends BaseNode<any, any> = any> extends Type<any, any, any, N> {
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
        options = {
            eager: true,
            dispatcher: undefined,
            ...options
        }
        this.dispatcher = options.dispatcher
        if (!options.eager) this.eager = false
        this.types = types
    }

    isAssignableFrom(type: IAnyType) {
        return this.types.some(subType => subType.isAssignableFrom(type))
    }

    describe() {
        return "(" + this.types.map(factory => factory.describe()).join(" | ") + ")"
    }

    instantiate(parent: AnyObjectNode | null, subpath: string, environment: any, value: any): N {
        const type = this.determineType(value, undefined)
        if (!type) throw fail("No matching type for union " + this.describe()) // can happen in prod builds
        return type.instantiate(parent, subpath, environment, value) as any
    }

    reconcile(current: N, newValue: any): N {
        const type = this.determineType(newValue, current.type)
        if (!type) throw fail("No matching type for union " + this.describe()) // can happen in prod builds
        return type.reconcile(current, newValue) as any
    }

    determineType(value: any, reconcileCurrentType: IAnyType | undefined): IAnyType | undefined {
        // try the dispatcher, if defined
        if (this.dispatcher) {
            return this.dispatcher(value)
        }

        // find the most accomodating type
        // if we are using reconciliation try the current node type first (fix for #1045)
        if (reconcileCurrentType) {
            if (reconcileCurrentType.is(value)) {
                return reconcileCurrentType
            }
            return this.types.filter(t => t !== reconcileCurrentType).find(type => type.is(value))
        } else {
            return this.types.find(type => type.is(value))
        }
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

/**
 * Transform _NotCustomized | _NotCustomized... to _NotCustomized, _NotCustomized | A | B to A | B
 * @hidden
 */
export type _CustomCSProcessor<T> = Exclude<T, _NotCustomized> extends never
    ? _NotCustomized
    : Exclude<T, _NotCustomized>

/** @hidden */
export interface ITypeUnion<C, S, T>
    extends IType<
        _CustomCSProcessor<C>,
        _CustomCSProcessor<S>,
        RedefineIStateTreeNode<T, IStateTreeNode<_CustomCSProcessor<C>, _CustomCSProcessor<S>>>
    > {}

// generated with C:\VSProjects\github\mobx-state-tree-upstream\packages\mobx-state-tree\scripts\generate-union-types.js
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB>
    | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> |
    ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG> | ModelCreationType2<PH, FCH>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG> | ModelSnapshotType2<PH, FSH>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB,
    FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG> | ModelInstanceType<PH, OH, FCH, FSH>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG> | ModelCreationType2<PH, FCH>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG> | ModelSnapshotType2<PH, FSH>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG> | ModelInstanceType<PH, OH, FCH, FSH>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH, PI extends ModelProperties, OI, FCI, FSI>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>, I: IModelType<PI, OI, FCI, FSI>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG> | ModelCreationType2<PH, FCH> | ModelCreationType2<PI, FCI>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG> | ModelSnapshotType2<PH, FSH> | ModelSnapshotType2<PI, FSI>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG> | ModelInstanceType<PH, OH, FCH, FSH> | ModelInstanceType<PI, OI, FCI, FSI>>
// prettier-ignore
export function union<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH, PI extends ModelProperties, OI, FCI, FSI>(options: UnionOptions, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>, I: IModelType<PI, OI, FCI, FSI>): ITypeUnion<ModelCreationType2<PA, FCA> | ModelCreationType2<PB, FCB> | ModelCreationType2<PC, FCC> | ModelCreationType2<PD, FCD> | ModelCreationType2<PE, FCE> | ModelCreationType2<PF, FCF> | ModelCreationType2<PG, FCG> | ModelCreationType2<PH, FCH> | ModelCreationType2<PI, FCI>, ModelSnapshotType2<PA, FSA> | ModelSnapshotType2<PB, FSB> | ModelSnapshotType2<PC, FSC> | ModelSnapshotType2<PD, FSD> | ModelSnapshotType2<PE, FSE> | ModelSnapshotType2<PF, FSF> | ModelSnapshotType2<PG, FSG> | ModelSnapshotType2<PH, FSH> | ModelSnapshotType2<PI, FSI>, ModelInstanceType<PA, OA, FCA, FSA> | ModelInstanceType<PB, OB, FCB, FSB> | ModelInstanceType<PC, OC, FCC, FSC> | ModelInstanceType<PD, OD, FCD, FSD> | ModelInstanceType<PE, OE, FCE, FSE> | ModelInstanceType<PF, OF, FCF, FSF> | ModelInstanceType<PG, OG, FCG, FSG> | ModelInstanceType<PH, OH, FCH, FSH> | ModelInstanceType<PI, OI, FCI, FSI>>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): ITypeUnion<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>): ITypeUnion<CA | CB, SA | SB, TA | TB>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): ITypeUnion<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>): ITypeUnion<CA | CB | CC, SA | SB | SC, TA | TB | TC>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): ITypeUnion<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>): ITypeUnion<CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): ITypeUnion<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>): ITypeUnion<CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): ITypeUnion<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>): ITypeUnion<CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB
    | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB
    | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>
// prettier-ignore
export function union<CA, SA, TA, CB, SB, TB, CC, SC, TC, CD, SD, TD, CE, SE, TE, CF, SF, TF, CG, SG, TG, CH, SH, TH, CI, SI, TI>(options: UnionOptions, A: IType<CA, SA, TA>, B: IType<CB, SB, TB>, C: IType<CC, SC, TC>, D: IType<CD, SD, TD>, E: IType<CE, SE, TE>, F: IType<CF, SF, TF>, G: IType<CG, SG, TG>, H: IType<CH, SH, TH>, I: IType<CI, SI, TI>): ITypeUnion<CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>

// manually written
export function union(...types: IAnyType[]): IAnyType
export function union(dispatchOrType: UnionOptions | IAnyType, ...otherTypes: IAnyType[]): IAnyType
/**
 * `types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.
 *
 * @param optionsOrType
 * @param otherTypes
 * @returns
 */
export function union(optionsOrType: UnionOptions | IAnyType, ...otherTypes: IAnyType[]): IAnyType {
    const options = isType(optionsOrType) ? undefined : optionsOrType
    const types = isType(optionsOrType) ? [optionsOrType, ...otherTypes] : otherTypes
    const name = "(" + types.map(type => type.name).join(" | ") + ")"

    // check all options
    if (process.env.NODE_ENV !== "production") {
        if (!isType(optionsOrType) && !isPlainObject(optionsOrType))
            throw fail(
                "First argument to types.union should either be a type, or an objects object of the form: { eager?: boolean, dispatcher?: Function }"
            )
        types.forEach(type => {
            if (!isType(type))
                throw fail(
                    "expected all possible types to be a mobx-state-tree type, got " +
                        type +
                        " instead"
                )
        })
    }
    return new Union(name, types, options)
}

/**
 * Returns if a given value represents a union type.
 *
 * @param type
 * @returns
 */
export function isUnionType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Union) > 0
}
