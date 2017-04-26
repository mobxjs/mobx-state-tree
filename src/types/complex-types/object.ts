import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    IAction,
    intercept,
    observe
} from "mobx"
import {
    nothing,
    extend as extendObject,
    invariant,
    fail, identity,
    isPrimitive,
    hasOwnProperty,
    isPlainObject
} from "../../utils"
import { MSTAdministration, maybeMST, getType, IMSTNode, getMSTAdministration, getSnapshot, IJsonPatch } from "../../core"
import { IType, IComplexType, isType } from "../type"
import { ComplexType } from "./complex-type"
import { getPrimitiveFactoryFromValue } from "../primitives"
import { createDefaultValueFactory } from "../utility-types/with-default"
import { isReferenceFactory } from "../utility-types/reference"
import { isIdentifierFactory } from "../utility-types/identifier"
import { Property } from "../property-types/property"
import { IdentifierProperty } from "../property-types/identifier-property"
import { ReferenceProperty } from "../property-types/reference-property"
import { ComputedProperty } from "../property-types/computed-property"
import { ValueProperty } from "../property-types/value-property"
import { ActionProperty } from "../property-types/action-property"

export class ObjectType extends ComplexType<any, any> {
    isObjectFactory = true

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
        invariant(/^\w[\w\d_]*$/.test(name), `Typename should be a valid identifier: ${name}`)
        this.modelConstructor = new Function(`return function ${name} (){}`)() // fancy trick to get a named function...., http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        this.modelConstructor.prototype.toString = function(this: any) {
            return `${name}${JSON.stringify(getSnapshot(this))}`
        }
        this.parseModelProps()
        this.forAllProps(prop => prop.initializePrototype(this.modelConstructor.prototype))
    }

    createNewInstance() {
        const instance = new this.modelConstructor()
        extendShallowObservable(instance, {})
        return instance as Object
    }

    finalizeNewInstance(instance: IMSTNode, snapshot: any) {
        intercept(instance, change => this.willChange(change) as any /* wait for typing fix in mobx */)
        observe(instance, this.didChange)
        this.forAllProps(prop => prop.initialize(instance, snapshot))
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getMSTAdministration(change.object)
        node.assertWritable()

        return this.props[change.name].willChange(change)
    }

    didChange = (change: IObjectChange) => {
        this.props[change.name].didChange(change)
    }

    parseModelProps() {
        const baseModel = this.baseModel
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
                this.props[key] = new ComputedProperty(key, descriptor.get!, descriptor.set)
                continue
            }

            const { value } = descriptor
            if (value === null || undefined) {
                fail("The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?")
            } else if (isIdentifierFactory(value)) {
                invariant(!this.identifierAttribute, `Cannot define property '${key}' as object identifier, property '${this.identifierAttribute}' is already defined as identifier property`)
                this.identifierAttribute = key
                this.props[key] = new IdentifierProperty(key)
            } else if (isPrimitive(value)) {
                const baseType = getPrimitiveFactoryFromValue(value)
                this.props[key] = new ValueProperty(key, createDefaultValueFactory(baseType, value))
            } else if (isType(value)) {
                this.props[key] = new ValueProperty(key, value)
            } else if (isReferenceFactory(value)) {
                this.props[key] =  new ReferenceProperty(key, value.targetType, value.basePath)
            } else if (typeof value === "function") {
                this.props[key] = new ActionProperty(key, value)
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    getChildMSTs(node: MSTAdministration): [string, MSTAdministration][] {
        const res: [string, MSTAdministration][] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty)
                maybeMST(node.target[prop.name], propertyNode => res.push([prop.name, propertyNode]))
        })
        return res
    }

    getChildMST(node: MSTAdministration, key: string): MSTAdministration | null {
        return maybeMST(node.target[key], identity, nothing)
    }

    serialize(node: MSTAdministration): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(node.target, res))
        return res
    }

    applyPatchLocally(node: MSTAdministration, subpath: string, patch: IJsonPatch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node, {
            [subpath]: patch.value
        })
    }

    @action applySnapshot(node: MSTAdministration, snapshot: any): void {
        // TODO:fix: all props should be processed when applying snapshot, and reset to default if needed
        for (let key in snapshot) if (key in this.props) {
            this.props[key].deserialize(node.target, snapshot)
        }
    }

    getChildType(key: string): IType<any, any> {
        return (this.props[key] as ValueProperty).type
    }

    isValidSnapshot(snapshot: any) {
        if (!isPlainObject(snapshot))
            return false
        for (let key in this.props)
            if (!this.props[key].isValidSnapshot(snapshot))
                return false
        return true
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

    removeChild(node: MSTAdministration, subpath: string) {
        node.target[subpath] = null
    }
}

export type IBaseModelDefinition<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K]
}

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
}

export interface IModelType<T, A> extends IComplexType<Snapshot<T>, T & A> { }

export function createModelFactory<T>(baseModel: IBaseModelDefinition<T>): IModelType<T, {}>
export function createModelFactory<T>(name: string, baseModel: IBaseModelDefinition<T>): IModelType<T, {}>
export function createModelFactory<T, A>(baseModel: IBaseModelDefinition<T> & ThisType<T>, actions: A & ThisType<T & A>): IModelType<T, A>
export function createModelFactory<T, A>(name: string, baseModel: IBaseModelDefinition<T> & ThisType<T>, actions: A & ThisType<T & A>): IModelType<T, A>
export function createModelFactory(arg1: any, arg2?: any, arg3?: any) {
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
    const baseFactories = typeof args[0] === "string" ? args.slice(1) : args
    const factoryName = typeof args[0] === "string" ? args[0] : baseFactories.map(f => f.name).join("_")

    return createModelFactory(
        factoryName,
        extendObject.apply(null, [{}].concat(baseFactories.map(getObjectFactoryBaseModel)))
    )
}

export function isObjectFactory(type: any): boolean {
    return isType(type) && (type as any).isObjectFactory === true
}

export function getIdentifierAttribute(factory: any): string | null {
    return isObjectFactory(factory) ? factory.identifierAttribute : null
}
