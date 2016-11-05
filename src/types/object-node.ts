import {IObjectChange, IObjectWillChange, isObservable, action} from "mobx"
import {Node, maybeNode, getNode, valueToSnapshot, getRelativePath} from "../core/node"
import {invariant, isSerializable, fail, registerEventHandler, IDisposer, identity, extend} from "../utils"
import {escapeJsonPath, IJsonPatch} from "../core/json-patch"
import {ModelFactory, primitiveFactory} from "../core/factories"
import {IActionCall, IActionHandler, applyActionLocally} from "../core/action"

export class ObjectNode extends Node {
    readonly actionSubscribers: IActionHandler[] = [];
    readonly submodelType: {
        [key: string]: ModelFactory;
    } = {}
    _isRunningAction = false

    getChildNodes(): [string, Node][] {
        const res: [string, Node][] = []
        for (let key in this.state)
            maybeNode(this.state[key], node => res.push([key, node]))
        return res
    }

    getChildNode(key): Node {
        return maybeNode(this.state[key], identity, () => fail(`Illegal state, no node for "${key}"`))
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

    applyPatchLocally(subpath, patch): void {
        // TODO: confusing that subpath should be used instead of patch, just clone the patch for simplicity?
        // works for both replace and add, remove is not a case in mobx-state-tree ATM
        // note that there is no clever merge going on, stuff is fully replaced instead. Would that be nice, or just confusing?
        invariant(patch.op === "replace" || patch.op === "add")
        invariant(isObservable(this.state, subpath), `Not an observable key: '${subpath}' in '${this.path}'`)
        this.state[subpath] = patch.value // takes care of further deserialization
    }

    applyAction(action: IActionCall) {
        const node = this.resolve(action.path || "")
        if (node instanceof ObjectNode)
            return applyActionLocally(node, action)
        return fail(`Invalid action path: ${action.path || ""}`)
    }

    emitAction(instance: ObjectNode, action: IActionCall, next) {
        let idx = -1
        const correctedAction: IActionCall = this.actionSubscribers.length
            ? extend({}, action, { path: getRelativePath(this, instance) })
            : null
        let n = () => { // TODO: use tail recursion / trampoline
            idx++
            if (idx < this.actionSubscribers.length) {
                this.actionSubscribers[idx](correctedAction!, n)
            } else {
                const parent = findEnclosingObjectNode(this)
                if (parent)
                    parent.emitAction(instance, action, next) // TODO correct path
                else
                    next()
            }
        }
        n()
    }

    @action applySnapshot(snapshot): void {
        // TODO: make a smart deep merge, that recycles object nodes & instances
        extend(this.state, snapshot)
    }

    getChildFactory(key: string): ModelFactory {
        return this.submodelType[key] || primitiveFactory
    }

    onAction(listener: (action: IActionCall, next: () => void) => void): IDisposer {
        return registerEventHandler(this.actionSubscribers, listener)
    }

    isRunningAction(): boolean {
        if (this._isRunningAction)
            return true
        if (this.isRoot)
            return false
        return this.parent!.isRunningAction()
    }
}

export function getObjectNode(thing: any): ObjectNode {
    const node = getNode(thing)
    // TODO: no instanceof, better message
    invariant(node instanceof ObjectNode, "Expected object node")
    return node as ObjectNode
}

/**
 * Returns first parent of the provided node that is an object node, or null
 */
export function findEnclosingObjectNode(thing: Node): ObjectNode | null {
    let parent: Node | null = thing
    while (parent = parent.parent)
        if (parent instanceof ObjectNode)
            return parent
    return null
}
