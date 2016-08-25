import {Node, NodeType, getNode, asNode} from "../node"
import {isMutable} from "../utils"

import {plainObjectHandler} from "./object-handler"

export interface ITypeHandler {
    initialize(initialState: any): any
    updatePathOfChildren(state: any, parentPath: string[]): void
    interceptor<T>(change: T): T | null
    observer<T>(change: T): void
    serialize(state): any
    deserialize(target, snapshot): void
    isDeserializableFrom(snapshot): boolean
    applyPatch(state, key, patch): void
    getChild(state, key): Node<any>
}

export function getTypeHandler(nodeType: NodeType): ITypeHandler {
    switch (nodeType) {
        case NodeType.PlainObject: return plainObjectHandler
        default: throw new Error("Unsupported node type")
    }
}

export function valueToSnapshot(thing) {
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

export function snapshotToValue(thing) {
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