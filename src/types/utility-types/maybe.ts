import { union } from "./union"
import { literal } from "./literal"
import { optional } from "./optional"
import { IType } from "../type"
import { frozen } from "./frozen"
import { fail } from "../../utils"

const nullType = optional(literal(null), null)

export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    if (type === frozen) {
        fail(
            "Unable to declare `types.maybe(types.frozen)`. Frozen already accepts `null`. Consider using `types.optional(types.frozen, null)` instead."
        )
    }
    return union(nullType, type)
}
