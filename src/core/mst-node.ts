export interface IMSTNode {
    readonly $treenode?: ComplexNode
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

export function getMSTAdministration(value: any): ComplexNode {
    if (isMST(value))
        return value.$treenode!
    else
        return fail("element has no Node")
}

export function getRelativePathForNodes(base: ComplexNode, target: ComplexNode): string {
    // PRE condition target is (a child of) base!
    if (base.root !== target.root) fail(`Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`)

    const baseParts = splitJsonPath(base.path)
    const targetParts = splitJsonPath(target.path)
    let common = 0
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common])
            break
    }
    // TODO: assert that no targetParts paths are "..", "." or ""!
    return baseParts.slice(common).map(_ => "..").join("/")
        + joinJsonPath(targetParts.slice(common))
}

import { ComplexNode } from "./nodes/complex-node"
import { isMutable, isSerializable, fail } from "../utils"
import { splitJsonPath, joinJsonPath } from "./json-patch"
import { IType } from "../types/type"

