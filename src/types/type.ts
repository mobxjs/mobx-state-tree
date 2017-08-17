import { action } from "mobx"
import { TypeFlags } from "./type-flags"

export interface ISnapshottable<S> {}

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

    // Internal api's
    instantiate(parent: Node | null, subpath: string, environment: any, initialValue?: any): Node
    reconcile(current: Node, newValue: any): Node
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

export interface ISimpleType<T> extends IType<T, T> {}

export interface IComplexType<S, T> extends IType<S, T & IStateTreeNode> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>
}

/*
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<S, T> implements IType<S, T> {
    readonly isType = true
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    @action
    create(snapshot: S = this.getDefaultSnapshot(), environment?: any) {
        typecheck(this, snapshot)
        return this.instantiate(null, "", environment, snapshot).value
    }

    abstract instantiate(
        parent: Node | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): Node

    abstract flags: TypeFlags
    abstract describe(): string

    abstract applySnapshot(node: Node, snapshot: any): void
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
        if (isStateTreeNode(value)) {
            return getType(value) === this || this.isAssignableFrom(getType(value))
                ? typeCheckSuccess()
                : typeCheckFailure(context, value)
            // it is tempting to compare snapshots, but in that case we should always clone on assignments...
        }
        return this.isValidSnapshot(value, context)
    }

    is(value: any): value is S | T {
        return this.validate(value, [{ path: "", type: this }]).length === 0
    }

    reconcile(current: Node, newValue: any): Node {
        if (current.snapshot === newValue)
            // newValue is the current snapshot of the node, noop
            return current
        if (isStateTreeNode(newValue) && getStateTreeNode(newValue) === current)
            // the current node is the same as the new one
            return current
        if (
            current.type === this &&
            isMutable(newValue) &&
            !isStateTreeNode(newValue) &&
            (!current.identifierAttribute ||
                current.identifier === newValue[current.identifierAttribute])
        ) {
            // the newValue has no node, so can be treated like a snapshot
            // we can reconcile
            current.applySnapshot(newValue)
            return current
        }
        // current node cannot be recycled in any way
        const { parent, subpath } = current
        current.die()
        // attempt to reuse the new one
        if (isStateTreeNode(newValue) && this.isAssignableFrom(getType(newValue))) {
            // newValue is a Node as well, move it here..
            const newNode = getStateTreeNode(newValue)
            newNode.setParent(parent, subpath)
            return newNode
        }
        // nothing to do, we have to create a new node
        return this.instantiate(parent, subpath, current._environment, newValue)
    }

    get Type(): T {
        return fail(
            "Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`"
        )
    }
    get SnapshotType(): S {
        return fail(
            "Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`"
        )
    }
}

export abstract class Type<S, T> extends ComplexType<S, T> implements IType<S, T> {
    constructor(name: string) {
        super(name)
    }

    abstract instantiate(
        parent: Node | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): Node

    getValue(node: Node) {
        return node.storedValue
    }

    getSnapshot(node: Node) {
        return node.storedValue
    }

    getDefaultSnapshot() {
        return undefined
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

    reconcile(current: Node, newValue: any): Node {
        // reconcile only if type and value are still the same
        if (current.type === this && current.storedValue === newValue) return current
        const res = this.instantiate(
            current.parent,
            current.subpath,
            current._environment,
            newValue
        )
        current.die()
        return res
    }

    removeChild(node: Node, subpath: string): void {
        return fail(`No child '${subpath}' available in type: ${this.name}`)
    }
}

import { EMPTY_ARRAY, fail, isMutable } from "../utils"
import { isStateTreeNode, getStateTreeNode } from "../core/node"
import {
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure,
    typeCheckSuccess
} from "./type-checker"
import { Node, IStateTreeNode, IJsonPatch } from "../core"
import { getType } from "../core/mst-operations"
