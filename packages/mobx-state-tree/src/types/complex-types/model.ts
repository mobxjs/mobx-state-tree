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
    fail,
    flattenTypeErrors,
    freeze,
    getContextForPath,
    getPrimitiveFactoryFromValue,
    getStateTreeNode,
    IAnyType,
    IChildNodesMap,
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
    ExtractC,
    ExtractS,
    ExtractT,
    Hook
} from "../../internal"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"
const POST_PROCESS_SNAPSHOT = "postProcessSnapshot"

/** @hidden */
export interface ModelProperties {
    [key: string]: IAnyType
}

/** @hidden */
export type ModelPrimitive = string | number | boolean | Date

/** @hidden */
export interface ModelPropertiesDeclaration {
    [key: string]: ModelPrimitive | IAnyType
}

/**
 * Unmaps syntax property declarations to a map of { propName: IType }
 *
 * @hidden
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
        : T[K] extends IAnyType
        ? T[K]
        : never
}

/** @hidden */
export interface OptionalProperty {
    // fake, only used for typing
    readonly "!!optionalType": undefined
}

/** @hidden */
// tslint:disable-next-line:class-name
export interface _NotCustomized {
    // only for typings
    readonly "!!mstNotCustomized": undefined
}
/** @hidden */
export type _CustomOrOther<Custom, Other> = Custom extends _NotCustomized ? Other : Custom

/**
 * Maps property types to the snapshot, including omitted optional attributes
 * @hidden
 */
export type RequiredPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalProperty ? never : K
}[keyof T]
/** @hidden */
export type RequiredProps<T> = Pick<T, RequiredPropNames<T>>
/** @hidden */
export type RequiredPropsObject<P extends ModelProperties> = { [K in keyof RequiredProps<P>]: P[K] }

/** @hidden */
export type OptionalPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalProperty ? K : never
}[keyof T]
/** @hidden */
export type OptionalProps<T> = Pick<T, OptionalPropNames<T>>
/** @hidden */
export type OptionalPropsObject<P extends ModelProperties> = {
    [K in keyof OptionalProps<P>]?: P[K]
}

/** @hidden */
export type ExtractCFromProps<P extends ModelProperties> = { [k in keyof P]: ExtractC<P[k]> }

/** @hidden */
export type ModelCreationType<P extends ModelProperties> = ExtractCFromProps<
    RequiredPropsObject<P> & OptionalPropsObject<P>
>

/** @hidden */
export type ModelCreationType2<P extends ModelProperties, CustomC> = _CustomOrOther<
    CustomC,
    ModelCreationType<P>
>

/** @hidden */
export type ModelSnapshotType<P extends ModelProperties> = { [K in keyof P]: ExtractS<P[K]> }

/** @hidden */
export type ModelSnapshotType2<P extends ModelProperties, CustomS> = _CustomOrOther<
    CustomS,
    ModelSnapshotType<P>
>

/**
 * @hidden
 * we keep this separate from ModelInstanceType to shorten model instance types generated declarations
 */
export type ModelInstanceTypeProps<P extends ModelProperties> = { [K in keyof P]: ExtractT<P[K]> }

/**
 * @hidden
 * do not transform this to an interface or model instance type generated declarations will be longer
 */
export type ModelInstanceType<
    P extends ModelProperties,
    O,
    CustomC,
    CustomS
> = ModelInstanceTypeProps<P> &
    O &
    IStateTreeNode<ModelCreationType2<P, CustomC>, ModelSnapshotType2<P, CustomS>>

/** @hidden */
export interface ModelActions {
    [key: string]: Function
}

export interface IModelType<
    PROPS extends ModelProperties,
    OTHERS,
    CustomC = _NotCustomized,
    CustomS = _NotCustomized
