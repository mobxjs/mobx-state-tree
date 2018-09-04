import {
    isStateTreeNode,
    getStateTreeNode,
    INode,
    Type,
    IType,
    TypeFlags,
    isType,
    IContext,
    IValidationResult,
    typecheckInternal,
    typeCheckSuccess,
    fail,
    IAnyType,
    IComplexType,
    OptionalProperty
} from "../../internal"

/**
 * @internal
 * @private
 */
export type IFunctionReturn<T> = () => T
/**
 * @internal
 * @private
 */
export type IOptionalValue<C, S, T> = C | S | IFunctionReturn<C | S | T>

/**
 * @internal
 * @private
 */
export class OptionalValue<C, S, T> extends Type<C, S, T> {
    readonly type: IType<C, S, T>
    readonly defaultValue: IOptionalValue<C, S, T>

    get flags() {
        return this.type.flags | TypeFlags.Optional
    }

    get shouldAttachNode() {
        return this.type.shouldAttachNode
    }

    constructor(type: IType<C, S, T>, defaultValue: IOptionalValue<C, S, T>) {
        super(type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        return this.type.describe() + "?"
    }

    instantiate(parent: INode, subpath: string, environment: any, value: S): INode {
        if (typeof value === "undefined") {
            const defaultInstanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
            return this.type.instantiate(parent, subpath, environment, defaultInstanceOrSnapshot)
        }
        return this.type.instantiate(parent, subpath, environment, value)
    }

    reconcile(current: INode, newValue: any): INode {
        return this.type.reconcile(
            current,
            this.type.is(newValue) && newValue !== undefined
                ? newValue
                : this.getDefaultInstanceOrSnapshot()
        )
    }

    public getDefaultInstanceOrSnapshot() {
        const defaultInstanceOrSnapshot =
            typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue

        // while static values are already snapshots and checked on types.optional
        // generator functions must always be rechecked just in case
        if (typeof this.defaultValue === "function") {
            typecheckInternal(this, defaultInstanceOrSnapshot)
        }

        return defaultInstanceOrSnapshot
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // defaulted values can be skipped
        if (value === undefined) {
            return typeCheckSuccess()
        }
        // bounce validation to the sub-type
        return this.type.validate(value, context)
    }

    isAssignableFrom(type: IAnyType) {
        return this.type.isAssignableFrom(type)
    }
}

export function optional<C, S, T>(
    type: IComplexType<C, S, T>,
    defaultValueOrFunction: C | S | (() => C | S | T)
): IComplexType<C | undefined, S, T> & OptionalProperty
export function optional<C, S, T>(
    type: IType<C, S, T>,
    defaultValueOrFunction: C | S | (() => C | S | T)
): IType<C | undefined, S, T> & OptionalProperty

/**
 * `types.optional` can be used to create a property with a default value.
 * If the given value is not provided in the snapshot, it will default to the provided `defaultValue`.
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is _not_ present, causes the value to be reset
 *
 * @example
 * const Todo = types.model({
 *   title: types.optional(types.string, "Test"),
 *   done: types.optional(types.boolean, false),
 *   created: types.optional(types.Date, () => new Date())
 * })
 *
 * // it is now okay to omit 'created' and 'done'. created will get a freshly generated timestamp
 * const todo = Todo.create({ title: "Get coffee "})
 *
 * @export
 * @alias types.optional
 */
export function optional<C, S, T>(
    type: IType<C, S, T>,
    defaultValueOrFunction: C | S | (() => C | S | T)
): IType<C | undefined, S, T> & OptionalProperty {
    // make sure we never pass direct instances
    if (typeof defaultValueOrFunction !== "function" && isStateTreeNode(defaultValueOrFunction)) {
        fail(
            "default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead"
        )
    }

    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected a mobx-state-tree type as first argument, got " + type + " instead")

        // we only check default values if they are passed directly
        // if they are generator functions they will be checked once they are generated
        // we don't check generator function results here to avoid generating a node just for type-checking purposes
        // which might generate side-effects
        if (typeof defaultValueOrFunction !== "function") {
            typecheckInternal(type, defaultValueOrFunction)
        }
    }

    const ret = new OptionalValue(type, defaultValueOrFunction)
    return ret as typeof ret & OptionalProperty
}

/**
 * Returns if a value represents an optional type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isOptionalType<IT extends IType<any | undefined, any, any> & OptionalProperty>(
    type: IT
): type is IT {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}
