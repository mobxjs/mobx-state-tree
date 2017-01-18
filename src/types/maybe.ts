import {createUnionFactory} from "./union"
import {createConstantFactory} from "./constant"
import {createDefaultValueFactory} from "./with-default"
import {isFactory, IFactory} from "../core/factories"

export function createMaybeFactory(type: IFactory<any, any>): IFactory<any, any>{
    return createDefaultValueFactory(createUnionFactory(createConstantFactory(null), type), null)
}