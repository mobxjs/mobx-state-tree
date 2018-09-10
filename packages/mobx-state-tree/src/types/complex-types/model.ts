import {
    _getAdministration,
    _interceptReads,
    action,
    computed,
    intercept,
    getAtom,
    IObjectWillChange,
    IObservableObject,
    isComputedProp,
    observable,
    observe,
    set
} from "mobx"
import {
    addHiddenFinalProp,
    addHiddenWritableProp,
    ArrayType,
    ComplexType,
    createActionInvoker,
    createNode,
    EMPTY_ARRAY,
    EMPTY_OBJECT,
    escapeJsonPath,
    ExtractIStateTreeNode,
    fail,
    flattenTypeErrors,
    freeze,
    getContextForPath,
    getPrimitiveFactoryFromValue,
    getStateTreeNode,
    IAnyType,
    IChildNodesMap,
    IComplexType,
    IContext,
    IJsonPatch,
    INode,
    isPlainObject,
    isPrimitive,
    isStateTreeNode,
    IStateTreeNode,
    isType,
    IType,
    IValidationResult,
    mobxShallow,
    ObjectNode,
    optional,
    OptionalValue,
    MapType,
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    SelfType,
    SelfTypeC,
    IArrayType,
    IMapType,
    IMaybeType,
    IMaybeNullType,
    ExtractC,
    ExtractS,
    ExtractT,
    late
} from "../../internal"
import { Suc } from "./type-utils"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"
const POST_PROCESS_SNAPSHOT = "postProcessSnapshot"

/**
 * @internal
 * @private
 */
export enum HookNames {
    afterCreate = "afterCreate",
    afterAttach = "afterAttach",
    beforeDetach = "beforeDetach",
    beforeDestroy = "beforeDestroy"
}

export interface ModelProperties {
    [key: string]: IAnyType
}

export type ModelPrimitive = string | number | boolean | Date

export interface ModelPropertiesDeclaration {
    [key: string]: ModelPrimitive | IAnyType
}

/**
 * Unmaps syntax property declarations to a map of { propName: IType }
 */
export type ModelPropertiesDeclarationToProperties<T extends ModelPropertiesDeclaration> = {
    [K in keyof T]: T[K] extends string
        ? IType<string | undefined, string, string> & OptionalProperty
        : T[K] extends number
            ? IType<number | undefined, number, number> & OptionalProperty
            : T[K] extends boolean
                ? IType<boolean | undefined, boolean, boolean> & OptionalProperty
                : T[K] extends Date
                    ? IType<number | Date | undefined, number, Date> & OptionalProperty
                    : T[K] extends IAnyType ? T[K] : never
}

export interface OptionalProperty {
    // fake, only used for typing
    readonly $optionalType: undefined
}

export type RequiredPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalProperty ? never : K
}[keyof T]
export type OptionalPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalProperty ? K : never
}[keyof T]

export type RequiredProps<T> = Pick<T, RequiredPropNames<T>>
export type OptionalProps<T> = Pick<T, OptionalPropNames<T>>

/**
 * Maps property types to the snapshot, including omitted optional attributes
 */
export type ModelCreationType<T extends ModelPropertiesDeclarationToProperties<any>> = {
    [K in keyof RequiredProps<T>]: T[K] extends IType<infer C, any, any> ? C : never
} &
    { [K in keyof OptionalProps<T>]?: T[K] extends IType<infer C, any, any> ? C : never }

export type ModelSnapshotType<T extends ModelPropertiesDeclarationToProperties<any>> = {
    [K in keyof T]: T[K] extends IType<any, infer S, any> ? S : never
}

export type ModelInstanceType<T extends ModelPropertiesDeclarationToProperties<any>, O, C, S> = {
    [K in keyof T]: T[K] extends IType<infer TC, infer TS, infer TM>
        ? ExtractIStateTreeNode<TC, TS, TM>
        : never
} &
    O &
    IStateTreeNode<C, S>

export interface ModelActions {
    [key: string]: Function
}

