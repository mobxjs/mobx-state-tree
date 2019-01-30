import { action } from "mobx"

import {
    EMPTY_ARRAY,
    fail,
    isMutable,
    isStateTreeNode,
    getStateTreeNode,
    IValidationContext,
    IValidationResult,
    typecheckInternal,
    typeCheckFailure,
    typeCheckSuccess,
    IStateTreeNode,
    IJsonPatch,
    getType,
    ObjectNode,
    IChildNodesMap,
    ModelPrimitive,
    EMPTY_OBJECT,
    IAnyStateTreeNode,
    normalizeIdentifier,
    AnyObjectNode,
    AnyNode,
    BaseNode,
    ScalarNode
} from "../../internal"

/**
 * @internal
 * @hidden
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

/**
 * Name of the properties of an object that can't be set to undefined
 * @hidden
 */
export type DefinablePropsNames<T> = {
    [K in keyof T]: Extract<T[K], undefined> extends never ? K : never
}[keyof T]

/**
 * Checks if a type is any or unknown
 * @hidden
 */
export type IsTypeAnyOrUnknown<T> = unknown extends T ? true : false

/**
 * Checks if a type supports an empty create() function
 * Basically !any, !unknown, X | undefined, objects with all properties being optional
 * @hidden
 */
export type IsEmptyCreationType<O> = IsTypeAnyOrUnknown<O> extends true
    ? true
    : Extract<O, undefined> extends never
    ? (DefinablePropsNames<O> extends never | undefined ? true : false)
    : true

/**
 * Chooses a create function based on the creation type.
 * @hidden
 */
export type CreateParams<C> = IsEmptyCreationType<C> extends false ? [C, any?] : [C?, any?]

/**
 * A type, either complex or simple.
 */
export interface IType<C, S, T> {
    /**
     * The type name.
     */
    name: string

    create(...args: CreateParams<C>): T
    /**
     * Creates an instance for the type given an snapshot input.
     *
     * @returns An instance of that type.
     */
    create(snapshot: C, env?: any): T // fallback

    /**
     * Checks if a given snapshot / instance is of the given type.
     *
     * @param thing Snapshot or instance to be checked.
     * @returns true if the value is of the current type, false otherwise.
     */
    is(thing: any): thing is C | S | T

    /**
     * Run's the type's typechecker on the given value with the given validation context.
     *
     * @param thing Value to be checked, either a snapshot or an instance.
     * @param context Validation context, an array of { subpaths, subtypes } that should be validated
     * @returns The validation result, an array with the list of validation errors.
     */
    validate(thing: any, context: IValidationContext): IValidationResult

    /**
     * Gets the textual representation of the type as a string.
     */
    describe(): string

    /**
     * @deprecated use `Instance<typeof MyType>` instead.
     * @hidden
     */
    Type: T

    /**
     * @deprecated use `SnapshotOut<typeof MyType>` instead.
     * @hidden
     */
    SnapshotType: S

    /**
     * @deprecated use `SnapshotIn<typeof MyType>` instead.
     * @hidden
     */
    CreationType: C

    // Internal api's
    /**
     * @internal
     * @hidden
     */
    flags: TypeFlags
    /**
     * @internal
     * @hidden
     */
    isType: boolean
    /**
     * @internal
     * @hidden
     */
    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): BaseNode<C, S, T>
    /**
     * @internal
     * @hidden
     */
    initializeChildNodes(node: BaseNode<C, S, T>, snapshot: C): IChildNodesMap
    /**
     * @internal
     * @hidden
     */
    createNewInstance(node: BaseNode<C, S, T>, childNodes: IChildNodesMap, snapshot: C): T
    /**
     * @internal
     * @hidden
     */
    finalizeNewInstance(node: BaseNode<C, S, T>, instance: any): void
    /**
     * @internal
     * @hidden
     */
    reconcile(current: BaseNode<C, S, T>, newValue: any): BaseNode<C, S, T>
    /**
     * @internal
     * @hidden
     */
    getValue(node: BaseNode<C, S, T>): T
    /**
     * @internal
     * @hidden
     */
    getSnapshot(node: BaseNode<C, S, T>, applyPostProcess?: boolean): S
    /**
     * @internal
     * @hidden
     */
    applySnapshot(node: BaseNode<C, S, T>, snapshot: S): void
    /**
     * @internal
     * @hidden
     */
    applyPatchLocally(node: BaseNode<C, S, T>, subpath: string, patch: IJsonPatch): void
    /**
     * @internal
     * @hidden
     */
    getChildren(node: BaseNode<C, S, T>): ReadonlyArray<AnyNode>
    /**
     * @internal
     * @hidden
     */
    getChildNode(node: BaseNode<C, S, T>, key: string): AnyNode
    /**
     * @internal
     * @hidden
     */
    getChildType(key: string): IAnyType
    /**
     * @internal
     * @hidden
     */
    removeChild(node: BaseNode<C, S, T>, subpath: string): void
    /**
     * @internal
     * @hidden
     */
    isAssignableFrom(type: IAnyType): boolean
}

// do not convert to an interface
/**
 * Any kind of type.
 */
export type IAnyType = IType<any, any, any>

/**
 * A simple type, this is, a type where the instance and the snapshot representation are the same.
 */
export interface ISimpleType<T> extends IType<T, T, T> {}

/** @hidden */
export type Primitives = ModelPrimitive | null | undefined

/**
 * A complex type.
 * @deprecated just for compatibility with old versions, could be deprecated on the next major version
 * @hidden
 */
export interface IComplexType<C, S, T> extends IType<C, S, T & IStateTreeNode<C, S>> {}

