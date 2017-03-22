import {observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe} from "mobx"
import {Node, maybeNode, valueToSnapshot, getNode} from "../core/node"
import {isFactory, IFactory} from "../core/factories"
import {identity, isPlainObject, nothing, isPrimitive} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"
import {ComplexType} from "../core/types"

interface IMapFactoryConfig {
    isMapFactory: true
}

export class MapType extends ComplexType {
    isMapFactory = true
    subType: IFactory<any, any>

    constructor(name: string, subType: IFactory<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return "Map<string, " + this.subType.type.describe() + ">"
    }

    createNewInstance() {
        return observable.shallowMap()
    }

    finalizeNewInstance(instance: ObservableMap<any>) {
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
    }

    getChildNodes(_node: Node, target: ObservableMap<any>): [string, Node][] {
        const res: [string, Node][] = []
        target.forEach((value, key) => {
            maybeNode(value, node => { res.push([key, node])})
        })
        return res
    }

    getChildNode(node: Node, target: ObservableMap<any>, key: string): Node | null {
        if (target.has(key))
            return maybeNode(target.get(key), identity, nothing)
        return null
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {
        // TODO: check type
        // TODO: check if editable

        const node = getNode(change.object)
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

    serialize(node: Node, target: ObservableMap<any>): Object {
        const res: {[key: string]: any} = {}
        target.forEach((value, key) => {
            res[key] = valueToSnapshot(value)
        })
        return res
    }

    didChange(change: IMapChange<any>): void {
        const node = getNode(change.object)
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

    applyPatchLocally(node: Node, target: ObservableMap<any>, subpath: string, patch: IJsonPatch): void {
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

    @action applySnapshot(node: Node, target: ObservableMap<any>, snapshot: any): void {
        // Try to update snapshot smartly, by reusing instances under the same key as much as possible
        const currentKeys: { [key: string]: boolean } = {}
        target.keys().forEach(key => { currentKeys[key] = false })
        Object.keys(snapshot).forEach(key => {
            // if snapshot[key] is non-primitive, and this.get(key) has a Node, update it, instead of replace
            if (key in currentKeys && !isPrimitive(snapshot[key])) {
                currentKeys[key] = true
                maybeNode(
                    target.get(key),
                    propertyNode => {
                        // update existing instance
                        propertyNode.applySnapshot(snapshot[key])
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

    getChildFactory(key: string): IFactory<any, any> {
        return this.subType
    }

    isValidSnapshot(snapshot: any) {
        return isPlainObject(snapshot) && Object.keys(snapshot).every(key => this.subType.is(snapshot[key]))
    }
}

export function createMapFactory<S, T>(subtype: IFactory<S, T>): IFactory<{[key: string]: S}, ObservableMap<T>> {
    return new MapType(`map<string, ${subtype.factoryName}>`, subtype).factory
}

export function isMapFactory(factory: any): boolean {
    return isFactory(factory) && (factory.type as any).isMapFactory === true
}
