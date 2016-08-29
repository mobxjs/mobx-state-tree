import {isObservableObject, observable, IObjectChange, IObjectWillChange} from "mobx"
import {NodeType, hasNode, getNode, maybeNode, initializeNode, prepareChild, asNode, getPath} from "../node"
import {invariant, isMutable, isSerializable, fail} from "../utils"
import {ITypeHandler, snapshotToValue, valueToSnapshot} from "./type-handlers"
import {escapeJsonPath, unescapeJsonPath} from "../json-patch"

export const plainObjectHandler: ITypeHandler = {
    initialize: (node, value) => {
        // make observable (probably already is)
        const res = isObservableObject(value) ? value : observable(value)
        for (let key in res)
            res[key] = maybeNode(res[key], childNode => childNode.setParent(node, key))
        return res
    },

    updatePathOfChildren: (state, parentPath: string[]) => {
        for (let key in state)
            maybeNode(state[key], node => node.updatePath(parentPath.concat(key)))
    },

    serialize: (state) => {
        const res = {}
        for (let key in state) {
            const value = state[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${getPath(state)}/${key}`)
            res[key] = valueToSnapshot(value)
        }
        return res
    },

    deserialize: (state: any, snapshot) => {
        for (let key in snapshot) if (key !== "$treetype")
            applySnapshotToObject(state, key, snapshot[key])
    },

    isDeserializableFrom: (snapshot) => {
        return snapshot && typeof snapshot === "object"
            && snapshot.$treetype === undefined && !Array.isArray(snapshot)
    },

    interceptor: (change: IObjectChange) => {
        const {newValue} = change
        if (newValue === change.oldValue)
            return null
        maybeNode(change.oldValue, adm => adm.setParent(null))
        maybeNode(newValue, () => {
            const parent = getNode(change.object)
            change.newValue = prepareChild(parent, change.name, newValue)
        })
        return change
    },

    observer: (change: IObjectChange) => {
        const parent = getNode(change.object)
        switch (change.type) {
            case "update": return void parent.emitPatch({
                op: "replace",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, parent)
            case "add": return void parent.emitPatch({
                op: "add",
                path: "/" + escapeJsonPath(change.name),
                value: valueToSnapshot(change.newValue)
            }, parent)
        }
    },

    applyPatch: (state, key, patch) => {
        // works for both replace and add, remove is not a case in mobx-state-tree ATM
        invariant(patch.op === "replace" || patch.op === "add")
        applySnapshotToObject(state, key, patch.value)
    },

    getChild: (state, name) => {
        // TODO: better error handling
        return asNode(state[name])
    }
}

function applySnapshotToObject(target, key, snapshot) {
    const current = target[key]
    // prefer updating existing compatible nodes
    if (hasNode(current) && asNode(current).typeHandler.isDeserializableFrom(snapshot))
        current.restoreSnapshot(snapshot)
    else
        target[key] = snapshotToValue(snapshot)
}
