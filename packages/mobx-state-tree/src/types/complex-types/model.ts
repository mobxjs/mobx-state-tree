import {
    action,
    IObjectWillChange,
    intercept,
    observe,
    getAtom,
    extendObservable,
    observable,
    _interceptReads,
    _getAdministration,
    isComputedProp,
    computed,
    set
} from "mobx"
import {
    fail,
    isPlainObject,
    isPrimitive,
    EMPTY_ARRAY,
    EMPTY_OBJECT,
    addHiddenFinalProp,
    createNode,
    getStateTreeNode,
    IStateTreeNode,
    IJsonPatch,
    INode,
    createActionInvoker,
    escapeJsonPath,
    ComplexType,
    IComplexType,
    IType,
    TypeFlags,
    isType,
    flattenTypeErrors,
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure,
    getContextForPath,
    getPrimitiveFactoryFromValue,
    optional,
    ObjectNode,
    freeze,
    addHiddenWritableProp,
    mobxShallow,
    isStateTreeNode,
    IChildNodesMap,
    IAnyType,
    OptionalValue,
    MapType,
    ArrayType,
    ExtractIStateTreeNode,
    IAnyStateTreeNode
} from "../../internal"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"
const POST_PROCESS_SNAPSHOT = "postProcessSnapshot"

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
        ? IType<string | undefined, string, string> & { flags: TypeFlags.Optional }
        : T[K] extends number
            ? IType<number | undefined, number, number> & { flags: TypeFlags.Optional }
            : T[K] extends boolean
                ? IType<boolean | undefined, boolean, boolean> & { flags: TypeFlags.Optional }
                : T[K] extends Date
                    ? IType<number | Date | undefined, number, Date> & {
                          flags: TypeFlags.Optional
                      }
                    : T[K] extends IAnyType ? T[K] : never
}

export interface OptionalPropertyTypes {
    flags: TypeFlags.Optional
}

export type RequiredPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalPropertyTypes ? never : K
}[keyof T]
export type OptionalPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalPropertyTypes ? K : never
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
    [K in keyof T]: T[K] extends IType<infer C, infer S, infer M>
        ? ExtractIStateTreeNode<T[K], C, S, M>
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
        props: PROPS2
    ): IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, OTHERS>
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
    preProcessSnapshot<S0 = ModelCreationType<PROPS>>(
        fn: (snapshot: S0) => ModelCreationType<PROPS>
    ): IModelType<PROPS, OTHERS, S0>
    postProcessSnapshot<S1 = ModelCreationType<PROPS>>(
        fn: (snapshot: ModelSnapshotType<PROPS>) => S1
    ): IModelType<PROPS, OTHERS, S1>
}

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

export interface ModelTypeConfig {
    name?: string
    properties?: ModelProperties
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

    constructor(opts: ModelTypeConfig) {
        super(opts.name || defaultObjectOptions.name)
        const name = opts.name || defaultObjectOptions.name
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
        return new ModelType({
            name: opts.name || this.name,
            properties: Object.assign({}, this.properties, opts.properties),
            initializers: this.initializers.concat((opts.initializers as any) || []),
            preProcessor: opts.preProcessor || this.preProcessor,
            postProcessor: opts.postProcessor || this.postProcessor
        })
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
            let action = actions[name]
            let baseAction = (self as any)[name]
            if (name in HookNames && baseAction) {
                let specializedAction = action
                action = function() {
                    baseAction.apply(null, arguments)
                    specializedAction.apply(null, arguments)
                }
            }
            // See #646, allow models to be mocked
            ;(process.env.NODE_ENV === "production" ? addHiddenFinalProp : addHiddenWritableProp)(
                self,
                name,
                createActionInvoker(self, name, action)
            )
        })
    }

    named(name: string): this {
        return this.cloneAndEnhance({ name }) as this
    }

    props(properties: ModelPropertiesDeclaration): any {
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
        return createNode(
            this,
            parent,
            subpath,
            environment,
            initialValue,
            this.createNewInstance,
            this.finalizeNewInstance
        )
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

    createNewInstance() {
        const instance = observable.object(EMPTY_OBJECT, EMPTY_OBJECT, mobxShallow)
        addHiddenFinalProp(instance, "toString", objectTypeToString)
        return instance as Object
    }

    finalizeNewInstance(node: INode, childNodes: IChildNodesMap) {
        const objNode = node as ObjectNode
        const type = objNode.type as ModelType<any, any>
        const instance = objNode.storedValue as IAnyStateTreeNode

        extendObservable(instance, childNodes, EMPTY_OBJECT, mobxShallow)
        type.forAllProps(name => {
            _interceptReads(instance, name, objNode.unbox)
        })

        type.initializers.reduce((self, fn) => fn(self), instance)
        intercept(instance, type.willChange)
        observe(instance, type.didChange)
    }

    willChange(change: any): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()
        const type = (node.type as ModelType<any, any>).properties[change.name]
        // only properties are typed, state are stored as-is references
        if (type) {
            typecheck(type, change.newValue)
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

    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add"))
            fail(`object does not support operation ${patch.op}`)
        node.storedValue[subpath] = patch.value
    }

    @action
    applySnapshot(node: ObjectNode, snapshot: any): void {
        const s = this.applySnapshotPreProcessor(snapshot)
        typecheck(this, s)
        this.forAllProps((name, type) => {
            node.storedValue[name] = s[name]
        })
    }

    applySnapshotPreProcessor(snapshot: any) {
        const processor = this.preProcessor
        const processed = processor ? processor.call(null, snapshot) : snapshot

        if (processed) {
            this.forAllProps((name, type) => {
                if (!(name in processed)) {
                    const optional = tryGetOptional(type)
                    if (optional) {
                        processed[name] = optional.getDefaultValueSnapshot()
                    }
                }
            })
        }
        return processed
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
        return {}
    }

    removeChild(node: ObjectNode, subpath: string) {
        node.storedValue[subpath] = null
    }
}

