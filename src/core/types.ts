import {action} from "mobx"
import {IJsonPatch} from "../core/json-patch"
import {fail} from "../utils"

// TODO: combine with object type
export type IModel = {
    $treenode: any // Actually Node, but that should not be exposed to the public...
} & Object

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export function getType(object: IModel): IType<any, any> {
    return getNode(object).type
}

export function getChildType(object: IModel, child: string): IType<any, any> {
    return getNode(object).getChildType(child)
}

// TODO: ambigous function name, remove
export function isModel(model: any): model is IModel {
    return hasNode(model)
}


export interface IType<S, T> {
    name: string
    is(thing: any): thing is S | T
    create(snapshot?: S): T
    isType: boolean
    describe(): string
}

export abstract class Type<S, T> implements IType<S, T> { // TODO: generic for config and state of target
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
        this.create = action(this.name, this.create)
    }

    abstract create(snapshot: any): any
    abstract is(thing: any): thing is S | T
    abstract describe(): string
}

export abstract class ComplexType<S, T> extends Type<S, T> {
    create(snapshot: any = this.getDefaultSnapshot()) {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        // tslint:disable-next-line:no_unused-variable
        const node = new Node(instance, this)
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
    abstract getChildType(key: string): IType<any, any>
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

import {Node, getNode, hasNode} from "./node"
