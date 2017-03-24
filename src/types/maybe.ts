import {createUnionFactory} from "./union"
import {createLiteralFactory} from "./literal"
import {IFactory} from "../core/factories"

const nullFactory = createLiteralFactory(null)

export function createMaybeFactory<S, T>(type: IFactory<S, T>): IFactory<S | null | undefined, T | null> {
    return createUnionFactory(nullFactory, type)
}