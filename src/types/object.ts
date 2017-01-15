import {action, isAction, extendShallowObservable, observable, IObjectChange, IObjectWillChange} from "mobx"
import {invariant, isSerializable, fail, registerEventHandler, IDisposer, identity, extend, isPrimitive, hasOwnProperty, addReadOnlyProp, isPlainObject} from "../utils"
import {Node, maybeNode, getNode, valueToSnapshot, getRelativePath, hasNode} from "../core/node"
import {Type, IModelFactory, isModelFactory, createFactory, getModelFactory, IModel} from "../core/factories"
import {IActionCall, IActionHandler, applyActionLocally, createActionWrapper, createNonActionWrapper} from "../core/action"
import {escapeJsonPath} from "../core/json-patch"
import {isArrayFactory} from "../types/array"
import {isMapFactory} from "../types/map"
import {isReferenceFactory, createReferenceProps} from "./reference"
import {primitiveFactory} from "./primitive"

interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

export class ObjectType extends Type {
    props: {
        [key: string]: IModelFactory<any, any>
    } = {}
    baseModel: any
    initializers: ((target) => void)[] = []
    isObjectFactory = true

    constructor(name: string, baseModel) {
        super(name)
        Object.seal(baseModel) // make sure nobody messes with it
        this.baseModel = baseModel
        this.extractPropsFromBaseModel()
    }

    createNewInstance() {
        const instance = observable.shallowObject({})
        this.initializers.forEach(f => f(instance))
        // TODO: Object.seal(instance) // don't allow new props to be added!
        return instance as Object
    }

    extractPropsFromBaseModel() {
        const baseModel = this.baseModel
        const addInitializer = this.initializers.push.bind(this.initializers)
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
                const computedDescriptor = {} // yikes
                Object.defineProperty(computedDescriptor, key, descriptor)
                addInitializer(t => extendShallowObservable(t, computedDescriptor))
                continue
            }

            const {value} = descriptor

