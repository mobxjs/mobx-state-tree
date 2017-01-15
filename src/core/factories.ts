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

// TODO: rename to IFactory
export interface IModelFactory<S, T> extends IModelFactoryConstructor<S, T>{
    factoryName: string,
    is: IModelFactoryChecker
    isModelFactory: boolean // TODO: rename to isFactory
    type: IType
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

// TODO: move to own file

export type TypeConstructor = new (name: string, config: any) => Type

// TODO: generics
export interface IType {
    name: string
    is(thing): boolean
    create(snapshot): any
    factory: IModelFactory<any, any> // TODO type
}

export abstract class Type { // TODO: generic for config and state of target
    name: string
    factory: IModelFactory<any, any>

    constructor(name: string) {
        this.name = name
        this.factory = this.initializeFactory()
    }

    abstract create(snapshot, environment?): any
    abstract is(thing): boolean

    protected initializeFactory() {
        const factory = action(
            this.name,
            this.create.bind(this)
        ) as IModelFactory<any, any>
        factory.type = this
        factory.isModelFactory = true
        factory.factoryName = this.name
        factory.is = (value) => this.is(value)
        return factory
    }
}

export abstract class ConcreteType extends Type {
}

export abstract class ComplexType extends ConcreteType {
    create(snapshot, environment?) {
        const instance = this.createNewInstance()
        const node = new Node(instance, environment, this.factory)
        if (arguments.length > 0)
            node.applySnapshot(snapshot)
        Object.seal(instance)
        return instance
    }

    abstract createNewInstance()
    abstract applySnapshot(node: Node, target, snapshot)
    abstract getChildNodes(node: Node, target): [string, Node][]
    abstract getChildNode(node: Node, target, key): Node | null
    abstract willChange(node: Node, change): Object | null
    abstract didChange(node: Node, change): void
    abstract serialize(node: Node, target): any
    abstract applyPatchLocally(node: Node, target, subpath: string, patch: IJsonPatch): void
    abstract getChildFactory(key: string): IModelFactory<any, any>
}
