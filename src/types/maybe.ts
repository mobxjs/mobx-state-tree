import {createUnionFactory} from "./union"
import {createConstantFactory} from "./constant"
import {createDefaultValueFactory} from "./with-default"
import {isFactory, IFactory} from "../core/factories"

const nullFactory = createConstantFactory(null)
export function createMaybeFactory(type: IFactory<any, any>): IFactory<any, any>{
    return createDefaultValueFactory(createUnionFactory(nullFactory, type), null)
}