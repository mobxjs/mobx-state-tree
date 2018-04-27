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
    IAnyType
} from "../../internal"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"

export enum HookNames {
    afterCreate = "afterCreate",
    afterAttach = "afterAttach",
    postProcessSnapshot = "postProcessSnapshot",
    beforeDetach = "beforeDetach",
    beforeDestroy = "beforeDestroy"
}

export type ModelProperties = {
    [key: string]: IAnyType
}

export type ModelPrimitive = string | number | boolean | Date

export type ModelPropertiesDeclaration = {
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
                    ? IType<number | undefined, number, Date> & { flags: TypeFlags.Optional }
                    : T[K] extends IType<infer C, infer S, infer T> & { flags: TypeFlags.Optional }
                        ? IType<C, S, T> & { flags: TypeFlags.Optional }
                        : T[K] extends IType<infer C, infer S, infer T> ? IType<C, S, T> : never
}

export type OptionalPropertyTypes = ModelPrimitive | { flags: TypeFlags.Optional }

export type RequiredPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalPropertyTypes ? never : undefined extends T[K] ? never : K
}[keyof T]
export type RequiredProps<T> = Pick<T, RequiredPropNames<T>>
export type OptionalPropNames<T> = {
    [K in keyof T]: T[K] extends OptionalPropertyTypes ? K : never
}[keyof T]
export type OptionalProps<T> = Pick<T, OptionalPropNames<T>>

/**
 * Maps property types to the snapshot, including omitted optional attributes
 */
export type ModelSnapshotType<T extends ModelProperties> = {
    [K in keyof RequiredProps<T>]: T[K] extends IType<any, infer X, any> ? X : never
} &
    { [K in keyof OptionalProps<T>]?: T[K] extends IType<any, infer X, any> ? X : never }

export type ModelCreationType<T extends ModelProperties> = {
    [K in keyof RequiredProps<T>]: T[K] extends IType<infer X, any, infer Y> ? X | Y : never
} &
    { [K in keyof OptionalProps<T>]?: T[K] extends IType<infer X, any, infer Y> ? X | Y : never }

export type ModelInstanceType<T extends ModelProperties, O> = {
    [K in keyof T]: T[K] extends IType<any, any, infer X> ? X : never
} &
    O &
    IStateTreeNode

export type ModelActions = {
    [key: string]: Function
}

export interface IModelType<PROPS extends ModelProperties, OTHERS>
    extends IComplexType<
            ModelCreationType<PROPS>,
            ModelSnapshotType<PROPS>,
            ModelInstanceType<PROPS, OTHERS>
        > {
    readonly properties: PROPS
    named(newName: string): this
    props<PROPS2 extends ModelPropertiesDeclaration>(
        props: PROPS2
    ): IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, OTHERS>
    views<V extends Object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS>) => V
    ): IModelType<PROPS, OTHERS & V>
    actions<A extends ModelActions>(
        fn: (self: ModelInstanceType<PROPS, OTHERS>) => A
    ): IModelType<PROPS, OTHERS & A>
    volatile<TP extends object>(
        fn: (self: ModelInstanceType<PROPS, OTHERS>) => TP
    ): IModelType<PROPS, OTHERS & TP>
    extend<A extends ModelActions = {}, V extends Object = {}, VS extends Object = {}>(
        fn: (self: ModelInstanceType<PROPS, OTHERS>) => { actions?: A; views?: V; state?: VS }
    ): IModelType<PROPS, OTHERS & A & V & VS>
    preProcessSnapshot<S0 = ModelCreationType<PROPS>, S1 = ModelSnapshotType<PROPS>>(
        fn: (snapshot: S0) => ModelCreationType<PROPS>
    ): this & IComplexType<S0, S1, ModelInstanceType<PROPS, OTHERS>> // Snapshot can now be anything!
}

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

export type ModelTypeConfig = {
    name?: string
    properties?: ModelProperties
    initializers?: ReadonlyArray<((instance: any) => any)>
    preProcessor?: (snapshot: any) => any
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    initializers: EMPTY_ARRAY
}

