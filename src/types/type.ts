import { action } from "mobx"

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
    getValue(node: Node): T
    getSnapshot(node: Node): S
    applySnapshot(node: Node, snapshot: S): void
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void
    getChildren(node: Node): Node[]
    getChildNode(node: Node, key: string): Node
    getChildType(key: string): IType<any, any>
    removeChild(node: Node, subpath: string): void
    isAssignableFrom(type: IType<any, any>): boolean
}

export interface ISimpleType<T> extends IType<T, T> { }

export interface IComplexType<S, T> extends IType<S, T & ISnapshottable<S> & IComplexValue> { }

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

function toJSON(this: IMSTNode) {
    return getComplexNode(this).snapshot
}

/**
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<S, T> implements IType<S, T> {
    readonly isType = true
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    @action create(snapshot: S = this.getDefaultSnapshot(), environment?: any): T {
        typecheck(this, snapshot)
        return this.instantiate(null, "", environment, snapshot).getValue()
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any = this.getDefaultSnapshot()): Node {
        const instance = this.createNewInstance(snapshot)
        // tslint:disable-next-line:no_unused-variable
        const node = new Node(this, parent, subpath, environment, instance)

        if (this.shouldAttachNode) addHiddenFinalProp(instance, "$treenode", node)

        let sawException = true
        try {
            node.pseudoAction(() => {
                this.finalizeNewInstance(instance, snapshot)
            })
            if (this.shouldAttachNode) addReadOnlyProp(instance, "toJSON", toJSON)
            node.fireHook("afterCreate")
            if (parent)
                node.fireHook("afterAttach")
            sawException = false
            return node
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                (node as any)._isAlive = false
            }
        }
    }

    abstract flags: TypeFlags
    abstract shouldAttachNode: boolean
    abstract describe(): string

    abstract createNewInstance(snapshot: any): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: Node, snapshot: any): void
    // TODO: Maybe optional could resolve to this if omitted?
    abstract getDefaultSnapshot(): any
    abstract getChildren(node: Node): Node[]
    abstract getChildNode(node: Node, key: string): Node
    abstract getValue(node: Node): T
    abstract getSnapshot(node: Node): any
    abstract applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract removeChild(node: Node, subpath: string): void
    abstract isValidSnapshot(value: any, context: IContext): IValidationResult


    isAssignableFrom(type: IType<any, any>): boolean {
        return type === this
    }

    validate(value: any, context: IContext): IValidationResult {
        if (isMST(value)) {
            return getType(value) === this || this.isAssignableFrom(getType(value)) ? typeCheckSuccess() : typeCheckFailure(context, value)
            // it is tempting to compare snapshots, but in that case we should always clone on assignments...
        }
        return this.isValidSnapshot(
            value,
            context
        )
    }

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

export interface IMSTNode {
    readonly $treenode?: Node
}

export function isMST(value: any): value is IMSTNode {
    return value && value.$treenode
}

export abstract class Type<S, T> extends ComplexType<S, T> implements IType<S, T> {
    shouldAttachNode = false

    constructor(name: string) {
        super(name)
    }

    getValue(node: Node) {
        return node.storedValue
    }

    getSnapshot(node: Node) {
        return node.storedValue
    }

    getDefaultSnapshot(){
        return undefined
    }

    createNewInstance(snapshot: S) {
        return snapshot
    }

    finalizeNewInstance(target: T, snapshot: S) {

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
}

import { EMPTY_ARRAY, fail, addReadOnlyProp, addHiddenFinalProp } from "../utils";
import { isComplexValue, getComplexNode } from "../core/node"
import { IContext, IValidationResult, typecheck, typeCheckFailure, typeCheckSuccess } from "./type-checker"
import { Node, IComplexValue, IJsonPatch } from "../core"
import { getType } from "../core/mst-operations"

