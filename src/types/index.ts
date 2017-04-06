// tslint:disable-next-line:no_unused-variable
import {IObservableArray, ObservableMap, IAction} from "mobx"
import {IType, MSTAdminisration, ISimpleType} from "../core"
import {createMapFactory, IExtendedObservableMap} from "./map"
import {createArrayFactory} from "./array"
import {primitiveFactory} from "./primitive"
import {primitiveFactory as primitive} from "./primitive"
import {identifier} from "./identifier"
import {createModelFactory as model, extend, Snapshot, IModelType} from "./object"
import {reference} from "./reference"
import {createUnionFactory as union} from "./union"
import {createDefaultValueFactory as withDefault} from "./with-default"
import {createLiteralFactory as literal} from "./literal"
import {createMaybeFactory as maybe} from "./maybe"
import {createRefinementFactory as refinement} from "./refinement"
import {frozen} from "./frozen"
import { boolean, DatePrimitive, number, string } from './core-types';
import {recursive} from "./recursive"

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function map<S, T>(subFactory: IType<S, T> = primitiveFactory as any): IType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return createMapFactory(subFactory) as any
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export function array<S, T>(subFactory: IType<S, T> = primitiveFactory as any): IType<T[], IObservableArray<T>> {
    return createArrayFactory(subFactory as any) as any
}

export const types = {
    primitive,
    model,
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
    Date: DatePrimitive,
    map,
    array,
    frozen,
    recursive,
    identifier
}