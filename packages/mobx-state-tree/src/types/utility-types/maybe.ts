import { union, nullType, optional, IType, isType, frozen, fail, TypeFlags } from "../../internal"

const optionalNullType = optional(nullType, null)

/**
 * Maybe will make a type nullable, and also null by default.
 *
 * @export
 * @alias types.maybe
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null | undefined, T | null>)}
 */
export function maybe<C, S, T>(
    type: IType<C, S, T>
): IType<S | null | undefined, S | null, T | null> & { flags: TypeFlags.Optional } {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
        if (type === frozen) {
            fail(
                "Unable to declare `types.maybe(types.frozen)`. Frozen already accepts `null`. Consider using `types.optional(types.frozen, null)` instead."
            )
        }
    }
    return union(type, optionalNullType) as any
}
