// tslint:disable-next-line:no_unused-variable
import {IObservableArray, ObservableMap, IAction} from "mobx"
import {IFactory} from "../core/factories"
import {createMapFactory, IExtendedObservableMap} from "./map"
import {createArrayFactory} from "./array"
import {primitiveFactory} from "./primitive"
import {primitiveFactory as primitive} from "./primitive"
import {identifier} from "./identifier"
import {createModelFactory as struct, composeFactory as extend} from "./object"
import {reference} from "./reference"
import {createUnionFactory as union} from "./union"
import {createDefaultValueFactory as withDefault} from "./with-default"
import {createLiteralFactory as literal} from "./literal"
import {createMaybeFactory as maybe} from "./maybe"
import {createRefinementFactory as refinement} from "./refinement"
import {frozen} from "./frozen"
import {string, boolean, number} from "./core-types"
import {recursive} from "./recursive"

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function map<S, T>(subFactory: IFactory<S, T> = primitiveFactory as any): IFactory<{[key: string]: S}, IExtendedObservableMap<T>> {
    return createMapFactory(subFactory) as any
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function array<S, T>(subFactory: IFactory<S, T> = primitiveFactory as any): IFactory<T[], IObservableArray<T>> {
    return createArrayFactory(subFactory as any) as any
}

export const types = {
    primitive,
    struct,
    extend,
    reference,
    union,
    withDefault,
    literal,
    maybe,
    refinement,
    string,
    boolean,
    number,
    map,
    array,
    frozen,
    recursive,
    identifier
}