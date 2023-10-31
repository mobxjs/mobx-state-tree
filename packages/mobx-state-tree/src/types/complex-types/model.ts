import {
    _getAdministration,
    _interceptReads,
    action,
    computed,
    defineProperty,
    intercept,
    getAtom,
    IObjectWillChange,
    observable,
    observe,
    set,
    IObjectDidChange,
    makeObservable,
    AnnotationsMap
} from "mobx"
import {
    addHiddenFinalProp,
    addHiddenWritableProp,
    ArrayType,
    ComplexType,
    createActionInvoker,
    createObjectNode,
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
    IValidationContext,
    IJsonPatch,
    isPlainObject,
    isPrimitive,
    isStateTreeNode,
    isType,
    IType,
    IValidationResult,
    mobxShallow,
    optional,
    MapType,
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    Hook,
    AnyObjectNode,
    AnyNode,
    _CustomOrOther,
    _NotCustomized,
    Instance,
    devMode,
    assertIsString,
    assertArg,
    FunctionWithFlag,
    IStateTreeNode
} from "../../internal"
import { makeAutoObservable } from "mobx"

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
export type ModelPropertiesDeclarationToProperties<T extends ModelPropertiesDeclaration> =
    T extends { [k: string]: IAnyType } // optimization to reduce nesting
        ? T
        : {
              [K in keyof T]: T[K] extends IAnyType // keep IAnyType check on the top to reduce nesting
                  ? T[K]
                  : T[K] extends string
                  ? IType<string | undefined, string, string>
                  : T[K] extends number
                  ? IType<number | undefined, number, number>
                  : T[K] extends boolean
                  ? IType<boolean | undefined, boolean, boolean>
                  : T[K] extends Date
                  ? IType<number | Date | undefined, number, Date>
                  : never
          }

/**
 * Checks if a value is optional (undefined, any or unknown).
 * @hidden
 *
 * Examples:
 * - string = false
 * - undefined = true
 * - string | undefined = true
 * - string & undefined = false, but we don't care
 * - any = true
 * - unknown = true
 */
type IsOptionalValue<C, TV, FV> = undefined extends C ? TV : FV

// type _A = IsOptionalValue<string, true, false> // false
// type _B = IsOptionalValue<undefined, true, false> // true
// type _C = IsOptionalValue<string | undefined, true, false> // true
// type _D = IsOptionalValue<string & undefined, true, false> // false, but we don't care
// type _E = IsOptionalValue<any, true, false> // true
// type _F = IsOptionalValue<unknown, true, false> // true

/**
 * Name of the properties of an object that can't be set to undefined, any or unknown
 * @hidden
 */
type DefinablePropsNames<T> = { [K in keyof T]: IsOptionalValue<T[K], never, K> }[keyof T]

/** @hidden */
export declare const $nonEmptyObject: unique symbol

/** @hidden */
export interface NonEmptyObject {
    [$nonEmptyObject]?: any
}

/** @hidden */
export type ExtractCFromProps<P extends ModelProperties> = { [k in keyof P]: P[k]["CreationType"] }

/** @hidden */
export type ModelCreationType<PC> = { [P in DefinablePropsNames<PC>]: PC[P] } & Partial<PC> &
    NonEmptyObject

/** @hidden */
export type ModelCreationType2<P extends ModelProperties, CustomC> = _CustomOrOther<
    CustomC,
    ModelCreationType<ExtractCFromProps<P>>
>

/** @hidden */
export type ModelSnapshotType<P extends ModelProperties> = {
    [K in keyof P]: P[K]["SnapshotType"]
} & NonEmptyObject

/** @hidden */
export type ModelSnapshotType2<P extends ModelProperties, CustomS> = _CustomOrOther<
    CustomS,
    ModelSnapshotType<P>
>

/**
 * @hidden
 * we keep this separate from ModelInstanceType to shorten model instance types generated declarations
 */
export type ModelInstanceTypeProps<P extends ModelProperties> = {
    [K in keyof P]: P[K]["Type"]
} & NonEmptyObject

/**
 * @hidden
 * do not transform this to an interface or model instance type generated declarations will be longer
 */
export type ModelInstanceType<P extends ModelProperties, O> = ModelInstanceTypeProps<P> & O

/** @hidden */
export interface ModelActions {
    [key: string]: FunctionWithFlag
}

export interface IModelType<
    PROPS extends ModelProperties,
    OTHERS,
    CustomC = _NotCustomized,
    CustomS = _NotCustomized
