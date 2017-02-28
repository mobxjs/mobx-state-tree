import {createRefinementFactory} from "./refinement"
import {createDefaultValueFactory} from "./with-default"
import {primitiveFactory} from "./primitive"
import {IFactory} from "../core/factories"

export const string = createRefinementFactory<string, string>("string", primitiveFactory, t => typeof t === 'string')
export const number = createRefinementFactory<number, number>("number", primitiveFactory, t => typeof t === 'number')
export const boolean = createRefinementFactory<boolean, boolean>("boolean", primitiveFactory, t => typeof t === 'boolean')