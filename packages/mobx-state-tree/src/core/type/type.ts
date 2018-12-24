import { action } from "mobx"

import {
    EMPTY_ARRAY,
    fail,
    isMutable,
    isStateTreeNode,
    getStateTreeNode,
    IContext,
    IValidationResult,
    typecheckInternal,
    typeCheckFailure,
    typeCheckSuccess,
    INode,
    IStateTreeNode,
    IJsonPatch,
    getType,
    ObjectNode,
    IChildNodesMap,
    ModelPrimitive,
    EMPTY_OBJECT,
    IAnyStateTreeNode,
    normalizeIdentifier
} from "../../internal"

/**
 * @internal
 * @private
 */
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

// name of the properties of an object that can't be set to undefined
export type DefinablePropsNames<T> = {
    [K in keyof T]: Extract<T[K], undefined> extends never ? K : never
}[keyof T]

// checks if a type is any or unknown
export type IsTypeAnyOrUnknown<T> = unknown extends T ? true : false

// checks if a type supports an empty create() function
// basically !any, !unknown, X | undefined, objects with all properties being optional
export type IsEmptyCreationType<O> = IsTypeAnyOrUnknown<O> extends true
    ? true
    : Extract<O, undefined> extends never
    ? (DefinablePropsNames<O> extends never | undefined ? true : false)
    : true

// chooses a create function based on the creation type
export type CreateParams<C> = IsEmptyCreationType<C> extends false ? [C, any?] : [C?, any?]

export interface IType<C, S, T> {
    name: string

    create(...args: CreateParams<C>): T
    create(snapshot: C, env?: any): T // fallback

    is(thing: any): thing is C | S | T
    validate(thing: any, context: IContext): IValidationResult
    describe(): string

    Type: T
    SnapshotType: S
    CreationType: C

    // Internal api's
    /**
     * @internal
     * @private
     */
    flags: TypeFlags
    /**
     * @internal
     * @private
     */
    isType: boolean
    /**
     * @internal
     * @private
     */
    instantiate(parent: INode | null, subpath: string, environment: any, initialValue?: any): INode
    /**
     * @internal
     * @private
     */
    initializeChildNodes(node: INode, snapshot: any): IChildNodesMap
    /**
     * @internal
     * @private
     */
    createNewInstance(node: INode, childNodes: IChildNodesMap, snapshot: any): any
    /**
     * @internal
     * @private
     */
    finalizeNewInstance(node: INode, instance: any): void
    /**
     * @internal
     * @private
     */
    reconcile(current: INode, newValue: any): INode
    /**
     * @internal
     * @private
     */
    getValue(node: INode): T
    /**
     * @internal
     * @private
     */
    getSnapshot(node: INode, applyPostProcess?: boolean): S
    /**
     * @internal
     * @private
     */
    applySnapshot(node: INode, snapshot: C): void
    /**
     * @internal
     * @private
     */
    applyPatchLocally(node: INode, subpath: string, patch: IJsonPatch): void
    /**
     * @internal
     * @private
     */
    getChildren(node: INode): ReadonlyArray<INode>
    /**
     * @internal
     * @private
     */
    getChildNode(node: INode, key: string): INode
    /**
     * @internal
     * @private
     */
    getChildType(key: string): IAnyType
    /**
     * @internal
     * @private
     */
    removeChild(node: INode, subpath: string): void
    /**
     * @internal
     * @private
     */
    isAssignableFrom(type: IAnyType): boolean
    /**
     * @internal
     * @private
     */
    shouldAttachNode: boolean
}

// do not convert to an interface
export type IAnyType = IType<any, any, any>

export interface ISimpleType<T> extends IType<T, T, T> {}

export type Primitives = ModelPrimitive | null | undefined

// just for compatibility with old versions, could be deprecated on the next major version
export interface IComplexType<C, S, T> extends IType<C, S, T & IStateTreeNode<C, S>> {}

// do not convert to an interface
export type IAnyComplexType = IType<any, any, IAnyStateTreeNode>

export type ExtractC<T extends IAnyType> = T extends IType<infer C, any, any> ? C : never
export type ExtractS<T extends IAnyType> = T extends IType<any, infer S, any> ? S : never
export type ExtractT<T extends IAnyType> = T extends IType<any, any, infer X> ? X : never
export type ExtractCST<IT extends IAnyType> = IT extends IType<infer C, infer S, infer T>
    ? C | S | T
    : never

export type Instance<T> = T extends IStateTreeNode
    ? T
    : T extends IType<any, any, infer TT>
    ? TT
    : T
export type SnapshotIn<T> = T extends IStateTreeNode<infer STNC, any>
    ? STNC
    : T extends IType<infer TC, any, any>
    ? TC
    : T
export type SnapshotOut<T> = T extends IStateTreeNode<any, infer STNS>
    ? STNS
    : T extends IType<any, infer TS, any>
    ? TS
    : T

/**
 * A type which is equivalent to the union of SnapshotIn and Instance types of a given typeof TYPE or typeof VARIABLE.
 * For primitives it defaults to the primitive itself.
 *
 * For example:
 * - SnapshotOrInstance<typeof ModelA> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>
 * - SnapshotOrInstance<typeof self.a (where self.a is a ModelA)> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>
 *
 * Usually you might want to use this when your model has a setter action that sets a property.
 *
 * @example
 * const ModelA = types.model({
 *   n: types.number
 * })
 *
 * const ModelB = types.model({
 *   innerModel: ModelA
 * }).actions(self => ({
 *   // this will accept as property both the snapshot and the instance, whichever is preferred
 *   setInnerModel(m: SnapshotOrInstance<typeof self.innerModel>) {
 *     self.innerModel = cast(m)
 *   }
 * }))
 */
export type SnapshotOrInstance<T> = SnapshotIn<T> | Instance<T>

/**
 * A complex type produces a MST node (Node in the state tree)
 *
 * @internal
 * @private
 */
export abstract class ComplexType<C, S, T> implements IType<C, S, T & IStateTreeNode<C, S>> {
    readonly isType = true
    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    @action
    create(snapshot: C = this.getDefaultSnapshot(), environment?: any) {
        typecheckInternal(this, snapshot)
        return this.instantiate(null, "", environment, snapshot).value
    }

    initializeChildNodes(node: INode, snapshot: any): IChildNodesMap {
        return EMPTY_OBJECT
    }

    createNewInstance(node: INode, childNodes: IChildNodesMap, snapshot: any): any {
        return snapshot
    }

    finalizeNewInstance(node: INode, instance: any) {}

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

    processInitialSnapshot(childNodes: IChildNodesMap, snapshot: any): any {
        return snapshot
    }

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
                current.identifier === normalizeIdentifier(newValue[current.identifierAttribute]))
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
        return this.instantiate(parent, subpath, current.environment, newValue)
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

/**
 * @internal
 * @private
 */
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
        const res = this.instantiate(current.parent, current.subpath, current.environment, newValue)
        current.die()
        return res
    }

    removeChild(node: INode, subpath: string): void {
        return fail(`No child '${subpath}' available in type: ${this.name}`)
    }
}

/**
 * Returns if a given value represents a type.
 *
 * @export
 * @param {*} value
 * @returns {value is IAnyType}
 */
export function isType(value: any): value is IAnyType {
    return typeof value === "object" && value && value.isType === true
}
