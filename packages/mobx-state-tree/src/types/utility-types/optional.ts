import {
    isStateTreeNode,
    getStateTreeNode,
    IType,
    TypeFlags,
    isType,
    IValidationContext,
    IValidationResult,
    typecheckInternal,
    typeCheckSuccess,
    fail,
    IAnyType,
    ExtractT,
    ExtractS,
    ExtractC,
    ExtractCST,
    RedefineIStateTreeNode,
    IStateTreeNode,
    AnyObjectNode,
    BaseType
} from "../../internal"

type IFunctionReturn<T> = () => T

type IOptionalValue<C, T> = C | IFunctionReturn<C | T>

/**
 * @hidden
 * @internal
 */
export class OptionalValue<IT extends IAnyType, OptionalVal> extends BaseType<
    ExtractC<IT> | OptionalVal,
    ExtractS<IT>,
    RedefineIStateTreeNode<ExtractT<IT>, IStateTreeNode<ExtractC<IT> | OptionalVal, ExtractS<IT>>>
> {
    get flags() {
        return this._subtype.flags | this._typeFlag
    }

    constructor(
        private readonly _subtype: IT,
        private readonly _defaultValue: IOptionalValue<ExtractC<IT>, ExtractT<IT>>,
        readonly optionalValue: OptionalVal,
        private readonly _typeFlag: TypeFlags,
        private readonly _describeSuffix: string
    ) {
        super(_subtype.name)
    }

    describe() {
        return this._subtype.describe() + this._describeSuffix
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: this["C"] | this["T"]
    ): this["N"] {
        if (initialValue === this.optionalValue) {
            const defaultInstanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
            return this._subtype.instantiate(
                parent,
                subpath,
                environment,
                defaultInstanceOrSnapshot
            )
        }
        return this._subtype.instantiate(parent, subpath, environment, initialValue)
    }

    reconcile(current: this["N"], newValue: this["C"] | this["T"]): this["N"] {
        return this._subtype.reconcile(
            current,
            newValue !== this.optionalValue && this._subtype.is(newValue)
                ? newValue
                : this.getDefaultInstanceOrSnapshot()
        )
    }

    getDefaultInstanceOrSnapshot(): this["C"] | this["T"] {
        const defaultInstanceOrSnapshot =
            typeof this._defaultValue === "function"
                ? (this._defaultValue as IFunctionReturn<this["C"] | this["T"]>)()
                : this._defaultValue

        // while static values are already snapshots and checked on types.optional
        // generator functions must always be rechecked just in case
        if (typeof this._defaultValue === "function") {
            typecheckInternal(this, defaultInstanceOrSnapshot)
        }

        return defaultInstanceOrSnapshot
    }

    getDefaultValueSnapshot(): this["S"] {
        const instanceOrSnapshot = this.getDefaultInstanceOrSnapshot()
        return isStateTreeNode(instanceOrSnapshot)
            ? getStateTreeNode(instanceOrSnapshot).snapshot
            : instanceOrSnapshot
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        // defaulted values can be skipped
        if (value === this.optionalValue) {
            return typeCheckSuccess()
        }
        // bounce validation to the sub-type
        return this._subtype.validate(value, context)
    }

    isAssignableFrom(type: IAnyType) {
        return this._subtype.isAssignableFrom(type)
    }

    getSubTypes() {
        return this._subtype
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
        RedefineIStateTreeNode<ExtractT<IT>, IStateTreeNode<ExtractC<IT> | undefined, ExtractS<IT>>>
    > {}

function checkOptionalPreconditions<IT extends IAnyType>(
    type: IAnyType,
    defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
) {
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
}

/**
 * `types.optional` - Can be used to create a property with a default value.
 * If the given value is not provided in the snapshot, it will default to the provided `defaultValue`.
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is _not_ present causes the value to be reset
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
 * const todo = Todo.create({ title: "Get coffee" })
 * ```
 *
 * @param type
 * @param defaultValueOrFunction
 * @returns
 */
export function optional<IT extends IAnyType>(
    type: IT,
    defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>
): IOptionalIType<IT> {
    checkOptionalPreconditions(type, defaultValueOrFunction)

    return new OptionalValue(type, defaultValueOrFunction, undefined, TypeFlags.Optional, "?")
}

/**
 * Returns if a value represents an optional type.
 *
 * @template IT
 * @param type
 * @returns
 */
export function isOptionalType<IT extends IType<any | undefined, any, any>>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}

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
    checkOptionalPreconditions(type, defaultValueOrFunction)

    return new OptionalValue(type, defaultValueOrFunction, null, TypeFlags.OptionalNull, "?(null)")
}

/**
 * Returns if a value represents an optional null type.
 *
 * @template IT
 * @param type
 * @returns
 */
export function isOptionalNullType<IT extends IType<any | null, any, any>>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.OptionalNull) > 0
}
