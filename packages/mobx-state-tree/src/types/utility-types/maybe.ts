import {
    union,
    optional,
    IType,
    isType,
    fail,
    TypeFlags,
    undefinedType,
    nullType,
    IComplexType
} from "../../internal"

const optionalUndefinedType = optional(undefinedType, undefined)
const optionalNullType = optional(nullType, null)

/**
 * Maybe will make a type nullable, and also optional.
 * The value `undefined` will be used to represent nullability.
 *
 * @export
 * @alias types.maybe
 * @template C
 * @template S
 * @template T
 * @param {IComplexType<C, S, M> | IType<C, S, M>} type The type to make nullable
 * @returns {(IType<C | undefined, S | undefined, T | undefined>)}
 */
export function maybe<C, S, T>(type: IComplexType<C, S, T> | IType<C, S, T>) {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    const ret = union(type, optionalUndefinedType)
    return ret as typeof ret & { flags: TypeFlags.Optional }
}

/**
 * Maybe will make a type nullable, and also optional.
 * The value `null` will be used to represent no value.
 *
 * @export
 * @alias types.maybeNull
 * @template C
 * @template S
 * @template T
 * @param {IComplexType<C, S, M> | IType<C, S, M>} type The type to make nullable
 * @returns {(IType<C | null | undefined, S | null, T | null>)}
 */
export function maybeNull<C, S, M>(type: IComplexType<C, S, M> | IType<C, S, M>) {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    const ret = union(type, optionalNullType)
    return ret as typeof ret & { flags: TypeFlags.Optional }
}
