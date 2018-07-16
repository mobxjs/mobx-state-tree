import {
    union,
    optional,
    IType,
    isType,
    fail,
    TypeFlags,
    undefinedType,
    nullType,
    IAnyType
} from "../../internal"

const optionalUndefinedType = optional(undefinedType, undefined)
const optionalNullType = optional(nullType, null)

/**
 * Maybe will make a type nullable, and also optional.
 * The value `undefined` will be used to represent nullability.
 *
 * @export
 * @alias types.maybe
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | undefined, T | undefined>)}
 */
export function maybe<C, S, T>(
    type: IType<C, S, T>
): IType<S | undefined, S | undefined, T | undefined> & { flags: TypeFlags.Optional } {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalUndefinedType) as any
}

/**
 * Maybe will make a type nullable, and also optional.
 * The value `null` will be used to represent no value.
 *
 * @export
 * @alias types.maybeNull
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null, T | null>)}
 */
export function maybeNull<C, S, T>(
    type: IType<C, S, T>
): IType<S | null | undefined, S | null, T | null> & { flags: TypeFlags.Optional } {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalNullType) as any
}
