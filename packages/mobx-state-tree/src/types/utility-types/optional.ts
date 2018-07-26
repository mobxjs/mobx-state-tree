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
    typecheck,
    typeCheckSuccess,
    fail,
    IAnyType,
    IComplexType
} from "../../internal"

export type IFunctionReturn<T> = () => T
export type IOptionalValue<C, S, T> = C | S | T | IFunctionReturn<C | S | T>

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
            const defaultSnapshot = this.getDefaultValueSnapshot()
            return this.type.instantiate(parent, subpath, environment, defaultSnapshot)
        }
        return this.type.instantiate(parent, subpath, environment, value)
    }

    reconcile(current: INode, newValue: any): INode {
        return this.type.reconcile(
            current,
            this.type.is(newValue) && newValue !== undefined ? newValue : this.getDefaultValue()
        )
    }

    private getDefaultValue() {
        const defaultValue =
            typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue
        if (typeof this.defaultValue === "function") typecheck(this, defaultValue)
        return defaultValue
    }

    public getDefaultValueSnapshot() {
        const defaultValue = this.getDefaultValue()
        return isStateTreeNode(defaultValue)
            ? getStateTreeNode(defaultValue).snapshot
            : defaultValue
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
    defaultValueOrFunction: C | S | T
): IComplexType<C | undefined, S, T> & { flags: TypeFlags.Optional }
export function optional<C, S, T>(
    type: IComplexType<C, S, T>,
    defaultValueOrFunction: () => C | S | T
): IComplexType<C | undefined, S, T> & { flags: TypeFlags.Optional }

export function optional<C, S, T>(
    type: IType<C, S, T>,
    defaultValueOrFunction: C | S | T
): IType<C | undefined, S, T> & { flags: TypeFlags.Optional }
export function optional<C, S, T>(
    type: IType<C, S, T>,
    defaultValueOrFunction: () => C | S | T
): IType<C | undefined, S, T> & { flags: TypeFlags.Optional }
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
export function optional(
    type: IAnyType,
    defaultValueOrFunction: any
): IAnyType & { flags: TypeFlags.Optional } {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected a mobx-state-tree type as first argument, got " + type + " instead")
        const defaultValue =
            typeof defaultValueOrFunction === "function"
                ? defaultValueOrFunction()
                : defaultValueOrFunction
        const defaultSnapshot = isStateTreeNode(defaultValue)
            ? getStateTreeNode(defaultValue).snapshot
            : defaultValue
        typecheck(type, defaultSnapshot)
    }
    return new OptionalValue(type, defaultValueOrFunction)
}

export function isOptionalType<
    IT extends IType<any | undefined, any, any> & { flags: TypeFlags.Optional }
>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}
