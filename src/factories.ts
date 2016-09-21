import {extendObservable, extras, asMap} from "mobx"
import {invariant, hasOwnProperty, isPrimitive} from "./utils"

// type Obje
type ObjectFactory = (snapshot: Object, env?: Object) => Object

class ModelAdministration {
    submodelType: {
        [key: string]: ObjectFactory;
    }

    constructor(public instance: Object) {
    }
}

export function createFactory(initializer: (env?: any) => Object): ObjectFactory {
    return function(snapshot: Object, env?: Object) {
        const baseModel = initializer(env)
        const instance = {}
        const adm = new ModelAdministration(instance)
        Object.defineProperty(instance, "__modelAdministration", adm)

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
            if (isSerializablePrimitive(value)) {
                extendObservable(initializer, { [key] : value })
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
                createActionWrapper(instance, key, value)
            } else if (typeof value === "function") {
                createNonActionWrapper(instance, key, value)
            } else if (typeof value === "object") {
                invariant(false, `In property '${key}': base model's should not contain complex values: '${value}'`)
            } else  {
                invariant(false)
            }
        }
        adm.applySnapshot(snapshot)
        return instance
    }
}

function createNonActionWrapper(instance, key, func) {
    Object.defineProperty(instance, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function () {
            invariant(
                extras.isComputingDerivation() || getModelAdministration(instance).isExecutingAction(),
                "Functions stored in models are only allowed to be invoked from either computed values or actions"
            )
            func.apply(instance, arguments);
        }
    })
}

function createActionWrapper(instance, key, action: Action) {
    const {func} = action
    Object.defineProperty(instance, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function() {
            const adm = getModelAdministration(instance)
            let hasError = true
            try {
                adm.notifyActionStart(key, arguments)
                func.apply(this, arguments)
                hasError = false
            } finally {
                adm.notifyActionEnd(hasError)
            }
        }
    })
}
