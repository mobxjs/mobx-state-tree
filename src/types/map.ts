import {observable, ObservableMap, IMapChange, IMapWillChange, action} from "mobx"
import {Node, maybeNode, valueToSnapshot, hasNode} from "../core/node"
import {isModelFactory, IModelFactory, ComplexType} from "../core/factories"
import {identity, fail, isPlainObject, invariant, nothing, isPrimitive} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"

interface IMapFactoryConfig {
    isMapFactory: true
}

export class MapType extends ComplexType {
    isMapFactory = true
    subType: IModelFactory<any, any>

    constructor(name: string, subType: IModelFactory<any, any>) {
        super(name)
        this.subType = subType
    }

    createNewInstance() {
        return observable.shallowMap()
    }

    getChildNodes(_node: Node, target): [string, Node][] {
        const res: [string, Node][] = []
        target.forEach((value, key) => {
            maybeNode(value, node => { res.push([key, node])})
        })
        return res
    }

    getChildNode(node: Node, target, key): Node | null {
        if (target.has(key))
            return maybeNode(target.get(key), identity, nothing)
        return null
    }

    willChange(node: Node, change: IMapWillChange<any>): Object | null {
        switch (change.type) {
            case "update":
                {
                    const {newValue} = change
                    const oldValue = change.object.get(change.name)
                    if (newValue === oldValue)
                        return null
                    change.newValue = node.prepareChild("" + change.name, newValue)
                }
                break
            case "add":
                {
                    const {newValue} = change
                    change.newValue = node.prepareChild("" + change.name, newValue)
                }
                break
            case "delete":
                {
                    const oldValue = change.object.get(change.name)
                    maybeNode(oldValue, adm => adm.setParent(null))
                }
                break
        }
        return change
    }

    serialize(node: Node, target): Object {
        const res = {}
        target.forEach((value, key) => {
            res[key] = valueToSnapshot(value)
        })
        return res
    }

    didChange(node: Node, change: IMapChange<any>): void {
        switch (change.type) {
            case "update":
            case "add":
                return void node.emitPatch({
                    op: change.type === "add" ? "add" : "replace",
                    path: "/" + escapeJsonPath(change.name),
                    value: valueToSnapshot(change.newValue)
                }, node)
            case "delete":
                return void node.emitPatch({
                    op: "remove",
                    path: "/" + escapeJsonPath(change.name)
                }, node)
        }
    }

    applyPatchLocally(node: Node, target, subpath: string, patch: IJsonPatch): void {
        switch (patch.op) {
            case "add":
            case "replace":
                target.set(subpath, patch.value)
                break
            case "remove":
                target.delete(subpath)
                break
        }
    }

    @action applySnapshot(node: Node, target, snapshot): void {
        // Try to update snapshot smartly, by reusing instances under the same key as much as possible
        const currentKeys: { [key: string]: boolean } = {}
        target.keys().forEach(key => { currentKeys[key] = false })
        Object.keys(snapshot).forEach(key => {
            // if snapshot[key] is non-primitive, and this.get(key) has a Node, update it, instead of replace
            if (key in currentKeys && !isPrimitive(snapshot[key])) {
                currentKeys[key] = true
                maybeNode(
                    target.get(key),
                    node => {
                        // update existing instance
                        node.applySnapshot(snapshot[key])
                    },
                    () => {
                        target.set(key, snapshot[key])
                    }
                )
            } else {
                target.set(key, snapshot[key])
            }
        })
        Object.keys(currentKeys).forEach(key => {
            if (currentKeys[key] === false)
                target.delete(key)
        })
    }

    getChildFactory(key: string): IModelFactory<any, any> {
        return this.subType
    }

    is(snapshot) {
        return isPlainObject(snapshot) && Object.keys(snapshot).every(key => this.subType.is(snapshot[key]))
    }
}

export function createMapFactory<S, T>(subtype: IModelFactory<S, T>): IModelFactory<{[key: string]: S}, ObservableMap<T>> {
    return new MapType(`map<string, ${subtype.factoryName}>`, subtype).factory
}

export function isMapFactory(factory): boolean {
    return isModelFactory(factory) && (factory.type as any).isMapFactory === true
}
