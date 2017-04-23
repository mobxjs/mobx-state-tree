import { IType } from "../types/type"

export interface IMSTNode {
    readonly $treenode?: MSTAdministration
}

export function getType<S, T>(object: IMSTNode): IType<S, T> {
    return getMSTAdministration(object).type
}

export function getChildType(object: IMSTNode, child: string): IType<any, any> {
    return getMSTAdministration(object).getChildType(child)
}

export function isMST(value: any): value is IMSTNode {
    return value && value.$treenode
}

export function getMSTAdministration(value: any): MSTAdministration {
    if (isMST(value))
        return value.$treenode!
    else
        return fail("element has no Node")
}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks, or the original value if the second callback is omitted
 */
export function maybeMST<T, R>(value: T & IMSTNode, asNodeCb: (node: MSTAdministration, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (isMutable(value) && isMST(value)) {
        const n = getMSTAdministration(value)
        return asNodeCb(n, n.target)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}

export function valueToSnapshot(thing: any) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        }
    }
    if (isMST(thing))
        return getMSTAdministration(thing).snapshot
    if (isSerializable(thing))
        return thing
    fail("Unable to convert value to snapshot.")
}

import { MSTAdministration } from "./mst-node-administration"
import { isMutable, isSerializable, fail } from "../utils"
