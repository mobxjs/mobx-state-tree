import {
    action,
    IObjectWillChange,
    intercept,
    observe,
    computed,
    isComputed,
    getAtom,
    extendObservable,
    observable,
    _interceptReads
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
    OptionalValue,
    Union,
    IdentifierType,
    IChildNodesMap
} from "../../internal"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"
const POST_PROCESS_SNAPSHOT = "postProcessSnapshot"

export enum HookNames {
    afterCreate = "afterCreate",
    afterAttach = "afterAttach",
    beforeDetach = "beforeDetach",
    beforeDestroy = "beforeDestroy"
}

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

export type ModelTypeConfig = {
    name?: string
    properties?: { [K: string]: IType<any, any> }
    initializers?: ReadonlyArray<((instance: any) => any)>
    preProcessor?: (snapshot: any) => any
    postProcessor?: (snapshot: any) => any
}

export type OptionalValuesMap = {
    [key: string]: OptionalValue<any, any>
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    initializers: EMPTY_ARRAY
}

function toPropertiesObject<T>(properties: IModelProperties<T>): { [K in keyof T]: IType<any, T> } {
    // loop through properties and ensures that all items are types
    return Object.keys(properties).reduce(
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
                // its already a type
            } else if (isType(value)) {
                return props
                // its a function, maybe the user wanted a view?
            } else if (typeof value === "function") {
                fail("Functions are not supported as properties, use views instead")
                // no other complex values
            } else if (typeof value === "object") {
                fail(
                    `In property '${key}': base models should not contain complex values: '${value}'`
                )
                // WTF did you pass in mate?
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        },
        properties as any
    )
}

export class ModelType<S, T> extends ComplexType<S, T> implements IModelType<S, T> {
    readonly flags = TypeFlags.Object
    shouldAttachNode = true

    /*
     * The original object definition
     */
    public readonly initializers: ((instance: any) => any)[]
    public readonly properties: { [K: string]: IType<any, any> } = {}
    private preProcessor: (snapshot: any) => any | undefined
    private postProcessor: (snapshot: any) => any | undefined

    public identifierAttribute: string | undefined = undefined
    private _optionalChildren: OptionalValuesMap

