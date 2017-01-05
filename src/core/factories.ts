import {action} from "mobx"
import {extend, fail} from "../utils"
import {getNode, hasNode, NodeConstructor} from "./node"

export type IModel = {
    $treenode: any // Actually Node, but that should not be exposed to the public...
} & Object

export type IModelFactoryChecker = (snapshot: any) => boolean
export type IModelFactoryDispatcher = (snapshot?: any) => IModelFactory<any, any>
export interface IModelFactoryConstructor<S, T>{
    (snapshot?: S, env?: Object): T & IModel
}

export interface IModelFactory<S, T> extends IModelFactoryConstructor<S, T>{
    factoryName: string,
    kind: string
    is: IModelFactoryChecker
    irreducible: boolean
    dispatch: IModelFactoryDispatcher
    config: Object
    isModelFactory: boolean
}

export function createFactoryConstructor<S, T>(
    name: string,
    nodeClass: NodeConstructor,
    config,
    instanceCreator: () => any
): IModelFactoryConstructor<S, T>{
    let factory = extend(
        action(name, function(snapshot?: any, environment?: Object) {
            const instance = instanceCreator()
            const adm = new nodeClass(instance, environment, factory, config)
            if (arguments.length > 0)
                adm.applySnapshot(snapshot)
            return instance
        }),
        {
            config
        }
    )
    return factory
}

export function createFactory<S, T>(
    name: string,
    kind: string,
    is: IModelFactoryChecker,
    dispatch: IModelFactoryDispatcher,
    constructor: IModelFactoryConstructor<S, T>
): IModelFactory<S, T> {
    let factory = extend(
        constructor,
        {
            isModelFactory: true,
            factoryName: name,
            kind,
            is: (nodeOrSnapshot) => {
                let snapshot = isModel(nodeOrSnapshot) ? getNode(nodeOrSnapshot).snapshot : nodeOrSnapshot
                return is(snapshot)
            },
            dispatch: (nodeOrSnapshot) => {
                let snapshot = isModel(nodeOrSnapshot) ? getNode(nodeOrSnapshot).snapshot : nodeOrSnapshot
                return dispatch(snapshot)
            }
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
