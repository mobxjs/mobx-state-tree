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
    ExtractC,
    ExtractT,
    ExtractS,
    IAnyModelType,
    ExtractProps,
    ExtractOthers,
    IAnyComplexType
} from "../../internal"

export type ITypeDispatcher = (snapshot: any) => IAnyType

export interface UnionOptions {
    eager?: boolean
    dispatcher?: ITypeDispatcher
}

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

export type UnionProps<T extends IAnyModelType[]> =
    | ExtractProps<T[0]>
    | ExtractProps<T[1]>
    | ExtractProps<T[2]>
    | ExtractProps<T[3]>
    | ExtractProps<T[4]>
    | ExtractProps<T[5]>
    | ExtractProps<T[6]>
    | ExtractProps<T[7]>
    | ExtractProps<T[8]>
    | ExtractProps<T[9]>
export type UnionOthers<T extends IAnyModelType[]> =
    | ExtractOthers<T[0]>
    | ExtractOthers<T[1]>
    | ExtractOthers<T[2]>
    | ExtractOthers<T[3]>
    | ExtractOthers<T[4]>
    | ExtractOthers<T[5]>
    | ExtractOthers<T[6]>
    | ExtractOthers<T[7]>
    | ExtractOthers<T[8]>
    | ExtractOthers<T[9]>

export type UnionC<T extends IAnyType[]> =
    | ExtractC<T[0]>
    | ExtractC<T[1]>
    | ExtractC<T[2]>
    | ExtractC<T[3]>
    | ExtractC<T[4]>
    | ExtractC<T[5]>
    | ExtractC<T[6]>
    | ExtractC<T[7]>
    | ExtractC<T[8]>
    | ExtractC<T[9]>
export type UnionS<T extends IAnyType[]> =
    | ExtractS<T[0]>
    | ExtractS<T[1]>
    | ExtractS<T[2]>
    | ExtractS<T[3]>
    | ExtractS<T[4]>
    | ExtractS<T[5]>
    | ExtractS<T[6]>
    | ExtractS<T[7]>
    | ExtractS<T[8]>
    | ExtractS<T[9]>
export type UnionT<T extends IAnyType[]> =
    | ExtractT<T[0]>
    | ExtractT<T[1]>
    | ExtractT<T[2]>
    | ExtractT<T[3]>
    | ExtractT<T[4]>
    | ExtractT<T[5]>
    | ExtractT<T[6]>
    | ExtractT<T[7]>
    | ExtractT<T[8]>
    | ExtractT<T[9]>

export function union<Types extends IAnyModelType[]>(
    options: UnionOptions,
    ...types: Types
): IModelType<UnionProps<Types>, UnionOthers<Types>, UnionC<Types>, UnionS<Types>, UnionT<Types>>
export function union<Types extends IAnyComplexType[]>(
    options: UnionOptions,
    ...types: Types
): IComplexType<UnionC<Types>, UnionS<Types>, UnionT<Types>>
export function union<Types extends IAnyType[]>(
    options: UnionOptions,
    ...types: Types
): IType<UnionC<Types>, UnionS<Types>, UnionT<Types>>

export function union<Types extends IAnyModelType[]>(
    ...types: Types
): IModelType<UnionProps<Types>, UnionOthers<Types>, UnionC<Types>, UnionS<Types>, UnionT<Types>>
export function union<Types extends IAnyComplexType[]>(
    ...types: Types
): IComplexType<UnionC<Types>, UnionS<Types>, UnionT<Types>>
export function union<Types extends IAnyType[]>(
    ...types: Types
): IType<UnionC<Types>, UnionS<Types>, UnionT<Types>>

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
