/* all code is initially loaded through internal, to avoid circular dep issues */
import "./internal"

// tslint:disable-next-line:no_unused-variable
import { IObservableArray, ObservableMap, IAction } from "mobx"

// tslint:disable-next-line:no_unused-variable
import {
    ISimpleType,
    IComplexType,
    IType,
    IAnyType,
    map,
    IMSTMap,
    array,
    identifier,
    model,
    compose,
    IModelType,
    reference,
    union,
    optional,
    literal,
    maybe,
    refinement,
    frozen,
    boolean,
    DatePrimitive,
    number,
    string,
    undefinedType,
    nullType,
    late,
    enumeration,
    custom,
    identifierNumber
} from "./internal"

export const types = {
    enumeration,
    model,
    compose,
    custom,
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
    identifierNumber,
    late,
    undefined: undefinedType,
    null: nullType
}

export {
    IAnyType,
    IModelType,
    IMSTMap,
    IType,
    ISimpleType,
    IComplexType,
    ISnapshottable,
    typecheckPublic as typecheck,
    escapeJsonPath,
    unescapeJsonPath,
    joinJsonPath,
    splitJsonPath,
    IJsonPatch,
    decorate,
    addMiddleware,
    IMiddlewareEvent,
    IMiddlewareHandler,
    IMiddlewareEventType,
    process,
    isStateTreeNode,
    IStateTreeNode,
    flow,
    applyAction,
    onAction,
    IActionRecorder,
    ISerializedActionCall,
    recordActions,
    createActionTrackingMiddleware
} from "./internal"

export * from "./core/mst-operations"
