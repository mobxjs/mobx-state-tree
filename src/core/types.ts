import {action} from "mobx"
import {Node, getNode, hasNode} from "./node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, IModel} from "./factories"

export interface IType {
    name: string
    is(thing: IModel | any): boolean
    create(snapshot): any
    factory: IFactory<any, any> // TODO type
    describe(): string
}

export type ITypeChecker = (value: IModel | any) => boolean

export abstract class Type implements IType { // TODO: generic for config and state of target
    name: string
    factory: IFactory<any, any>

    constructor(name: string) {
        this.name = name
        this.factory = this.initializeFactory()
    }

    abstract create(snapshot): any
    abstract is(thing): boolean
    abstract describe(): string

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
    create(snapshot) {
        const instance = this.createNewInstance()
        const node = new Node(instance, this.factory)
        this.finalizeNewInstance(instance)
        if (arguments.length > 0)
            node.applySnapshot(snapshot)
        Object.seal(instance)
        return instance
    }

    abstract createNewInstance()
    abstract finalizeNewInstance(target: any)
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
