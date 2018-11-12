import {
    union,
    optional,
    IType,
    isType,
    fail,
    undefinedType,
    nullType,
    IAnyType,
    ExtractC,
    ExtractS,
    ExtractT,
    OptionalProperty,
    IStateTreeNode,
    RedefineIStateTreeNode
} from "../../internal"

const optionalUndefinedType = optional(undefinedType, undefined)
const optionalNullType = optional(nullType, null)

export interface IMaybeIType<IT extends IAnyType, C, O>
    extends IType<
            ExtractC<IT> | C,
            ExtractS<IT> | O,
            | RedefineIStateTreeNode<
                  ExtractT<IT>,
                  IStateTreeNode<ExtractC<IT> | C, ExtractS<IT> | O>
              >
            | O
        >,
        OptionalProperty {}

export interface IMaybe<IT extends IAnyType> extends IMaybeIType<IT, undefined, undefined> {}
export interface IMaybeNull<IT extends IAnyType> extends IMaybeIType<IT, null | undefined, null> {}

/**
 * Maybe will make a type nullable, and also optional.
 * The value `undefined` will be used to represent nullability.
 *
 * @export
 * @alias types.maybe
 * @template IT
 * @param {IT} type
 * @returns {IMaybe<IT>}
 */
export function maybe<IT extends IAnyType>(type: IT): IMaybe<IT> {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalUndefinedType) as any
}

/**
 * Maybe will make a type nullable, and also optional.
 * The value `null` will be used to represent no value.
 *
 * @export
 * @alias types.maybeNull
 * @template IT
 * @param {IT} type
 * @returns {IMaybeNull<IT>}
 */
export function maybeNull<IT extends IAnyType>(type: IT): IMaybeNull<IT> {
    if (process.env.NODE_ENV !== "production" && !isType(type))
        fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
    return union(type, optionalNullType) as any
}
