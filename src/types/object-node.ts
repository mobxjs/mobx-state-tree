import {action, isAction, extendShallowObservable, observable, IObjectChange, IObjectWillChange} from "mobx"
import {invariant, isSerializable, fail, registerEventHandler, IDisposer, identity, extend, isPrimitive, hasOwnProperty, addReadOnlyProp, isPlainObject} from "../utils"
import {Node, maybeNode, getNode, valueToSnapshot, getRelativePath, hasNode} from "../core/node"
import {IModelFactory, isModelFactory, createFactory, getModelFactory, IModel, createFactoryConstructor} from "../core/factories"
import {IActionCall, IActionHandler, applyActionLocally, createActionWrapper, createNonActionWrapper} from "../core/action"
import {escapeJsonPath} from "../core/json-patch"
import {isArrayFactory} from "../types/array-node"
import {isMapFactory} from "../types/map-node"
import {isReferenceFactory, createReferenceProps} from "./reference"
import {primitiveFactory} from "./primitive"

interface IObjectFactoryConfig {
    isObjectFactory: true,
    baseModel: Object
}

export class ObjectNode extends Node {
    readonly actionSubscribers: IActionHandler[] = []

    // Optimization: submodelTypes can be stored on the factory config!
    readonly submodelTypes: {
        [key: string]: IModelFactory<any, any>;
    } = {}
    _isRunningAction = false

    constructor(instance, environment, factory) {
        super(instance, environment, factory)
        this.copyBaseModelToInstance()
        Object.seal(instance) // don't allow new props to be added!
    }

