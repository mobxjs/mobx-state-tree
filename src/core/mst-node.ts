import { Type, IType, typecheck } from "./type"
import {IJsonPatch, joinJsonPath} from "../core/json-patch"

export type IMSTNode = {
    $treenode: MSTAdminisration
} & Object

export function getType(object: IMSTNode): IType<any, any> {
    return getMST(object).type
}

export function getChildType(object: IMSTNode, child: string): IType<any, any> {
    return getMST(object).getChildType(child)
}

export function hasMST(value: any): value is IMSTNode {
    return value && value.$treenode
}

export function isMST(model: any): model is IMSTNode {
    return hasMST(model)
}

export function getMST(value: any): MSTAdminisration {
    if (hasMST(value))
        return value.$treenode
    else
        return fail("element has no Node")

}

/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export function maybeMST<T, R>(value: T & IMSTNode, asNodeCb: (node: MSTAdminisration, value: T) => R, asPrimitiveCb?: (value: T) => R): R {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (isMutable(value)) {
        const n = getMST(value)
        return asNodeCb(n, n.target)
    } else if (asPrimitiveCb) {
        return asPrimitiveCb(value)
    } else {
        return value as any as R
    }
}


export function getPath(thing: IMSTNode): string {
    return getMST(thing).path
}

export function getRelativePath(base: MSTAdminisration, target: MSTAdminisration): string {
    // PRE condition target is (a child of) base!
    invariant(
        base.root === target.root,
        `Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`
    )
    const baseParts = base.pathParts
    const targetParts = target.pathParts
    let common = 0
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common])
            break
    }
    return joinJsonPath(
        baseParts
        .slice(common).map(_ => "..")
        .concat(
            targetParts.slice(common)
        )
    )
}

export function getParent(thing: IMSTNode): IMSTNode {
    const node = getMST(thing)
    return node.parent ? node.parent.target : null
}

export function valueToSnapshot(thing: any) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        }
    }
    if (hasMST(thing))
        return getMST(thing).snapshot
    if (isSerializable(thing))
        return thing
    fail("Unable to convert value to snapshot.")
}

import { MSTAdminisration } from "./mst-node-administration"
import { invariant, isMutable, isSerializable, fail } from "../utils"
