import {action} from "mobx"
import {Node, getNode, hasNode} from "./node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, IModel} from "./factories"

// TODO: generics S, T
export interface IType {
    name: string
    is(thing: IModel | any): boolean
    create(snapshot): any
    factory: IFactory<any, any> // TODO type
}

export type ITypeChecker = (value: IModel | any) => boolean

export abstract class Type { // TODO: generic for config and state of target
    name: string
    factory: IFactory<any, any>

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
        ) as IFactory<any, any>
        factory.type = this
        factory.isFactory = true
        factory.factoryName = this.name
        factory.is = (value) => this.is(value)
        return factory
    }
}

export abstract class ComplexType extends Type {
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
    abstract getChildFactory(key: string): IFactory<any, any>
    abstract isValidSnapshot(snapshot: any): boolean

    is(value: IModel | any): boolean {
        if (!value || typeof value !== "object")
            return false
        if (hasNode(value))
            return this.isValidSnapshot(getNode(value).snapshot) // could check factory, but that doesn't check structurally...
        return this.isValidSnapshot(value)
    }
}