// do not convert to an interface
/**
 * Any kind of complex type.
 */
export type IAnyComplexType = IType<any, any, IAnyStateTreeNode>

/** @hidden */
export type ExtractC<T extends IAnyType> = T extends IType<infer C, any, any> ? C : never
/** @hidden */
export type ExtractS<T extends IAnyType> = T extends IType<any, infer S, any> ? S : never
/** @hidden */
export type ExtractT<T extends IAnyType> = T extends IType<any, any, infer X> ? X : never
/** @hidden */
export type ExtractCST<IT extends IAnyType> = IT extends IType<infer C, infer S, infer T>
    ? C | S | T
    : never

/**
 * The instance representation of a given type.
 */
export type Instance<T> = T extends IStateTreeNode
    ? T
    : T extends IType<any, any, infer TT>
    ? TT
    : T

/**
 * The input (creation) snapshot representation of a given type.
 */
export type SnapshotIn<T> = T extends IStateTreeNode<infer STNC, any>
    ? STNC
    : T extends IType<infer TC, any, any>
    ? TC
    : T

/**
 * The output snapshot representation of a given type.
 */
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
 * - `SnapshotOrInstance<typeof ModelA> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`
 * - `SnapshotOrInstance<typeof self.a (where self.a is a ModelA)> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`
 *
 * Usually you might want to use this when your model has a setter action that sets a property.
 *
 * Example:
 * ```ts
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
 * ```
 */
export type SnapshotOrInstance<T> = SnapshotIn<T> | Instance<T>

/**
 * A base type produces a MST node (Node in the state tree)
 *
 * @internal
 * @hidden
 */
export abstract class BaseType<C, S, T, N extends BaseNode<C, S, T>>
    implements IType<C, S, T & IStateTreeNode<C, S>> {
    // these are just to make inner types avaialable to inherited classes
    readonly C!: C
    readonly S!: S
    readonly T!: T
    readonly N!: N

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

    initializeChildNodes(node: N, snapshot: any): IChildNodesMap {
        return EMPTY_OBJECT
    }

    createNewInstance(node: N, childNodes: IChildNodesMap, snapshot: C): T {
        return snapshot as any
    }

    finalizeNewInstance(node: N, instance: any): void {}

    abstract instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): N

    abstract flags: TypeFlags
    abstract describe(): string

    abstract applySnapshot(node: N, snapshot: S): void
    abstract getDefaultSnapshot(): C
    abstract getChildren(node: N): ReadonlyArray<AnyNode>
    abstract getChildNode(node: N, key: string): AnyNode
    abstract getValue(node: N): T
    abstract getSnapshot(node: N, applyPostProcess?: boolean): S
    abstract applyPatchLocally(node: N, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IAnyType
    abstract removeChild(node: N, subpath: string): void
    abstract isValidSnapshot(value: any, context: IValidationContext): IValidationResult

    processInitialSnapshot(childNodes: IChildNodesMap, snapshot: C): S {
        return snapshot as any
    }

    isAssignableFrom(type: IAnyType): boolean {
        return type === this
    }

    validate(value: any, context: IValidationContext): IValidationResult {
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

    abstract reconcile(current: N, newValue: any): N

    get Type(): T {
        throw fail(
            "Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`"
        )
    }
    get SnapshotType(): S {
        throw fail(
            "Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`"
        )
    }
    get CreationType(): C {
        throw fail(
            "Factory.CreationType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.CreationType`"
        )
    }
}

/**
 * A complex type produces a MST node (Node in the state tree)
 *
 * @internal
 * @hidden
 */
export abstract class ComplexType<C, S, T> extends BaseType<C, S, T, ObjectNode<C, S, T>> {
    identifierAttribute: string | undefined

    constructor(name: string) {
        super(name)
    }
    reconcile(current: this["N"], newValue: any): this["N"] {
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
}

/**
 * @internal
 * @hidden
 */
export abstract class Type<C, S, T, ScalarN extends boolean = true> extends BaseType<
    C,
    S,
    T,
    ScalarN extends true ? ScalarNode<C, S, T> : BaseNode<C, S, T>
> {
    constructor(name: string) {
        super(name)
    }

    abstract instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: any
    ): this["N"]

    getValue(node: this["N"]): T {
        return node.storedValue
    }

    getSnapshot(node: this["N"]): S {
        return node.storedValue
    }

    getDefaultSnapshot(): C {
        return undefined as any
    }

    applySnapshot(node: this["N"], snapshot: S): void {
        throw fail("Immutable types do not support applying snapshots")
    }

    applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
        throw fail("Immutable types do not support applying patches")
    }

    getChildren(node: this["N"]): AnyNode[] {
        return EMPTY_ARRAY as AnyNode[]
    }

    getChildNode(node: this["N"], key: string): AnyNode {
        throw fail(`No child '${key}' available in type: ${this.name}`)
    }

    getChildType(key: string): IAnyType {
        throw fail(`No child '${key}' available in type: ${this.name}`)
    }

    reconcile(current: this["N"], newValue: any): this["N"] {
        // reconcile only if type and value are still the same
        if (current.type === this && current.storedValue === newValue) return current
        const res = this.instantiate(current.parent, current.subpath, current.environment, newValue)
        current.die()
        return res
    }

    removeChild(node: this["N"], subpath: string): void {
        throw fail(`No child '${subpath}' available in type: ${this.name}`)
    }
}

/**
 * Returns if a given value represents a type.
 *
 * @param value Value to check.
 * @returns `true` if the value is a type.
 */
export function isType(value: any): value is IAnyType {
    return typeof value === "object" && value && value.isType === true
}