> extends IType<
        ModelCreationType2<PROPS, CustomC>,
        ModelSnapshotType2<PROPS, CustomS>,
        ModelInstanceType<PROPS, OTHERS>
    > {
    readonly properties: PROPS

    named(newName: string): IModelType<PROPS, OTHERS, CustomC, CustomS>

    // warning: redefining props after a process snapshot is used ends up on the fixed (custom) C, S typings being overridden
    // so it is recommended to use pre/post process snapshot after all props have been defined
    props<PROPS2 extends ModelPropertiesDeclaration>(
        props: PROPS2
    ): IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, OTHERS, CustomC, CustomS>

    views<V extends Object>(
        v:
            | (ThisType<ModelInstanceType<PROPS, OTHERS>> & V)
            | (() => ThisType<ModelInstanceType<PROPS, OTHERS>> & V)
    ): IModelType<PROPS, OTHERS & V, CustomC, CustomS>

    actions<A extends ModelActions>(
        a:
            | ThisType<ModelInstanceType<PROPS, OTHERS> & A>
            | (() => ThisType<ModelInstanceType<PROPS, OTHERS> & A>)
    ): IModelType<PROPS, OTHERS & A, CustomC, CustomS>

    volatile<TP extends object>(fn: TP): IModelType<PROPS, OTHERS & TP, CustomC, CustomS>

    extend<A extends ModelActions = {}, V extends Object = {}, VS extends Object = {}>(
        e: { actions?: A; views?: V; state?: VS } | (() => { actions?: A; views?: V; state?: VS })
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
    properties?: ModelPropertiesDeclaration
    preProcessor?: (snapshot: any) => any
    postProcessor?: (snapshot: any) => any
    actionDescriptors?: ReadonlyArray<any>
    viewDescriptors?: ReadonlyArray<any>
    volatileDescriptors?: ReadonlyArray<any>
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    actionDescriptors: EMPTY_ARRAY as any[],
    viewDescriptors: EMPTY_ARRAY as any[],
    volatileDescriptors: EMPTY_ARRAY as any[]
}

function toPropertiesObject(declaredProps: ModelPropertiesDeclaration): ModelProperties {
    const keysList = Object.keys(declaredProps)
    const alreadySeenKeys: { [key: string]: boolean } = {}
    keysList.forEach((key) => {
        if (alreadySeenKeys[key]) {
            throw fail(`${key} is declared twice in the model. Model should not contain same keys`)
        } else {
            alreadySeenKeys[key] = true
        }
    })
    // loop through properties and ensures that all items are types
    return keysList.reduce((props, key) => {
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
        } else if (devMode() && typeof value === "function") {
            throw fail(
                `Invalid type definition for property '${key}', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?`
            )
            // no other complex values
        } else if (devMode() && typeof value === "object") {
            throw fail(
                `Invalid type definition for property '${key}', it looks like you passed an object. Try passing another model type or a types.frozen.`
            )
            // WTF did you pass in mate?
        } else {
            throw fail(
                `Invalid type definition for property '${key}', cannot infer a type from a value like '${value}' (${typeof value})`
            )
        }
    }, declaredProps as any)
}

/**
 * @internal
 * @hidden
 */
