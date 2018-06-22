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
    fail
} from "../../internal"

export type IFunctionReturn<T> = () => T
export type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>

export class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>
    readonly defaultValue: IOptionalValue<S, T>

    get flags() {
        return this.type.flags | TypeFlags.Optional
    }

    get shouldAttachNode() {
        return this.type.shouldAttachNode
    }

    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>) {
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

    isAssignableFrom(type: IType<any, any>) {
        return this.type.isAssignableFrom(type)
    }
}

export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>
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
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: any): IType<S, T> {
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

export function isOptionalType(type: any): type is OptionalValue<any, any> {
    return isType(type) && (type.flags & TypeFlags.Optional) > 0
}
