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

export type UnionProps<T extends IAnyModelType[]> = ExtractProps<T[number]>
export type UnionOthers<T extends IAnyModelType[]> = ExtractOthers<T[number]>
export type UnionC<T extends IAnyType[]> = ExtractC<T[number]>
export type UnionS<T extends IAnyType[]> = ExtractS<T[number]>
export type UnionT<T extends IAnyType[]> = ExtractT<T[number]>

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

/**
 * Returns if a given value represents a union type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isUnionType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Union) > 0
}
