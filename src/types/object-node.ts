import {IObjectChange, IObjectWillChange, isObservable} from "mobx"
import {Node, maybeNode, getNode, valueToSnapshot} from "../core/node"
import {invariant, isSerializable, fail, registerEventHandler, IDisposer} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"
import {ModelFactory} from "../core/factories"
import {IActionCall, IActionCallOptions} from "../core/action"
import {clone} from "../mobx-state-tree"

export class ObjectNode extends Node {
    readonly actionSubscribers: ((actionCall: IActionCall) => void)[] = [];
    readonly submodelType: {
        [key: string]: ModelFactory;
    }
    private _isExecutingAction = 0

    getChildNodes(): [string, Node][] {
        const res: [string, Node][] = []
        for (let key in this.state)
            maybeNode(this.state[key], node => res.push([key, node]))
        return res
    }

    getChildNode(key): Node {
        return maybeNode(n => n, () => fail(`Illegal state, no node for "${key}"`))
    }

    willChange(change: IObjectWillChange): Object | null {
        const {newValue} = change
        const oldValue = change.object[change.name]
        if (newValue === oldValue)
            return null
        maybeNode(oldValue, adm => adm.setParent(null))
        change.newValue = this.prepareChild(change.name, newValue)
        return change
    }

    didChange(change: IObjectChange): void {
        switch (change.type) {
            case "update": return void this.emitPatch({
                op: "replace",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, this)
            case "add": return void this.emitPatch({
                op: "add",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, this)
        }
    }

    serialize(): any {
        const {state} = this
        const res = {}
        for (let key in state) {
            const value = state[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${this.path}/${key}`)
            res[key] = valueToSnapshot(value)
        }
        return res
    }

    // deserialize(target, snapshot): void {
    // isDeserializableFrom(snapshot): boolean {

    applyPatchLocally(subpath, patch): void {
        // TODO: confusing that subpath should be used instead of patch, just clone the patch for simplicity?
        // works for both replace and add, remove is not a case in mobx-state-tree ATM
        // note that there is no clever merge going on, stuff is fully replaced instead. Would that be nice, or just confusing?
        invariant(patch.op === "replace" || patch.op === "add")
        invariant(isObservable(this.state, subpath), `Not an observable key: '${subpath}' in '${this.path}'`)
        this.state[subpath] = patch.value // takes care of further deserialization
    }

    applyAction(action: IActionCall, options?: IActionCallOptions): IJsonPatch[] {
        const node = getObjectNode(this.resolve(action.path))
        return node.applyAction(action, options)
    }

    applyActionLocally(action: IActionCall, options?: IActionCallOptions): IJsonPatch[] {
        const supressActionEvents = (options && options.supressActionEvents) || true
        const supressPatchEvents = (options && options.supressPatchEvents) || false
        const dryRun = (options && options.dryRun) || false
        const target = dryRun ? getObjectNode(clone(this.state)) : this
        const actionSubscriptions = supressActionEvents ? target.actionSubscribers.splice(0) : []
        const patchSubscriptions  = supressPatchEvents  ? target.patchSubscribers.splice(0)  : []
        try {
            return target.state[action.name].apply(target.state, action.args)
        } finally {
            target.patchSubscribers.push(...patchSubscriptions)
            target.actionSubscribers.push(...actionSubscriptions)
        }
    }

    getChildFactory(key: string): ModelFactory {
        return this.submodelType[key] || fail(`No factory defined for '${key}' in '${this.path}'`)
    }

    isExecutingAction() {
        return this._isExecutingAction > 0
    }

    notifyActionStart(name, args) {
        if (++this._isExecutingAction === 1) {

        }
    }

    notifyActionEnd() {
        // TODO: emit event when starting or ending an action?
        --this._isExecutingAction
    }

    onAction(listener: (action: IActionCall) => void): IDisposer {
        return registerEventHandler(this.actionSubscribers, listener)
    }
}

export function getObjectNode(thing: any): ObjectNode {
    const node = getNode(thing)
    // TODO: no instanceof, better message
    invariant(node instanceof ObjectNode, "Expected object node")
    return node as ObjectNode
}
