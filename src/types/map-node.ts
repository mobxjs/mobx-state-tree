import {ObservableMap, IMapChange, IMapWillChange, action} from "mobx"
import {Node, maybeNode, valueToSnapshot, getNode, hasNode} from "../core/node"
import {ModelFactory} from "../core/factories"
import {invariant, isMutable, identity, fail, isPlainObject} from "../utils"
import {escapeJsonPath} from "../core/json-patch"

// TODO: support primitives. Have separate factory?
export class MapNode extends Node {
    state: ObservableMap<any>
    subType: ModelFactory

    getChildNodes(): [string, Node][] {
        const res: [string, Node][] = []
        this.state.forEach((value, key) => {
            maybeNode(value, node => { res.push([key, node])})
        })
        return res
    }

    getChildNode(key): Node {
        return maybeNode(this.state.get(key), identity, () => fail(`No node at index '${key}' in '${this.path}'`))
    }

    willChange(change: IMapWillChange<any>): Object | null {
        switch (change.type) {
            case "update":
                {
                    const {newValue} = change
                    const oldValue = change.object.get(change.name)
                    if (newValue === oldValue)
                        return null
                    maybeNode(oldValue, adm => adm.setParent(null))
                    change.newValue = this.prepareChild("" + change.name, newValue)
                }
                break
            case "add":
                {
                    const {newValue} = change
                    change.newValue = this.prepareChild("" + change.name, newValue)
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

    serialize(): Object {
        // TODO: or serialize as entries?
        const res = {}
        this.state.forEach((value, key) => {
            res[key] = valueToSnapshot(value)
        })
        return res
    }

    didChange(change: IMapChange<any>): void {
        switch (change.type) {
            case "update":
            case "add":
                return void this.emitPatch({
                    op: change.type === "add" ? "add" : "replace",
                    path: "/" + escapeJsonPath(change.name),
                    value: valueToSnapshot(change.newValue)
                }, this)
            case "delete":
                return void this.emitPatch({
                    op: "remove",
                    path: "/" + escapeJsonPath(change.name)
                }, this)
        }
    }

    applyPatchLocally(subpath, patch): void {
        switch (patch.type) {
            case "add":
            case "replace":
                this.state.set(subpath, patch.value) // takes care of further deserialization
                break
            case "remove":
                this.state.delete(subpath)
                break
        }
    }

    @action applySnapshot(snapshot): void {
        this.state.clear()
        this.state.merge(snapshot)
    }

    getChildFactory(): ModelFactory {
        return this.subType
    }

    getPathForNode(node: Node): string | null{
        for(var [key, value] of this.state.entries()){
            if(hasNode(value) && getNode(value) === node){
                return key
            }
        }
        return null
    }
}

export function createMapFactory(subtype: ModelFactory): ModelFactory {
    let factory = action("map-factory", (snapshot: any = {}, env?) => {
        invariant(isPlainObject(snapshot), "Expected array")
        const instance = new ObservableMap()
        const adm = new MapNode(instance, null, env, factory as ModelFactory)
        adm.subType = subtype
        Object.defineProperty(instance, "__modelAdministration", adm)
        for (let key in snapshot) {
            const value = snapshot[key]
            instance.set(key, isMutable(value) ? subtype(value, env) : value)
        }
        return instance
    }) as ModelFactory
    (factory as any).isModelFactory = true; // TODO: DRY
    (factory as any).isMapFactory = true
    return factory
}

export function isMapFactory(factory): boolean {
    return factory.isMapFactory === true
}