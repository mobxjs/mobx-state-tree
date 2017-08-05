import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    intercept,
    observe,
    computed
} from "mobx"
import {
    fail,
    hasOwnProperty,
    isPlainObject,
    isPrimitive,
    EMPTY_ARRAY,
    addHiddenFinalProp
} from "../../utils"
import { ComplexType, IComplexType, IType, ISnapshottable } from "../type"
import { TypeFlags, isType, isObjectType } from "../type-flags"
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
    typeCheckFailure
} from "../type-checker"
import { getPrimitiveFactoryFromValue } from "../primitives"
import { optional } from "../utility-types/optional"
// TODO: eliminate property / value-property
import { Property } from "../property-types/property"
import { ValueProperty } from "../property-types/value-property"

const HOOK_NAMES = [
    "preProcessSnapshot",
    "afterCreate",
    "afterAttach",
    "postProcessSnapshot",
    "beforeDetach",
    "beforeDestroy"
]

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

// TODO: rename to Model
export class ObjectType<S, T> extends ComplexType<S, T> implements IModelType<S, T> {
    readonly flags = TypeFlags.Object

    /*
     * The original object definition
     */
    public readonly initializers: ((instance: any) => any)[]
    public readonly properties: { [K: string]: IType<any, any> }
    private readonly parsedProperties: { [K: string]: ValueProperty } = {}

    modelConstructor: new () => any

    constructor(
        name: string,
        properties: { [K: string]: IType<any, any> },
        initializers?: ((instance: any) => any)[]
    ) {
        super(name)
        Object.freeze(properties) // make sure nobody messes with it
        this.properties = properties
        this.initializers = initializers ? initializers : EMPTY_ARRAY as any
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        this.createModelConstructor()
    }

    private createModelConstructor() {
        // Fancy trick to get a named constructor
        this.modelConstructor = class {}
        Object.defineProperty(this.modelConstructor, "name", {
            value: this.name,
            writable: false
        })
        const proto = this.modelConstructor.prototype
        proto.toString = objectTypeToString
        this.parseModelProps()
        this.forAllProps(prop => prop.initializePrototype(this.modelConstructor.prototype))
    }

    actions<A extends { [name: string]: Function }>(fn: (self: T) => A): IModelType<S, T & A> {
        const actionInitializer = (self: T) => {
            const actions = fn(self)
            if (actions && isPlainObject(actions)) {
                Object.keys(actions).forEach(name => {
                    addHiddenFinalProp(self, name, createActionInvoker(self, name, actions[name]))
                })
            }
            return self
        }
        return new ObjectType(
            this.name,
            this.properties,
            this.initializers.concat(actionInitializer)
        )
    }

    named(name: string): IModelType<S, T> {
        return new ObjectType(name, this.properties, this.initializers)
    }

    props<SP, TP>(
        props: { [K in keyof TP]: IType<any, TP[K]> } & { [K in keyof SP]: IType<SP[K], any> }
    ): IModelType<S & SP, T & TP> {
        return new ObjectType(
            this.name,
            Object.assign({} as any, this.properties, props),
            this.initializers
        )
    }

    views<V extends Object>(fn: (self: T) => V): IModelType<S, T & V> {
        const viewInitializer = (self: T) => {
            const views = fn(self)

            Object.keys(views).forEach(key => {
                // is this a computed property?
                const descriptor = Object.getOwnPropertyDescriptor(views, key)
                const { value } = descriptor
                if ("get" in descriptor) {
                    const tmp = {}
                    Object.defineProperty(tmp, key, {
                        get: descriptor.get,
                        set: descriptor.set,
                        enumerable: true
                    })
                    extendShallowObservable(self, tmp)
                } else if (typeof value === "function") {
                    // this is a view function, merge as is!
                    addHiddenFinalProp(self, key, value)
                } else {
                    // TODO: throw!
                }
            })

            return self
        }

        return new ObjectType(this.name, this.properties, this.initializers.concat(viewInitializer))
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any): Node {
        return createNode(
            this,
            parent,
            subpath,
            environment,
            this.preProcessSnapshot(snapshot),
            this.createNewInstance,
            this.finalizeNewInstance
        )
        // Optimization: record all prop- view- and action names after first construction, and generate an optimal base class
        // that pre-reserves all these fields for fast object-member lookups
    }

