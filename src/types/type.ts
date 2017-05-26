export interface ISnapshottable<S> {}

export enum TypeFlags {
    String  = 1 << 0,
    Number  = 1 << 1,
    Boolean = 1 << 2,
    Date    = 1 << 3,
    Literal = 1 << 4,
    Array   = 1 << 5,
    Map     = 1 << 6,
    Object  = 1 << 7,
    Frozen  = 1 << 8,
    Optional = 1 << 9
}

export interface IType<S, T> {
    name: string
    flags: TypeFlags
    is(thing: any): thing is S | T
    validate(thing: any, context: IContext): IValidationResult
    create(snapshot?: S, environment?: any, parent?: MSTAdministration | null, subpath?: string): T
    isType: boolean
    describe(): string
    Type: T
    SnapshotType: S
    identifierAttribute: string | null
}

export interface ISimpleType<T> extends IType<T, T> { }

export interface IComplexType<S, T> extends IType<S, T & ISnapshottable<S> & IMSTNode> { }

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export abstract class Type<S, T> implements IType<S, T> {
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
    }

    abstract flags: TypeFlags
    abstract create(snapshot: any): any
    abstract validate(thing: any, context: IContext): IValidationResult
    abstract describe(): string

    is(value: any): value is S | T {
        return this.validate(
            value,
            [{ path: "", type: this }]
        ).length === 0
    }

    get Type(): T {
        return fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`")
    }
    get SnapshotType(): S {
        return fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`")
    }

    abstract get identifierAttribute(): string | null
}

import { fail } from "../utils"
import { IMSTNode } from "../core/mst-node"
import { IContext, IValidationResult } from "./type-checker"
import { MSTAdministration } from "../core/mst-node-administration"
