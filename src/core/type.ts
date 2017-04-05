
export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export interface IType<S, T> {
    name: string
    is(thing: any): thing is S | T
    create(snapshot?: S): T
    isType: boolean
    describe(): string,
    Type: T
    SnapshotType: S
}

export abstract class Type<S, T> implements IType<S, T> { // TODO: generic for config and state of target
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
        this.create = action(this.name, this.create) // TODO: only do this for complex types
    }

    abstract create(snapshot: any): any
    abstract is(thing: any): thing is S | T
    abstract describe(): string

    get Type(): T {
        return fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`")
    }
    get SnapshotType(): S {
        return fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`")
    }
}

export function typecheck(type: IType<any, any>, snapshot: any) {
    if (!type.is(snapshot))
        fail(`Snapshot ${JSON.stringify(snapshot)} is not assignable to type ${type.name}. Expected ${type.describe()} instead.`)
}

import {action} from "mobx"
import {fail} from "../utils"