    createNewInstance = () => {
        const instance = new this.modelConstructor()
        extendShallowObservable(instance, {})
        return instance as Object
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.storedValue as IStateTreeNode
        this.forAllProps(prop => prop.initialize(instance, snapshot))
        this.initializers.reduce((self, fn) => fn(self), instance)
        intercept(instance, change => this.willChange(change))
        observe(instance, this.didChange)
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()
        return this.parsedProperties[change.name].willChange(change)
    }

    didChange = (change: IObjectChange) => {
        this.parsedProperties[change.name].didChange(change)
    }

    parseModelProps() {
        const { properties } = this
        for (let key in properties)
            if (hasOwnProperty(properties, key)) {
                if (HOOK_NAMES.indexOf(key) !== -1)
                    console.warn(
                        `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                    )

                const descriptor = Object.getOwnPropertyDescriptor(properties, key)
                if ("get" in descriptor) {
                    fail("Getters are not supported as properties. Please use views instead")
                }
                const { value } = descriptor
                if (value === null || undefined) {
                    fail(
                        "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
                    )
                } else if (isPrimitive(value)) {
                    const baseType = getPrimitiveFactoryFromValue(value)
                    this.parsedProperties[key] = new ValueProperty(key, optional(baseType, value))
                } else if (isType(value)) {
                    this.parsedProperties[key] = new ValueProperty(key, value)
                } else if (typeof value === "function") {
                    fail("Functions are not supported as properties, use views instead")
                } else if (typeof value === "object") {
                    fail(
                        `In property '${key}': base model's should not contain complex values: '${value}'`
                    )
                } else {
                    fail(`Unexpected value for property '${key}'`)
                }
            }
    }

    getChildren(node: Node): Node[] {
        const res: Node[] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty) res.push(prop.getValueNode(node.storedValue))
        })
        return res
    }

    getChildNode(node: Node, key: string): Node {
        if (!(this.parsedProperties[key] instanceof ValueProperty))
            return fail("Not a value property: " + key)
        return (this.parsedProperties[key] as ValueProperty).getValueNode(node.storedValue)
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(node.storedValue, res))
        return this.postProcessSnapshot(res)
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add"))
            fail(`object does not support operation ${patch.op}`)
        node.storedValue[subpath] = patch.value
    }

    @action
    applySnapshot(node: Node, snapshot: any): void {
        const s = this.preProcessSnapshot(snapshot)
        typecheck(this, s)
        this.forAllProps(prop => {
            prop.deserialize(node.storedValue, s)
        })
    }

    preProcessSnapshot(snapshot: any) {
        // TODO: reimplement this using types
        // if (typeof this.actions.preProcessSnapshot === "function")
        // return this.actions.preProcessSnapshot.call(null, snapshot)
        return snapshot
    }

    postProcessSnapshot(snapshot: any) {
        // if (typeof this.actions.postProcessSnapshot === "function")
        // return this.actions.postProcessSnapshot.call(null, snapshot)
        return snapshot
    }

    getChildType(key: string): IType<any, any> {
        return (this.parsedProperties[key] as ValueProperty).type
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        let snapshot = this.preProcessSnapshot(value)

        if (!isPlainObject(snapshot)) {
            return typeCheckFailure(context, snapshot)
        }

        return flattenTypeErrors(
            Object.keys(this.parsedProperties).map(path =>
                this.parsedProperties[path].validate(snapshot, context)
            )
        )
    }

    private forAllProps(fn: (o: Property) => void) {
        // optimization: persists keys or loop more efficiently
        Object.keys(this.parsedProperties).forEach(key => fn(this.parsedProperties[key]))
    }

    describe() {
        // TODO: make proptypes responsible
        // optimization: cache
        return (
            "{ " +
            Object.keys(this.parsedProperties)
                .map(key => {
                    const prop = this.parsedProperties[key]
                    return prop instanceof ValueProperty ? key + ": " + prop.type.describe() : ""
                })
                .filter(Boolean)
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
    const props = args.shift() || {}
    return new ObjectType(name, props, [])
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
    return (args as ObjectType<any, any>[])
        .reduce(
            (prev, cur) =>
                new ObjectType(
                    "AnonymousType",
                    Object.assign({}, prev.properties, cur.properties),
                    prev.initializers.concat(cur.initializers)
                )
        )
        .named(typeName)
}
