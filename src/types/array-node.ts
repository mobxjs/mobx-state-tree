import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action} from "mobx"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {ModelFactory, createFactoryHelper} from "../core/factories"
import {invariant, identity, fail, extend} from "../utils"

export class ArrayNode extends Node {
    state: IObservableArray<any>
    subType: ModelFactory

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
                        path: "/" + (change.index + i)
                    }, this)
                return
        }
    }

    applyPatchLocally(subpath, patch): void {
        const index = subpath === "-" ? this.state.length : parseInt(subpath)
        switch (patch.type) {
            case "update":
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
        this.state.replace(snapshot)
    }

    getChildFactory(): ModelFactory {
        return this.subType
    }
}

export function createArrayFactory(subtype: ModelFactory): ModelFactory {
    let factory = extend(
        createFactoryHelper("array-factory", (snapshot: any[] = [], env?) => {
            invariant(Array.isArray(snapshot), "Expected array")
            const instance = observable.shallowArray()
            const adm = new ArrayNode(instance, null, env, factory)
            adm.subType = subtype
            Object.defineProperty(instance, "__modelAdministration", adm)
            instance.replace(snapshot)
            return instance
        }),
        { isArrayFactory: true }
    )
    return factory
}

export function isArrayFactory(factory): boolean {
    return factory.isArrayFactory === true
}