    constructor(opts: ModelTypeConfig) {
        super(opts.name || defaultObjectOptions.name)
        const name = opts.name || defaultObjectOptions.name
        // TODO: this test still needed?
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties)
        freeze(this.properties) // make sure nobody messes with it
        this._preBootModel()
    }

    private _preBootModel() {
        this._optionalChildren = {} as OptionalValuesMap
        this.forAllProps((propName, propType) => {
            if (propType instanceof IdentifierType) {
                if (this.identifierAttribute)
                    fail(
                        `Cannot define property '${propName}' as object identifier, property '${this
                            .identifierAttribute}' is already defined as identifier property`
                    )
                this.identifierAttribute = propName
            } else if (propType instanceof OptionalValue) {
                this._optionalChildren[propName] = propType
            } else if (propType instanceof Union) {
                const optional = propType.types.find(
                    t => t instanceof OptionalValue
                ) as OptionalValue<any, any>
                if (optional) {
                    this._optionalChildren[propName] = optional
                }
            }
        })
        freeze(this._optionalChildren)
    }

    get propertyNames(): string[] {
        return Object.keys(this.properties)
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

    actions<A extends { [name: string]: Function }>(fn: (self: T) => A): IModelType<S, T & A> {
        const actionInitializer = (self: T) => {
            this.instantiateActions(self, fn(self))
            return self
        }
        return this.cloneAndEnhance({ initializers: [actionInitializer] })
    }

    instantiateActions(self: T, actions: { [name: string]: Function }) {
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

    named(name: string): IModelType<S, T> {
        return this.cloneAndEnhance({ name })
    }

    props<SP, TP>(
        properties: { [K in keyof TP]: IType<any, TP[K]> | TP[K] } &
            { [K in keyof SP]: IType<SP[K], any> | SP[K] }
    ): IModelType<S & SP, T & TP> {
        return this.cloneAndEnhance({ properties } as any)
    }

    volatile<TP>(fn: (self: T) => TP): IModelType<S, T & TP> {
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
        // TODO: typecheck & namecheck members of state?
        extendObservable(self, state, EMPTY_OBJECT, mobxShallow)
    }

    extend<
        A extends { [name: string]: Function } = {},
        V extends Object = {},
        VS extends Object = {}
    >(
        fn: (self: T & IStateTreeNode) => { actions?: A; views?: V; state?: VS }
    ): IModelType<S, T & A & V & VS> {
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

    views<V extends Object>(fn: (self: T) => V): IModelType<S, T & V> {
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
                // TODO: mobx currently does not allow redefining computes yet, pending #1121
                if (isComputed((self as any).$mobx.values[key])) {
                    // TODO: use `isComputed(self, key)`, pending mobx #1120
                    ;(self as any).$mobx.values[key] = computed(descriptor.get!, {
                        name: key,
                        set: descriptor.set,
                        context: self
                    })
                } else {
                    const tmp = {}
                    Object.defineProperty(tmp, key, {
                        get: descriptor.get,
                        set: descriptor.set,
                        enumerable: true
                    })
                    extendObservable(self, tmp, EMPTY_OBJECT, mobxShallow)
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

    preProcessSnapshot(preProcessor: (snapshot: any) => S): IModelType<S, T> {
        const currentPreprocessor = this.preProcessor
        if (!currentPreprocessor) return this.cloneAndEnhance({ preProcessor })
        else
            return this.cloneAndEnhance({
                preProcessor: snapshot => currentPreprocessor(preProcessor(snapshot))
            })
    }

    postProcessSnapshot(postProcessor: (snapshot: any) => S): IModelType<S, T> {
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
        return createNode(
            this,
            parent,
            subpath,
            environment,
            this.applySnapshotPreProcessor(snapshot),
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
        const instance = objNode.storedValue as IStateTreeNode

        type.forAllProps(name => {
            extendObservable(
                instance,
                {
                    [name]: childNodes[name]
                },
                EMPTY_OBJECT,
                mobxShallow
            )
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
        const childNode = node.storedValue.$mobx.values[key].value // TODO: blegh!
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
            const optionalChildren = this._optionalChildren
            Object.keys(optionalChildren).forEach(name => {
                if (typeof processed[name] === "undefined") {
                    processed[name] = optionalChildren[name].getDefaultValueSnapshot()
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

    getChildType(key: string): IType<any, any> {
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

    private forAllProps(fn: (name: string, type: IType<any, any>) => void) {
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

export interface IModelType<S, T> extends IComplexType<S, T & IStateTreeNode> {
    readonly properties: { readonly [K: string]: IType<any, any> } // for reflection purposes
    named(newName: string): IModelType<S, T>
    props<SP, TP>(
        props: { [K in keyof TP]: IType<any, TP[K]> | TP[K] } &
            { [K in keyof SP]: IType<SP[K], any> | SP[K] }
    ): IModelType<S & Snapshot<SP>, T & TP>
    // props<P>(props: IModelProperties<P>): IModelType<S & Snapshot<P>, T & P>
    views<V extends Object>(fn: (self: T & IStateTreeNode) => V): IModelType<S, T & V>
    actions<A extends { [name: string]: Function }>(
        fn: (self: T & IStateTreeNode) => A
    ): IModelType<S, T & A>
    volatile<TP>(fn: (self: T) => TP): IModelType<S, T & TP>
    extend<
        A extends { [name: string]: Function } = {},
        V extends Object = {},
        VS extends Object = {}
    >(
        fn: (self: T & IStateTreeNode) => { actions?: A; views?: V; state?: VS }
    ): IModelType<S, T & A & V & VS>
    preProcessSnapshot(fn: (snapshot: any) => S): IModelType<S, T>
    postProcessSnapshot(fn: (snapshot: any) => S): IModelType<S, T>
}

export type IModelProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] }
export type IModelVolatileState<T> = { [K in keyof T]: ((self?: any) => T[K]) | T[K] }

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
}

export function model<T = {}>(
    name: string,
    properties?: IModelProperties<T>
): IModelType<Snapshot<T>, T>
export function model<T = {}>(properties?: IModelProperties<T>): IModelType<Snapshot<T>, T>
/**
 * Creates a new model type by providing a name, properties, volatile state and actions.
 *
 * See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.
 *
 * @export
 * @alias types.model
 */
export function model<T = {}>(...args: any[]): IModelType<Snapshot<T>, T> {
    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    const properties = args.shift() || {}
    return new ModelType({ name, properties }) as IModelType<Snapshot<T>, T>
}

export function compose<T1, S1, T2, S2, T3, S3>(
    t1: IModelType<T1, S1>,
    t2: IModelType<T2, S2>,
    t3?: IModelType<T3, S3>
): IModelType<T1 & T2 & T3, S1 & S2 & S3> // ...and so forth...
export function compose<T1, S1, A1, T2, S2, A2, T3, S3, A3>(
    name: string,
    t1: IModelType<T1, S1>,
    t2: IModelType<T2, S2>,
    t3?: IModelType<T3, S3>
): IModelType<T1 & T2 & T3, S1 & S2 & S3> // ...and so forth...
/**
 * Composes a new model from one or more existing model types.
 * This method can be invoked in two forms:
 * Given 2 or more model types, the types are composed into a new Type.
 *
 * @export
 * @alias types.compose
 */
export function compose(...args: any[]): IModelType<any, any> {
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

export function isObjectType(type: any): type is ModelType<any, any> {
    return isType(type) && (type.flags & TypeFlags.Object) > 0
}
