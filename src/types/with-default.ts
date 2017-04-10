import {Type, IType} from "../core/type"

export class DefaultValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>
    readonly defaultValue: any

    constructor(type: IType<S, T>, defaultValue: S) {
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
        return typeof value === "undefined" ? this.type.create(this.defaultValue) : this.type.create(value)
    }

    is(value: any): value is S | T {
        // defaulted values can be skipped
        return value === undefined || this.type.is(value)
    }

}

export function createDefaultValueFactory<T>(type: IType<T, T>, defaultValueOrNode: T): IType<T, T>;
export function createDefaultValueFactory<S, T>(type: IType<S, T>, defaultValueOrNode: S): IType<S, T>;
export function createDefaultValueFactory(type: IType<any, any>, defaultValueOrNode: any): IType<any, any> {
    const defaultValue = isMST(defaultValueOrNode) ? getMST(defaultValueOrNode).snapshot : defaultValueOrNode
    invariant(type.is(defaultValue), `Default value ${JSON.stringify(defaultValue)} is not assignable to type ${type.name}. Expected ${JSON.stringify(type.describe())}`)
    return new DefaultValue(type, defaultValue)
}

import {isMST, getMST} from "../core/mst-node"
import {invariant} from "../utils"
