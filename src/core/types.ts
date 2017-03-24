import {action} from "mobx"
import {Node, getNode, hasNode} from "./node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, IModel} from "./factories"
import {fail} from "../utils"

export interface IType<S, T> {
    name: string
    is(thing: any): thing is S | T
    create(snapshot: S): T
    factory: IFactory<S, T>
    describe(): string
}

export type ITypeChecker<S, T> = (value: any) => value is S | T

export abstract class Type<S, T> implements IType<S, T> { // TODO: generic for config and state of target
    name: string
    factory: IFactory<any, any>

    constructor(name: string) {
        this.name = name
        this.factory = this.initializeFactory()
    }

    abstract create(snapshot: any): any
    abstract is(thing: any): thing is S | T
    abstract describe(): string

    protected initializeFactory() {
        return {
            create: action(
                this.name,
                this.create.bind(this)
            ),
            type: this as any,
            isFactory: true,
            factoryName: this.name,
            is: this.is.bind(this)
        }
    }
}

export abstract class ComplexType<S, T> extends Type<S, T> {
    create(snapshot: any = this.getDefaultSnapshot()) {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        const node = new Node(instance, this.factory)
        this.finalizeNewInstance(instance, snapshot)
        Object.seal(instance)
        return instance
    }

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: Node, target: any, snapshot: any): void
    abstract getDefaultSnapshot(): any
    abstract getChildNodes(node: Node, target: any): [string, Node][]
    abstract getChildNode(node: Node, target: any, key: string): Node | null
    abstract serialize(node: Node, target: any): any
    abstract applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void
    abstract getChildFactory(key: string): IFactory<any, any>
    abstract isValidSnapshot(snapshot: any): boolean

    is(value: any): value is S | T {
        if (!value || typeof value !== "object")
            return false
        if (hasNode(value))
            return this.isValidSnapshot(getNode(value).snapshot) // could check factory, but that doesn't check structurally...
        return this.isValidSnapshot(value)
    }
}

export function typecheck(type: IType<any, any>, snapshot: any) {
    if (!type.is(snapshot))
        fail(`Snapshot ${JSON.stringify(snapshot)} is not assignable to type ${type.name}. Expected ${type.describe()} instead.`)
}