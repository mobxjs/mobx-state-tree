import {createRefinementFactory} from "./refinement"
import {createDefaultValueFactory} from "./with-default"
import {primitiveFactory} from "./primitive"
import {IFactory} from "../core/factories"

export const string = createRefinementFactory("string", createDefaultValueFactory(primitiveFactory, ''), t => typeof t === 'string')
export const number = createRefinementFactory("number", createDefaultValueFactory(primitiveFactory, 0), t => typeof t === 'number')
export const boolean = createRefinementFactory("boolean", createDefaultValueFactory(primitiveFactory, true), t => typeof t === 'boolean')