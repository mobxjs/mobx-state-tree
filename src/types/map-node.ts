import {ObservableMap, asMap, IMapChange, IMapWillChange, action} from "mobx"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {ModelFactory, isModelFactory} from "../core/factories"
import {invariant, isMutable, identity, fail, isPlainObject} from "../utils"

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
        // TODO:
    }

    applyPatchLocally(subpath, patch): void {
        // TODO:
    }

    getChildFactory(): ModelFactory {
        return this.subType
    }
}

export function createMapFactory(subtype: ModelFactory): ModelFactory {
    let factory = action("map-factory", (snapshot: any[], env?) => {
        invariant(isPlainObject(snapshot), "Expected array")
        const instance = asMap()
        const adm = new MapNode(instance, null, env, factory as ModelFactory, null)
        adm.subType = subtype
        Object.defineProperty(instance, "__modelAdministration", adm)
        for (let key in snapshot) {
            const value = snapshot[key]
            instance.set(key, isMutable(value) ? subtype(value, env) : value)
        }
        return instance
    })
    return factory
}

// TODO: somehow just use map from mobx?
export class Map {
    constructor(public subtype: ModelFactory | null) {
        invariant(!subtype || isModelFactory(subtype))
    }
}

export function map(subtype?: ModelFactory): any {
    return new Map(subtype || null)
}

export function isMap(value: any): value is Map {
    return value instanceof Map // TODO: don't use instanceof
}
