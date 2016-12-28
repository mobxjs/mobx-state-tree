import {action} from "mobx"
import {extend} from "../utils"
import {getNode, hasNode, NodeConstructor} from "./node"

export type IModel = {
    $treenode: any // Actually Node, but that should not be exposed to the public...
} & Object

export interface ModelFactory<S, T> {
    (snapshot?: S, env?: Object): T & IModel
    isModelFactory: true
    factoryName: string,
    config: Object
}

export function createFactory<S, T>(
    name: string,
    nodeClass: NodeConstructor,
    configuration,
    instanceCreator: () => any
): ModelFactory<S, T> {
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

export function isModelFactory(value: any): value is ModelFactory<any, any> {
    return typeof value === "function" && value.isModelFactory === true
}

export function getModelFactory(object: IModel): ModelFactory<any, any> {
    return getNode(object).factory
}

export function getChildModelFactory(object: IModel, child: string): ModelFactory<any, any> {
    return getNode(object).getChildFactory(child)
}

export function isModel(model: any): model is IModel {
    return hasNode(model)
}
