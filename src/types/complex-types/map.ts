import { createDefaultValueFactory } from "../utility-types/with-default"
import { getIdentifierAttribute } from "./object"
import { observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe } from "mobx"
import { getMSTAdministration, maybeMST, MSTAdministration, valueToSnapshot, escapeJsonPath, IJsonPatch } from "../../core"
import { identity, isPlainObject, nothing, isPrimitive, invariant, fail } from "../../utils"
import { IType, IComplexType, isType } from "../type"
import { ComplexType } from "./complex-type"

interface IMapFactoryConfig {
    isMapFactory: true
}

export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this // downtype to any, again, because we cannot type the snapshot, see
}

export class MapType<S, T> extends ComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    isMapFactory = true
    subType: IType<any, any>

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return "Map<string, " + this.subType.describe() + ">"
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
        getMSTAdministration(instance).applySnapshot(snapshot)
    }

    getChildMSTs(node: MSTAdministration): [string, MSTAdministration][] {
        const res: [string, MSTAdministration][] = []
        ; (node.target as ObservableMap<any>).forEach((value: any, key: string) => {
            maybeMST(value, childNode => { res.push([key, childNode])})
        })
        return res
    }

    getChildMST(node: MSTAdministration, key: string): MSTAdministration | null {
        const target = node.target as ObservableMap<any>
        if (target.has(key))
            return maybeMST(target.get(key), identity, nothing)
        return null
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {
        const node = getMSTAdministration(change.object)
        node.assertWritable()

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
                    maybeMST(oldValue, adm => adm.setParent(null))
                }
                break
        }
        return change
    }

    serialize(node: MSTAdministration): Object {
        const target = node.target as ObservableMap<any>
        const res: {[key: string]: any} = {}
        target.forEach((value, key) => {
            res[key] = valueToSnapshot(value)
        })
        return res
    }

    didChange(change: IMapChange<any>): void {
        const node = getMSTAdministration(change.object)
        switch (change.type) {
            case "update":
            case "add":
                return void node.emitPatch({
                    op: change.type === "add" ? "add" : "replace",
                    path: escapeJsonPath(change.name),
                    value: valueToSnapshot(change.newValue)
                }, node)
            case "delete":
                return void node.emitPatch({
                    op: "remove",
                    path: escapeJsonPath(change.name)
                }, node)
        }
    }

    applyPatchLocally(node: MSTAdministration, subpath: string, patch: IJsonPatch): void {
        const target = node.target as ObservableMap<any>
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

    @action applySnapshot(node: MSTAdministration, snapshot: any): void {
        const target = node.target as ObservableMap<any>
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
                maybeMST(
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

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(snapshot: any) {
        return isPlainObject(snapshot) && Object.keys(snapshot).every(key => this.subType.is(snapshot[key]))
    }

    getDefaultSnapshot() {
        return {}
    }

    removeChild(node: MSTAdministration, subpath: string) {
        (node.target as ObservableMap<any>).delete(subpath)
    }
}

export function createMapFactory<S, T>(subtype: IType<S, T>): IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return createDefaultValueFactory(new MapType(`map<string, ${subtype.name}>`, subtype), {})
}

export function isMapFactory<S, T>(factory: any): factory is IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return isType(factory) && (factory as any).isMapFactory === true
}
