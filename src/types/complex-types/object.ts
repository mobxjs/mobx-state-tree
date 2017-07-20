import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    intercept,
    observe
} from "mobx"
import { extendKeepGetter, fail, hasOwnProperty, isPlainObject, isPrimitive } from "../../utils"
import { ComplexType, IComplexType, IType } from "../type"
import { TypeFlags, isType, isObjectType } from "../type-flags"
import { createNode, getStateTreeNode, IStateTreeNode, IJsonPatch, Node } from "../../core"
import {
    flattenTypeErrors,
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure
} from "../type-checker"
import { getPrimitiveFactoryFromValue } from "../primitives"
import { optional } from "../utility-types/optional"
import { Property } from "../property-types/property"
import { ComputedProperty } from "../property-types/computed-property"
import { ValueProperty } from "../property-types/value-property"
import { ActionProperty } from "../property-types/action-property"
import { ViewProperty } from "../property-types/view-property"
import { VolatileProperty } from "../property-types/volatile-property"

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
export class ObjectType extends ComplexType<any, any> {
    shouldAttachNode = true
    readonly flags = TypeFlags.Object

    /*
     * The original object definition
     */
    properties: any
    state: any
    actions: any

    modelConstructor: new () => any

    /*
     * Parsed description of all properties
     */
    private props: {
        [key: string]: Property
    } = {}

    constructor(name: string, baseModel: Object, baseState: Object, baseActions: Object) {
        super(name)
        Object.freeze(baseModel) // make sure nobody messes with it
        Object.freeze(baseActions)
        this.properties = baseModel
        this.state = baseState
        this.actions = baseActions
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        // fancy trick to get a named function...., http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        // Although object.defineProperty on a real function could also be used, that name is not used everywhere, for example when logging an object to the Chrome console, so this works better:
        this.modelConstructor = new Function(`return function ${name} (){}`)()
        this.modelConstructor.prototype.toString = objectTypeToString
        this.parseModelProps()
        this.forAllProps(prop => prop.initializePrototype(this.modelConstructor.prototype))
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
    }

    createNewInstance = () => {
        const instance = new this.modelConstructor()
        extendShallowObservable(instance, {})
        return instance as Object
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.storedValue as IStateTreeNode
        this.forAllProps(prop => prop.initialize(instance, snapshot))
        intercept(instance, change => this.willChange(change))
        observe(instance, this.didChange)
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()

        return this.props[change.name].willChange(change)
    }

    didChange = (change: IObjectChange) => {
        this.props[change.name].didChange(change)
    }

    parseModelProps() {
        const { properties, state, actions } = this

        for (let key in properties)
            if (hasOwnProperty(properties, key)) {
                if (HOOK_NAMES.indexOf(key) !== -1)
                    console.warn(
                        `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
                    )

                const descriptor = Object.getOwnPropertyDescriptor(properties, key)
                if ("get" in descriptor) {
                    this.props[key] = new ComputedProperty(key, descriptor.get!, descriptor.set)
                    continue
                }

                const { value } = descriptor
                if (value === null || undefined) {
                    fail(
                        "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
                    )
                } else if (isPrimitive(value)) {
                    const baseType = getPrimitiveFactoryFromValue(value)
                    this.props[key] = new ValueProperty(key, optional(baseType, value))
                } else if (isType(value)) {
                    this.props[key] = new ValueProperty(key, value)
                } else if (typeof value === "function") {
                    this.props[key] = new ViewProperty(key, value)
                } else if (typeof value === "object") {
                    fail(
                        `In property '${key}': base model's should not contain complex values: '${value}'`
                    )
                } else {
                    fail(`Unexpected value for property '${key}'`)
                }
            }

        for (let key in state)
            if (hasOwnProperty(state, key)) {
                if (HOOK_NAMES.indexOf(key) !== -1)
                    console.warn(
                        `Hook '${key}' was defined as local state. Hooks should be defined as part of the actions`
                    )

                const value = state[key]
                if (key in this.properties)
                    fail(
                        `Property '${key}' was also defined as local state. Local state fields and properties should not collide`
                    )
                this.props[key] = new VolatileProperty(key, value)
            }

