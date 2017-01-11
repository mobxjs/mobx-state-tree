import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action} from "mobx"
import {Node, maybeNode, valueToSnapshot, hasNode} from "../core/node"
import {IJsonPatch} from "../core/json-patch"
import {IModelFactory, createFactory, createFactoryConstructor} from "../core/factories"
import {invariant, identity, fail} from "../utils"

interface IArrayFactoryConfig {
    subType: IModelFactory<any, any>
    isArrayFactory: true
}

export class ArrayNode extends Node {
    state: IObservableArray<any>

    getChildNodes(): [string, Node][] {
        const res: [string, Node][] = []
        this.state.forEach((value, index) => {
            maybeNode(value, node => { res.push(["" + index, node])})
        })
        return res
    }

    getChildNode(key): Node {
        return maybeNode(this.state[key], identity, () => fail(`No node at index '${key}' in '${this.path}'`))
    }

    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        switch (change.type) {
            case "update":
                const {newValue} = change
                const oldValue = change.object[change.index]
                if (newValue === oldValue)
                    return null
                maybeNode(oldValue, adm => adm.setParent(null))
                change.newValue = this.prepareChild("" + change.index, newValue)
                break
            case "splice":
                change.object.slice(change.index, change.removedCount).forEach(oldValue => {
                    maybeNode(oldValue, adm => adm.setParent(null))
                })
                change.added = change.added.map((newValue, pos) => {
                    return this.prepareChild("" + (change.index + pos), newValue)
                })
                break
        }
        return change
    }

    serialize(): any {
        return this.state.map(valueToSnapshot)
    }

    didChange(change: IArrayChange<any> | IArraySplice<any>): void {
        switch (change.type) {
            case "update":
                return void this.emitPatch({
                    op: "replace",
                    path: "/" + change.index,
                    value: valueToSnapshot(change.newValue)
                }, this)
            case "splice":
                for (let i = change.index + change.removedCount - 1; i >= change.index; i--)
                    this.emitPatch({
                        op: "remove",
                        path: "/" + i
                    }, this)
                for (let i = 0; i < change.addedCount; i++)
                    this.emitPatch({
                        op: "add",
                        path: "/" + (change.index + i),
                        value: valueToSnapshot(change.added[i])
                    }, this)
                return
        }
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        const index = subpath === "-" ? this.state.length : parseInt(subpath)
        switch (patch.op) {
            case "replace":
                this.state[index] = patch.value
                break
            case "add":
                this.state.splice(index, 0, patch.value)
                break
            case "remove":
                this.state.splice(index, 1)
                break
        }
    }

    @action applySnapshot(snapshot): void {
        invariant(this.factory.is(snapshot) && !hasNode(snapshot), 'Snapshot ' + JSON.stringify(snapshot) + ' is not assignable to ' + this.factory.factoryName)
        // TODO: make a smart merge here...
        // MWE: should we try to reuse existing instances in the array? Guess not, that might be terribly confusing
        // as they are not uniquely identifyable..
        this.state.replace(snapshot)
    }

    getChildFactory(): IModelFactory<any, any> {
        return (this.factory.config as IArrayFactoryConfig).subType
    }
}

export function createArrayFactory<S, T extends S>(subtype: IModelFactory<S, T>): IModelFactory<S[], IObservableArray<T>> {
    let factory = createFactory(
        "array-factory",
        "array",
        snapshot => (Array.isArray(snapshot) && snapshot.every(item => subtype.is(item))),
        snapshot => factory,
        createFactoryConstructor(
            "array-factory",
            ArrayNode,
            {
                subType: subtype,
                isArrayFactory: true
            } as IArrayFactoryConfig,
            () => observable.shallowArray()
        )
    ) as any

    return factory
}

export function isArrayFactory(factory): boolean {
    return factory && factory.config && factory.config.isArrayFactory === true
}
