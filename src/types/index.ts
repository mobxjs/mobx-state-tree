// tslint:disable-next-line:no_unused-variable
import { IObservableArray, ObservableMap, IAction } from "mobx"
// tslint:disable-next-line:no_unused-variable
import { IType, ISimpleType } from "./type"
import { createMapFactory, IExtendedObservableMap } from "./complex-types/map"
import { createArrayFactory } from "./complex-types/array"
import { identifier } from "./utility-types/identifier"
// tslint:disable-next-line:no_unused-variable
import { createModelFactory as model, extend, IModelType } from "./complex-types/object"
import { reference } from "./utility-types/reference"
import { createUnionFactory as union } from "./utility-types/union"
import { createDefaultValueFactory as withDefault } from "./utility-types/with-default"
import { createLiteralFactory as literal } from "./utility-types/literal"
import { createMaybeFactory as maybe } from "./utility-types/maybe"
import { createRefinementFactory as refinement } from "./utility-types/refinement"
import { frozen } from "./utility-types/frozen"
import { boolean, DatePrimitive, number, string  } from "./primitives"
import { late } from "./utility-types/late"

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
function map<S, T>(subFactory: IType<S, T>): IType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return createMapFactory(subFactory) as any
}

/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
function array<S, T>(subFactory: IType<S, T>): IType<T[], IObservableArray<T>> {
    return createArrayFactory(subFactory as any) as any
}

export { IType }

export const types = {
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
    identifier,
    late
}
