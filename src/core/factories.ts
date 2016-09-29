import {action, isAction, extendObservable, asMap} from "mobx"
import {invariant, hasOwnProperty, isPrimitive} from "../utils"
import {hasNode} from "./node"
import {ObjectNode} from "../types/object-node"
import {createActionWrapper, createNonActionWrapper} from "./action"
import {isMap} from "../types/map-node"

// type Obje
export type ModelFactory = (snapshot: Object, env?: Object) => Object

export function createFactory(initializer: (env?: any) => Object): ModelFactory {
    // TODO: remember which keys are assignable and check that on next runs
    let factory = action("factory", function(snapshot: Object, env?: Object) {
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

export function isModelFactory(value: any): value is ModelFactory {
    // TODO:
    return true
}