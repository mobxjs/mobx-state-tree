// tslint:disable-next-line:no_unused-variable
import { IObservableArray, ObservableMap, IAction } from "mobx"
// tslint:disable-next-line:no_unused-variable
import { IType, ISimpleType, IComplexType } from "./type"
// tslint:disable-next-line:no_unused-variable
import { map, IExtendedObservableMap } from "./complex-types/map"
import { array } from "./complex-types/array"
import { identifier } from "./utility-types/identifier"
// tslint:disable-next-line:no_unused-variable
import { model, extend, IModelType } from "./complex-types/object"
import { reference } from "./utility-types/reference"
import { union } from "./utility-types/union"
import { optional } from "./utility-types/optional"
import { literal } from "./utility-types/literal"
import { maybe } from "./utility-types/maybe"
import { refinement } from "./utility-types/refinement"
import { frozen } from "./utility-types/frozen"
import { boolean, DatePrimitive, number, string  } from "./primitives"
import { late } from "./utility-types/late"

export { IType, ISimpleType }

export const types = {
    model,
    extend,
    reference,
    union,
    optional,
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
