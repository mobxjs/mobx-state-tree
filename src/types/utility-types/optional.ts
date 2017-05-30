import {Type, IType, TypeFlags} from "../type"
import { IContext, IValidationResult, typecheck, typeCheckSuccess, typeCheckFailure } from "../type-checker"

export type IFunctionReturn<T> = () => T
export type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>

export class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>
    readonly defaultValue: IOptionalValue<S, T>

    get flags () {
        return this.type.flags | TypeFlags.Optional
    }

    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>) {
        super(type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        // return "(" + this.type.type.describe() + " = " + JSON.stringify(this.defaultValue) + ")"
        // MWE: discuss a default value is not part of the type description? (unlike a literal)
        return this.type.describe() + "?"
    }

    instantiate(parent: ComplexNode, subpath: string, environment: any, value: S): AbstractNode {
        if (typeof value === "undefined") {
            const defaultValue = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue
            const defaultSnapshot = isMST(defaultValue) ? getMSTAdministration(defaultValue).snapshot : defaultValue
            return this.type.instantiate(parent, subpath, environment, defaultSnapshot)
        }

        return this.type.instantiate(parent, subpath, environment, value)
    }

    validate(value: any, context: IContext): IValidationResult {
        // defaulted values can be skipped
        if (value === undefined || this.type.is(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }

    get identifierAttribute() {
        return this.type.identifierAttribute
    }
}

export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: any): IType<S, T> {
    const defaultValue = typeof defaultValueOrFunction === "function" ? defaultValueOrFunction() : defaultValueOrFunction
    const defaultSnapshot = isMST(defaultValue) ? getMSTAdministration(defaultValue).snapshot : defaultValue
    typecheck(type, defaultSnapshot)
    return new OptionalValue(type, defaultValueOrFunction)
}

import { isMST, getMSTAdministration, ComplexNode, AbstractNode  } from "../../core"

