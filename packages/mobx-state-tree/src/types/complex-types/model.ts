import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    intercept,
    observe,
    computed,
    isComputed,
    observable,
    extras
} from "mobx"
import {
    fail,
    isPlainObject,
    isPrimitive,
    EMPTY_ARRAY,
    EMPTY_OBJECT,
    addHiddenFinalProp
} from "../../utils"
import { ComplexType, IComplexType, IType } from "../type"
import { TypeFlags, isType } from "../type-flags"
import {
    createNode,
    getStateTreeNode,
    IStateTreeNode,
    IJsonPatch,
    Node,
    createActionInvoker,
    escapeJsonPath
} from "../../core"
import {
    flattenTypeErrors,
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure,
    getContextForPath
} from "../type-checker"
import { getPrimitiveFactoryFromValue, undefinedType } from "../primitives"
import { optional } from "../utility-types/optional"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"

const HOOK_NAMES = {
    afterCreate: "afterCreate",
    afterAttach: "afterAttach",
    postProcessSnapshot: "postProcessSnapshot",
    beforeDetach: "beforeDetach",
    beforeDestroy: "beforeDestroy"
}

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

export type ModelTypeConfig = {
    name?: string
    properties?: { [K: string]: IType<any, any> }
    initializers?: ReadonlyArray<((instance: any) => any)>
    preProcessor?: (snapshot: any) => any
}

const defaultObjectOptions = {
    name: "AnonymousModel",
    properties: {},
    initializers: EMPTY_ARRAY
}

function toPropertiesObject<T>(properties: IModelProperties<T>): { [K in keyof T]: IType<any, T> } {
    // loop through properties and ensures that all items are types
    return Object.keys(properties).reduce(
        (properties, key) => {
            // warn if user intended a HOOK
            if (key in HOOK_NAMES)
                return fail(
                    `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                )

            // the user intended to use a view
            const descriptor = Object.getOwnPropertyDescriptor(properties, key)
            if ("get" in descriptor) {
                fail("Getters are not supported as properties. Please use views instead")
            }
            // undefined and null are not valid
            const { value } = descriptor
            if (value === null || undefined) {
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
                    `In property '${key}': base model's should not contain complex values: '${value}'`
                )
                // WTF did you passed in mate?
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        },
        properties as any
    )
}

export class ModelType<S, T> extends ComplexType<S, T> implements IModelType<S, T> {
    readonly flags = TypeFlags.Object

    /*
     * The original object definition
     */
    public readonly initializers: ((instance: any) => any)[]
    public readonly properties: { [K: string]: IType<any, any> }
    private preProcessor: (snapshot: any) => any | undefined
    private readonly propertiesNames: string[]

    constructor(opts: ModelTypeConfig) {
        super(opts.name || defaultObjectOptions.name)
        const name = opts.name || defaultObjectOptions.name
        // TODO: this test still needed?
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        Object.assign(this, defaultObjectOptions, opts)
        // ensures that any default value gets converted to its related type
        this.properties = toPropertiesObject(this.properties)
        this.propertiesNames = Object.keys(this.properties)
        Object.freeze(this.properties) // make sure nobody messes with it
    }

    cloneAndEnhance(opts: ModelTypeConfig): ModelType<any, any> {
        return new ModelType({
            name: opts.name || this.name,
            properties: Object.assign({}, this.properties, opts.properties),
            initializers: this.initializers.concat((opts.initializers as any) || []),
            preProcessor: opts.preProcessor || this.preProcessor
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
                return fail(
                    `Cannot define action '${PRE_PROCESS_SNAPSHOT}', it should be defined using 'type.preProcessSnapshot(fn)' instead`
                )

            // apply hook composition
            let action = actions[name]
            let baseAction = (self as any)[name]
            if (name in HOOK_NAMES && baseAction) {
                let specializedAction = action
                if (name === HOOK_NAMES.postProcessSnapshot)
                    action = (snapshot: any) => specializedAction(baseAction(snapshot))
                else
                    action = function() {
                        baseAction.apply(null, arguments)
                        specializedAction.apply(null, arguments)
                    }
            }

            addHiddenFinalProp(self, name, createActionInvoker(self, name, action))
        })
    }

    named(name: string): IModelType<S, T> {
        return this.cloneAndEnhance({ name })
    }

    props<SP, TP>(
        properties: { [K in keyof TP]: IType<any, TP[K]> } & { [K in keyof SP]: IType<SP[K], any> }
    ): IModelType<S & SP, T & TP> {
        return this.cloneAndEnhance({ properties } as any)
    }

