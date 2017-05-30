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
    instantiate(parent: Node | null, subpath: string, environment: any, snapshot?: S): Node
    readValue(node: Node): T
    toSnapshot(node: Node): S
    applySnapshot(node: Node, snapshot: S): void
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void
    getChildren(node: Node): Node[]
    getChildNode(node: Node, key: string): Node
    getChildType(key: string): IType<any, any>
    removeChild(node: Node, subpath: string): void
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

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: S | undefined): Node {
        typecheck(this, snapshot)
        return new Node(this, parent, subpath, environment, snapshot)
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

    readValue(node: Node) {
        return node.storedValue
    }

    toSnapshot(node: Node) {
        return node.storedValue
    }

    applySnapshot(node: Node, snapshot: S): void {
        fail("Immutable types do not support applying snapshots")
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        fail("Immutable types do not support applying patches")
    }

    getChildren(node: Node): Node[] {
        return EMPTY_ARRAY as any
    }

    getChildNode(node: Node, key: string): Node {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    getChildType(key: string): IType<any, any> {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    removeChild(node: Node, subpath: string): void {
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
import { Node, IComplexValue, IJsonPatch } from "../core"

