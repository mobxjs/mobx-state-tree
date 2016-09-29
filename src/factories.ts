import {action as mobxAction, extendObservable, extras, asMap} from "mobx"
import {invariant, hasOwnProperty, isPrimitive, addHiddenFinalProp} from "./utils"
import {Node, hasNode, getNode} from "./node"
import {ObjectNode, getObjectNode} from "./types/object-node"

// type Obje
export type ModelFactory = (snapshot: Object, env?: Object) => Object

export function createFactory(initializer: (env?: any) => Object): ModelFactory {
    // TODO: remember which keys are assignable and check that on next runs
    let factory = mobxAction("factory", function(snapshot: Object, env?: Object) {
        invariant(snapshot && typeof snapshot === "object" && !hasNode(snapshot), "Not a valid snapshot")
        // run initializer, environment will now be bound
        const baseModel = initializer(env)
        const instance = {}
        const adm = new ObjectNode(instance, null, env, factory as ModelFactory, null)
        Object.defineProperty(instance, "__modelAdministration", adm)
        copyBaseModelToInstance(baseModel, instance, adm)
        Object.seal(instance) // don't allow new props to be added!
        for (let key in snapshot)
            instance[key] = snapshot
        return instance
    } as ModelFactory)
    return factory
}

function copyBaseModelToInstance(baseModel: Object, instance: Object, adm: ObjectNode) {
    for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
        const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
        if ("get" in descriptor) {
            invariant(!descriptor.set, "computed property setters are currently not allowed")
            const tmp = {} // yikes
            Object.defineProperty(tmp, key, descriptor)
            extendObservable(baseModel, tmp)
            continue
        }

        const {value} = descriptor
        if (isPrimitive(value)) {
            extendObservable(instance, { [key] : value })
        } else if (isModelFactory(value)) {
            adm.submodelType[key] = value
            extendObservable(instance, { [key] : null })
        } else if (Array.isArray(value)) {
            invariant(value.length < 2 && value.length >= 0, "Array fields should have length zero or one in: " + key)
            extendObservable(instance, { [key] : [] })
            if (value.length === 1) {
                const subFactory = value[0]
                invariant(isModelFactory(subFactory), "Expected factory as only array value on field: "  + key)
                adm.submodelType[key] = subFactory
            }
            // TODO: support map
        } else if (isMap(value)) {
            adm.submodelType[key] = value.modelType
            extendObservable(instance, { [key] : asMap() })
        } else if (isAction(value)) {
            createActionWrapper(instance, key, value.action)
        } else if (typeof value === "function") {
            createNonActionWrapper(instance, key, value)
        } else if (typeof value === "object") {
            invariant(false, `In property '${key}': base model's should not contain complex values: '${value}'`)
        } else  {
            invariant(false)
        }
    }
}

function createNonActionWrapper(instance, key, func) {
    addHiddenFinalProp(instance, key, function () {
        invariant(
            extras.isComputingDerivation() || getNode(instance).isExecutingAction(),
            "Functions stored in models are only allowed to be invoked from either computed values or actions"
        )
        return func.apply(instance, arguments);
    })
}

function createActionWrapper(instance, key, action: Function) {
    addHiddenFinalProp(instance, key, function() {
        const adm = getObjectNode(instance)
        // TODO: check if all arguments are serialize (Nodes are serializable as well!)
        let hasError = true
        try {
            adm.notifyActionStart(key, arguments)
            const res = action.apply(this, arguments)
            invariant(res === undefined, `action '${key}' should not return a value but got '${res}'`)
            hasError = false
        } finally {
            adm.notifyActionEnd()
        }
    })
}

class Action {
    constructor(public action: Function) {}
}

export function action(action): any {
    return new Action(action)
}

function isAction(action: any): action is Action {
    return action instanceof Action
}

class Map {
    constructor(public subtype: ModelFactory | null) {
        invariant(!subtype || isModelFactory(subtype))
    }
}

export function map(subtype?: ModelFactory): any {
    return new Map(subtype || null)
}

function isMap(value: any): value is Map {
    return value instanceof Map
}

export function isModelFactory(value: any): value is ModelFactory {
    // TODO:
    return true
}