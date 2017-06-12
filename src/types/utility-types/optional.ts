import {Type, IType, TypeFlags} from "../type"
import { IContext, IValidationResult, typecheck, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { isStateTreeNode, getStateTreeNode, Node  } from "../../core"

export type IFunctionReturn<T> = () => T
export type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>

export class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>
    readonly defaultValue: IOptionalValue<S, T>

    get flags () {
        return this.type.flags | TypeFlags.Optional
    }

    get snapshottable () {
        return this.type.snapshottable
    }

    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>) {
        super(type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        return this.type.describe() + "?"
    }

    instantiate(parent: Node, subpath: string, environment: any, value: S): Node {
        if (typeof value === "undefined") {
            const defaultValue = this.getDefaultValue()
            const defaultSnapshot = isStateTreeNode(defaultValue) ? getStateTreeNode(defaultValue).snapshot : defaultValue
            return this.type.instantiate(parent, subpath, environment, defaultSnapshot)
        }
        return this.type.instantiate(parent, subpath, environment, value)
    }

    reconcile(current: Node, newValue: any): Node {
        return this.type.reconcile(current, this.type.is(newValue) ? newValue : this.getDefaultValue())
    }

    private getDefaultValue() {
        const defaultValue = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue
        if (typeof this.defaultValue === "function") typecheck(this, defaultValue)
        return defaultValue
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // defaulted values can be skipped
        if (value === undefined || this.type.is(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }
}

export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: any): IType<S, T> {
    const defaultValue = typeof defaultValueOrFunction === "function" ? defaultValueOrFunction() : defaultValueOrFunction
    const defaultSnapshot = isStateTreeNode(defaultValue) ? getStateTreeNode(defaultValue).snapshot : defaultValue
    typecheck(type, defaultSnapshot)
    return new OptionalValue(type, defaultValueOrFunction)
}
