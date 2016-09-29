import {ModelFactory, isModelFactory} from "../core/factories"
import {invariant} from "../utils"

// TODO: just use map from mobx?
export class Map {
    constructor(public subtype: ModelFactory | null) {
        invariant(!subtype || isModelFactory(subtype))
    }
}

export function map(subtype?: ModelFactory): any {
    return new Map(subtype || null)
}

export function isMap(value: any): value is Map {
    return value instanceof Map
}
