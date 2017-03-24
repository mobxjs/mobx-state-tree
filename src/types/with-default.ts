import {IFactory} from "../core/factories"
import {hasNode, getNode} from "../core/node"
import {invariant} from "../utils"
import {Type} from "../core/types"

export class DefaultValue<S, T> extends Type<S, T> {
    readonly type: IFactory<S, T>
    readonly defaultValue: any

    constructor(type: IFactory<S, T>, defaultValue: S) {
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

    is(value: any): value is S | T {
        // defaulted values can be skipped
        return value === undefined || this.type.is(value)
    }

}

export function createDefaultValueFactory<T>(type: IFactory<T, T>, defaultValueOrNode: T): IFactory<T, T>;
export function createDefaultValueFactory<S, T>(type: IFactory<S, T>, defaultValueOrNode: S): IFactory<S, T>;
export function createDefaultValueFactory(type: IFactory<any, any>, defaultValueOrNode: any): IFactory<any, any> {
    const defaultValue = hasNode(defaultValueOrNode) ? getNode(defaultValueOrNode).snapshot : defaultValueOrNode
    invariant(type.is(defaultValue), `Default value ${JSON.stringify(defaultValue)} is not assignable to type ${type.factoryName}. Expected ${JSON.stringify(type.type.describe())}`)
    return new DefaultValue(type, defaultValue).factory
}