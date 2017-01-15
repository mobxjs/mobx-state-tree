import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action} from "mobx"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {IJsonPatch} from "../core/json-patch"
import {IModelFactory, createFactory, Type, isModelFactory} from "../core/factories"
import {identity, fail} from "../utils"

export class ArrayType extends Type {
    isArrayFactory = true
    subType: IModelFactory<any, any> // TODO: type

    constructor(name, subType: IModelFactory<any, any>) {
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

    getChildNode(node: Node, target, key): Node {
        return maybeNode(target[key], identity, () => fail(`No node at index '${key}' in '${node.path}'`))
    }

    willChange(node: Node, change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        switch (change.type) {
            case "update":
                const {newValue} = change
                const oldValue = change.object[change.index]
                if (newValue === oldValue)
                    return null
                maybeNode(oldValue, adm => adm.setParent(null))
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

    getChildFactory(key: string): IModelFactory<any, any> {
        return this.subType
    }

    is(snapshot) {
        return Array.isArray(snapshot) && snapshot.every(item => this.subType.is(item))
    }
}

export function createArrayFactory<S, T extends S>(subtype: IModelFactory<S, T>): IModelFactory<S[], IObservableArray<T>> {
    return createFactory(
        "array-of-" + subtype.factoryName,
        ArrayType,
        subtype
    ) as any // TODO: no any
}

export function isArrayFactory(factory): boolean {
    return isModelFactory(factory) && (factory.type as any).isArrayFactory === true
}
