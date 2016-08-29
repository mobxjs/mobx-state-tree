import {isObservableArray, isObservableMap} from "mobx"
import {Node, NodeType, getNode, asNode} from "../node"
import {isMutable, invariant, isPlainObject} from "../utils"

import {plainObjectHandler} from "./object-handler"

export interface ITypeHandler {
    initialize(target: Node<any>, initialState: any): any
    updatePathOfChildren(state: any, parentPath: string[]): void
    interceptor<T>(change: T): T | null
    observer<T>(change: T): void
    serialize(state): any
    deserialize(target, snapshot): void
    isDeserializableFrom(snapshot): boolean
    applyPatch(state, key, patch): void
    getChild(state, key): Node<any>
}


export function determineNodeType(value): NodeType {
    invariant(!!value, "Cannot convert a falsy value to a state tree")
    invariant(typeof value === "object", "State trees can only be created from objects")
    invariant(!(value instanceof Node))
    // TODO: check if not a Map! or auto convert map?
    if (Array.isArray(value) || isObservableArray(value))
        return NodeType.Array
    if (isPlainObject(value))
        return NodeType.PlainObject
    if (isObservableMap(value))
        return NodeType.Map
    return NodeType.ComplexObject
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

export function snapshotToValue(parent: Node<any>, subpart: string, thing) {
    if (!thing || typeof thing !== "object")
        return thing
    const type: string | undefined = thing.$treetype
    if (type === undefined) {
        const node = asNode(thing, parent, subpart)
        return node.state
    }
    if (type === "Date")
        return new Date(thing.time)
    // TODO: maps & complex objects
}