export interface IModelType<
    PROPS extends ModelProperties,
    OTHERS,
    C = ModelCreationType<PROPS>,
    S = ModelSnapshotType<PROPS>,
    T = ModelInstanceType<PROPS, OTHERS, C, S>
> extends IComplexType<C, S, T> {
    readonly properties: PROPS
    named(newName: string): this
    props<PROPS2 extends ModelPropertiesDeclaration>(
        props: PROPS2 | ((selfType: SelfType) => PROPS2)
    ): ResolveSelfTypeModel<
        IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, OTHERS>,
        0
    >
    views<V extends Object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, C, S>) => V
    ): IModelType<PROPS, OTHERS & V>
    actions<A extends ModelActions>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, C, S>) => A
    ): IModelType<PROPS, OTHERS & A>
    volatile<TP extends object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, C, S>) => TP
    ): IModelType<PROPS, OTHERS & TP>
    extend<A extends ModelActions = {}, V extends Object = {}, VS extends Object = {}>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, C, S>) => { actions?: A; views?: V; state?: VS }
    ): IModelType<PROPS, OTHERS & A & V & VS>
    preProcessSnapshot<NewC = C>(fn: (snapshot: NewC) => C): IModelType<PROPS, OTHERS, NewC, S>
    postProcessSnapshot<NewS = S>(fn: (snapshot: S) => NewS): IModelType<PROPS, OTHERS, C, NewS>
}

// do not make this an interface (#994 will happen again if done)
export type IAnyModelType = IModelType<any, any, any, any, any>

export type ExtractProps<T extends IAnyModelType> = T extends IModelType<infer P, any> ? P : never
export type ExtractOthers<T extends IAnyModelType> = T extends IModelType<any, infer O> ? O : never

// types for self resolution

// these two types are fake and only for typings
export interface SelfTypeC {
    readonly $typeRef: "self"
}

export interface SelfType extends IComplexType<SelfTypeC, SelfTypeC, SelfTypeC> {}

// resolution up to 10 levels deep
export type ResolveSelfTypeModel<M extends IAnyModelType, Times extends number> = Times extends 10
    ? M
    : M extends IModelType<infer P, infer O>
        ? IModelType<ResolveSelfTypeProps<P, M, Suc<Times>>, O>
        : never

export type ResolveSelfTypeProps<P, M extends IAnyModelType, Times extends number> = {
    [k in keyof P]: ResolveSelfTypeProp<P[k], M, Times>
}

// supports prop: self, maybe(self), maybeNull(self), array(self), map(self)
export type ResolveSelfTypeProp<
    T,
    M extends IAnyModelType,
    Times extends number,
    RM extends IAnyModelType = ResolveSelfTypeModel<M, Times>
> = T extends SelfType
    ? RM
    : T extends IArrayType<SelfTypeC, any, any>
        ? IArrayType<ExtractC<RM>, ExtractS<RM>, ExtractT<RM>>
        : T extends IMapType<SelfTypeC, any, any>
            ? IMapType<ExtractC<RM>, ExtractS<RM>, ExtractT<RM>>
            : T extends IMaybeType<SelfType>
                ? IMaybeType<RM>
                : T extends IMaybeNullType<SelfType> ? IMaybeNullType<RM> : T
// end of types for types.self resolution

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

/**
 * @internal
 * @private
 */
export interface ModelTypeConfig {
    name?: string
    properties?: ModelProperties | ((selfType: SelfType) => ModelProperties)
    initializers?: ReadonlyArray<((instance: any) => any)>
    preProcessor?: (snapshot: any) => any
    postProcessor?: (snapshot: any) => any
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    initializers: EMPTY_ARRAY
}