export class ModelType<
        PROPS extends ModelProperties,
        OTHERS,
        CustomC,
        CustomS,
        MT extends IModelType<PROPS, OTHERS, CustomC, CustomS>
    >
    extends ComplexType<
        ModelCreationType2<PROPS, CustomC>,
        ModelSnapshotType2<PROPS, CustomS>,
        ModelInstanceType<PROPS, OTHERS>
    >
    implements IModelType<PROPS, OTHERS, CustomC, CustomS>
{
    readonly flags = TypeFlags.Object

    /*
     * The original object definition
     */
    public readonly actionDescriptors!: any[]
    public readonly viewDescriptors!: any[]
    public readonly volatileDescriptors!: any[]
    public readonly properties!: PROPS

    private baseClass?: new (param: string) => any

    private preProcessor!: (snapshot: any) => any | undefined
    private postProcessor!: (snapshot: any) => any | undefined
    private readonly propertyNames: string[]

    constructor(opts: ModelTypeConfig) {
        super(opts.name || defaultObjectOptions.name)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties) as PROPS
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

    cloneAndEnhance(opts: ModelTypeConfig): IAnyModelType {
        return new ModelType({
            name: opts.name || this.name,
            properties: Object.assign({}, this.properties, opts.properties),
            preProcessor: opts.preProcessor || this.preProcessor,
            postProcessor: opts.postProcessor || this.postProcessor,
            actionDescriptors: this.actionDescriptors.concat(opts.actionDescriptors || []),
            viewDescriptors: this.viewDescriptors.concat(opts.viewDescriptors || []),
            volatileDescriptors: this.volatileDescriptors.concat(opts.volatileDescriptors || [])
        })
    }

    actions<A extends ModelActions>(actions: A) {
        return this.cloneAndEnhance({ actionDescriptors: [actions] })
    }

    private instantiateActions(
        self: this["T"],
        actions: ModelActions | (() => ModelActions)
    ): void {
        if (typeof actions === "function") actions = actions()

        // check if return is correct
        if (!isPlainObject(actions))
            throw fail(`actions initializer should return a plain object containing actions`)

        // bind actions to the object created
        Object.keys(actions).forEach((name) => {
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

            // @ts-ignore
            let action = actions[name]

            // apply hook composition
            let baseAction = (self as any)[name]
            if (name in Hook && baseAction) {
                let specializedAction = action
                action = function () {
                    baseAction.apply(null, arguments)
                    specializedAction.apply(null, arguments)
                }
            }

            const actionInvoker = createActionInvoker(name, action)
            // @ts-ignore
            console.log("instantiateActions", name, actionInvoker._isMSTAction)

            // @ts-ignore
            actions[name] = actionInvoker

            // See #646, allow models to be mocked
            ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(
                self.prototype,
                name,
                actionInvoker
            )
            // @ts-ignore
            // self.prototype[name] = actionInvoker

            if (name === "actionName") debugger
        })
    }

    named: MT["named"] = (name) => {
        return this.cloneAndEnhance({ name })
    }

    props: MT["props"] = (properties) => {
        return this.cloneAndEnhance({ properties })
    }

    volatile<TP extends object>(volatile: TP) {
        return this.cloneAndEnhance({ volatileDescriptors: [volatile] })
    }

    private instantiateVolatileState(
        self: this["T"],
        state:
            | {
                  [key: string]: any
              }
            | (() => {
                  [key: string]: any
              })
    ): void {
        if (typeof state === "function") state = state()

        // check views return
        if (!isPlainObject(state))
            throw fail(`volatile state initializer should return a plain object containing state`)

        Object.getOwnPropertyNames(state).forEach((key) => {
            Object.defineProperty(self, key, {
                // @ts-ignore
                value: state[key]
            })
        })
    }

    extend<A extends ModelActions = {}, V extends Object = {}, VS extends Object = {}>({
        actions,
        views,
        state
    }: {
        actions?: A
        views?: V
        state?: VS
    }) {
        // const initializer = (self: Instance<this>) => {
        //     const { actions, views, state, ...rest } = fn(self)
        //     for (let key in rest)
        //         throw fail(
        //             `The \`extend\` function should return an object with a subset of the fields 'actions', 'views' and 'state'. Found invalid key '${key}'`
        //         )
        //     if (state) this.instantiateVolatileState(self, state)
        //     if (views) this.instantiateViews(self, views)
        //     if (actions) this.instantiateActions(self, actions)
        //     return self
        // }
        return this.cloneAndEnhance({
            actionDescriptors: [actions],
            viewDescriptors: [views],
            volatileDescriptors: [state]
        })
    }

    views<V extends Object>(views: V) {
        return this.cloneAndEnhance({ viewDescriptors: [views] })
    }

    private instantiateViews(self: this["T"], views: Object | (() => Object)): void {
        if (typeof views === "function") views = views()

        // check views return
        if (!isPlainObject(views)) {
            // throw fail(`views initializer should return a plain object containing views`)
            // @ts-ignore
            views = views(self)
        }
        Object.getOwnPropertyNames(views).forEach((key) => {
            if (key in self.prototype || key in this.properties) {
                throw fail(`${key} property is declared twice`)
            }

            const descriptor = Object.getOwnPropertyDescriptor(views, key)!
            if ("get" in descriptor) {
                Object.defineProperty(self.prototype, key, descriptor)
            } else if (typeof descriptor.value === "function") {
                // this is a view function, merge as is!
                // See #646, allow models to be mocked
                ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(
                    self,
                    key,
                    descriptor.value
                )
            } else {
                throw fail(`A view member should either be a function or getter based property`)
            }
        })
    }

    preProcessSnapshot: MT["preProcessSnapshot"] = (preProcessor) => {
        const currentPreprocessor = this.preProcessor
        if (!currentPreprocessor) return this.cloneAndEnhance({ preProcessor })
        else
            return this.cloneAndEnhance({
                preProcessor: (snapshot) => currentPreprocessor(preProcessor(snapshot))
            })
    }

    postProcessSnapshot: MT["postProcessSnapshot"] = (postProcessor) => {
        const currentPostprocessor = this.postProcessor
        if (!currentPostprocessor) return this.cloneAndEnhance({ postProcessor })
        else
            return this.cloneAndEnhance({
                postProcessor: (snapshot) => postProcessor(currentPostprocessor(snapshot))
            })
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: this["C"] | this["T"]
    ): this["N"] {
        // Optimization: record all prop- view- and action names after first construction, and generate an optimal base class
        // that pre-reserves all these fields for fast object-member lookups
        if (!this.baseClass) {
            const options = { ...mobxShallow, name: this.describe() }
            // @ts-ignore
            this.baseClass = class {
                constructor(childNodes: IChildNodesMap) {
                    // const annotations = {} as AnnotationsMap<string, any>
                    Object.keys(childNodes).forEach((key) => {
                        // @ts-ignore
                        this[key] = childNodes[key]
                        // annotations[key] = observable
                    })
                    // makeObservable(this, annotations, options);

                    // makeAutoObservable(this, EMPTY_OBJECT, options)

                    // Binds all actions to the current instance.
                    // Remove this because autoObservable does it.
                    const prototype = Reflect.getPrototypeOf(this)!
                    for (const key of Reflect.ownKeys(prototype)) {
                        if (key === "constructor") continue
                        const descriptor = Reflect.getOwnPropertyDescriptor(prototype, key)
                        if (descriptor && typeof descriptor.value === "function") {
                            // @ts-ignore
                            this[key] = this[key].bind(this)
                        }
                    }
                }
            }
            Object.defineProperty(this.baseClass, "name", { value: this.name })
            // @ts-ignore
            this.volatileDescriptors.forEach((v) =>
                // @ts-ignore
                this.instantiateVolatileState(this.baseClass, v)
            )
            // @ts-ignore
            this.viewDescriptors.forEach((v) => this.instantiateViews(this.baseClass, v))
            // @ts-ignore
            this.actionDescriptors.forEach((v) => this.instantiateActions(this.baseClass, v))
        }

        const value = isStateTreeNode(initialValue)
            ? initialValue
            : this.applySnapshotPreProcessor(initialValue)
        return createObjectNode(this, parent, subpath, environment, value)
    }

    initializeChildNodes(objNode: this["N"], initialSnapshot: any = {}): IChildNodesMap {
        const type = objNode.type as this
        const result: IChildNodesMap = {}
        type.forAllProps((name, childType) => {
            result[name] = childType.instantiate(
                objNode,
                name,
                undefined,
                (initialSnapshot as any)[name]
            )
        })
        return result
    }

    createNewInstance(childNodes: IChildNodesMap): this["T"] {
        // @ts-ignore
        return new this.baseClass!(childNodes)
    }

    finalizeNewInstance(node: this["N"], instance: this["T"]): void {
        addHiddenFinalProp(instance, "toString", objectTypeToString)

        this.forAllProps((name) => {
            _interceptReads(instance, name, node.unbox)
        })

        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    private willChange(chg: IObjectWillChange): IObjectWillChange | null {
        // TODO: mobx typings don't seem to take into account that newValue can be set even when removing a prop
        const change = chg as IObjectWillChange & { newValue?: any }

        const node = getStateTreeNode(change.object)
        const subpath = change.name as string
        node.assertWritable({ subpath })
        const childType = (node.type as this).properties[subpath]
        // only properties are typed, state are stored as-is references
        if (childType) {
            typecheckInternal(childType, change.newValue)
            change.newValue = childType.reconcile(
                node.getChildNode(subpath),
                change.newValue,
                node,
                subpath
            )
        }
        return change
    }

    private didChange(chg: IObjectDidChange) {
        // TODO: mobx typings don't seem to take into account that newValue can be set even when removing a prop
        const change = chg as IObjectWillChange & { newValue?: any; oldValue?: any }

        const childNode = getStateTreeNode(change.object)
        const childType = (childNode.type as this).properties[change.name as string]
        if (!childType) {
            // don't emit patches for volatile state
            return
        }
        const oldChildValue = change.oldValue ? change.oldValue.snapshot : undefined
        childNode.emitPatch(
            {
                op: "replace",
                path: escapeJsonPath(change.name as string),
                value: change.newValue.snapshot,
                oldValue: oldChildValue
            },
            childNode
        )
    }

    getChildren(node: this["N"]): ReadonlyArray<AnyNode> {
        const res: AnyNode[] = []
        this.forAllProps((name) => {
            res.push(this.getChildNode(node, name))
        })
        return res
    }

    getChildNode(node: this["N"], key: string): AnyNode {
        if (!(key in this.properties)) throw fail("Not a value property: " + key)
        const adm = _getAdministration(node.storedValue, key)
        const childNode = adm.raw?.()
        if (!childNode) throw fail("Node not available for property " + key)
        return childNode
    }

    getSnapshot(node: this["N"], applyPostProcess = true): this["S"] {
        const res = {} as any
        this.forAllProps((name, type) => {
            try {
                // TODO: FIXME, make sure the observable ref is used!
                const atom = getAtom(node.storedValue, name)
                ;(atom as any).reportObserved()
            } catch (e) {
                throw fail(`${name} property is declared twice`)
            }
            res[name] = this.getChildNode(node, name).snapshot
        })
        if (applyPostProcess) {
            return this.applySnapshotPostProcessor(res)
        }
        return res
    }

    processInitialSnapshot(childNodes: IChildNodesMap): this["S"] {
        const processed = {} as any
        Object.keys(childNodes).forEach((key) => {
            processed[key] = childNodes[key].getSnapshot()
        })
        return this.applySnapshotPostProcessor(processed)
    }

    applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add")) {
            throw fail(`object does not support operation ${patch.op}`)
        }
        ;(node.storedValue as any)[subpath] = patch.value
    }

    applySnapshot(node: this["N"], snapshot: this["C"]): void {
        typecheckInternal(this, snapshot)
        const preProcessedSnapshot = this.applySnapshotPreProcessor(snapshot)
        this.forAllProps((name) => {
            ;(node.storedValue as any)[name] = preProcessedSnapshot[name]
        })
    }

    applySnapshotPreProcessor(snapshot: any) {
        const processor = this.preProcessor
        return processor ? processor.call(null, snapshot) : snapshot
    }

    applySnapshotPostProcessor(snapshot: any) {
        const postProcessor = this.postProcessor
        if (postProcessor) return postProcessor.call(null, snapshot)
        return snapshot
    }

    getChildType(propertyName: string): IAnyType {
        assertIsString(propertyName, 1)

        return this.properties[propertyName]
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        let snapshot = this.applySnapshotPreProcessor(value)

        if (!isPlainObject(snapshot)) {
            return typeCheckFailure(context, snapshot, "Value is not a plain object")
        }

        return flattenTypeErrors(
            this.propertyNames.map((key) =>
                this.properties[key].validate(
                    snapshot[key],
                    getContextForPath(context, key, this.properties[key])
                )
            )
        )
    }

    private forAllProps(fn: (name: string, type: IAnyType) => void) {
        this.propertyNames.forEach((key) => fn(key, this.properties[key]))
    }

    describe() {
        // optimization: cache
        return (
            "{ " +
            this.propertyNames
                .map((key) => key + ": " + this.properties[key].describe())
                .join("; ") +
            " }"
        )
    }

    getDefaultSnapshot(): this["C"] {
        return EMPTY_OBJECT as this["C"]
    }

    removeChild(node: this["N"], subpath: string) {
        ;(node.storedValue as any)[subpath] = undefined
    }
}
ModelType.prototype.applySnapshot = action(ModelType.prototype.applySnapshot)

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
 * See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.
 */
export function model(...args: any[]): any {
    if (devMode() && typeof args[0] !== "string" && args[1]) {
        throw fail(
            "Model creation failed. First argument must be a string when two arguments are provided"
        )
    }

    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    const properties = args.shift() || {}
    return new ModelType({ name, properties })
}

// TODO: this can be simplified in TS3, since we can transform _NotCustomized to unknown, since unkonwn & X = X
// and then back unknown to _NotCustomized if needed
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
    const hasTypename = typeof args[0] === "string"
    const typeName: string = hasTypename ? args[0] : "AnonymousModel"
    if (hasTypename) {
        args.shift()
    }

    // check all parameters
    if (devMode()) {
        args.forEach((type, i) => {
            assertArg(type, isModelType, "mobx-state-tree model type", hasTypename ? i + 2 : i + 1)
        })
    }

    return args
        .reduce((prev, cur) =>
            prev.cloneAndEnhance({
                name: prev.name + "_" + cur.name,
                properties: cur.properties,
                actionDescriptors: cur.actionDescriptors,
                viewDescriptors: cur.viewDescriptors,
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
