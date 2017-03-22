import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe} from "mobx"
import {Node, maybeNode, valueToSnapshot, getNode} from "../core/node"
import {IJsonPatch} from "../core/json-patch"
import {IFactory, isFactory} from "../core/factories"
import {identity, nothing} from "../utils"
import {ComplexType} from "../core/types"

export class ArrayType extends ComplexType {
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

    finalizeNewInstance(instance: IObservableArray<any>) {
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
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

    @action applySnapshot(node: Node, target: IObservableArray<any>, snapshot: any): void {
        // TODO: make a smart merge here, try to reuse instances..
        target.replace(snapshot)
    }

    getChildFactory(key: string): IFactory<any, any> {
        return this.subType
    }

    isValidSnapshot(snapshot: any) {
        return Array.isArray(snapshot) && snapshot.every(item => this.subType.is(item))
    }
}

export function createArrayFactory<S, T extends S>(subtype: IFactory<S, T>): IFactory<S[], IObservableArray<T>> {
    return new ArrayType(subtype.factoryName + "[]", subtype).factory
}

export function isArrayFactory(factory: any): boolean {
    return isFactory(factory) && (factory.type as any).isArrayFactory === true
}
