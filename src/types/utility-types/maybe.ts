import { union } from "./union"
import { literal } from "./literal"
import { optional } from "./optional"
import { IType } from "../type"
import { frozen } from "./frozen"
import { fail } from "../../utils"

const nullType = optional(literal(null), null)

/**
 * Maybe will make a type nullable, and also null by default. 
 * 
 * @export
 * @template S 
 * @template T 
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null | undefined, T | null>)} 
 */
export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    if (type === frozen) {
        fail(
            "Unable to declare `types.maybe(types.frozen)`. Frozen already accepts `null`. Consider using `types.optional(types.frozen, null)` instead."
        )
    }
    return union(nullType, type)
}
