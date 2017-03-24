import { isFactory } from '../../lib';
import {action} from "mobx"
import {Node, getNode, hasNode} from "./node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, IModel} from "./factories"

export interface IType {
    name: string
    is(thing: IModel | any): boolean
    create(snapshot: any): any
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

    abstract create(snapshot: any): any
    abstract is(thing: any): boolean
    abstract describe(): string

    protected initializeFactory(this: Type) {
        return {
            create: action(
                this.name,
                this.create.bind(this)
            ),
            type: this,
            isFactory: true,
            factoryName: this.name,
            is: this.is.bind(this)
        }
    }
}

export abstract class ComplexType extends Type {
    create(snapshot: any) {
        const instance = this.createNewInstance()
        const node = new Node(instance, this.factory)
        this.finalizeNewInstance(instance)
        if (arguments.length > 0)
            node.applySnapshot(snapshot)
        Object.seal(instance)
        return instance
    }

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any): void
    abstract applySnapshot(node: Node, target: any, snapshot: any): void
    abstract getChildNodes(node: Node, target: any): [string, Node][]
    abstract getChildNode(node: Node, target: any, key: string): Node | null
    abstract serialize(node: Node, target: any): any
    abstract applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void
    abstract getChildFactory(key: string): IFactory<any, any>
    abstract isValidSnapshot(snapshot: any): boolean

    is(value: any): boolean {
        if (!value || typeof value !== "object")
            return false
        if (hasNode(value))
            return this.isValidSnapshot(getNode(value).snapshot) // could check factory, but that doesn't check structurally...
        return this.isValidSnapshot(value)
    }
}
