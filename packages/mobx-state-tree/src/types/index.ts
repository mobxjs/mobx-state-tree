// we import the types to re-export them inside types.
import {
    enumeration,
    model,
    compose,
    custom,
    reference,
    safeReference,
    union,
    optional,
    literal,
    maybe,
    maybeNull,
    refinement,
    string,
    boolean,
    number,
    integer,
    float,
    finite,
    DatePrimitive,
    map,
    array,
    frozen,
    identifier,
    identifierNumber,
    late,
    undefinedType,
    nullType,
    snapshotProcessor
} from "../internal"

export const types = {
    enumeration,
    model,
    compose,
    custom,
    reference,
    safeReference,
    union,
    optional,
    literal,
    maybe,
    maybeNull,
    refinement,
    string,
    boolean,
    number,
    integer,
    float,
    finite,
    Date: DatePrimitive,
    map,
    array,
    frozen,
    identifier,
    identifierNumber,
    late,
    undefined: undefinedType,
    null: nullType,
    snapshotProcessor
}
