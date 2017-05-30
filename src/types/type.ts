import {action} from "mobx"

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
    Optional = 1 << 9,
    Reference = 1 << 10,
    Identifier = 1 << 11
}

export interface IType<S, T> {
    name: string
    flags: TypeFlags
    is(thing: any): thing is S | T
    validate(thing: any, context: IContext): IValidationResult
    create(snapshot?: S, environment?: any): T
    isType: boolean
    describe(): string
    Type: T
    SnapshotType: S
    identifierAttribute: string | null

    // Internal api's
    instantiate(parent: AbstractNode | null, subpath: string, environment: any, snapshot?: S): AbstractNode
    readValue(node: AbstractNode): T
    toSnapshot(node: AbstractNode): S
    applySnapshot(node: AbstractNode, snapshot: S): void
    applyPatchLocally(node: AbstractNode, subpath: string, patch: IJsonPatch): void
    getChildren(node: AbstractNode): AbstractNode[]
    getChildNode(node: AbstractNode, key: string): AbstractNode
    getChildType(key: string): IType<any, any>
    removeChild(node: AbstractNode, subpath: string): void
}

export interface ISimpleType<T> extends IType<T, T> { }

export interface IComplexType<S, T> extends IType<S, T & ISnapshottable<S> & IComplexValue> { }

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export abstract class Type<S, T> implements IType<S, T> {
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
    }

    instantiate(parent: AbstractNode | null, subpath: string, environment: any, snapshot: S | undefined): AbstractNode {
        typecheck(this, snapshot)
        return new AbstractNode(this, parent, subpath, environment, snapshot)
    }

    abstract flags: TypeFlags
    abstract validate(thing: any, context: IContext): IValidationResult
    abstract describe(): string

    @action create(snapshot?: S, environment?: any): T {
        return this.instantiate(null, "", environment, snapshot).getValue()
    }

    is(value: any): value is S | T {
        return this.validate(
            value,
            [{ path: "", type: this }]
        ).length === 0
    }

    readValue(node: AbstractNode) {
        return node.storedValue
    }

    toSnapshot(node: AbstractNode) {
        return node.storedValue
    }

    applySnapshot(node: AbstractNode, snapshot: S): void {
        fail("Immutable types do not support applying snapshots")
    }

    applyPatchLocally(node: AbstractNode, subpath: string, patch: IJsonPatch): void {
        fail("Immutable types do not support applying patches")
    }

    getChildren(node: AbstractNode): AbstractNode[] {
        return EMPTY_ARRAY as any
    }

    getChildNode(node: AbstractNode, key: string): AbstractNode {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    getChildType(key: string): IType<any, any> {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    removeChild(node: AbstractNode, subpath: string): void {
        return fail(`No child '${subpath}' available in type: ${this.name}`)
    }

    get Type(): T {
        return fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`")
    }
    get SnapshotType(): S {
        return fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`")
    }

    abstract get identifierAttribute(): string | null
}

import { EMPTY_ARRAY, fail } from '../utils';
import {  } from "../core/mst-node"
import { IContext, IValidationResult, typecheck } from "./type-checker"
import { AbstractNode, IComplexValue, IJsonPatch } from "../core"

