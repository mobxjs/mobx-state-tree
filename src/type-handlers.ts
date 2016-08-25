import {isObservableObject, observable, IObjectChange, IObjectWillChange} from "mobx"
import {NodeType, hasNode, getNode, prepareChild, asNode} from "./node"
import {invariant, isMutable, isSerializable} from "./utils"

export interface ITypeHandler {
    initialize(initialState: any): any
    updatePathOfChildren(state: any, parentPath: string[]): void
    interceptor<T>(change: T): T | null
    observer<T>(change: T): void
    serialize(): any
    deserialize(target, snapshot): void
    isDeserializableFrom(snapshot): boolean
    applyPatch(state, patch): void
}

const plainObjectHandler: ITypeHandler = {
    initialize: value => {
        return isObservableObject(value) ? value : observable(value)
    },

    updatePathOfChildren: (state, parentPath: string[]) => {
        for (let key in state) {
            const value = state[key]
            if (hasNode(value)) {
                value.$treenode.updatePath(parentPath.concat[key])
            }
        }
    },

    serialize: (state) => {
        const res = {}
        for (let key in state) {
            const value = state[key]
            if (!isSerializable(value))
                console.warn(`Encountered unserialize value '${value}' in ${getPath(state)}/${key}`)
            res[key] = getSnapshot(value)
        }
        return res
    },

    deserialize: (state: any, snapshot) => {
        for (let key in snapshot) if (key !== "$treetype") {
            const current = state[key]
            const next = snapshot[key]
            // prefer updating existing compatible nodes
            if (hasNode(current) && asNode(current).typeHandler.isDeserializableFrom(next))
                current.restoreSnapshot(next)
            // cleanup is handled by
            else
                state[key] = snapshotToValue(snapshot[key])
        }
    },

    isDeserializableFrom: (snapshot) => {
        return snapshot && typeof snapshot === "object"
            && snapshot.$treetype === undefined && !Array.isArray(snapshot)
    },

    interceptor: (change: IObjectChange) => {
        const newValue = {change}
        if (newValue === change.oldValue)
            return null
        if (isMutable(newValue))
            return change
        const parent = getNode(change.object)
        if (isMutable(change.oldValue))
            getNode(change.oldValue).setParent(null)
        prepareChild(parent, change.name, newValue)
        return change
    },

    observer: (change: IObjectChange) => {
        const parent = getNode(change.object)
        const patch = "//TODO"
        parent.emitPatch(patch)
    },

    applyPatch: (state, patch) => {

    }

}

export function getTypeHandler(nodeType: NodeType): ITypeHandler {
    switch (nodeType) {
        case NodeType.PlainObject: return plainObjectHandler
        default: throw new Error("Unsupported node type")
    }
}

function getSnapshot(thing) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        }
    }
    if (isMutable(thing))
        return getNode(thing).snapshot
    return thing
}

function snapshotToValue(thing) {
    if (!thing || typeof thing !== "object")
        return thing
    const type: string | undefined = thing.$treetype
    if (type === undefined) {
        const node = asNode(Array.isArray(thing) ? [] : {})
        node.restoreSnapshot(thing)
        return node.state
    }
    if (type === "Date")
        return new Date(thing.time)
    // TODO: maps & complex objects
}