function toPropertiesObject<T>(declaredProps: ModelPropertiesDeclaration): ModelProperties {
    // loop through properties and ensures that all items are types
    return Object.keys(declaredProps).reduce(
        (properties, key) => {
            // warn if user intended a HOOK
            if (key in HookNames)
                return fail(
                    `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                )

            // the user intended to use a view
            const descriptor = Object.getOwnPropertyDescriptor(properties, key)!
            if ("get" in descriptor) {
                fail("Getters are not supported as properties. Please use views instead")
            }
            // undefined and null are not valid
            const { value } = descriptor
            if (value === null || value === undefined) {
                fail(
                    "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
                )
                // its a primitive, convert to its type
            } else if (isPrimitive(value)) {
                return Object.assign({}, properties, {
                    [key]: optional(getPrimitiveFactoryFromValue(value), value)
                })
                // its already a type
            } else if (isType(value)) {
                return properties
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
    public readonly initializers: ((instance: any) => any)[]
    public readonly properties: S = {} as S
    private preProcessor: (snapshot: any) => any | undefined

    constructor(opts: ModelTypeConfig) {
        super(opts.name || defaultObjectOptions.name)
        const name = opts.name || defaultObjectOptions.name
        // TODO: this test still needed?
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties) as S
        freeze(this.properties) // make sure nobody messes with it
    }

    get propertyNames(): string[] {
        return Object.keys(this.properties)
    }

    cloneAndEnhance(opts: ModelTypeConfig): ModelType<any, any> {
        return new ModelType({
            name: opts.name || this.name,
            properties: Object.assign({}, this.properties, opts.properties),
            initializers: this.initializers.concat((opts.initializers as any) || []),
            preProcessor: opts.preProcessor || this.preProcessor
        })
    }

    actions(fn: (self: any) => any): IModelType<any, any> {
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
                return fail(
                    `Cannot define action '${PRE_PROCESS_SNAPSHOT}', it should be defined using 'type.preProcessSnapshot(fn)' instead`
                )

            // apply hook composition
            let action = actions[name]
            let baseAction = (self as any)[name]
            if (name in HookNames && baseAction) {
                let specializedAction = action
                if (name === HookNames.postProcessSnapshot)
                    action = (snapshot: any) => specializedAction(baseAction(snapshot))
                else
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
            return
        })
    }

    named(name: string): this {
        return this.cloneAndEnhance({ name }) as this
    }

    props(properties: ModelPropertiesDeclaration): IModelType<any, any> {
        return this.cloneAndEnhance({ properties } as any)
    }

    volatile(fn: (self: any) => any): IModelType<any, any> {
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

    extend(fn: (self: any) => any): IModelType<any, any> {
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

    views(fn: (self: any) => any): IModelType<any, any> {
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

    preProcessSnapshot(preProcessor: (snapshot: any) => any): this {
        const currentPreprocessor = this.preProcessor
        if (!currentPreprocessor) return this.cloneAndEnhance({ preProcessor }) as this
        else
            return this.cloneAndEnhance({
                preProcessor: snapshot => currentPreprocessor(preProcessor(snapshot))
            }) as this
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

    createNewInstance = () => {
        const instance = observable.object(EMPTY_OBJECT, EMPTY_OBJECT, mobxShallow)
        addHiddenFinalProp(instance, "toString", objectTypeToString)
        return instance as Object
    }

    finalizeNewInstance = (node: INode, snapshot: any) => {
        const objNode = node as ObjectNode
        const instance = objNode.storedValue as IStateTreeNode
        this.forAllProps((name, type) => {
            extendObservable(
                instance,
                {
                    [name]: type.instantiate(objNode, name, objNode._environment, snapshot[name])
                },
                EMPTY_OBJECT,
                mobxShallow
            )
            _interceptReads(instance, name, objNode.unbox)
        })

        this.initializers.reduce((self, fn) => fn(self), instance)
        intercept(instance, change => this.willChange(change))
        observe(instance, this.didChange)
    }

    willChange(change: any): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()
        const type = this.properties[change.name]
        // only properties are typed, state are stored as-is references
        if (type) {
            typecheck(type, change.newValue)
            change.newValue = type.reconcile(node.getChildNode(change.name), change.newValue)
        }
        return change
    }

    didChange = (change: any) => {
        if (!this.properties[change.name]) {
            // don't emit patches for volatile state
            return
        }
        const node = getStateTreeNode(change.object)
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

    getSnapshot(node: ObjectNode): any {
        const res = {} as any
        this.forAllProps((name, type) => {
            // TODO: FIXME, make sure the observable ref is used!
            ;(getAtom(node.storedValue, name) as any).reportObserved()
            res[name] = this.getChildNode(node, name).snapshot
        })
        if (typeof node.storedValue.postProcessSnapshot === "function") {
            return node.storedValue.postProcessSnapshot.call(null, res)
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
        if (this.preProcessor) return this.preProcessor.call(null, snapshot)
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

export function compose<
    T1 extends ModelProperties,
    S1,
    T2 extends ModelProperties,
    S2,
    T3 extends ModelProperties,
    S3
>(
    t1: IModelType<T1, S1>,
    t2: IModelType<T2, S2>,
    t3?: IModelType<T3, S3>
): IModelType<T1 & T2 & T3, S1 & S2 & S3> // ...and so forth...
export function compose<
    T1 extends ModelProperties,
    S1,
    T2 extends ModelProperties,
    S2,
    T3 extends ModelProperties,
    S3
>(
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
