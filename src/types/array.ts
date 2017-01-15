import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action} from "mobx"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, isFactory} from "../core/factories"
import {identity, nothing, fail} from "../utils"
import {ComplexType} from "../core/types"

export class ArrayType extends ComplexType {
    isArrayFactory = true
    subType: IFactory<any, any> // TODO: type

    constructor(name, subType: IFactory<any, any>) {
        super(name)
        this.subType = subType
    }

    createNewInstance() {
        return observable.shallowArray()
    }

    getChildNodes(_: Node, target): [string, Node][] {
        const res: [string, Node][] = []
        target.forEach((value, index) => {
            maybeNode(value, node => { res.push(["" + index, node])})
        })
        return res
    }

    getChildNode(node: Node, target, key): Node | null {
        if (parseInt(key) < target.length)
            return maybeNode(target[key], identity, nothing)
        return null
    }

    willChange(node: Node, change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
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

    serialize(node: Node, target): any {
        return target.map(valueToSnapshot)
    }

    didChange(node: Node, change: IArrayChange<any> | IArraySplice<any>): void {
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

    applyPatchLocally(node: Node, target, subpath: string, patch: IJsonPatch): void {
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

    @action applySnapshot(node: Node, target, snapshot): void {
        // TODO: make a smart merge here, try to reuse instances..
        target.replace(snapshot)
    }

    getChildFactory(key: string): IFactory<any, any> {
        return this.subType
    }

    is(snapshot) {
        return Array.isArray(snapshot) && snapshot.every(item => this.subType.is(item))
    }
}

export function createArrayFactory<S, T extends S>(subtype: IFactory<S, T>): IFactory<S[], IObservableArray<T>> {
    return new ArrayType(subtype.factoryName + "[]", subtype).factory
}

export function isArrayFactory(factory): boolean {
    return isFactory(factory) && (factory.type as any).isArrayFactory === true
}