>
    extends IType<
        ModelCreationType2<PROPS, CustomC>,
        ModelSnapshotType2<PROPS, CustomS>,
        ModelInstanceType<PROPS, OTHERS, CustomC, CustomS>
    > {
    readonly properties: PROPS

    named(newName: string): this

    // warning: redefining props after a process snapshot is used ends up on the fixed (custom) C, S typings being overridden
    // so it is recommended to use pre/post process snapshot after all props have been defined
    props<PROPS2 extends ModelPropertiesDeclaration>(
        props: PROPS2
    ): IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, OTHERS, CustomC, CustomS>

    views<V extends Object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, CustomC, CustomS>) => V
    ): IModelType<PROPS, OTHERS & V, CustomC, CustomS>

    actions<A extends ModelActions>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, CustomC, CustomS>) => A
    ): IModelType<PROPS, OTHERS & A, CustomC, CustomS>

    volatile<TP extends object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS, CustomC, CustomS>) => TP
    ): IModelType<PROPS, OTHERS & TP, CustomC, CustomS>

    extend<A extends ModelActions = {}, V extends Object = {}, VS extends Object = {}>(
        fn: (
            self: ModelInstanceType<PROPS, OTHERS, CustomC, CustomS>
        ) => { actions?: A; views?: V; state?: VS }
    ): IModelType<PROPS, OTHERS & A & V & VS, CustomC, CustomS>

    preProcessSnapshot<NewC = ModelCreationType2<PROPS, CustomC>>(
        fn: (snapshot: NewC) => ModelCreationType2<PROPS, CustomC>
    ): IModelType<PROPS, OTHERS, NewC, CustomS>

    postProcessSnapshot<NewS = ModelSnapshotType2<PROPS, CustomS>>(
        fn: (snapshot: ModelSnapshotType2<PROPS, CustomS>) => NewS
    ): IModelType<PROPS, OTHERS, CustomC, NewS>
}

/**
 * Any model type.
 */
export interface IAnyModelType extends IModelType<any, any, any, any> {}

/** @hidden */
export type ExtractProps<T extends IAnyModelType> = T extends IModelType<infer P, any, any, any>
    ? P
    : never
/** @hidden */
export type ExtractOthers<T extends IAnyModelType> = T extends IModelType<any, infer O, any, any>
    ? O
    : never

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

/**
 * @internal
 * @hidden
 */
export interface ModelTypeConfig {
    name?: string
    properties?: ModelProperties
    initializers?: ReadonlyArray<(instance: any) => any>
    preProcessor?: (snapshot: any) => any
    postProcessor?: (snapshot: any) => any
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    initializers: EMPTY_ARRAY
}

