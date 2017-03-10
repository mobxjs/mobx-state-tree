import { action, isAction, extendShallowObservable, observable, IObjectChange, IObjectWillChange, IAction, intercept, observe } from "mobx"
import { nothing, invariant, isSerializable, fail, identity, extend, isPrimitive, hasOwnProperty, isPlainObject } from "../utils"
import { Node, maybeNode, valueToSnapshot, getNode } from "../core/node"
import { IFactory, isFactory, getFactory } from "../core/factories"
import { createActionWrapper, createNonActionWrapper } from "../core/action"
import { escapeJsonPath } from "../core/json-patch"
import { isReferenceFactory, createReferenceProps } from "./reference"
import { primitiveFactory } from "./primitive"
import { ComplexType } from "../core/types"
import { createDefaultValueFactory } from "./with-default"


interface IObjectInstance {
    $objectprops: { [key: string]: any }
    $treenode: Node
}

interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

abstract class ObjectProperty {
    constructor(public name: string) {
        // empty
    }

    abstract initializePropDescriptors(baseProps: PropertyDescriptorMap)
    abstract initialize(targetInstance: IObjectInstance)

    abstract serialize(instance: IObjectInstance, snapshot): any
    abstract deserialize(instance: IObjectInstance, snapshot)
    abstract isValidSnapshot(snapshot): boolean
}

class ValueProperty extends ObjectProperty {
    constructor(propertyName, public factory: IFactory<any, any>) {
        super(propertyName)
    }

    initializePropDescriptors(props) {
        const self = this
        props[this.name] = {
            configurable: false,
            enumerable: true,
            get: function () {
                return self.get(this)
            },
            set: function (v) {
                self.set(this, v)
            }
        }
    }

    initialize(targetInstance) {
        extendShallowObservable(targetInstance.$objectprops, {
            [this.name]: this.factory()
        })
    }

    get(instance: IObjectInstance) {
        return instance.$objectprops[this.name]
    }

    set(instance, newValue) {
        const node = getNode(instance)
        const oldValue = this.get(instance)
        if (newValue === oldValue)
            return

        // TODO check type
        // TODO: check if tree is editable
        maybeNode(oldValue, adm => adm.setParent(null))
        newValue = node.prepareChild(this.name, newValue)

        instance.$objectprops[this.name] = newValue

        node.emitPatch({
            op: "replace",
            path: "/" + escapeJsonPath(this.name),
            value: valueToSnapshot(newValue)
        }, node)
    }

    serialize(instance, snapshot) {
        snapshot[this.name] = valueToSnapshot(instance[this.name])
    }

    deserialize(instance, snapshot) {
        maybeNode(
            instance[this.name],
            propertyNode => { propertyNode.applySnapshot(snapshot[this.name]) },
            () => { instance[this.name] = snapshot[this.name] }
        )
    }

    instantiate(target) {
        extendShallowObservable(target, {
            [this.name]: this.factory()
        })
    }

    isValidSnapshot(snapshot) {
        return this.factory.is(snapshot[this.name])
    }
}

// class ComputedProperty extends ObjectProperty {
//     constructor(propertyName, public getter: () => any, public setter?: (v) => void) {
//         super(propertyName)
//     }

//     get(instance) {
//         return instance[this.name]
//     }

//     set(instance, v) {
//         // TODO check type
//         instance[this.name] = v
//     }

//     serialize(instance, snapshot) {
//         snapshot[this.name] = valueToSnapshot(instance[this.name])
//     }

//     deserialize(instance, snapshot) {
//         maybeNode(
//             instance[this.name],
//             propertyNode => { propertyNode.applySnapshot(snapshot[this.name]) },
//             () => { instance[this.name] = snapshot[this.name] }
//         )
//     }

//     instantiate(target) {
//         extendShallowObservable(target, {
//             [this.name]: this.factory()
//         })
//     }
// }

// class ActionProperty extends ObjectProperty {
//     constructor(name: string, public fn: Function) {
//         super(name)
//     }
// }


export class ObjectType extends ComplexType {
    isObjectFactory = true

    /**
     * The original object definition
     */
    baseModel: any

    namedConstructor: new () => any

    /**
     * Parsed description of all properties
     */
    private props: {
        [key: string]: ObjectProperty
    } = {}

