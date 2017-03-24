import {createUnionFactory} from "./union"
import {createLiteralFactory} from "./literal"
import {IType} from "../core/type"

const nullFactory = createLiteralFactory(null)

export function createMaybeFactory<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    return createUnionFactory(nullFactory, type)
}