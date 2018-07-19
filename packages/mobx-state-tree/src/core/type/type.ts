import { action } from "mobx"

import {
    EMPTY_ARRAY,
    fail,
    isMutable,
    isStateTreeNode,
    getStateTreeNode,
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure,
    typeCheckSuccess,
    INode,
    IStateTreeNode,
    IJsonPatch,
    getType,
    ObjectNode,
    IChildNodesMap
} from "../../internal"

export enum TypeFlags {
    String = 1,
    Number = 2,
    Boolean = 4,
    Date = 8,
    Literal = 16,
    Array = 32,
    Map = 64,
    Object = 128,
    Frozen = 256,
    Optional = 512,
    Reference = 1024,
    Identifier = 2048,
    Late = 4096,
    Refinement = 8192,
    Union = 16384,
    Null = 32768,
    Undefined = 65536,
    Integer = 131072
}

export interface ISnapshottable<S> {} // TODO: kill this?

export interface IType<C, S, T> {
    name: string
    flags: TypeFlags
    is(thing: any): thing is C | S | T
    validate(thing: any, context: IContext): IValidationResult
    create(snapshot?: C, environment?: any): T
    isType: boolean
    describe(): string
    Type: T
    SnapshotType: S
    CreationType: C

    // Internal api's
    instantiate(parent: INode | null, subpath: string, environment: any, initialValue?: any): INode
    initializeChildNodes(node: INode, snapshot: any): IChildNodesMap | null
    reconcile(current: INode, newValue: any): INode
    getValue(node: INode): T
    getSnapshot(node: INode, applyPostProcess?: boolean): S
    applySnapshot(node: INode, snapshot: C): void
    applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void
    getChildren(node: INode): ReadonlyArray<INode>
    getChildNode(node: INode, key: string): INode
    getChildType(key: string): IAnyType
    removeChild(node: INode, subpath: string): void
    isAssignableFrom(type: IAnyType): boolean
    shouldAttachNode: boolean
}

export type IAnyType = IType<any, any, any>

export interface ISimpleType<T> extends IType<T, T, T> {}

export interface IComplexType<C, S, T> extends IType<C, S, T & IStateTreeNode> {
    create(snapshot?: C, environment?: any): T & { toJSON?(): S } & ISnapshottable<S>
}

/*
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<C, S, T> implements IType<C, S, T> {
    readonly isType = true
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    @action
    create(snapshot: C = this.getDefaultSnapshot(), environment?: any) {
        typecheck(this, snapshot)
        return this.instantiate(null, "", environment, snapshot).value
    }
    initializeChildNodes(node: INode, snapshot: any): IChildNodesMap | null {
        return null
    }

    abstract instantiate(
        parent: INode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): INode

    abstract flags: TypeFlags
    abstract describe(): string

    abstract applySnapshot(node: INode, snapshot: any): void
    abstract getDefaultSnapshot(): any
    abstract getChildren(node: INode): ReadonlyArray<INode>
    abstract getChildNode(node: INode, key: string): INode
    abstract getValue(node: INode): T
    abstract getSnapshot(node: INode, applyPostProcess?: boolean): any
    abstract applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IAnyType
    abstract removeChild(node: INode, subpath: string): void
    abstract isValidSnapshot(value: any, context: IContext): IValidationResult
    abstract shouldAttachNode: boolean

    isAssignableFrom(type: IAnyType): boolean {
        return type === (this as any)
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

    reconcile(current: ObjectNode, newValue: any): INode {
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
                current.identifier === "" + newValue[current.identifierAttribute])
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
    get CreationType(): C {
        return fail(
            "Factory.CreationType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.CreationType`"
        )
    }
}

export abstract class Type<C, S, T> extends ComplexType<C, S, T> implements IType<C, S, T> {
    constructor(name: string) {
        super(name)
    }

    abstract instantiate(
        parent: INode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): INode

    getValue(node: INode) {
        return node.storedValue
    }

    getSnapshot(node: INode) {
        return node.storedValue
    }

    getDefaultSnapshot() {
        return undefined
    }

    applySnapshot(node: INode, snapshot: C): void {
        fail("Immutable types do not support applying snapshots")
    }

    applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void {
        fail("Immutable types do not support applying patches")
    }

    getChildren(node: INode): INode[] {
        return EMPTY_ARRAY as any
    }

    getChildNode(node: INode, key: string): INode {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    getChildType(key: string): IAnyType {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    reconcile(current: INode, newValue: any): INode {
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

    removeChild(node: INode, subpath: string): void {
        return fail(`No child '${subpath}' available in type: ${this.name}`)
    }
}

export function isType(value: any): value is IAnyType {
    return typeof value === "object" && value && value.isType === true
}
