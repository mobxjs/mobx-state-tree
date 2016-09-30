import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action} from "mobx"
import {Node, maybeNode, valueToSnapshot} from "../core/node"
import {ModelFactory} from "../core/factories"
import {invariant, isMutable, identity, fail} from "../utils"

// TODO: support primitives. Have separate factory?
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
        // TODO:
    }

    applyPatchLocally(subpath, patch): void {
        // TODO:
    }

    @action applySnapshot(snapshot): void {
        this.state.replace(snapshot)
    }

    getChildFactory(): ModelFactory {
        return this.subType
    }
}

export function createArrayFactory(subtype: ModelFactory): ModelFactory {
    let factory = action("array-factory", (snapshot: any[], env?) => {
        invariant(Array.isArray(snapshot), "Expected array")
        const instance = observable(
            snapshot.map(value => isMutable(value) ? subtype(value, env) : value)
        )
        const adm = new ArrayNode(instance, null, env, factory as ModelFactory, null)
        adm.subType = subtype
        Object.defineProperty(instance, "__modelAdministration", adm)
        return instance
    }) as ModelFactory
    (factory as any).isArrayFactory = true
    return factory
}

export function isArrayFactory(factory): boolean {
    return factory.isArrayFactory === true
}
