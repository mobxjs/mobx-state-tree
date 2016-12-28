import {action, isAction, extendShallowObservable, observable, IObjectChange, IObjectWillChange, isObservable} from "mobx"
import {invariant, isSerializable, fail, registerEventHandler, IDisposer, identity, extend, isPrimitive, hasOwnProperty, addReadOnlyProp, isPlainObject} from "../utils"
import {Node, maybeNode, getNode, valueToSnapshot, getRelativePath, hasNode} from "../core/node"
import {ModelFactory, isModelFactory, createFactoryHelper, getModelFactory} from "../core/factories"
import {IActionCall, IActionHandler, applyActionLocally, createActionWrapper, createNonActionWrapper} from "../core/action"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"
import {isArrayFactory} from "../types/array-node"
import {isMapFactory} from "../types/map-node"
import {isReferenceFactory, createReferenceProps} from "./reference"
import {primitiveFactory} from "./primitive"

export class ObjectNode extends Node {
    readonly actionSubscribers: IActionHandler[] = []

    // Optimization: submodelTypes can be stored on the factory!
    readonly submodelTypes: {
        [key: string]: ModelFactory;
    } = {}
    _isRunningAction = false

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
        // TODO: confusing that subpath should be used instead of patch, just clone the patch for simplicity?
        // works for both replace and add, remove is not a case in mobx-state-tree ATM
        // note that there is no clever merge going on, stuff is fully replaced instead. Would that be nice, or just confusing?
        invariant(patch.op === "replace" || patch.op === "add")
        invariant(isObservable(this.state, subpath), `Not an observable key: '${subpath}' in '${this.path}'`)
        this.state[subpath] = patch.value // takes care of further deserialization
    }

    applyAction(action: IActionCall) {
        const node = this.resolve(action.path || "")
        if (node instanceof ObjectNode)
            return applyActionLocally(node, action)
        return fail(`Invalid action path: ${action.path || ""}`)
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
                    parent.emitAction(instance, action, next) // TODO correct path
                else
                    next()
            }
        }
        n()
    }

    @action applySnapshot(snapshot): void {
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

    getChildFactory(key: string): ModelFactory {
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


export function createFactory(baseModel: Object): ModelFactory
export function createFactory(name: string, baseModel: Object): ModelFactory
export function createFactory(arg1, arg2?): ModelFactory {
    const factoryName = typeof arg1 === "string" ? arg1 : "unnamed-object-factory"
    const baseModel = typeof arg1 === "string" ? arg2 : arg1

    // optimization remember which keys are assignable and check that on next runs
    let factory = extend(
        createFactoryHelper(factoryName, function(snapshot: Object = {}, env?: Object) {
            invariant(isPlainObject(snapshot) && !hasNode(snapshot), "Not a valid snapshot")
            const instance = observable.shallowObject({})
            const adm = new ObjectNode(instance, null, env, factory)
            Object.defineProperty(instance, "__modelAdministration", adm)
            copyBaseModelToInstance(baseModel, instance, adm)
            Object.seal(instance) // don't allow new props to be added!
            adm.applySnapshot(snapshot)
            return instance
        }),
        { isObjectFactory: true }
    )
    return factory
}

function copyBaseModelToInstance(baseModel: Object, instance: Object, adm: ObjectNode) {
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
            adm.submodelTypes[key] = primitiveFactory
            extendShallowObservable(instance, { [key] : value })
        } else if (isMapFactory(value)) {
            adm.submodelTypes[key] = value
            addReadOnlyProp(instance, key, adm.prepareChild(key, {}))
        } else if (isArrayFactory(value)) {
            adm.submodelTypes[key] = value
            addReadOnlyProp(instance, key, adm.prepareChild(key, []))
        } else if (isModelFactory(value)) {
            adm.submodelTypes[key] = value
            // future work: allow initialization / default values
            extendShallowObservable(instance, { key: null })
        } else if (isReferenceFactory(value)) {
            extendShallowObservable(instance, createReferenceProps(key, value))
        } else if (isAction(value)) {
            createActionWrapper(instance, key, value)
        } else if (typeof value === "function") {
            createNonActionWrapper(instance, key, value)
        } else if (typeof value === "object") {
            invariant(false, `In property '${key}': base model's should not contain complex values: '${value}'`)
        } else  {
            invariant(false)
        }
    }
}

export function composeFactory(name: string, ...models: (ModelFactory | any)[]): ModelFactory;
export function composeFactory(...models: (ModelFactory | any)[]): ModelFactory;
export function composeFactory(...args: any[]): ModelFactory {
    const factoryName = typeof args[0] === "string" ? args[0] : "unnamed-factory"
    const baseModels = typeof args[0] === "string" ? args.slice(1) : args

    return createFactory(factoryName, extend.apply(null, baseModels.map(baseModel =>
        isModelFactory(baseModel) ? getModelFactory(baseModel) : baseModel
    )))
}

export function getObjectNode(thing: any): ObjectNode {
    const node = getNode(thing)
    invariant((node.factory as any).isObjectFactory === true, "Expected object node, got " + (node.constructor as any).name)
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
