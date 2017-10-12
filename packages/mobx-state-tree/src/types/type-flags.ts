import { IType, IComplexType } from "./type"
import { CoreType } from "./primitives"
import { IExtendedObservableMap } from "./complex-types/map"
import { ModelType } from "./complex-types/model"
import { IdentifierType } from "./utility-types/identifier"
import { ReferenceType } from "./utility-types/reference"
import { Refinement } from "./utility-types/refinement"
import { Union } from "./utility-types/union"
import { OptionalValue } from "./utility-types/optional"
import { Frozen } from "./utility-types/frozen"
import { Late } from "./utility-types/late"
import { Literal } from "./utility-types/literal"
import { IObservableArray } from "mobx"

export enum TypeFlags {
    String = 1 << 0,
    Number = 1 << 1,
    Boolean = 1 << 2,
    Date = 1 << 3,
    Literal = 1 << 4,
    Array = 1 << 5,
    Map = 1 << 6,
    Object = 1 << 7,
    Frozen = 1 << 8,
    Optional = 1 << 9,
    Reference = 1 << 10,
    Identifier = 1 << 11,
    Late = 1 << 12,
    Refinement = 1 << 13,
    Union = 1 << 14,
    Null = 1 << 15,
    Undefined = 1 << 16
}

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export function isPrimitiveType(type: any): type is CoreType<any, any> {
    return (
        isType(type) &&
        (type.flags & (TypeFlags.String | TypeFlags.Number | TypeFlags.Boolean | TypeFlags.Date)) >
            0
    )
}

export function isArrayType<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>> {
    return isType(type) && (type.flags & TypeFlags.Array) > 0
}

export function isMapType<S, T>(
    type: any
): type is IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    return isType(type) && (type.flags & TypeFlags.Map) > 0
}

export function isObjectType(type: any): type is ModelType<any, any> {
    return isType(type) && (type.flags & TypeFlags.Object) > 0
}

export function isFrozenType(type: any): type is Frozen<any> {
    return isType(type) && (type.flags & TypeFlags.Frozen) > 0
}

export function isIdentifierType(type: any): type is IdentifierType<any> {
    return isType(type) && (type.flags & TypeFlags.Identifier) > 0
}

export function isLateType(type: any): type is Late<any, any> {
    return isType(type) && (type.flags & TypeFlags.Late) > 0
}

export function isLiteralType(type: any): type is Literal<any> {
    return isType(type) && (type.flags & TypeFlags.Literal) > 0
}

export function isOptionalType(type: any): type is OptionalValue<any, any> {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & TypeFlags.Reference) > 0
}

export function isRefinementType(type: any): type is Refinement<any, any> {
    return (type.flags & TypeFlags.Refinement) > 0
}

export function isUnionType(type: any): type is Union {
    return (type.flags & TypeFlags.Union) > 0
}
