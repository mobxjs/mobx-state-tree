import {action, isAction, extendObservable, observable} from "mobx"
import {invariant, hasOwnProperty, isPrimitive, fail} from "../utils"
import {hasNode} from "./node"
import {ObjectNode} from "../types/object-node"
import {createActionWrapper, createNonActionWrapper} from "./action"
import {isMapFactory, createMapFactory} from "../types/map-node"
import {isArrayFactory, createArrayFactory} from "../types/array-node"
import {isReferenceFactory, createReferenceProps} from "./reference"

// type Obje
export type ModelFactory = (snapshot?: any, env?: Object) => any

export function primitiveFactory(snapshot: any, env?: Object): any {
    invariant(isPrimitive(snapshot), `Expected primitive, got '${snapshot}'`)
    return snapshot
}
(primitiveFactory as any).isModelFactory = true // TODO: DRY


// TODO: move to object-node
// TODO: add name attribute
export function createFactory(baseModel: Object): ModelFactory {
    // TODO: remember which keys are assignable and check that on next runs
    // TODO: check that baseModel is plain object
    let factory = action("object-factory" /* TODO: use name */, function(snapshot: Object = {}, env?: Object) {
        invariant(snapshot && typeof snapshot === "object" && !hasNode(snapshot), "Not a valid snapshot")
        const instance = observable({})
        const adm = new ObjectNode(instance, null, env, factory as ModelFactory)
        Object.defineProperty(instance, "__modelAdministration", adm)
        copyBaseModelToInstance(baseModel, instance, adm)
        Object.seal(instance) // don't allow new props to be added!
        for (let key in snapshot)
            instance[key] = snapshot[key]
        return instance
    } as ModelFactory);
    (factory as any).isModelFactory = true // TODO: DRY
    return factory
}

// TODO: move to object-node?
function copyBaseModelToInstance(baseModel: Object, instance: Object, adm: ObjectNode) {
    for (let key in baseModel) if (hasOwnProperty(baseModel, key)) {
        const descriptor = Object.getOwnPropertyDescriptor(baseModel, key)
        if ("get" in descriptor) {
            const tmp = {} // yikes
            Object.defineProperty(tmp, key, descriptor)
            extendObservable(instance, tmp)
            continue
        }

        const {value} = descriptor
        if (isPrimitive(value)) {
            extendObservable(instance, { [key] : value })
        } else if (isMapFactory(value)) {
            adm.submodelType[key] = value
            extendObservable(instance, { [key] : {} }) //TODO: allow predefined map in future? second arg to factory?
        } else if (isArrayFactory(value)) {
            adm.submodelType[key] = value
            extendObservable(instance, { [key] : [] }) //TODO: allow predefined map in future? second arg to factory?
        // TODO: might be convenient shorthand in the future
        // } else if (Array.isArray(value)) {
        //     invariant(value.length < 2 && value.length >= 0, "Array fields should have length zero or one in: " + key)
        //     // TODO: have separate factory for primitives?
        //     const subFactory = createArrayFactory(value.length === 1 ? value[0] : primitiveFactory)
        //     adm.submodelType[key] = subFactory
        } else if (isModelFactory(value)) {
            adm.submodelType[key] = value
            extendObservable(instance, { [key] : null })
        } else if (isReferenceFactory(value)) {
            extendObservable(instance, createReferenceProps(key, value))
        }else if (isAction(value)) {
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

export function isModelFactory(value: any): value is ModelFactory {
    return typeof value === "function" && value.isModelFactory === true
}

// TODO: expose
// TODO: introduce plainObjectFactory?
export function generateFactory(value: any): ModelFactory {
    return generateFactoryHelper(value)
}

export function composeFactory(...models: (ModelFactory | any)[]): ModelFactory {
    // TODO: implement
    return fail("not implemented yet")
}

function generateFactoryHelper(value): ModelFactory | any {
    if (isPrimitive(value))
        return value
    if (Array.isArray(value)) {
        if (value.length === 0 || isPrimitive(value[0]))
            return createArrayFactory(primitiveFactory)
        return createArrayFactory(generateFactoryHelper(value[0]))
    }
    // TODO: recognize observable maps
    // an object
    const baseObject = {}
    for (let key in value) {
        // TODO: recognize actions etc
        baseObject[key] = generateFactoryHelper(value[key])
    }
    return createFactory(() => baseObject)
}
