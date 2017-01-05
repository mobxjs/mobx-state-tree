import {observable, ObservableMap, IMapChange, IMapWillChange, action} from "mobx"
import {Node, maybeNode, valueToSnapshot, hasNode} from "../core/node"
import {IModelFactory, createFactory, createFactoryConstructor} from "../core/factories"
import {identity, fail, isPlainObject, invariant} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"

interface IMapFactoryConfig {
    subType: IModelFactory<any, any>
    isMapFactory: true
}

export class MapNode extends Node {
    state: ObservableMap<any>

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

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        switch (patch.op) {
            case "add":
            case "replace":
                this.state.set(subpath, patch.value)
                break
            case "remove":
                this.state.delete(subpath)
                break
        }
    }

    @action applySnapshot(snapshot): void {
        invariant(this.factory.is(snapshot) && !hasNode(snapshot), 'Snapshot ' + JSON.stringify(snapshot) + ' is not assignable to ' + this.factory.factoryName)
        this.state.replace(snapshot)
    }

    getChildFactory(): IModelFactory<any, any> {
        return (this.factory.config as IMapFactoryConfig).subType
    }
}

export function createMapFactory<S, T>(subtype: IModelFactory<S, T>): IModelFactory<{[key: string]: S}, ObservableMap<T>> {
    let factory = createFactory(
        "map-factory",
        "map",
        snapshot => (isPlainObject(snapshot) && Object.keys(snapshot).every(key => subtype.is(snapshot[key]))),
        snapshot => factory,
        createFactoryConstructor(
            "map-factory",
            MapNode,
            {
                subType: subtype,
                isMapFactory: true
            } as IMapFactoryConfig,
            () => observable.shallowMap()
        )
    ) as any
    return factory
}

export function isMapFactory(factory): boolean {
    return factory && factory.config && factory.config.isMapFactory === true
}