        for (let key in actions)
            if (hasOwnProperty(actions, key)) {
                const value = actions[key]
                if (key in this.properties)
                    fail(
                        `Property '${key}' was also defined as action. Actions and properties should not collide`
                    )
                if (key in this.state)
                    fail(
                        `Property '${key}' was also defined as local state. Actions and state should not collide`
                    )
                if (typeof value === "function") {
                    this.props[key] = new ActionProperty(key, value)
                } else {
                    fail(
                        `Unexpected value for action '${key}'. Expected function, got ${typeof value}`
                    )
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
        if (!(this.props[key] instanceof ValueProperty)) return fail("Not a value property: " + key)
        return (this.props[key] as ValueProperty).getValueNode(node.storedValue)
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
        for (let key in this.props) this.props[key].deserialize(node.storedValue, s)
    }

    preProcessSnapshot(snapshot: any) {
        if (typeof this.actions.preProcessSnapshot === "function")
            return this.actions.preProcessSnapshot.call(null, snapshot)
        return snapshot
    }

    postProcessSnapshot(snapshot: any) {
        if (typeof this.actions.postProcessSnapshot === "function")
            return this.actions.postProcessSnapshot.call(null, snapshot)
        return snapshot
    }

    getChildType(key: string): IType<any, any> {
        return (this.props[key] as ValueProperty).type
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        let snapshot = this.preProcessSnapshot(value)

        if (!isPlainObject(snapshot)) {
            return typeCheckFailure(context, snapshot)
        }

        return flattenTypeErrors(
            Object.keys(this.props).map(path => this.props[path].validate(snapshot, context))
        )
    }

    private forAllProps(fn: (o: Property) => void) {
        // optimization: persists keys or loop more efficiently
        Object.keys(this.props).forEach(key => fn(this.props[key]))
    }

    describe() {
        // TODO: make proptypes responsible
        // optimization: cache
        return (
            "{ " +
            Object.keys(this.props)
                .map(key => {
                    const prop = this.props[key]
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

export type IModelProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] }
export type IModelVolatileState<T> = { [K in keyof T]: ((self?: any) => T[K]) | T[K] }

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
}

export interface IModelType<T = {}, S = {}, A = {}> extends IComplexType<Snapshot<T>, T & S & A> {
    properties: IModelProperties<T>
    state: IModelVolatileState<S>
    actions: A
}

export function model<T = {}, S = {}, A = {}>(
    name: string,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & S>,
    volatileState: IModelVolatileState<S> & ThisType<IStateTreeNode & T & S>,
    operations: A & ThisType<IStateTreeNode & T & A & S>
): IModelType<T & IStateTreeNode, S, A>
export function model<T = {}, S = {}, A = {}>(
    name: string,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & S>,
    operations?: A & ThisType<IStateTreeNode & T & A & S>
): IModelType<T & IStateTreeNode, S, A>
export function model<T = {}, S = {}, A = {}>(
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & S>,
    volatileState: IModelVolatileState<S> & ThisType<IStateTreeNode & T & S>,
    operations: A & ThisType<IStateTreeNode & T & A & S>
): IModelType<T & IStateTreeNode, S, A>
export function model<T = {}, S = {}, A = {}>(
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & S>,
    operations?: A & ThisType<IStateTreeNode & T & A & S>
): IModelType<T & IStateTreeNode, S, A>
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
    const props = args.shift() || fail("types.model must specify properties")
    const volatileState = (args.length > 1 && args.shift()) || {}
    const actions = args.shift() || {}
    return new ObjectType(name, props, volatileState, actions)
}

export function compose<T1, S1, A1, T2, S2, A2, T3, S3, A3>(
    t1: IModelType<T1, S1, A1>,
    t2: IModelType<T2, S2, A2>,
    t3?: IModelType<T3, S3, A3>
): IModelType<IStateTreeNode & T1 & T2 & T3, S1 & S2 & S3, A1 & A2 & A3> // ...and so forth...
export function compose<T1, S1, A1, T2, S2, A2, T3, S3, A3>(
    name: string,
    t1: IModelType<T1, S1, A1>,
    t2: IModelType<T2, S2, A2>,
    t3?: IModelType<T3, S3, A3>
): IModelType<IStateTreeNode & T1 & T2 & T3, S1 & S2 & S3, A1 & A2 & A3> // ...and so forth...
export function compose<BASE_T, BASE_S, BASE_A, T, S, A>(
    name: string,
    baseType: IModelType<BASE_T, BASE_S, BASE_A>,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & BASE_T>,
    volatileState: IModelVolatileState<S> & ThisType<IStateTreeNode & BASE_T & T & BASE_S & S>,
    operations: A & ThisType<BASE_T & T & BASE_S & S & BASE_A & A>
): IModelType<IStateTreeNode & BASE_T & T, BASE_S & S, BASE_A & A>
export function compose<BASE_T, BASE_S, BASE_A, T, S, A>(
    name: string,
    baseType: IModelType<BASE_T, BASE_S, BASE_A>,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & BASE_T>,
    operations?: A & ThisType<BASE_T & T & BASE_S & S & BASE_A & A>
): IModelType<IStateTreeNode & BASE_T & T, BASE_S & S, BASE_A & A>
export function compose<BASE_T, BASE_S, BASE_A, T, S, A>(
    baseType: IModelType<BASE_T, BASE_S, BASE_A>,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & BASE_T>,
    volatileState: IModelVolatileState<S> & ThisType<IStateTreeNode & BASE_T & T & BASE_S & S>,
    operations: A & ThisType<BASE_T & T & BASE_S & S & BASE_A & A>
): IModelType<IStateTreeNode & BASE_T & T, BASE_S & S, BASE_A & A>
export function compose<BASE_T, BASE_S, BASE_A, T, S, A>(
    baseType: IModelType<BASE_T, BASE_S, BASE_A>,
    properties: IModelProperties<T> & ThisType<IStateTreeNode & T & BASE_T>,
    operations?: A & ThisType<BASE_T & T & BASE_S & S & BASE_A & A>
): IModelType<IStateTreeNode & BASE_T & T, BASE_S & S, BASE_A & A>
/**
 * Composes a new model from one or more existing model types.
 * This method can be invoked in two forms:
 * 1. Given 2 or more model types, the types are composed into a new Type.
 * 2. Given 1 model type, and additionally a set of properties, actions and volatile state, a new type is composed.
 *
 * Overloads:
 *
 * * `compose(...modelTypes)`
 * * `compose(modelType, properties)`
 * * `compose(modelType, properties, actions)`
 * * `compose(modelType, properties, volatileState, actions)`
 *
 * [Example of form 2](https://github.com/mobxjs/mobx-state-tree#simulate-inheritance-by-using-type-composition)
 *
 * @export
 * @alias types.compose
 */
export function compose(...args: any[]) {
    const typeName = typeof args[0] === "string" ? args.shift() : "AnonymousModel"

    if (args.every(arg => isType(arg))) {
        // compose types
        return (args as IModelType<any, any, any>[]).reduce((prev, cur) =>
            compose(typeName, prev, cur.properties, cur.state, cur.actions)
        )
    }

    const baseType = args.shift()
    const props = args.shift() || fail("types.compose must specify properties or `{}`")
    const volatileState = (args.length > 1 && args.shift()) || {}
    const actions = args.shift() || {}

    if (!isObjectType(baseType)) return fail(`Only model types can be composed`)
    return model(
        typeName,
        extendKeepGetter({}, baseType.properties, props),
        extendKeepGetter({}, baseType.state, volatileState),
        extendKeepGetter({}, baseType.actions, actions)
    )
}