    /**
     * Base properties to quickly create new objects
     */
    baseProperties: PropertyDescriptorMap

    constructor(name: string, baseModel) {
        super(name)
        Object.seal(baseModel) // make sure nobody messes with it

        this.baseModel = baseModel
        // TODO: verify valid name
        this.namedConstructor = new Function(`return function ${name} (){}`)() // fancy trick to get a named function...., http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        this.baseProperties = {}
        this.extractPropsFromBaseModel()
        this.forAllProps(prop => prop.initializePropDescriptors(this.baseProperties))
    }

    private forAllProps(fn: (o: ObjectProperty) => void) {
        Object.keys(this.props).forEach(key => fn(this.props[key]))
    }

    describe() {
        // optimization: don't evaluate lazily
        return "{ " + Object.keys(this.props).map(key => {
            const prop = this.props[key]
            return prop instanceof ValueProperty
                ? key + ": " + prop.factory.type.describe()
                : ""
        }).filter(Boolean).join("; ") + " }"
    }

    createNewInstance() {
        const instance = new this.namedConstructor()
        Object.defineProperty(instance, "$objectprops", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: observable.shallowObject({}, )
        })
        Object.defineProperties(instance, this.baseProperties) // TODO: or, in constructor, do Object.defineProperty(this.namedConstructor.prototype, baseProperties) ?
        return instance as Object
    }

    finalizeNewInstance(instance) {
        this.forAllProps(prop => prop.initialize(instance))
    }

    extractPropsFromBaseModel() {
        const baseModel = this.baseModel
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
// TODO:                this.props[key] = new ComputedProperty(key, descriptor.get!, descriptor.set)
                continue
            }

            const { value } = descriptor

            if (isPrimitive(value)) {
                // TODO: detect exact primitiveFactory!
                this.props[key] = new ValueProperty(key, createDefaultValueFactory(primitiveFactory, value))
            } else if (isFactory(value)) {
                this.props[key] = new ValueProperty(key, value)
            } else if (isReferenceFactory(value)) {
                // TODO:               addInitializer(t => extendShallowObservable(t, createReferenceProps(key, value)))
            } else if (isAction(value)) {
// TODO:                this.props[key] = new ActionProperty(key, value)
            } else if (typeof value === "function") {
                // TODO: threat as action
                // addInitializer(t => createNonActionWrapper(t, key, value))
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    // TODO: adm or instance as param?
    getChildNodes(node, instance): [string, Node][] {
        const res: [string, Node][] = []
        this.forAllProps(prop => {
            if (prop instanceof ValueProperty)
                maybeNode(instance[prop.name], propertyNode => res.push([prop.name, propertyNode]))
        })
        return res
    }

    getChildNode(node, instance, key): Node | null {
        return maybeNode(instance[key], identity, nothing)
    }

    // TODO: node or instance?
    serialize(node: Node, instance): any {
        const res = {}
        this.forAllProps(prop => prop.serialize(instance, res))
        return res
    }

    applyPatchLocally(node: Node, target, subpath, patch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node, target, {
            [subpath]: patch.value
        })
    }

    // TODO: remove node arg
    @action applySnapshot(node: Node, target, snapshot): void {
        // TODO typecheck?
        for (let key in snapshot) {
            invariant(key in this.props, `It is not allowed to assign a value to non-declared property ${key} of ${this.name}`)
            this.props[key].deserialize(target, snapshot)
        }
    }

    getChildFactory(key: string): IFactory<any, any> {
        return (this.props[key] as ValueProperty).factory
    }

    isValidSnapshot(snapshot) {
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
}

export type IBaseModelDefinition<S extends Object, T> = {[K in keyof T]: IFactory<any, T[K]> | T[K] & IAction | T[K]}

export function createModelFactory<S extends Object, T extends S>(baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>
export function createModelFactory<S extends Object, T extends S>(name: string, baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>
export function createModelFactory(arg1, arg2?) {
    let name = typeof arg1 === "string" ? arg1 : "AnonymousModel"
    let baseModel: Object = typeof arg1 === "string" ? arg2 : arg1

    return new ObjectType(name, baseModel).factory
}

function getObjectFactoryBaseModel(item) {
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

export function isObjectFactory(factory): boolean {
    return isFactory(factory) && (factory.type as any).isObjectFactory === true
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