    copyBaseModelToInstance() {
        const baseModel = (this.factory.config as IObjectFactoryConfig).baseModel
        const instance = this.state
        for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
            const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
            if ("get" in descriptor) {
                const tmp = {} // yikes
                Object.defineProperty(tmp, key, descriptor)
                extendShallowObservable(instance, tmp)
                continue
            }

            const {value} = descriptor
            if (isPrimitive(value)) {
                this.submodelTypes[key] = primitiveFactory
                extendShallowObservable(instance, { [key] : value })
            } else if (isMapFactory(value)) {
                this.submodelTypes[key] = value
                // there is no technical need for read only props, but
                // it might avoid confusion if direct assingments are forbidden,
                // and content of complex collections is replace instead
                addReadOnlyProp(instance, key, this.prepareChild(key, {}))
            } else if (isArrayFactory(value)) {
                this.submodelTypes[key] = value
                addReadOnlyProp(instance, key, this.prepareChild(key, []))
            } else if (isModelFactory(value)) {
                this.submodelTypes[key] = value
                extendShallowObservable(instance, { [key]: null })
            } else if (isReferenceFactory(value)) {
                extendShallowObservable(instance, createReferenceProps(key, value))
            } else if (isAction(value)) {
                createActionWrapper(instance, key, value)
            } else if (typeof value === "function") {
                createNonActionWrapper(instance, key, value)
            } else if (typeof value === "object") {
                fail(`In property '${key}': base model's should not contain complex values: '${value}'`)
            } else  {
                fail(`Unexpected value for property '${key}'`)
            }
        }
    }

    getChildNodes(): [string, Node][] {
        const res: [string, Node][] = []
        for (let key in this.state)
            maybeNode(this.state[key], node => res.push([key, node]))
        return res
    }

    getChildNode(key): Node {
        return maybeNode(this.state[key], identity, () => fail(`Illegal state, no node for "${key}"`))
    }

    willChange(change: IObjectWillChange): Object | null {
        const {newValue} = change
        const oldValue = change.object[change.name]
        if (newValue === oldValue)
            return null
        maybeNode(oldValue, adm => adm.setParent(null))
        change.newValue = this.prepareChild(change.name, newValue)
        return change
    }

    didChange(change: IObjectChange): void {
        switch (change.type) {
            case "update": return void this.emitPatch({
                op: "replace",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, this)
            case "add": return void this.emitPatch({
                op: "add",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, this)
        }
    }

    serialize(): any {
        const {state} = this
        const res = {}
        for (let key in state) {
            const value = state[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${this.path}/${key}`)
            res[key] = valueToSnapshot(value)
        }
        return res
    }

    applyPatchLocally(subpath, patch): void {
        invariant(patch.op === "replace" || patch.op === "add")
        this.applySnapshot({
            [subpath]: patch.value
        })
    }

    applyAction(action: IActionCall): void {
        const node = this.resolve(action.path || "")
        if (node instanceof ObjectNode)
            applyActionLocally(node, action)
        else
            fail(`Invalid action path: ${action.path || ""}`)
    }

    emitAction(instance: ObjectNode, action: IActionCall, next) {
        let idx = -1
        const correctedAction: IActionCall = this.actionSubscribers.length
            ? extend({} as any, action, { path: getRelativePath(this, instance) })
            : null
        let n = () => {
            // optimization: use tail recursion / trampoline
            idx++
            if (idx < this.actionSubscribers.length) {
                this.actionSubscribers[idx](correctedAction!, n)
            } else {
                const parent = findEnclosingObjectNode(this)
                if (parent)
                    parent.emitAction(instance, action, next)
                else
                    next()
            }
        }
        n()
    }

    @action applySnapshot(snapshot): void {
        invariant(this.factory.is(snapshot) && !hasNode(snapshot), 'Snapshot ' + JSON.stringify(snapshot) + ' is not assignable to ' + this.factory.factoryName)
        const target = this.state
        for (let key in snapshot) {
            invariant(key in this.submodelTypes, `It is not allowed to assign a value to non-declared property ${key} of ${this.factory.factoryName}`)
            maybeNode(
                target[key],
                node => { node.applySnapshot(snapshot[key]) },
                () =>   { target[key] = snapshot[key] }
            )
        }
    }

    getChildFactory(key: string): IModelFactory<any, any> {
        return this.submodelTypes[key] || primitiveFactory
    }

    onAction(listener: (action: IActionCall, next: () => void) => void): IDisposer {
        return registerEventHandler(this.actionSubscribers, listener)
    }

    isRunningAction(): boolean {
        if (this._isRunningAction)
            return true
        if (this.isRoot)
            return false
        return this.parent!.isRunningAction()
    }
}

export function createObjectFactory<S extends Object, T extends S>(baseModel: T): IModelFactory<S, T>
export function createObjectFactory<S extends Object, T extends S>(name: string, baseModel: T): IModelFactory<S, T>
export function createObjectFactory(arg1, arg2?) {
    let name = typeof arg1 === "string" ? arg1 : "unnamed-object-factory"
    let config: Object = typeof arg1 === "string" ? arg2 : arg1
    let modelKeys = Object.keys(config).filter(key => isPrimitive(config[key]) || isModelFactory(config[key]))

    const is = snapshot => {
        if(!isPlainObject(snapshot)) return false
        const snapshotKeys = Object.keys(snapshot)
        if(snapshotKeys.length > modelKeys.length) return false
        return snapshotKeys.every(key => {
            let keyInConfig = key in config
            let bothArePrimitives = isPrimitive(config[key]) && isPrimitive(snapshot[key])
            let ifModelFactoryIsCastable = isModelFactory(config[key]) && config[key].is(snapshot[key])
            return keyInConfig && (bothArePrimitives || ifModelFactoryIsCastable)
        })
    }

    let factory = createFactory(
        name,
        "object",
        is,
        snapshot => factory,
        createFactoryConstructor(
            name,
            ObjectNode,
            {
                isObjectFactory: true,
                baseModel: typeof arg1 === "string" ? arg2 : arg1
            },
            () => observable.shallowObject({})
        )
    )

    return factory
}

function getObjectFactoryBaseModel(item){
    let factory = isModelFactory(item) ? item : getModelFactory(item)

    return isObjectFactory(factory) ? (factory.config as IObjectFactoryConfig).baseModel : {}
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
    return factory && factory.config && factory.config.isObjectFactory === true
}

export function getObjectNode(thing: IModel): ObjectNode {
    const node = getNode(thing)
    invariant(isObjectFactory(node.factory), "Expected object node, got " + (node.constructor as any).name)
    return node as ObjectNode
}

/**
 * Returns first parent of the provided node that is an object node, or null
 */
export function findEnclosingObjectNode(thing: Node): ObjectNode | null {
    let parent: Node | null = thing
    while (parent = parent.parent)
        if (parent instanceof ObjectNode)
            return parent
    return null
}
