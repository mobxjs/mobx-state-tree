import { createDefaultValueFactory } from './with-default';
import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe} from "mobx"
import { applySnapshot } from "../top-level-api"
import {Node, maybeNode, valueToSnapshot, getNode} from "../core/node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, isType, getType} from "../core/factories"
import {identity, nothing, invariant} from "../utils"
import {ComplexType} from "../core/types"
import {getIdentifierAttribute} from "./object"

export class ArrayType<T> extends ComplexType<T[], IObservableArray<T>> {
    isArrayFactory = true
    subType: IFactory<any, any> // TODO: type

    constructor(name: string, subType: IFactory<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return this.subType.type.describe() + "[]"
    }

    createNewInstance() {
        return observable.shallowArray()
    }

    finalizeNewInstance(instance: IObservableArray<any>, snapshot: any) {
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
        getNode(instance).applySnapshot(snapshot)
    }

    getChildNodes(_: Node, target: IObservableArray<any>): [string, Node][] {
        const res: [string, Node][] = []
        target.forEach((value, index) => {
            maybeNode(value, node => { res.push(["" + index, node])})
        })
        return res
    }

    getChildNode(node: Node, target: IObservableArray<any>, key: string): Node | null {
        const index = parseInt(key, 10)
        if (index < target.length)
            return maybeNode(target[index], identity, nothing)
        return null
    }

    willChange = (change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null => {
        // TODO: verify type
                // TODO check type
        // TODO: check if tree is editable
        // TODO: check for key duplication
        const node = getNode(change.object)
        switch (change.type) {
            case "update":
                const {newValue} = change
                const oldValue = change.object[change.index]
                if (newValue === oldValue)
                    return null
                change.newValue = node.prepareChild("" + change.index, newValue)
                break
            case "splice":
                change.object.slice(change.index, change.removedCount).forEach(oldValue => {
                    maybeNode(oldValue, adm => adm.setParent(null))
                })
                change.added = change.added.map((newValue, pos) => {
                    return node.prepareChild("" + (change.index + pos), newValue)
                })
                break
        }
        return change
    }

    serialize(node: Node, target: IObservableArray<any>): any {
        return target.map(valueToSnapshot)
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getNode(change.object)
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "/" + change.index,
                    value: valueToSnapshot(change.newValue)
                }, node)
            case "splice":
                for (let i = change.index + change.removedCount - 1; i >= change.index; i--)
                    node.emitPatch({
                        op: "remove",
                        path: "/" + i
                    }, node)
                for (let i = 0; i < change.addedCount; i++)
                    node.emitPatch({
                        op: "add",
                        path: "/" + (change.index + i),
                        value: valueToSnapshot(change.added[i])
                    }, node)
                return
        }
    }

    applyPatchLocally(node: Node, target: IObservableArray<any>, subpath: string, patch: IJsonPatch): void {
        const index = subpath === "-" ? target.length : parseInt(subpath)
        switch (patch.op) {
            case "replace":
                target[index] = patch.value
                break
            case "add":
                target.splice(index, 0, patch.value)
                break
            case "remove":
                target.splice(index, 1)
                break
        }
    }

    @action applySnapshot(node: Node, target: IObservableArray<any>, snapshot: any[]): void {
        const identifierAttr = getIdentifierAttribute(this.subType)
        if (identifierAttr)
            target.replace(reconcileArrayItems(identifierAttr, target, snapshot, this.subType))
        else
            target.replace(snapshot)
    }

    getChildType(key: string): IFactory<any, any> {
        return this.subType
    }

    isValidSnapshot(snapshot: any) {
        return Array.isArray(snapshot) && snapshot.every(item => this.subType.is(item))
    }

    getDefaultSnapshot() {
        return []
    }
}

function reconcileArrayItems(identifierAttr: string, target: IObservableArray<any>, snapshot: any[], factory: IFactory<any, any>): any[] {
    const current: any = {}
    target.forEach(item => {
        const id = item[identifierAttr]
        invariant(!current[id], `Identifier '${id}' (of ${getNode(item).path}) is not unique!`)
        current[id] = item
    })
    return snapshot.map(item => {
        const existing = current[item[identifierAttr]]
        if (existing && getType(existing).is(item)) {
            applySnapshot(existing, item)
            return existing
        } else {
            return factory.create(item)
        }
    })
}

export function createArrayFactory<S, T>(subtype: IFactory<S, T>): IFactory<S[], IObservableArray<T>> {
    return createDefaultValueFactory(new ArrayType(subtype.factoryName + "[]", subtype).factory, [])
}

export function isArrayFactory(factory: any): boolean {
    return isType(factory) && (factory.type as any).isArrayFactory === true
}
