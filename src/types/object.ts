import { IdentifierProperty } from './property-types/identifier-property';
import { action, isAction, extendShallowObservable, IObjectChange, IObjectWillChange, IAction, intercept, observe } from "mobx"
import { nothing, invariant, fail, identity, extend, isPrimitive, hasOwnProperty, isPlainObject } from "../utils"
import { Node, maybeNode } from "../core/node"
import { IFactory, isFactory, getFactory } from "../core/factories"
import { isReferenceFactory } from "./reference"
import { primitiveFactory } from "./primitive"
import { isIdentifierFactory } from "./identifier"
import { ComplexType } from "../core/types"
import { createDefaultValueFactory } from "./with-default"
import { Property } from "./property-types/property"
import { TransformedProperty } from "./property-types/transformed-property"
import { ComputedProperty } from "./property-types/computed-property"
import { ValueProperty } from "./property-types/value-property"
import { ActionProperty } from "./property-types/action-property"
import { getSnapshot } from "../top-level-api"
import { IJsonPatch } from "../index";

export interface IObjectInstance {
    $treenode: Node
}

interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

export class ObjectType extends ComplexType {
    isObjectFactory = true

    /**
     * The original object definition
     */
    baseModel: any

    modelConstructor: new () => any

    /**
     * Parsed description of all properties
     */
    private props: {
        [key: string]: Property
    } = {}

    identifierAttribute: string | null = null

    constructor(name: string, baseModel: Object) {
        super(name)
        Object.seal(baseModel) // make sure nobody messes with it
        this.baseModel = baseModel
        // TODO: verify valid name
        this.modelConstructor = new Function(`return function ${name} (){}`)() // fancy trick to get a named function...., http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        this.modelConstructor.prototype.toString = function() {
            return `${name}${JSON.stringify(getSnapshot(this))}`
        }
        this.modelConstructor.prototype.toJSON = function() {
            return getSnapshot(this)
        }
        this.parseModelProps()
        this.forAllProps(prop => prop.initializePrototype(this.modelConstructor.prototype))
    }

    createNewInstance() {
        const instance = new this.modelConstructor()
        extendShallowObservable(instance, {})
        return instance as Object
    }

    finalizeNewInstance(instance: IObjectInstance, snapshot: any) {
        intercept(instance, this.willChange as any /* wait for typing fix in mobx */)
        observe(instance, this.didChange)
        this.forAllProps(prop => prop.initialize(instance, snapshot))
    }

    willChange = (change: IObjectWillChange): IObjectWillChange | null => {
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
            if (isIdentifierFactory(value)) {
                invariant(!this.identifierAttribute, `Cannot define property '${key}' as object identifier, property '${this.identifierAttribute}' is already defined as identifier property`)
                this.identifierAttribute = key
                this.props[key] = new IdentifierProperty(key)
            } else if (isPrimitive(value)) {
                // TODO: detect exact primitiveFactory!
                this.props[key] = new ValueProperty(key, createDefaultValueFactory(primitiveFactory, value))
            } else if (isFactory(value)) {
                this.props[key] = new ValueProperty(key, value)
            } else if (isReferenceFactory(value)) {
                this.props[key] =  new TransformedProperty(key, value.setter, value.getter)
            } else if (typeof value === "function") {
                this.props[key] = new ActionProperty(key, value)
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    // TODO: adm or instance as param?
    getChildNodes(node: Node, instance: any): [string, Node][] {
        const res: [string, Node][] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty)
                maybeNode(instance[prop.name], propertyNode => res.push([prop.name, propertyNode]))
        })
        return res
    }

    getChildNode(node: Node, instance: any, key: string): Node | null {
        return maybeNode(instance[key], identity, nothing)
    }

    // TODO: node or instance?
    serialize(node: Node, instance: any): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(instance, res))
        return res
    }

    applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node, target, {
            [subpath]: patch.value
        })
    }

    // TODO: remove node arg
    @action applySnapshot(node: Node, target: any, snapshot: any): void {
        // TODO typecheck?
        for (let key in snapshot) {
            invariant(key in this.props, `It is not allowed to assign a value to non-declared property ${key} of ${this.name}`)
            this.props[key].deserialize(target, snapshot)
        }
    }

    getChildFactory(key: string): IFactory<any, any> {
        return (this.props[key] as ValueProperty).factory
    }

    isValidSnapshot(snapshot: any) {
        if (!isPlainObject(snapshot))
            return false
        for (let key in snapshot)
            if (!(key in this.props))
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
        // optimization: cache
        return "{ " + Object.keys(this.props).map(key => {
            const prop = this.props[key]
            return prop instanceof ValueProperty
                ? key + ": " + prop.factory.type.describe()
                : prop instanceof IdentifierProperty
                    ? key + ": identifier()"
                    : ""
        }).filter(Boolean).join("; ") + " }"
    }

    getDefaultSnapshot(): any {
        return {}
    }
}

export type IBaseModelDefinition<T> = {[K in keyof T]: IFactory<any, T[K]> | T[K] & IAction | T[K]}

export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>
}

// MWE: somehow get  & { toJSON(): S } in here...?
export function createModelFactory<S extends Object, T extends S>(baseModel: IBaseModelDefinition<T>): IFactory<DeepPartial<T>, T & { toJSON(): any }>
export function createModelFactory<S extends Object, T extends S>(name: string, baseModel: IBaseModelDefinition<T>): IFactory<DeepPartial<T>, T & { toJSON(): any }>
export function createModelFactory(arg1: any, arg2?: any) {
    let name = typeof arg1 === "string" ? arg1 : "AnonymousModel"
    let baseModel: Object = typeof arg1 === "string" ? arg2 : arg1

    return new ObjectType(name, baseModel).factory
}

function getObjectFactoryBaseModel(item: any) {
    let factory = isFactory(item) ? item : getFactory(item)

    return isObjectFactory(factory) ? (factory.type as ObjectType).baseModel : {}
}

export function composeFactory<AS, AT, BS, BT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
export function composeFactory<AS, AT, BS, BT, CS, CT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
export function composeFactory<S, T>(name: string, ...models: IFactory<any, any>[]): IFactory<S, T>;
export function composeFactory<AS, AT, BS, BT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
export function composeFactory<AS, AT, BS, BT, CS, CT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
export function composeFactory<S, T>(...models: IFactory<any, any>[]): IFactory<S, T>;
export function composeFactory(...args: any[]) {
    const baseFactories = typeof args[0] === "string" ? args.slice(1) : args
    const factoryName = typeof args[0] === "string" ? args[0] : baseFactories.map(f => f.type.name).join("_")

    return createModelFactory(
        factoryName,
        extend.apply(null, [{}].concat(baseFactories.map(getObjectFactoryBaseModel)))
    )
}

export function isObjectFactory(factory: any): boolean {
    return isFactory(factory) && (factory.type as any).isObjectFactory === true
}

export function getIdentifierAttribute(factory: any): string | null {
    return isObjectFactory(factory) ? (factory.type as ObjectType).identifierAttribute : null
}

// export function getObjectNode(thing: IModel): ObjectNode {
//     const node = getNode(thing)
//     invariant(isObjectFactory(node.factory), "Expected object node, got " + (node.constructor as any).name)
//     return node as ObjectNode
// }

// /**
//  * Returns first parent of the provided node that is an object node, or null
//  */
// export function findEnclosingObjectNode(thing: Node): ObjectNode | null {
//     let parent: Node | null = thing
//     while (parent = parent.parent)
//         if (parent instanceof ObjectNode)
//             return parent
//     return null
// }
