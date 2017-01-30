import {createUnionFactory} from "./union"
import {createLiteralFactory} from "./literal"
import {createDefaultValueFactory} from "./with-default"
import {isFactory, IFactory} from "../core/factories"

const nullFactory = createLiteralFactory(null)
export function createMaybeFactory<S, T>(type: IFactory<S, T>): IFactory<S | null | undefined, T | null | undefined>{
    return createDefaultValueFactory(createUnionFactory(nullFactory, type), null)
}