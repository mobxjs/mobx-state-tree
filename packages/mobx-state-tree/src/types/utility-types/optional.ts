import {
    isStateTreeNode,
    getStateTreeNode,
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
    OptionalProperty,
    ExtractT,
    ExtractS,
    ExtractC,
    ExtractCST,
    RedefineIStateTreeNode,
    IStateTreeNode,
    AnyObjectNode
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export type IFunctionReturn<T> = () => T

/**
 * @internal
 * @hidden
 */
export type IOptionalValue<C, S, T> = C | S | IFunctionReturn<C | S | T>

/**
 * @internal
 * @hidden
 */
export class OptionalValue<C, S, T> extends Type<C, S, T, false> {
    readonly type: IType<C, S, T>
    readonly defaultValue: IOptionalValue<C, S, T>

    get flags() {
        return this.type.flags | TypeFlags.Optional
    }

    constructor(type: IType<C, S, T>, defaultValue: IOptionalValue<C, S, T>) {
        super(type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        return this.type.describe() + "?"
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): this["N"] {
        if (typeof initialValue === "undefined") {
            const defaultInstanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
            return this.type.instantiate(parent, subpath, environment, defaultInstanceOrSnapshot)
        }
        return this.type.instantiate(parent, subpath, environment, initialValue) as any
    }

    reconcile(current: this["N"], newValue: any): this["N"] {
        const ret = this.type.reconcile(
            current,
            this.type.is(newValue) && newValue !== undefined
                ? newValue
                : this.getDefaultInstanceOrSnapshot()
        )
        return ret
    }

    getDefaultInstanceOrSnapshot(): C | S | T {
        const defaultInstanceOrSnapshot =
            typeof this.defaultValue === "function"
                ? (this.defaultValue as IFunctionReturn<C | S | T>)()
                : this.defaultValue

        // while static values are already snapshots and checked on types.optional
        // generator functions must always be rechecked just in case
        if (typeof this.defaultValue === "function") {
            typecheckInternal(this, defaultInstanceOrSnapshot)
        }

        return defaultInstanceOrSnapshot
    }

    public getDefaultValueSnapshot(): S {
        const instanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
        return isStateTreeNode(instanceOrSnapshot)
            ? getStateTreeNode(instanceOrSnapshot).snapshot
            : instanceOrSnapshot
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

/** @hidden */
export type OptionalDefaultValueOrFunction<IT extends IAnyType> =
    | ExtractC<IT>
    | ExtractS<IT>
    | (() => ExtractCST<IT>)

/** @hidden */
export interface IOptionalIType<IT extends IAnyType>
    extends IType<
            ExtractC<IT> | undefined,
            ExtractS<IT>,
            RedefineIStateTreeNode<
                ExtractT<IT>,
                IStateTreeNode<ExtractC<IT> | undefined, ExtractS<IT>>
            >
        >,
        OptionalProperty {}

/**
 * `types.optional` - Can be used to create a property with a default value.
 * If the given value is not provided in the snapshot, it will default to the provided `defaultValue`.
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is _not_ present, causes the value to be reset
 *
 * Example:
 * ```ts
 * const Todo = types.model({
 *   title: types.optional(types.string, "Test"),
 *   done: types.optional(types.boolean, false),
 *   created: types.optional(types.Date, () => new Date())
 * })
 *
 * // it is now okay to omit 'created' and 'done'. created will get a freshly generated timestamp
 * const todo = Todo.create({ title: "Get coffee "})
 * ```
 *
 * @param type
 * @param defaultValueOrFunction
 * @returns
 */
export function optional<IT extends IAnyType>(
    type: IT,
    defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
): IT extends OptionalProperty ? IT : IOptionalIType<IT> {
    // make sure we never pass direct instances
    if (typeof defaultValueOrFunction !== "function" && isStateTreeNode(defaultValueOrFunction)) {
        throw fail(
            "default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead"
        )
    }

    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            throw fail(
                "expected a mobx-state-tree type as first argument, got " + type + " instead"
            )

        // we only check default values if they are passed directly
        // if they are generator functions they will be checked once they are generated
        // we don't check generator function results here to avoid generating a node just for type-checking purposes
        // which might generate side-effects
        if (typeof defaultValueOrFunction !== "function") {
            typecheckInternal(type, defaultValueOrFunction)
        }
    }

    const ret = new OptionalValue(type, defaultValueOrFunction)
    return ret as any
}

/**
 * Returns if a value represents an optional type.
 *
 * @template IT
 * @param type
 * @returns
 */
export function isOptionalType<IT extends IType<any | undefined, any, any> & OptionalProperty>(
    type: IT
): type is IT {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}
