import { union } from "./union"
import { literal } from "./literal"
import { IType } from "../type"

const nullFactory = literal(null)

export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    // TODO: is identifierAttr correct for maybe?
    return union(nullFactory, type)
}
