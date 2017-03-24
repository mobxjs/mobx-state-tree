import {IFactory} from "../core/factories"
import {hasNode, getNode} from "../core/node"
import {invariant} from "../utils"
import {Type} from "../core/types"

export class DefaultValue extends Type {
    readonly type: IFactory<any, any>
    readonly defaultValue: any

    constructor(type: IFactory<any, any>, defaultValue: any) {
        super(type.type.name)
        this.type = type
        this.defaultValue = defaultValue
    }

    describe() {
        // return "(" + this.type.type.describe() + " = " + JSON.stringify(this.defaultValue) + ")"
        // MWE: discuss a default value is not part of the type description? (unlike a literal)
        return this.type.type.describe()
    }

    create(value: any) {
        return typeof value === "undefined" ? this.type.create(this.defaultValue) : this.type.create(value)
    }

    is(value: any) {
        // defaulted values can be skipped
        return value === undefined || this.type.is(value)
    }

}

// TODO: improve typings to S } void or something?
export function createDefaultValueFactory<S, T>(type: IFactory<S, T>, defaultValueOrNode: S | T): IFactory<S, T>;
export function createDefaultValueFactory<S, T>(type: IFactory<S, T>, defaultValueOrNode: any): IFactory<S, T>; /* any snapshot, as snapshots cannot properly typed yet */
export function createDefaultValueFactory<S, T>(type: IFactory<S, T>, defaultValueOrNode: S | T): IFactory<S, T> {
    const defaultValue = hasNode(defaultValueOrNode) ? getNode(defaultValueOrNode).snapshot : defaultValueOrNode
    invariant(type.is(defaultValue), `Default value ${JSON.stringify(defaultValue)} is not assignable to type ${type.factoryName}. Expected ${JSON.stringify(type.type.describe())}`)
    return new DefaultValue(type, defaultValue).factory
}