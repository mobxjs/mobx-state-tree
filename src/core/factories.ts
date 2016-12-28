import {action} from "mobx"
import {extend, addHiddenFinalProp} from "../utils"
import {getNode, hasNode, NodeConstructor} from "./node"

export type ModelFactory = {
    (snapshot?: any, env?: Object): any
    isModelFactory: true
    factoryName: string,
    config: Object
}

export function createFactory(
    name: string,
    nodeClass: NodeConstructor,
    configuration,
    instanceCreator: () => any
): ModelFactory {
    let factory = extend(
        action(name, function(snapshot?: any, environment?: Object) {
            const instance = instanceCreator()
            const adm = new nodeClass(instance, environment, factory, configuration)
            adm.applySnapshot(snapshot)
            return instance
        }) as any,
        {
            isModelFactory: true,
            factoryName: name,
            config: configuration
        }
    )
    return factory
}

export function isModelFactory(value: any): value is ModelFactory {
    return typeof value === "function" && value.isModelFactory === true
}

export function getModelFactory(object: Object): ModelFactory {
    return getNode(object).factory
}

export function getChildModelFactory(object: Object, child: string): ModelFactory {
    return getNode(object).getChildFactory(child)
}

export function isModel(model: any): boolean {
    return hasNode(model)
}
