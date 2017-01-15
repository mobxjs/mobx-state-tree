import {action} from "mobx"
import {extend, fail} from "../utils"
import {Node, getNode, hasNode, NodeConstructor} from "./node"
import {IJsonPatch} from "../core/json-patch"

export type IModel = {
    $treenode: any // Actually Node, but that should not be exposed to the public...
} & Object

export type IModelFactoryChecker = (value: IModel | any) => boolean

export interface IModelFactoryConstructor<S, T>{
    (snapshot?: S, env?: Object): T & IModel
}

export interface IModelFactory<S, T> extends IModelFactoryConstructor<S, T>{
    factoryName: string,
    is: IModelFactoryChecker
    isModelFactory: boolean
    type: Type
}

// TODO: move to type?
// TODO: typeconfig should just by the initial args
export function createFactory<S, T>(
    name: string,
    baseType: TypeConstructor,
    typeConfig
): IModelFactory<S, T> {
    let type: Type = new baseType(name, typeConfig)
    const factory = action(
        name,
        function (snapshot, environment) {
            const instance = type.createNewInstance()
            const adm = new Node(instance, environment, factory)
            if (arguments.length > 0)
                adm.applySnapshot(snapshot)
            return instance
        }
    ) as IModelFactory<S, T>
    factory.type = type
    factory.isModelFactory = true
    factory.factoryName = name
    factory.is = (value) => type.is(value)
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

export type TypeConstructor = new (name: string, config: any) => Type

// TODO: refactor from class to struct?
// TODO: separate into AbstractType and ConcreteType
export abstract class Type { // TODO: generic for config and state of target
    name: string

    constructor(name: string) {
        this.name = name
    }

    // TODO: most methods don't need node
    abstract createNewInstance(): any
    abstract applySnapshot(node: Node, target, snapshot)
    abstract getChildNodes(node: Node, target): [string, Node][]
    abstract getChildNode(node: Node, target, key): Node
    abstract willChange(node: Node, change): Object | null
    abstract didChange(node: Node, change): void
    abstract serialize(node: Node, target): any
    abstract applyPatchLocally(node: Node, target, subpath: string, patch: IJsonPatch): void
    abstract getChildFactory(key: string): IModelFactory<any, any>
    abstract is(thing): boolean

    // TODO:
    // dispatch(value): ConcreteType
}
