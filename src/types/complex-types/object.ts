import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    intercept,
    observe
} from "mobx"
import {
    nothing,
    extend as extendObject,
    fail, identity,
    isPrimitive,
    hasOwnProperty,
    isPlainObject
} from "../../utils"
import { IType, IComplexType, TypeFlags, isType, ComplexType } from "../type"
import { getType, IComplexValue, getComplexNode, IJsonPatch, Node } from "../../core"
import { IContext, IValidationResult, typeCheckFailure, flattenTypeErrors, getContextForPath } from "../type-checker"
import { getPrimitiveFactoryFromValue } from "../primitives"
import { isIdentifierType, IdentifierType } from "../utility-types/identifier"
import { optional } from "../utility-types/optional"
// import { isReferenceFactory } from "../utility-types/reference"
// import { isIdentifierFactory, IIdentifierDescriptor } from "../utility-types/identifier"
import { Late } from "../utility-types/late"
import { Property } from "../property-types/property"
import { IdentifierProperty } from "../property-types/identifier-property"
import { ReferenceProperty } from "../property-types/reference-property"
import { ComputedProperty } from "../property-types/computed-property"
import { ValueProperty } from "../property-types/value-property"
import { ActionProperty } from "../property-types/action-property"
import { ViewProperty } from "../property-types/view-property"

function objectTypeToString(this: any) {
    return getComplexNode(this).toString()
}

export class ObjectType extends ComplexType<any, any> {
    shouldAttachNode = true
    readonly flags = TypeFlags.Object

    /**
     * The original object definition
     */
    baseModel: any
    baseActions: any

    modelConstructor: new () => any

    /**
     * Parsed description of all properties
     */
    private props: {
        [key: string]: Property
    } = {}

    identifierAttribute: string | null = null

    constructor(name: string, baseModel: Object, baseActions: Object) {
        super(name)
        Object.freeze(baseModel) // make sure nobody messes with it
        Object.freeze(baseActions)
        this.baseModel = baseModel
        this.baseActions = baseActions
        if (!(/^\w[\w\d_]*$/.test(name))) fail(`Typename should be a valid identifier: ${name}`)
        this.modelConstructor = new Function(`return function ${name} (){}`)() // fancy trick to get a named function...., http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        this.modelConstructor.prototype.toString = objectTypeToString
        this.parseModelProps()
        this.forAllProps(prop => prop.initializePrototype(this.modelConstructor.prototype))
    }

    createNewInstance() {
        const instance = new this.modelConstructor()
        extendShallowObservable(instance, {})
        return instance as Object
    }

    finalizeNewInstance(instance: IComplexValue, snapshot: any) {
        this.forAllProps(prop => prop.initialize(instance, snapshot))
        intercept(instance, change => this.willChange(change) as any /* wait for typing fix in mobx */)
        observe(instance, this.didChange)
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getComplexNode(change.object)
        node.assertWritable()

        // TODO: assigning a new snapshot / MST to a property should result in a nice patch in itself
        return this.props[change.name].willChange(change)
    }

    didChange = (change: IObjectChange) => {
        this.props[change.name].didChange(change)
    }

    parseModelProps() {
        const {baseModel, baseActions} = this
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            // TODO: check that hooks are not defined as part of baseModel
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
                this.props[key] = new ComputedProperty(key, descriptor.get!, descriptor.set)
                continue
            }

            const { value } = descriptor
            if (value === null || undefined) {
                fail("The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?")
            } else if (isPrimitive(value)) {
                const baseType = getPrimitiveFactoryFromValue(value)
                this.props[key] = new ValueProperty(key, optional(baseType, value))
            } else if (isIdentifierType(value)) {
                if (this.identifierAttribute) fail(`Cannot define property '${key}' as object identifier, property '${this.identifierAttribute}' is already defined as identifier property`)
                this.identifierAttribute = key
                this.props[key] = new IdentifierProperty(key, (value as IdentifierType<any>).identifierType)
            } else if (isType(value)) {
                this.props[key] = new ValueProperty(key, value)
            // } else if (isReferenceFactory(value)) {
            //     this.props[key] = new ReferenceProperty(key, value.targetType, value.basePath)
            } else if (typeof value === "function") {
                this.props[key] = new ViewProperty(key, value)
            } else if (typeof value === "object") {
                // if (!Array.isArray(value) && isPlainObject(value)) {
                //     TODO: also check if the entire type is simple! (no identifiers and other complex types)
                //     this.props[key] = new ValueProperty(key, createDefaultValueFactory(
                //         createModelFactory(this.name + "__" + key, value),
                //         () => value)
                //     )
                // } else {
                    // TODO: in future also expand on `[Type]` and  `[{ x: 3 }]`
                    fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
                // }
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        }