function toPropertiesObject<T>(declaredProps: ModelPropertiesDeclaration): ModelProperties {
    // loop through properties and ensures that all items are types
    return Object.keys(declaredProps).reduce(
        (props, key) => {
            // warn if user intended a HOOK
            if (key in HookNames)
                return fail(
                    `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                )

            // the user intended to use a view
            const descriptor = Object.getOwnPropertyDescriptor(props, key)!
            if ("get" in descriptor) {
                fail("Getters are not supported as properties. Please use views instead")
            }
            // undefined and null are not valid
            const value = descriptor.value
            if (value === null || value === undefined) {
                fail(
                    "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
                )
                // its a primitive, convert to its type
            } else if (isPrimitive(value)) {
                return Object.assign({}, props, {
                    [key]: optional(getPrimitiveFactoryFromValue(value), value)
                })
                // map defaults to empty object automatically for models
            } else if (value instanceof MapType) {
                return Object.assign({}, props, {
                    [key]: optional(value, {})
                })
            } else if (value instanceof ArrayType) {
                return Object.assign({}, props, { [key]: optional(value, []) })
                // its already a type
            } else if (isType(value)) {
                return props
                // its a function, maybe the user wanted a view?
            } else if (process.env.NODE_ENV !== "production" && typeof value === "function") {
                fail(
                    `Invalid type definition for property '${key}', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?`
                )
                // no other complex values
            } else if (process.env.NODE_ENV !== "production" && typeof value === "object") {
                fail(
                    `Invalid type definition for property '${key}', it looks like you passed an object. Try passing another model type or a types.frozen.`
                )
                // WTF did you pass in mate?
            } else {
                fail(
                    `Invalid type definition for property '${key}', cannot infer a type from a value like '${value}' (${typeof value})`
                )
            }
        },
        declaredProps as any
    )
}

/**
 * @internal
 * @private
 */
export class ModelType<S extends ModelProperties, T> extends ComplexType<any, any, any>
    implements IModelType<S, T> {
    readonly flags = TypeFlags.Object
    shouldAttachNode = true

    /*
     * The original object definition
     */
    public readonly identifierAttribute: string | undefined
    public readonly initializers!: ((instance: any) => any)[]
    public readonly properties: any

    private preProcessor!: (snapshot: any) => any | undefined
    private postProcessor!: (snapshot: any) => any | undefined
    private readonly propertyNames: string[]

    constructor(opts: ModelTypeConfig, oldProps: ModelProperties) {
        super(opts.name || defaultObjectOptions.name)
        const name = opts.name || defaultObjectOptions.name

        const newProps =
            typeof opts.properties === "function"
                ? opts.properties(late(() => this))
                : opts.properties
        opts.properties = { ...oldProps, ...newProps }

        // TODO: this test still needed?
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties) as S
        freeze(this.properties) // make sure nobody messes with it
        this.propertyNames = Object.keys(this.properties)
        this.identifierAttribute = this._getIdentifierAttribute()
    }

    private _getIdentifierAttribute(): string | undefined {
        let identifierAttribute: string | undefined = undefined
        this.forAllProps((propName, propType) => {
            if (propType.flags & TypeFlags.Identifier) {
                if (identifierAttribute)
                    fail(
                        `Cannot define property '${propName}' as object identifier, property '${identifierAttribute}' is already defined as identifier property`
                    )
                identifierAttribute = propName
            }
        })
        return identifierAttribute
    }

    cloneAndEnhance(opts: ModelTypeConfig): ModelType<any, any> {
        return new ModelType(
            {
                name: opts.name || this.name,
                properties: opts.properties,
                initializers: this.initializers.concat((opts.initializers as any) || []),
                preProcessor: opts.preProcessor || this.preProcessor,
                postProcessor: opts.postProcessor || this.postProcessor
            },
            this.properties
        )
    }

    actions(fn: (self: any) => any): any {
        const actionInitializer = (self: T) => {
            this.instantiateActions(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [actionInitializer] })
    }

    instantiateActions(self: T, actions: any) {
        // check if return is correct
        if (!isPlainObject(actions))
            fail(`actions initializer should return a plain object containing actions`)
        // bind actions to the object created
        Object.keys(actions).forEach(name => {
            // warn if preprocessor was given
            if (name === PRE_PROCESS_SNAPSHOT)
                fail(
                    `Cannot define action '${PRE_PROCESS_SNAPSHOT}', it should be defined using 'type.preProcessSnapshot(fn)' instead`
                )
            // warn if postprocessor was given
            if (name === POST_PROCESS_SNAPSHOT)
                fail(
                    `Cannot define action '${POST_PROCESS_SNAPSHOT}', it should be defined using 'type.postProcessSnapshot(fn)' instead`
                )

            // apply hook composition
            let action2 = actions[name]
            let baseAction = (self as any)[name]
            if (name in HookNames && baseAction) {
                let specializedAction = action2
                action2 = function() {
                    baseAction.apply(null, arguments)
                    specializedAction.apply(null, arguments)
                }
            }
            // See #646, allow models to be mocked
            ;(process.env.NODE_ENV === "production" ? addHiddenFinalProp : addHiddenWritableProp)(
                self,
                name,
                createActionInvoker(self, name, action2)
            )
        })
    }

    named(name: string): this {
        return this.cloneAndEnhance({ name }) as this
    }

    props(
        properties:
            | ModelPropertiesDeclaration
            | ((selfType: SelfType) => ModelPropertiesDeclaration)
    ): any {
        return this.cloneAndEnhance({ properties } as any)
    }

    volatile(fn: (self: any) => any): any {
        const stateInitializer = (self: T) => {
            this.instantiateVolatileState(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [stateInitializer] })
    }

    instantiateVolatileState(self: T, state: Object) {
        // check views return
        if (!isPlainObject(state))
            fail(`volatile state initializer should return a plain object containing state`)
        set(self, state)
    }

    extend(fn: (self: any) => any): any {
        const initializer = (self: T) => {
            const { actions, views, state, ...rest } = fn(self)
            for (let key in rest)
                fail(
                    `The \`extend\` function should return an object with a subset of the fields 'actions', 'views' and 'state'. Found invalid key '${key}'`
                )
            if (state) this.instantiateVolatileState(self, state)
            if (views) this.instantiateViews(self, views)
            if (actions) this.instantiateActions(self, actions)
            return self
        }
        return this.cloneAndEnhance({ initializers: [initializer] })
    }

    views(fn: (self: any) => any): any {
        const viewInitializer = (self: T) => {
            this.instantiateViews(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [viewInitializer] })
    }

    instantiateViews(self: T, views: Object) {
        // check views return
        if (!isPlainObject(views))
            fail(`views initializer should return a plain object containing views`)
        Object.keys(views).forEach(key => {
            // is this a computed property?
            const descriptor = Object.getOwnPropertyDescriptor(views, key)!
            const { value } = descriptor
            if ("get" in descriptor) {
                if (isComputedProp(self, key)) {
                    const computedValue = _getAdministration(self, key)
                    // TODO: mobx currently does not allow redefining computes yet, pending #1121
                    // FIXME: this binds to the internals of mobx!
                    computedValue.derivation = descriptor.get
                    computedValue.scope = self
                    if (descriptor.set)
                        computedValue.setter = action(
                            computedValue.name + "-setter",
                            descriptor.set
                        )
                } else {
                    // use internal api as shortcut
                    ;(computed as any)(self, key, descriptor, true)
                }
            } else if (typeof value === "function") {
                // this is a view function, merge as is!
                // See #646, allow models to be mocked
                ;(process.env.NODE_ENV === "production"
                    ? addHiddenFinalProp
                    : addHiddenWritableProp)(self, key, value)
            } else {
                fail(`A view member should either be a function or getter based property`)
            }
        })
    }

    preProcessSnapshot(preProcessor: (snapshot: any) => any): any {
        const currentPreprocessor = this.preProcessor
        if (!currentPreprocessor) return this.cloneAndEnhance({ preProcessor }) as this
        else
            return this.cloneAndEnhance({
                preProcessor: snapshot => currentPreprocessor(preProcessor(snapshot))
            }) as this
    }

    postProcessSnapshot(postProcessor: (snapshot: any) => any): any {
        const currentPostprocessor = this.postProcessor
        if (!currentPostprocessor) return this.cloneAndEnhance({ postProcessor })
        else
            return this.cloneAndEnhance({
                postProcessor: snapshot => postProcessor(currentPostprocessor(snapshot))
            })
    }

    instantiate(
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: any
    ): INode {
        const initialValue = isStateTreeNode(snapshot)
            ? snapshot
            : this.applySnapshotPreProcessor(snapshot)
        return createNode(this, parent, subpath, environment, initialValue)
        // Optimization: record all prop- view- and action names after first construction, and generate an optimal base class
        // that pre-reserves all these fields for fast object-member lookups
    }

    initializeChildNodes(objNode: ObjectNode, initialSnapshot: any = {}): IChildNodesMap {
        const type = objNode.type as ModelType<any, any>
        const result = {} as IChildNodesMap
        type.forAllProps((name, childType) => {
            result[name] = childType.instantiate(
                objNode,
                name,
                objNode._environment,
                initialSnapshot[name]
            )
        })
        return result
    }

    createNewInstance(node: ObjectNode, childNodes: IChildNodesMap, snapshot: any): any {
        return observable.object(childNodes, EMPTY_OBJECT, mobxShallow)
    }
    finalizeNewInstance(node: ObjectNode, instance: IObservableObject): void {
        addHiddenFinalProp(instance, "toString", objectTypeToString)

        this.forAllProps(name => {
            _interceptReads(instance, name, node.unbox)
        })

        this.initializers.reduce((self, fn) => fn(self), instance)
        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    willChange(change: any): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()
        const type = (node.type as ModelType<any, any>).properties[change.name]
        // only properties are typed, state are stored as-is references
        if (type) {
            typecheckInternal(type, change.newValue)
            change.newValue = type.reconcile(node.getChildNode(change.name), change.newValue)
        }
        return change
    }

    didChange(change: any) {
        const node = getStateTreeNode(change.object)
        const type = (node.type as ModelType<any, any>).properties[change.name]
        if (!type) {
            // don't emit patches for volatile state
            return
        }
        const oldValue = change.oldValue ? change.oldValue.snapshot : undefined
        node.emitPatch(
            {
                op: "replace",
                path: escapeJsonPath(change.name),
                value: change.newValue.snapshot,
                oldValue
            },
            node
        )
    }

    getChildren(node: ObjectNode): INode[] {
        const res: INode[] = []
        this.forAllProps((name, type) => {
            res.push(this.getChildNode(node, name))
        })
        return res
    }

    getChildNode(node: ObjectNode, key: string): INode {
        if (!(key in this.properties)) return fail("Not a value property: " + key)
        const childNode = _getAdministration(node.storedValue, key).value // TODO: blegh!
        if (!childNode) return fail("Node not available for property " + key)
        return childNode
    }

    getValue(node: ObjectNode): any {
        return node.storedValue
    }

    getSnapshot(node: ObjectNode, applyPostProcess = true): any {
        const res = {} as any
        this.forAllProps((name, type) => {
            // TODO: FIXME, make sure the observable ref is used!
            ;(getAtom(node.storedValue, name) as any).reportObserved()
            res[name] = this.getChildNode(node, name).snapshot
        })
        if (applyPostProcess) {
            return this.applySnapshotPostProcessor(res)
        }
        return res
    }

    processInitialSnapshot(childNodes: IChildNodesMap, snapshot: any): any {
        const processed = {} as any
        Object.keys(childNodes).forEach(key => {
            processed[key] = childNodes[key].getSnapshot()
        })
        return this.applySnapshotPostProcessor(this.applyOptionalValuesToSnapshot(processed))
    }

    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add"))
            fail(`object does not support operation ${patch.op}`)
        node.storedValue[subpath] = patch.value
    }

    @action
    applySnapshot(node: ObjectNode, snapshot: any): void {
        const s = this.applySnapshotPreProcessor(snapshot)
        typecheckInternal(this, s)
        this.forAllProps((name, type) => {
            node.storedValue[name] = s[name]
        })
    }

    applySnapshotPreProcessor(snapshot: any) {
        const processor = this.preProcessor
        return processor ? processor.call(null, snapshot) : snapshot
    }

    applyOptionalValuesToSnapshot(snapshot: any) {
        if (snapshot) {
            snapshot = Object.assign({}, snapshot)
            this.forAllProps((name, type) => {
                if (!(name in snapshot)) {
                    const optional2 = tryGetOptional(type)
                    if (optional2) {
                        snapshot[name] = optional2.getDefaultValueSnapshot()
                    }
                }
            })
        }
        return snapshot
    }

    applySnapshotPostProcessor(snapshot: any) {
        const postProcessor = this.postProcessor
        if (postProcessor) return postProcessor.call(null, snapshot)
        return snapshot
    }

    getChildType(key: string): IAnyType {
        return this.properties[key]
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        let snapshot = this.applySnapshotPreProcessor(value)

        if (!isPlainObject(snapshot)) {
            return typeCheckFailure(context, snapshot, "Value is not a plain object")
        }

        return flattenTypeErrors(
            this.propertyNames.map(key =>
                this.properties[key].validate(
                    snapshot[key],
                    getContextForPath(context, key, this.properties[key])
                )
            )
        )
    }

    private forAllProps(fn: (name: string, type: IAnyType) => void) {
        this.propertyNames.forEach(key => fn(key, this.properties[key]))
    }

    describe() {
        // optimization: cache
        return (
            "{ " +
            this.propertyNames.map(key => key + ": " + this.properties[key].describe()).join("; ") +
            " }"
        )
    }

    getDefaultSnapshot(): any {
        return EMPTY_OBJECT
    }

    removeChild(node: ObjectNode, subpath: string) {
        node.storedValue[subpath] = undefined
    }
}

