import {action, isAction, extendShallowObservable, observable, IObjectChange, IObjectWillChange, IAction} from "mobx"
import {nothing, invariant, isSerializable, fail, identity, extend, isPrimitive, hasOwnProperty, isPlainObject} from "../utils"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {IFactory, isFactory, getFactory} from "../core/factories"
import {createActionWrapper, createNonActionWrapper} from "../core/action"
import {escapeJsonPath} from "../core/json-patch"
import {isReferenceFactory, createReferenceProps} from "./reference"
import {primitiveFactory} from "./primitive"
import {ComplexType} from "../core/types"

interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

export class ObjectType extends ComplexType {
    props: {
        [key: string]: IFactory<any, any>
    } = {}
    baseModel: any
    initializers: ((target: any) => void)[] = []
    finalizers: ((target: any) => void)[] = []
    isObjectFactory = true

    constructor(name: string, baseModel: any) {
        super(name)
        Object.seal(baseModel) // make sure nobody messes with it
        this.baseModel = baseModel
        this.extractPropsFromBaseModel()
    }

    describe() {
        return "{ " + Object.keys(this.props).map(key => key + ": " + this.props[key].type.describe()).join("; ") + " }"
    }

    createNewInstance() {
        const instance = observable.shallowObject({})
        this.initializers.forEach(f => f(instance))
        return instance as Object
    }

    finalizeNewInstance(instance: any) {
        this.finalizers.forEach(f => f(instance))
        // TODO: Object.seal(instance) // don't allow new props to be added!
    }

    extractPropsFromBaseModel() {
        const baseModel = this.baseModel
        const addInitializer = this.initializers.push.bind(this.initializers)
        const addFinalizer = this.finalizers.push.bind(this.finalizers)
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
                const computedDescriptor = {} // yikes
                Object.defineProperty(computedDescriptor, key, descriptor)
                addInitializer((t: any) => extendShallowObservable(t, computedDescriptor))
                continue
            }

            const {value} = descriptor

            if (isPrimitive(value)) {
                // TODO: detect exact primitiveFactory!
                this.props[key] = primitiveFactory
                // MWE: optimization, create one single extendObservale
                addInitializer((t: any) => extendShallowObservable(t, { [key] : value }))
            } else if (isFactory(value)) {
                this.props[key] = value
                addInitializer((t: any) => extendShallowObservable(t, { [key]: null }))
                addFinalizer((t: any) => t[key] = value())
            } else if (isReferenceFactory(value)) {
                addInitializer((t: any) => extendShallowObservable(t, createReferenceProps(key, value)))
            } else if (isAction(value)) {
                addInitializer((t: any) => createActionWrapper(t, key, value))
            } else if (typeof value === "function") {
                addInitializer((t: any) => createNonActionWrapper(t, key, value))
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else  {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    // TODO: adm or instance as param?
    getChildNodes(node: any, instance: any): [string, Node][] {
        const res: [string, Node][] = []
        for (let key in this.props)
            maybeNode(instance[key], propertyNode => res.push([key, propertyNode]))
        return res
    }

    getChildNode(node: any, instance: any, key: any): Node | null {
        return maybeNode(instance[key], identity, nothing)
    }

    willChange(node: any, change: IObjectWillChange): Object | null {
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

    serialize(node: Node, instance: any): any {
        const res:{[index: string]: any} = {}
        for (let key in this.props) {
            const value = instance[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${node.path}/${key}`)
            res[key] = valueToSnapshot(value)
        }
        return res
    }

    applyPatchLocally(node: Node, target: any, subpath: any, patch: any): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot(node, target, {
            [subpath]: patch.value
        })
    }

    @action applySnapshot(node: Node, target: any, snapshot: any): void {
        for (let key in snapshot) {
            invariant(key in this.props, `It is not allowed to assign a value to non-declared property ${key} of ${this.name}`)
            maybeNode(
                target[key],
                propertyNode => { propertyNode.applySnapshot(snapshot[key]) },
                () =>   { target[key] = snapshot[key] }
            )
        }
    }

    getChildFactory(key: string): IFactory<any, any> {
        return this.props[key] || primitiveFactory
    }

    isValidSnapshot(snapshot: any) {
        if (!isPlainObject(snapshot))
            return false
        const props = this.props
        let modelKeys = Object.keys(props).filter(key => isPrimitive(props[key]) || isFactory(props[key]))
        const snapshotKeys = Object.keys(snapshot)
        if (snapshotKeys.length > modelKeys.length)
            return false
        return snapshotKeys.every(key => {
            let keyInConfig = key in props
            let bothArePrimitives = isPrimitive(props[key]) && isPrimitive(snapshot[key])
            let ifModelFactoryIsCastable = isFactory(props[key]) && props[key].is(snapshot[key])
            return keyInConfig && (bothArePrimitives || ifModelFactoryIsCastable)
        })
    }
}

export type IBaseModelDefinition<S extends Object, T> = {[K in keyof T]: IFactory<any, T[K]> | T[K] & IAction | T[K]}

export function createModelFactory<S extends Object, T extends S>(baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>
export function createModelFactory<S extends Object, T extends S>(name: string, baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>
export function createModelFactory(arg1: any, arg2?: any) {
    let name = typeof arg1 === "string" ? arg1 : "unnamed-object-factory"
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
    const factoryName = typeof args[0] === "string" ? args[0] : "unnamed-factory"
    const baseModels = typeof args[0] === "string" ? args.slice(1) : args

    return createModelFactory(
        factoryName,
        extend.apply(null, [{}].concat(baseModels.map(getObjectFactoryBaseModel)))
    )
}

export function isObjectFactory(factory: any): boolean {
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
