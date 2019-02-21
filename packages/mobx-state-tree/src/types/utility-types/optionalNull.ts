import {
    IType,
    IAnyType,
    ExtractT,
    ExtractS,
    ExtractC,
    RedefineIStateTreeNode,
    IStateTreeNode,
    types,
    OptionalDefaultValueOrFunction,
    freeze
} from "../../internal"

/** @hidden */
export interface IOptionalNullIType<IT extends IAnyType>
    extends IType<
        ExtractC<IT> | null,
        ExtractS<IT>,
        RedefineIStateTreeNode<ExtractT<IT>, IStateTreeNode<ExtractC<IT> | null, ExtractS<IT>>>
    > {}

/**
 * `types.optionalNull` - Can be used to create a property with a default value.
 * If the given value is null in the snapshot, it will default to the provided `defaultValue`.
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is null causes the value to be reset
 *
 * Example:
 * ```ts
 * const Todo = types.model({
 *   title: types.optionalNull(types.string, "Test"),
 *   done: types.optionalNull(types.boolean, false),
 *   created: types.optionalNull(types.Date, () => new Date())
 * })
 *
 * // it is now okay to set 'created' and 'done' to null. created will get a freshly generated timestamp
 * const todo = Todo.create({ title: "Get coffee", done: null, created: null })
 * ```
 *
 * @param type
 * @param defaultValueOrFunction
 * @returns
 */
export function optionalNull<IT extends IAnyType>(
    type: IT,
    defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
): IOptionalNullIType<IT> {
    const opt = types.optional(type, defaultValueOrFunction)
    const optNull = types.snapshotProcessor(opt, optionalNullProcessors)
    return optNull as any
}

const optionalNullProcessors = freeze({
    preProcessor(sn: any) {
        return sn === null ? undefined : sn
    },
    postProcessor(sn: any) {
        return sn === undefined ? null : sn
    }
})
