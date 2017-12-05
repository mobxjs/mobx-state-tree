import { IType, fail, ObjectNode, splitJsonPath, joinJsonPath } from "../../internal"

export enum NodeLifeCycle {
    INITIALIZING, // setting up
    CREATED, // afterCreate has run
    FINALIZED, // afterAttach has run
    DETACHING, // being detached from the tree
    DEAD // no coming back from this one
}

export interface INode {
    readonly type: IType<any, any>
    readonly storedValue: any
    readonly path: string
    readonly isRoot: boolean
    readonly parent: ObjectNode | null
    readonly root: ObjectNode
    readonly _environment: any
    subpath: string

    isAlive: boolean
    readonly value: any
    readonly snapshot: any

    assertAlive(): void
    setParent(newParent: ObjectNode | null, subpath?: string | null): void
    die(): void
}

export type IStateTreeNode = {
    readonly $treenode?: any
}

/**
 * Returns true if the given value is a node in a state tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IStateTreeNode}
 */
export function isStateTreeNode(value: any): value is IStateTreeNode {
    return !!(value && value.$treenode)
}

export function getStateTreeNode(value: IStateTreeNode): ObjectNode {
    if (isStateTreeNode(value)) return value.$treenode!
    else return fail(`Value ${value} is no MST Node`)
}

export function canAttachNode(value: any) {
    return (
        value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !isStateTreeNode(value) &&
        !Object.isFrozen(value)
    )
}

export function toJSON(this: IStateTreeNode) {
    return getStateTreeNode(this).snapshot
}

export function getRelativePathBetweenNodes(base: ObjectNode, target: ObjectNode): string {
    // PRE condition target is (a child of) base!
    if (base.root !== target.root)
        fail(
            `Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`
        )

    const baseParts = splitJsonPath(base.path)
    const targetParts = splitJsonPath(target.path)
    let common = 0
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common]) break
    }
    // TODO: assert that no targetParts paths are "..", "." or ""!
    return (
        baseParts
            .slice(common)
            .map(_ => "..")
            .join("/") + joinJsonPath(targetParts.slice(common))
    )
}

export function resolveNodeByPath(base: ObjectNode, pathParts: string): INode
export function resolveNodeByPath(
    base: ObjectNode,
    pathParts: string,
    failIfResolveFails: boolean
): INode | undefined
export function resolveNodeByPath(
    base: ObjectNode,
    path: string,
    failIfResolveFails: boolean = true
): INode | undefined {
    return resolveNodeByPathParts(base, splitJsonPath(path), failIfResolveFails)
}

export function resolveNodeByPathParts(base: ObjectNode, pathParts: string[]): INode
export function resolveNodeByPathParts(
    base: ObjectNode,
    pathParts: string[],
    failIfResolveFails: boolean
): INode | undefined
export function resolveNodeByPathParts(
    base: ObjectNode,
    pathParts: string[],
    failIfResolveFails: boolean = true
): INode | undefined {
    // counter part of getRelativePath
    // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
    // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
    // so we treat leading ../ apart...
    let current: INode | null = base
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === "") current = current!.root
        else if (pathParts[i] === "..") current = current!.parent
        else if (pathParts[i] === "." || pathParts[i] === "")
            // '/bla' or 'a//b' splits to empty strings
            continue
        else if (current) {
            if (current instanceof ObjectNode) current = current.getChildNode(pathParts[i])
            else return fail(`Illegal state`)
            continue
        }

        if (!current) {
            if (failIfResolveFails)
                return fail(
                    `Could not resolve '${pathParts[i]}' in '${joinJsonPath(
                        pathParts.slice(0, i - 1)
                    )}', path of the patch does not resolve`
                )
            else return undefined
        }
    }
    return current!
}