export function model<T extends ModelPropertiesDeclaration = {}>(
    name: string,
    properties?: T | ((selfType: SelfType) => T)
): ResolveSelfTypeModel<IModelType<ModelPropertiesDeclarationToProperties<T>, {}>, 0>
export function model<T extends ModelPropertiesDeclaration = {}>(
    properties?: T | ((selfType: SelfType) => T)
): ResolveSelfTypeModel<IModelType<ModelPropertiesDeclarationToProperties<T>, {}>, 0>
/**
 * Creates a new model type by providing a name, properties, volatile state and actions.
 *
 * See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.
 *
 * @export
 * @alias types.model
 */
export function model(...args: any[]): any {
    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    const properties = args.shift() || {}
    return new ModelType({ name, properties }, {})
}

// generated with mobx-state-tree\packages\mobx-state-tree\scripts\generate-compose-type.js
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>): IModelType<PA & PB, OA & OB, CA & CB, SA & SB, TA & TB>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>): IModelType<PA & PB, OA & OB, CA & CB, SA & SB, TA & TB>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>): IModelType<PA & PB & PC, OA & OB & OC, CA & CB & CC, SA & SB & SC, TA & TB & TC>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>): IModelType<PA & PB & PC, OA & OB & OC, CA & CB & CC, SA & SB & SC, TA & TB & TC>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>): IModelType<PA & PB & PC & PD, OA & OB & OC & OD, CA & CB & CC & CD, SA & SB & SC & SD, TA & TB & TC & TD>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>): IModelType<PA & PB & PC & PD, OA & OB & OC
    & OD, CA & CB & CC & CD, SA & SB & SC & SD, TA & TB & TC & TD>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>): IModelType<PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, CA & CB & CC & CD & CE, SA & SB & SC & SD & SE, TA & TB & TC & TD & TE>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>,
    E: IModelType<PE, OE, CE, SE, TE>): IModelType<PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, CA & CB & CC & CD & CE, SA & SB & SC & SD & SE, TA & TB & TC & TD & TE>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>): IModelType<PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, CA & CB & CC & CD & CE & CF, SA & SB & SC & SD & SE & SF, TA & TB & TC & TD & TE & TF>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC,
    SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>): IModelType<PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, CA & CB & CC & CD & CE & CF, SA & SB & SC & SD & SE & SF, TA & TB & TC & TD & TE & TF>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B:
    IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>): IModelType<PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, CA & CB & CC & CD & CE & CF & CG, SA & SB & SC & SD & SE & SF & SG, TA & TB & TC & TD & TE & TF & TG>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>): IModelType<PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, CA & CB & CC & CD & CE & CF & CG, SA & SB & SC & SD & SE & SF & SG, TA & TB & TC & TD & TE & TF & TG>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, CA & CB
    & CC & CD & CE & CF & CG & CH, SA & SB & SC & SD & SE & SF & SG & SH, TA & TB & TC & TD & TE & TF & TG & TH>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, CA & CB & CC & CD & CE & CF & CG & CH, SA & SB & SC & SD & SE & SF & SG & SH, TA & TB & TC & TD & TE & TF & TG & TH>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH, PI extends ModelProperties, OI, CI, SI, TI>(name: string, A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>, I: IModelType<PI, OI, CI, SI, TI>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, CA & CB & CC & CD & CE & CF & CG & CH & CI, SA & SB & SC & SD & SE & SF & SG & SH & SI, TA & TB & TC & TD & TE & TF & TG & TH & TI>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, CA, SA, TA, PB extends ModelProperties, OB, CB, SB, TB, PC extends ModelProperties, OC, CC, SC, TC, PD extends ModelProperties, OD, CD, SD, TD, PE extends ModelProperties, OE, CE, SE, TE, PF extends ModelProperties, OF, CF, SF, TF, PG extends ModelProperties, OG, CG, SG, TG, PH extends ModelProperties, OH, CH, SH, TH, PI extends ModelProperties, OI, CI, SI, TI>(A: IModelType<PA, OA, CA, SA, TA>, B: IModelType<PB, OB, CB, SB, TB>, C: IModelType<PC, OC, CC, SC, TC>, D: IModelType<PD, OD, CD, SD, TD>, E: IModelType<PE, OE, CE, SE, TE>, F: IModelType<PF, OF, CF, SF, TF>, G: IModelType<PG, OG, CG, SG, TG>, H: IModelType<PH, OH, CH, SH, TH>, I: IModelType<PI, OI, CI, SI, TI>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, CA & CB & CC & CD & CE & CF & CG & CH & CI, SA & SB & SC & SD & SE & SF & SG & SH & SI, TA & TB & TC & TD & TE & TF & TG & TH & TI>

/**
 * Composes a new model from one or more existing model types.
 * This method can be invoked in two forms:
 * Given 2 or more model types, the types are composed into a new Type.
 * Given first parameter as a string and 2 or more model types,
 * the types are composed into a new Type with the given name
 *
 * @export
 * @alias types.compose
 */
export function compose(...args: any[]): any {
    // TODO: just join the base type names if no name is provided
    const typeName: string = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    // check all parameters
    if (process.env.NODE_ENV !== "production") {
        args.forEach(type => {
            if (!isType(type)) fail("expected a mobx-state-tree type, got " + type + " instead")
        })
    }
    return (args as ModelType<any, any>[])
        .reduce((prev, cur) =>
            prev.cloneAndEnhance({
                name: prev.name + "_" + cur.name,
                properties: cur.properties,
                initializers: cur.initializers
            })
        )
        .named(typeName)
}

/**
 * Returns if a given value represents a model type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isModelType<IT extends IModelType<any, any>>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Object) > 0
}

function tryGetOptional(type: any): OptionalValue<any, any, any> | undefined {
    if (!type) return undefined
    // we need to check for type.types since an optional union doesn't have direct subtypes
    if (type.flags & TypeFlags.Union && type.types) return type.types.find(tryGetOptional)
    if (type.flags & TypeFlags.Late && type.getSubType && type.getSubType(false))
        return tryGetOptional(type.subType)
    if (type.flags & TypeFlags.Optional) return type
    return undefined
}