        for (let key in baseActions) if (hasOwnProperty(baseActions, key)) {
            const value = baseActions[key]
            if (key in this.baseModel)
                fail(`Property '${key}' was also defined as action. Actions and properties should not collide`)
            if (typeof value === "function") {
                this.props[key] = new ActionProperty(key, value)
            } else {
                fail(`Unexpected value for action '${key}'. Expected function, got ${typeof value}`)
            }
        }
    }

    getChildren(node: Node): Node[] {
        const res: Node[] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty)
                res.push(prop.getValueNode(node.storedValue))
        })
        return res
    }

    getChildNode(node: Node, key: string): Node {
        if (!(this.props[key] instanceof ValueProperty))
            return fail("Not a value property: " + key)
        return (this.props[key] as ValueProperty).getValueNode(node.storedValue)
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(node.storedValue, res))
        return res
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add")) fail(`object does not support operation ${patch.op}`)
        node.storedValue[subpath] = patch.value
    }

    @action applySnapshot(node: Node, snapshot: any): void {
        // TODO:fix: all props should be processed when applying snapshot, and reset to default if needed?
        node.pseudoAction(() => {
            for (let key in this.props)
                this.props[key].deserialize(node.storedValue, snapshot)
        })
    }

    getChildType(key: string): IType<any, any> {
        return (this.props[key] as ValueProperty).type
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!isPlainObject(value)) {
            return typeCheckFailure(context, value)
        }

        return flattenTypeErrors(
            Object.keys(this.props).map(
                (path) => this.props[path].validate(value, context)
            )
        )
    }

    private forAllProps(fn: (o: Property) => void) {
        // optimization: persists keys or loop more efficiently
        Object.keys(this.props).forEach(key => fn(this.props[key]))
    }

    describe() {
        // TODO: make proptypes responsible
        // optimization: cache
        return "{ " + Object.keys(this.props).map(key => {
            const prop = this.props[key]
            return prop instanceof ValueProperty
                ? key + ": " + prop.type.describe()
                : prop instanceof IdentifierProperty
                    ? key + ": identifier"
                    : ""
        }).filter(Boolean).join("; ") + " }"
    }

    getDefaultSnapshot(): any {
        return {}
    }

    removeChild(node: Node, subpath: string) {
        node.storedValue[subpath] = null
    }
}

export type IModelProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K]
}

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
}

export interface IModelType<T, A> extends IComplexType<Snapshot<T>, T & A> { }

export function model<T>(properties: IModelProperties<T> & ThisType<T>): IModelType<T, {}>
export function model<T>(name: string, properties: IModelProperties<T> & ThisType<T>): IModelType<T, {}>
export function model<T, A>(properties: IModelProperties<T> & ThisType<T>, operations: A & ThisType<T & A>): IModelType<T, A>
export function model<T, A>(name: string, properties: IModelProperties<T> & ThisType<T>, operations: A & ThisType<T & A>): IModelType<T, A>
export function model(arg1: any, arg2?: any, arg3?: any) {
    let name = typeof arg1 === "string" ? arg1 : "AnonymousModel"
    let baseModel: Object = typeof arg1 === "string" ? arg2 : arg1
    let actions: Object =  typeof arg1 === "string" ? arg3 : arg2

    return new ObjectType(name, baseModel, actions || {})
}

function getObjectFactoryBaseModel(item: any) {
    let type = isType(item) ? item : getType(item)

    return isObjectFactory(type) ? (type as ObjectType).baseModel : {}
}

export function extend<A, B, AA, BA>(name: string, a: IModelType<A, AA>, b: IModelType<B, BA>): IModelType<A & B, AA & BA>
export function extend<A, B, C, AA, BA, CA>(name: string, a: IModelType<A, AA>, b: IModelType<B, BA>, c: IModelType<C, CA>): IModelType<A & B & C, AA & BA & CA>
export function extend<A, B, AA, BA>(a: IModelType<A, AA>, b: IModelType<B, BA>): IModelType<A & B, AA & BA>
export function extend<A, B, C, AA, BA, CA>(a: IModelType<A, AA>, b: IModelType<B, BA>, c: IModelType<C, CA>): IModelType<A & B & C, AA & BA & CA>
export function extend(...args: any[]) {
    console.warn("[mobx-state-tree] `extend` is an experimental feature and it's behavior will probably change in the future")
    const baseFactories = typeof args[0] === "string" ? args.slice(1) : args
    const factoryName = typeof args[0] === "string" ? args[0] : baseFactories.map(f => f.name).join("_")

    return model(
        factoryName,
        extendObject.apply(null, [{}].concat(baseFactories.map(getObjectFactoryBaseModel)))
    )
}

export function isObjectFactory(type: any): boolean {
    return isType(type) && ((type as IType<any, any>).flags & TypeFlags.Object) > 0
}

export function getIdentifierAttribute(type: IType<any, any>): string | null {
    if ( isObjectFactory(type) )
        return type.identifierAttribute

    return null
}
