import { IdentifierProperty } from './property-types/identifier-property';
import { action, isAction, extendShallowObservable, IObjectChange, IObjectWillChange, IAction, intercept, observe } from "mobx"
import { nothing, extend as extendObject, invariant, fail, identity, isPrimitive, hasOwnProperty, isPlainObject } from "../utils"
import { MSTAdminisration, maybeMST } from "../core"
import { isReferenceFactory } from "./reference"
import { primitiveFactory } from "./primitive"
import { isIdentifierFactory } from "./identifier"
import { ComplexType, getType, IMSTNode, isType, IType, getMST } from '../core';
import { createDefaultValueFactory } from "./with-default"
import { Property } from "./property-types/property"
import { TransformedProperty } from "./property-types/transformed-property"
import { ComputedProperty } from "./property-types/computed-property"
import { ValueProperty } from "./property-types/value-property"
import { ActionProperty } from "./property-types/action-property"
import { getSnapshot } from "../top-level-api"
import { IJsonPatch } from "../index";
import { getPrimitiveFactoryFromValue } from "./core-types";

// TODO: make generic with snapshot type
export interface IObjectInstance {
    $treenode: MSTAdminisration
}


interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

export class ObjectType extends ComplexType<any, any> {
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
        // TODO: kill toJSON
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
        const node = getMST(change.object)
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
    getChildMSTs(node: MSTAdminisration, instance: any): [string, MSTAdminisration][] {
        const res: [string, MSTAdminisration][] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty)
                maybeMST(instance[prop.name], propertyNode => res.push([prop.name, propertyNode]))
        })
        return res
    }

    getChildMST(node: MSTAdminisration, instance: any, key: string): MSTAdminisration | null {
        return maybeMST(instance[key], identity, nothing)
    }

    // TODO: node or instance?
    serialize(node: MSTAdminisration, instance: any): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(instance, res))
        return res
    }

    applyPatchLocally(node: MSTAdminisration, target: any, subpath: string, patch: IJsonPatch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node, target, {
            [subpath]: patch.value
        })
    }

    // TODO: remove node arg
    @action applySnapshot(node: MSTAdminisration, target: any, snapshot: any): void {
        for (let key in snapshot) if (key in this.props) {
            this.props[key].deserialize(target, snapshot)
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
        // optimization: cache
        return "{ " + Object.keys(this.props).map(key => {
            const prop = this.props[key]
            return prop instanceof ValueProperty
                ? key + ": " + prop.type.describe()
                : prop instanceof IdentifierProperty
                    ? key + ": identifier()"
                    : ""
        }).filter(Boolean).join("; ") + " }"
    }

    getDefaultSnapshot(): any {
        return {}
    }

    removeChild(node: MSTAdminisration, subpath: string) {
        node.target[subpath] = null
    }
}

export type IBaseModelDefinition<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K] & IAction | T[K]
}

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
}

// MWE: somehow get  & { toJSON(): S } in here...?
export function createModelFactory<S extends Object, T extends S>(baseModel: IBaseModelDefinition<T>): IType<Snapshot<T>, IMSTNode<Snapshot<T>, T> & { toJSON(): Snapshot<T> }>
export function createModelFactory<S extends Object, T extends S>(name: string, baseModel: IBaseModelDefinition<T>): IType<Snapshot<T>, IMSTNode<Snapshot<T>, T> & { toJSON(): Snapshot<T> }>
export function createModelFactory(arg1: any, arg2?: any) {
    let name = typeof arg1 === "string" ? arg1 : "AnonymousModel"
    let baseModel: Object = typeof arg1 === "string" ? arg2 : arg1

    return new ObjectType(name, baseModel)
}

function getObjectFactoryBaseModel(item: any) {
    let type = isType(item) ? item : getType(item)

    return isObjectFactory(type) ? (type as ObjectType).baseModel : {}
}

// TODO: toJSON() is now not typed correctly...
export function extend<AS, AT, BS, BT>(name: string, a: IType<AS, AT>, b: IType<BS, BT>): IType<AS & BS, AT & BT>;
export function extend<AS, AT, BS, BT, CS, CT>(name: string, a: IType<AS, AT>, b: IType<BS, BT>, c: IType<CS, CT>): IType<AS & BS & CS, AT & BT & CT>;
export function extend<S, T>(name: string, ...models: IType<any, any>[]): IType<S, T>;
export function extend<AS, AT, BS, BT>(a: IType<AS, AT>, b: IType<BS, BT>): IType<AS & BS, AT & BT>;
export function extend<AS, AT, BS, BT, CS, CT>(a: IType<AS, AT>, b: IType<BS, BT>, c: IType<CS, CT>): IType<AS & BS & CS, AT & BT & CT>;
export function extend<S, T>(...models: IType<any, any>[]): IType<S, T>;
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