            if (isPrimitive(value)) {
                // TODO: detect exact primitiveFactory!
                this.props[key] = primitiveFactory
                // MWE: optimization, create one single extendObservale
                addInitializer(t => extendShallowObservable(t, { [key] : value }))
            } else if (isMapFactory(value) || isArrayFactory(value)) {
                this.props[key] = value
                // there is no technical need for read only props, but
                // it might avoid confusion if direct assingments are forbidden,
                // and content of complex collections is replace instead
                addInitializer(t => addReadOnlyProp(t, key, value()))
            } else if (isModelFactory(value)) {
                this.props[key] = value
                addInitializer(t => extendShallowObservable(t, { [key]: null })) // TODO: support default value
            } else if (isReferenceFactory(value)) {
                addInitializer(t => extendShallowObservable(t, createReferenceProps(key, value)))
            } else if (isAction(value)) {
                addInitializer(t => createActionWrapper(t, key, value))
            } else if (typeof value === "function") {
                addInitializer(t => createNonActionWrapper(t, key, value))
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else  {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    // TODO: adm or instance as param?
    getChildNodes(node, instance): [string, Node][] {
        const res: [string, Node][] = []
        for (let key in this.props)
            maybeNode(instance[key], node => res.push([key, node]))
        return res
    }

    getChildNode(node, instance, key): Node {
        return maybeNode(instance[key], identity, () => fail(`Illegal state, no node for "${key}"`))
    }

    willChange(node, change: IObjectWillChange): Object | null {
        const {newValue} = change
        const oldValue = change.object[change.name]
        if (newValue === oldValue)
            return null
        maybeNode(oldValue, adm => adm.setParent(null))
        change.newValue = node.prepareChild(change.name, newValue)
        return change
    }

    didChange(node: Node, change: IObjectChange): void {
        switch (change.type) {
            case "update": return void node.emitPatch({
                op: "replace",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, node)
            case "add": return void node.emitPatch({
                op: "add",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, node)
        }
    }

    serialize(node: Node, instance): any {
        const res = {}
        for (let key in this.props) {
            const value = instance[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${node.path}/${key}`)
            res[key] = valueToSnapshot(value)
        }
        return res
    }

    applyPatchLocally(node: Node, target, subpath, patch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node ,target, {
            [subpath]: patch.value
        })
    }

    @action applySnapshot(node: Node, target, snapshot): void {
        for (let key in snapshot) {
            invariant(key in this.props, `It is not allowed to assign a value to non-declared property ${key} of ${this.name}`)
            maybeNode(
                target[key],
                node => { node.applySnapshot(snapshot[key]) },
                () =>   { target[key] = snapshot[key] }
            )
        }
    }


    getChildFactory(key: string): IModelFactory<any, any> {
        return this.props[key] || primitiveFactory
    }
    is(snapshot) {
        const props = this.props
        let modelKeys = Object.keys(props).filter(key => isPrimitive(props[key]) || isModelFactory(props[key]))
        if (!isPlainObject(snapshot)) return false
        const snapshotKeys = Object.keys(snapshot)
        if (snapshotKeys.length > modelKeys.length) return false
        return snapshotKeys.every(key => {
            let keyInConfig = key in props
            let bothArePrimitives = isPrimitive(props[key]) && isPrimitive(snapshot[key])
            let ifModelFactoryIsCastable = isModelFactory(props[key]) && props[key].is(snapshot[key])
            return keyInConfig && (bothArePrimitives || ifModelFactoryIsCastable)
        })
    }
}

export function createObjectFactory<S extends Object, T extends S>(baseModel: T): IModelFactory<S, T>
export function createObjectFactory<S extends Object, T extends S>(name: string, baseModel: T): IModelFactory<S, T>
export function createObjectFactory(arg1, arg2?) {
    let name = typeof arg1 === "string" ? arg1 : "unnamed-object-factory"
    let baseModel: Object = typeof arg1 === "string" ? arg2 : arg1

    return createFactory(
        name,
        ObjectType,
        baseModel
    )
}

function getObjectFactoryBaseModel(item){
    let factory = isModelFactory(item) ? item : getModelFactory(item)

    return isObjectFactory(factory) ? (factory as any).baseModel : {}
}

export function composeFactory<AS, AT, BS, BT>(name: string, a: IModelFactory<AS, AT>, b: IModelFactory<BS, BT>): IModelFactory<AS & BS, AT & BT>;
export function composeFactory<AS, AT, BS, BT, CS, CT>(name: string, a: IModelFactory<AS, AT>, b: IModelFactory<BS, BT>, c: IModelFactory<CS, CT>): IModelFactory<AS & BS & CS, AT & BT & CT>;
export function composeFactory<S, T>(name: string, ...models: IModelFactory<any, any>[]): IModelFactory<S, T>;
export function composeFactory<AS, AT, BS, BT>(a: IModelFactory<AS, AT>, b: IModelFactory<BS, BT>): IModelFactory<AS & BS, AT & BT>;
export function composeFactory<AS, AT, BS, BT, CS, CT>(a: IModelFactory<AS, AT>, b: IModelFactory<BS, BT>, c: IModelFactory<CS, CT>): IModelFactory<AS & BS & CS, AT & BT & CT>;
export function composeFactory<S, T>(...models: IModelFactory<any, any>[]): IModelFactory<S, T>;
export function composeFactory(...args: any[]) {
    const factoryName = typeof args[0] === "string" ? args[0] : "unnamed-factory"
    const baseModels = typeof args[0] === "string" ? args.slice(1) : args

    return createObjectFactory(
        factoryName,
        extend.apply(null, baseModels.map(getObjectFactoryBaseModel))
    )
}

export function isObjectFactory(factory): boolean {
    return isModelFactory(factory) && (factory.type as any).isObjectFactory === true
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
