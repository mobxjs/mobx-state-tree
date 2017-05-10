import { identifier } from './identifier';
import {Type, IType, typecheck} from "../type"

export type IFunctionReturn<T> = () => T
export type IDefaultValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>

export class DefaultValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>
    readonly defaultValue: IDefaultValue<S, T>

    constructor(type: IType<S, T>, defaultValue: IDefaultValue<S, T>) {
        super(type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        // return "(" + this.type.type.describe() + " = " + JSON.stringify(this.defaultValue) + ")"
        // MWE: discuss a default value is not part of the type description? (unlike a literal)
        return this.type.describe()
    }

    create(value: any) {
        if (typeof value === "undefined") {
            const defaultValue = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue
            const defaultSnapshot = isMST(defaultValue) ? getMSTAdministration(defaultValue).snapshot : defaultValue
            return this.type.create(defaultSnapshot)
        }

        return this.type.create(value)
    }

    is(value: any): value is S | T {
        // defaulted values can be skipped
        return value === undefined || this.type.is(value)
    }

    get identifierAttribute() {
        return this.type.identifierAttribute
    }
}

export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>
export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>
export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>
export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>
export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrFunction: any): IType<S, T> {
    const defaultValue = typeof defaultValueOrFunction === "function" ? defaultValueOrFunction() : defaultValueOrFunction
    const defaultSnapshot = isMST(defaultValue) ? getMSTAdministration(defaultValue).snapshot : defaultValue
    typecheck(type, defaultSnapshot)
    return new DefaultValue(type, defaultValueOrFunction)
}

import {isMST, getMSTAdministration} from "../../core/mst-node"