    extend<A extends { [name: string]: Function } = {}, V extends Object = {}>(
        fn: (self: T & IStateTreeNode) => { actions?: A; views?: V }
    ): IModelType<S, T & A & V> {
        const initializer = (self: T) => {
            const { actions, views, ...rest } = fn(self)
            for (let key in rest)
                fail(
                    `The \`extend\` function should return an object with fields 'actions' and / or  'views'. Found invalid key '${key}'`
                )
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
            const descriptor = Object.getOwnPropertyDescriptor(views, key)
            const { value } = descriptor
            if ("get" in descriptor) {
                // TODO: mobx currently does not allow redefining computes yet, pending #1121
                if (isComputed((self as any).$mobx.values[key])) {
                    // TODO: use `isComputed(self, key)`, pending mobx #1120
                    ;(self as any).$mobx.values[key] = computed(descriptor.get!, {
                        name: key,
                        setter: descriptor.set,
                        context: self
                    })
                } else {
                    const tmp = {}
                    Object.defineProperty(tmp, key, {
                        get: descriptor.get,
                        set: descriptor.set,
                        enumerable: true
                    })
                    extendShallowObservable(self, tmp)
                }
            } else if (typeof value === "function") {
                // this is a view function, merge as is!
                addHiddenFinalProp(self, key, value)
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

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any): Node {
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
        const instance = observable.shallowObject(EMPTY_OBJECT)
        addHiddenFinalProp(instance, "toString", objectTypeToString)
        return instance as Object
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.storedValue as IStateTreeNode
        this.forAllProps((name, type) => {
            extendShallowObservable(instance, {
                [name]: observable.ref(
                    type.instantiate(node, name, node._environment, snapshot[name])
                )
            })
            extras.interceptReads(node.storedValue, name, node.unbox)
        })

        this.initializers.reduce((self, fn) => fn(self), instance)
        intercept(instance, change => this.willChange(change))
        observe(instance, this.didChange)
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        const type = this.properties[change.name]
        node.assertWritable()
        typecheck(type, change.newValue)
        change.newValue = type.reconcile(node.getChildNode(change.name), change.newValue)
        return change
    }

    didChange = (change: IObjectChange) => {
        const node = getStateTreeNode(change.object)
        node.emitPatch(
            {
                op: "replace",
                path: escapeJsonPath(change.name),
                value: change.newValue.snapshot,
                oldValue: change.oldValue ? change.oldValue.snapshot : undefined
            },
            node
        )
    }

    getChildren(node: Node): Node[] {
        const res: Node[] = []
        this.forAllProps((name, type) => {
            res.push(this.getChildNode(node, name))
        })
        return res
    }

    getChildNode(node: Node, key: string): Node {
        if (!(key in this.properties)) return fail("Not a value property: " + key)
        const childNode = node.storedValue.$mobx.values[key].value // TODO: blegh!
        if (!childNode) return fail("Node not available for property " + key)
        return childNode
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): any {
        const res = {} as any
        this.forAllProps((name, type) => {
            // TODO: FIXME, make sure the observable ref is used!
            ;(extras.getAtom(node.storedValue, name) as any).reportObserved()
            res[name] = this.getChildNode(node, name).snapshot
        })
        if (typeof node.storedValue.postProcessSnapshot === "function")
            return node.storedValue.postProcessSnapshot.call(null, res)
        return res
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add"))
            fail(`object does not support operation ${patch.op}`)
        node.storedValue[subpath] = patch.value
    }

    @action
    applySnapshot(node: Node, snapshot: any): void {
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

    getChildType(key: string): IType<any, any> {
        return this.properties[key]
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        let snapshot = this.applySnapshotPreProcessor(value)

        if (!isPlainObject(snapshot)) {
            return typeCheckFailure(context, snapshot, "Value is not a plain object")
        }

        return flattenTypeErrors(
            this.propertiesNames.map(key =>
                this.properties[key].validate(
                    snapshot[key],
                    getContextForPath(context, key, this.properties[key])
                )
            )
        )
    }

    private forAllProps(fn: (name: string, type: IType<any, any>) => void) {
        this.propertiesNames.forEach(key => fn(key, this.properties[key]))
    }

    describe() {
        // optimization: cache
        return (
            "{ " +
            this.propertiesNames
                .map(key => key + ": " + this.properties[key].describe())
                .join("; ") +
            " }"
        )
    }

    getDefaultSnapshot(): any {
        return {}
    }

    removeChild(node: Node, subpath: string) {
        node.storedValue[subpath] = null
    }
}

export interface IModelType<S, T> extends IComplexType<S, T & IStateTreeNode> {
    named(newName: string): IModelType<S, T>
    props<SP, TP>(
        props: { [K in keyof TP]: IType<any, TP[K]> | TP[K] } &
            { [K in keyof SP]: IType<SP[K], any> | SP[K] }
    ): IModelType<S & Snapshot<SP>, T & TP>
    //props<P>(props: IModelProperties<P>): IModelType<S & Snapshot<P>, T & P>
    views<V extends Object>(fn: (self: T & IStateTreeNode) => V): IModelType<S, T & V>
    actions<A extends { [name: string]: Function }>(
        fn: (self: T & IStateTreeNode) => A
    ): IModelType<S, T & A>
    extend<A extends { [name: string]: Function } = {}, V extends Object = {}>(
        fn: (self: T & IStateTreeNode) => { actions?: A; views?: V }
    ): IModelType<S, T & A & V>
    preProcessSnapshot(fn: (snapshot: any) => S): IModelType<S, T>
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
export function model(...args: any[]) {
    const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel"
    const properties = args.shift() || {}
    return new ModelType({ name, properties })
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
