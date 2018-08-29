import {
    union,
    optional,
    IType,
    isType,
    fail,
    undefinedType,
    nullType,
    IComplexType,
    IAnyType,
    ExtractC,
    ExtractS,
    ExtractT,
    IAnyComplexType,
    OptionalProperty
} from "../../internal"

const optionalUndefinedType = optional(undefinedType, undefined)
const optionalNullType = optional(nullType, null)

export type IMaybeTypeBase<IT extends IAnyType, C, O> = IT extends IAnyComplexType
    ? IComplexType<ExtractC<IT> | C, ExtractS<IT> | O, ExtractT<IT> | O> & OptionalProperty
    : IT extends IAnyType
        ? IType<ExtractC<IT> | C, ExtractS<IT> | O, ExtractT<IT> | O> & OptionalProperty
        : never

export type IMaybeType<IT extends IAnyType> = IMaybeTypeBase<IT, undefined, undefined>

/**
 * Maybe will make a type nullable, and also optional.
 * The value `undefined` will be used to represent nullability.
 *
 * @export
 * @alias types.maybe
 * @template C
 * @template S
 * @template T
 * @param {IType<C, S, M>} type The type to make nullable
 * @returns {(IType<C | undefined, S | undefined, T | undefined>)}
 */
export function maybe<IT extends IAnyType>(type: IT): IMaybeType<IT> {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalUndefinedType) as any
}

export type IMaybeNullType<IT extends IAnyType> = IMaybeTypeBase<IT, null | undefined, null>

/**
 * Maybe will make a type nullable, and also optional.
 * The value `null` will be used to represent no value.
 *
 * @export
 * @alias types.maybeNull
 * @template C
 * @template S
 * @template T
 * @param {IType<C, S, M>} type The type to make nullable
 * @returns {(IType<C | null | undefined, S | null, T | null>)}
 */
export function maybeNull<IT extends IAnyType>(type: IT): IMaybeNullType<IT> {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalNullType) as any
}
