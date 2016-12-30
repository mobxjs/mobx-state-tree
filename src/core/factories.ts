import {action} from "mobx"
import {extend} from "../utils"
import {getNode, hasNode, NodeConstructor} from "./node"

export type IModel = {
    $treenode: any // Actually Node, but that should not be exposed to the public...
} & Object

export interface IModelFactory<S, T> {
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
): IModelFactory<S, T> {
    let factory = extend(
        action(name, function(snapshot?: any, environment?: Object) {
            const instance = instanceCreator()
            const adm = new nodeClass(instance, environment, factory, configuration)
            if (arguments.length > 0)
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

export function isModelFactory(value: any): value is IModelFactory<any, any> {
    return typeof value === "function" && value.isModelFactory === true
}

export function getModelFactory(object: IModel): IModelFactory<any, any> {
    return getNode(object).factory
}

export function getChildModelFactory(object: IModel, child: string): IModelFactory<any, any> {
    return getNode(object).getChildFactory(child)
}

export function isModel(model: any): model is IModel {
    return hasNode(model)
}