export function model<T extends ModelPropertiesDeclaration = {}>(
    name: string,
    properties?: T
): IModelType<ModelPropertiesDeclarationToProperties<T>, {}>
export function model<T extends ModelPropertiesDeclaration = {}>(
    properties?: T
): IModelType<ModelPropertiesDeclarationToProperties<T>, {}>
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
    return new ModelType({ name, properties })
}

// generated with /home/michel/mobservable/mobx-state-tree/packages/mobx-state-tree/scripts/generate-compose-type.js
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>): IModelType<T1 & T2, S1 & S2>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>): IModelType<T1 & T2 & T3, S1 & S2 & S3>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>): IModelType<T1 & T2 & T3 & T4, S1 & S2 & S3 & S4>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>): IModelType<T1 & T2 & T3 & T4 & T5, S1 & S2 & S3 & S4 & S5>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>): IModelType<T1 & T2 & T3 & T4 & T5 & T6, S1 & S2 & S3 & S4 & S5 & S6>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7, S1 & S2 & S3 & S4 & S5 & S6 & S7>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7, T8 extends ModelProperties, S8>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>, t8: IModelType<T8, S8>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7, T8 extends ModelProperties, S8, T9 extends ModelProperties, S9>(name: string, t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>, t8: IModelType<T8, S8>, t9: IModelType<T9, S9>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9>

export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2>(
    t1: IModelType<T1, S1>,
    t2: IModelType<T2, S2>
): IModelType<T1 & T2, S1 & S2>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>): IModelType<T1 & T2 & T3, S1 & S2 & S3>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>): IModelType<T1 & T2 & T3 & T4, S1 & S2 & S3 & S4>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>): IModelType<T1 & T2 & T3 & T4 & T5, S1 & S2 & S3 & S4 & S5>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>): IModelType<T1 & T2 & T3 & T4 & T5 & T6, S1 & S2 & S3 & S4 & S5 & S6>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7, S1 & S2 & S3 & S4 & S5 & S6 & S7>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7, T8 extends ModelProperties, S8>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>, t8: IModelType<T8, S8>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8>
// prettier-ignore
export function compose<T1 extends ModelProperties, S1, T2 extends ModelProperties, S2, T3 extends ModelProperties, S3, T4 extends ModelProperties, S4, T5 extends ModelProperties, S5, T6 extends ModelProperties, S6, T7 extends ModelProperties, S7, T8 extends ModelProperties, S8, T9 extends ModelProperties, S9>(t1: IModelType<T1, S1>, t2: IModelType<T2, S2>, t3: IModelType<T3, S3>, t4: IModelType<T4, S4>, t5: IModelType<T5, S5>, t6: IModelType<T6, S6>, t7: IModelType<T7, S7>, t8: IModelType<T8, S8>, t9: IModelType<T9, S9>): IModelType<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9, S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9>
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
