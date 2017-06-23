import { union } from "./union"
import { literal } from "./literal"
import { optional } from "./optional"
import { IType } from "../type"

const nullType = optional(literal(null), null)

export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    return union(nullType, type)
}
