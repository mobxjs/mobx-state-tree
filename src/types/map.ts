import { createDefaultValueFactory } from './with-default';
import { getIdentifierAttribute } from './object';
import {observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe} from "mobx"
import { getNode, hasNode, maybeNode, Node, valueToSnapshot } from '../core/node';
import {isFactory, IFactory} from "../core/factories"
import {identity, isPlainObject, nothing, isPrimitive, invariant, fail} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"
import {ComplexType} from "../core/types"

interface IMapFactoryConfig {
    isMapFactory: true
}

export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T): this
}

export class MapType<S, T> extends ComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
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
        const identifierAttr = getIdentifierAttribute(this.subType)
        const map = observable.shallowMap()

        // map.put(x) is a shorthand for map.set(x[identifier], x)
        ; (map as any).put = function(value: any) {
            invariant(!!identifierAttr, `Map.put is only supported if the subtype has an idenfier attribute`)
            invariant(!!value, `Map.put cannot be used to set empty values`)
            this.set(value[identifierAttr!], value)
            return this
        }
        return map
    }

    finalizeNewInstance(instance: ObservableMap<any>, snapshot: any) {
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
        getNode(instance).applySnapshot(snapshot)
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
        const node = getNode(change.object)
        const identifierAttr = getIdentifierAttribute(node)
        if (identifierAttr && change.newValue && typeof change.newValue === "object" && change.newValue[identifierAttr] !== change.name)
            fail(`A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${change.name}', but expected: '${change.newValue[identifierAttr!]}'`)

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
        const identifierAttr = getIdentifierAttribute(this.subType)
        // Try to update snapshot smartly, by reusing instances under the same key as much as possible
        const currentKeys: { [key: string]: boolean } = {}
        target.keys().forEach(key => { currentKeys[key] = false })
        Object.keys(snapshot).forEach(key => {
            const item = snapshot[key]
            if (identifierAttr && item && typeof item === "object" && key !== item[identifierAttr])
                fail(`A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${key}', but expected: '${item[identifierAttr]}'`)
            // if snapshot[key] is non-primitive, and this.get(key) has a Node, update it, instead of replace
            if (key in currentKeys && !isPrimitive(item)) {
                currentKeys[key] = true
                maybeNode(
                    target.get(key),
                    propertyNode => {
                        // update existing instance
                        propertyNode.applySnapshot(item)
                    },
                    () => {
                        target.set(key, item)
                    }
                )
            } else {
                target.set(key, item)
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

    getDefaultSnapshot() {
        return {}
    }
}

export function createMapFactory<S, T>(subtype: IFactory<S, T>): IFactory<{[key: string]: S}, IExtendedObservableMap<T>> {
    return createDefaultValueFactory(new MapType(`map<string, ${subtype.factoryName}>`, subtype).factory, {})
}

export function isMapFactory(factory: any): boolean {
    return isFactory(factory) && (factory.type as any).isMapFactory === true
}
