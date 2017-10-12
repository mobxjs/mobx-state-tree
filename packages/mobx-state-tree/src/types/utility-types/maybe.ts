import { union } from "./union"
import { nullType } from "../primitives"
import { optional } from "./optional"
import { IType } from "../type"
import { isType } from "../type-flags"
import { frozen } from "./frozen"
import { fail } from "../../utils"

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
export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
        if (type === frozen) {
            fail(
                "Unable to declare `types.maybe(types.frozen)`. Frozen already accepts `null`. Consider using `types.optional(types.frozen, null)` instead."
            )
        }
    }
    return union(optionalNullType, type)
}