function toPropertiesObject(declaredProps: ModelPropertiesDeclaration): ModelProperties {
    // loop through properties and ensures that all items are types
    return Object.keys(declaredProps).reduce(
        (props, key) => {
            // warn if user intended a HOOK
            if (key in Hook)
                throw fail(
                    `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                )

            // the user intended to use a view
            const descriptor = Object.getOwnPropertyDescriptor(props, key)!
            if ("get" in descriptor) {
                throw fail("Getters are not supported as properties. Please use views instead")
            }
            // undefined and null are not valid
            const value = descriptor.value
            if (value === null || value === undefined) {
                throw fail(
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
                throw fail(
                    `Invalid type definition for property '${key}', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?`
                )
                // no other complex values
            } else if (process.env.NODE_ENV !== "production" && typeof value === "object") {
                throw fail(
                    `Invalid type definition for property '${key}', it looks like you passed an object. Try passing another model type or a types.frozen.`
                )
                // WTF did you pass in mate?
            } else {
                throw fail(
                    `Invalid type definition for property '${key}', cannot infer a type from a value like '${value}' (${typeof value})`
                )
            }
        },
        declaredProps as any
    )
}

/**
 * @internal
 * @hidden
 */
export class ModelType<P extends ModelProperties, O> extends ComplexType<any, any, any>
    implements IModelType<P, O, any, any> {
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
        if (!/^\w[\w\d_]*$/.test(name)) throw fail(`Typename should be a valid identifier: ${name}`)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties) as P
        freeze(this.properties) // make sure nobody messes with it
        this.propertyNames = Object.keys(this.properties)
        this.identifierAttribute = this._getIdentifierAttribute()
    }

    private _getIdentifierAttribute(): string | undefined {
        let identifierAttribute: string | undefined = undefined
        this.forAllProps((propName, propType) => {
            if (propType.flags & TypeFlags.Identifier) {
                if (identifierAttribute)
                    throw fail(
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
        const actionInitializer = (self: any) => {
            this.instantiateActions(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [actionInitializer] })
    }

    instantiateActions(self: any, actions: any): void {
        // check if return is correct
        if (!isPlainObject(actions))
            throw fail(`actions initializer should return a plain object containing actions`)

        // bind actions to the object created
        Object.keys(actions).forEach(name => {
            // warn if preprocessor was given
            if (name === PRE_PROCESS_SNAPSHOT)
                throw fail(
                    `Cannot define action '${PRE_PROCESS_SNAPSHOT}', it should be defined using 'type.preProcessSnapshot(fn)' instead`
                )
            // warn if postprocessor was given
            if (name === POST_PROCESS_SNAPSHOT)
                throw fail(
                    `Cannot define action '${POST_PROCESS_SNAPSHOT}', it should be defined using 'type.postProcessSnapshot(fn)' instead`
                )

            let action2 = actions[name]

            // apply hook composition
            let baseAction = (self as any)[name]
            if (name in Hook && baseAction) {
                let specializedAction = action2
                action2 = function() {
                    baseAction.apply(null, arguments)
                    specializedAction.apply(null, arguments)
                }
            }

            // the goal of this is to make sure actions using "this" can call themselves,
            // while still allowing the middlewares to register them
            const middlewares = action2.$mst_middleware // make sure middlewares are not lost
            let boundAction = action2.bind(actions)
            boundAction.$mst_middleware = middlewares
            const actionInvoker = createActionInvoker(self, name, boundAction)
            actions[name] = actionInvoker

            // See #646, allow models to be mocked
            ;(process.env.NODE_ENV === "production" ? addHiddenFinalProp : addHiddenWritableProp)(
                self,
                name,
                actionInvoker
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
        const stateInitializer = (self: any) => {
            this.instantiateVolatileState(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [stateInitializer] })
    }

    instantiateVolatileState(self: any, state: Object): void {
        // check views return
        if (!isPlainObject(state))
            throw fail(`volatile state initializer should return a plain object containing state`)
        set(self, state)
    }

    extend(fn: (self: any) => any): any {
        const initializer = (self: any) => {
            const { actions, views, state, ...rest } = fn(self)
            for (let key in rest)
                throw fail(
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
        const viewInitializer = (self: any) => {
            this.instantiateViews(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [viewInitializer] })
    }

    instantiateViews(self: any, views: Object): void {
        // check views return
        if (!isPlainObject(views))
            throw fail(`views initializer should return a plain object containing views`)
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
                throw fail(`A view member should either be a function or getter based property`)
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
                objNode.environment,
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
        node.assertWritable({ subpath: change.name })
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
        if (!(key in this.properties)) throw fail("Not a value property: " + key)
        const childNode = _getAdministration(node.storedValue, key).value // TODO: blegh!
        if (!childNode) throw fail("Node not available for property " + key)
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
            throw fail(`object does not support operation ${patch.op}`)
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

export function model<P extends ModelPropertiesDeclaration = {}>(
    name: string,
    properties?: P
): IModelType<ModelPropertiesDeclarationToProperties<P>, {}>
export function model<P extends ModelPropertiesDeclaration = {}>(
    properties?: P
): IModelType<ModelPropertiesDeclarationToProperties<P>, {}>
/**
 * `types.model` - Creates a new model type by providing a name, properties, volatile state and actions.
 *
 * See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.
 */
export function model(...args: any[]): any {
    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    const properties = args.shift() || {}
    return new ModelType({ name, properties })
}

// TODO: this can be simplified in TS3, since we can transform _NotCustomized to unknown, since unkonwn & X = X
// and then back unkown to _NotCustomized if needed
/** @hidden */
export type _CustomJoin<A, B> = A extends _NotCustomized ? B : A & B

// generated with C:\VSProjects\github\mobx-state-tree-upstream\packages\mobx-state-tree\scripts\generate-compose-type.js
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>): IModelType<PA & PB, OA & OB, _CustomJoin<FCA, FCB>, _CustomJoin<FSA, FSB>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>): IModelType<PA & PB, OA & OB, _CustomJoin<FCA, FCB>, _CustomJoin<FSA, FSB>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>): IModelType<PA & PB & PC, OA & OB & OC, _CustomJoin<FCA, _CustomJoin<FCB, FCC>>, _CustomJoin<FSA, _CustomJoin<FSB, FSC>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>): IModelType<PA & PB & PC, OA & OB & OC, _CustomJoin<FCA, _CustomJoin<FCB, FCC>>, _CustomJoin<FSA, _CustomJoin<FSB, FSC>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>): IModelType<PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, FCD>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, FSD>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>): IModelType<PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, FCD>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, FSD>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>): IModelType<PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, FCE>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, FSE>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE>(A:
    IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>): IModelType<PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin<FCA,
    _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, FCE>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, FSE>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>): IModelType<PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, FCF>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, FSF>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>): IModelType<PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, FCF>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, FSF>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>): IModelType<PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, FCG>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, FSG>>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>): IModelType<PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, FCG>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, FSG>>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, _CustomJoin<FCG, FCH>>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, _CustomJoin<FSG, FSH>>>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, _CustomJoin<FCG, FCH>>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, _CustomJoin<FSG, FSH>>>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH, PI extends ModelProperties, OI, FCI, FSI>(name: string, A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>, I: IModelType<PI, OI, FCI, FSI>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, _CustomJoin<FCG, _CustomJoin<FCH, FCI>>>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, _CustomJoin<FSG, _CustomJoin<FSH, FSI>>>>>>>>>
// prettier-ignore
export function compose<PA extends ModelProperties, OA, FCA, FSA, PB extends ModelProperties, OB, FCB, FSB, PC extends ModelProperties, OC, FCC, FSC, PD extends ModelProperties, OD, FCD, FSD, PE extends ModelProperties, OE, FCE, FSE, PF
    extends ModelProperties, OF, FCF, FSF, PG extends ModelProperties, OG, FCG, FSG, PH extends ModelProperties, OH, FCH, FSH, PI extends ModelProperties, OI, FCI, FSI>(A: IModelType<PA, OA, FCA, FSA>, B: IModelType<PB, OB, FCB, FSB>, C: IModelType<PC, OC, FCC, FSC>, D: IModelType<PD, OD, FCD, FSD>, E: IModelType<PE, OE, FCE, FSE>, F: IModelType<PF, OF, FCF, FSF>, G: IModelType<PG, OG, FCG, FSG>, H: IModelType<PH, OH, FCH, FSH>, I: IModelType<PI, OI, FCI, FSI>): IModelType<PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin<FCA, _CustomJoin<FCB, _CustomJoin<FCC, _CustomJoin<FCD, _CustomJoin<FCE, _CustomJoin<FCF, _CustomJoin<FCG, _CustomJoin<FCH, FCI>>>>>>>>, _CustomJoin<FSA, _CustomJoin<FSB, _CustomJoin<FSC, _CustomJoin<FSD, _CustomJoin<FSE, _CustomJoin<FSF, _CustomJoin<FSG, _CustomJoin<FSH, FSI>>>>>>>>>

/**
 * `types.compose` - Composes a new model from one or more existing model types.
 * This method can be invoked in two forms:
 * Given 2 or more model types, the types are composed into a new Type.
 * Given first parameter as a string and 2 or more model types,
 * the types are composed into a new Type with the given name
 */
export function compose(...args: any[]): any {
    // TODO: just join the base type names if no name is provided
    const typeName: string = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    // check all parameters
    if (process.env.NODE_ENV !== "production") {
        args.forEach(type => {
            if (!isModelType(type))
                throw fail("expected a mobx-state-tree model type, got " + type + " instead")
        })
    }
    return (args as ModelType<any, any>[])
        .reduce((prev, cur) =>
            prev.cloneAndEnhance({
                name: prev.name + "_" + cur.name,
                properties: cur.properties,
                initializers: cur.initializers,
                preProcessor: (snapshot: any) =>
                    cur.applySnapshotPreProcessor(prev.applySnapshotPreProcessor(snapshot)),
                postProcessor: (snapshot: any) =>
                    cur.applySnapshotPostProcessor(prev.applySnapshotPostProcessor(snapshot))
            })
        )
        .named(typeName)
}

/**
 * Returns if a given value represents a model type.
 *
 * @param type
 * @returns
 */
export function isModelType<IT extends IAnyModelType = IAnyModelType>(type: IAnyType): type is IT {
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
