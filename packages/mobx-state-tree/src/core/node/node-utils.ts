import {
    fail,
    ObjectNode,
    splitJsonPath,
    joinJsonPath,
    ScalarNode,
    IChildNodesMap,
    EMPTY_ARRAY,
    AnyObjectNode,
    AnyNode,
    Omit
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export enum NodeLifeCycle {
    INITIALIZING, // setting up
    CREATED, // afterCreate has run
    FINALIZED, // afterAttach has run
    DETACHING, // being detached from the tree
    DEAD // no coming back from this one
}

/** @hidden */
declare const $stateTreeNodeTypes: unique symbol

/**
 * Common interface that represents a node instance.
 * @hidden
 */
export interface IStateTreeNode<C = any, S = any> {
    /**
     * @internal
     */
    readonly $treenode?: any

    // fake, will never be present, just for typing
    // we use this weird trick to allow reference types to work
    readonly [$stateTreeNodeTypes]?: [C, S] | [any, any]
}

/** @hidden */
export type RedefineIStateTreeNode<T, STN extends IAnyStateTreeNode> = T extends IAnyStateTreeNode
    ? Omit<T, typeof $stateTreeNodeTypes> & STN
    : T

/** @hidden */
export type ExtractNodeC<T> = T extends IStateTreeNode<infer C, any> ? C : never

/** @hidden */
export type ExtractNodeS<T> = T extends IStateTreeNode<any, infer S> ? S : never

/**
 * Represents any state tree node instance.
 * @hidden
 */
export interface IAnyStateTreeNode extends IStateTreeNode<any, any> {}

/**
 * Returns true if the given value is a node in a state tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @param value
 * @returns true if the value is a state tree node.
 */
export function isStateTreeNode<C = any, S = any>(value: any): value is IStateTreeNode<C, S> {
    return !!(value && value.$treenode)
}

/**
 * @internal
 * @hidden
 */
export function assertIsStateTreeNode(value: IAnyStateTreeNode, argNumber: number): void {
    if (process.env.NODE_ENV !== "production") {
        if (!isStateTreeNode(value)) {
            // istanbul ignore next
            throw fail(
                `expected a mobx-state-tree node as argument ${argNumber}, got ${value} instead`
            )
        }
    }
}

/**
 * @internal
 * @hidden
 */
export function getStateTreeNode(value: IAnyStateTreeNode): AnyObjectNode {
    if (!isStateTreeNode(value)) {
        // istanbul ignore next
        throw fail(`Value ${value} is no MST Node`)
    }
    return value.$treenode!
}

/**
 * @internal
 * @hidden
 */
export function getStateTreeNodeSafe(value: IAnyStateTreeNode): AnyObjectNode | null {
    return (value && value.$treenode) || null
}

/**
 * @internal
 * @hidden
 */
export function toJSON<S>(this: IStateTreeNode<any, S>): S {
    return getStateTreeNode(this).snapshot
}

const doubleDot = (_: any) => ".."

/**
 * @internal
 * @hidden
 */
export function getRelativePathBetweenNodes(base: AnyObjectNode, target: AnyObjectNode): string {
    // PRE condition target is (a child of) base!
    if (base.root !== target.root) {
        throw fail(
            `Cannot calculate relative path: objects '${base}' and '${target}' are not part of the same object tree`
        )
    }

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
            .map(doubleDot)
            .join("/") + joinJsonPath(targetParts.slice(common))
    )
}

/**
 * @internal
 * @hidden
 */
export function resolveNodeByPath(
    base: AnyObjectNode,
    path: string,
    failIfResolveFails: boolean = true
): AnyNode | undefined {
    return resolveNodeByPathParts(base, splitJsonPath(path), failIfResolveFails)
}

/**
 * @internal
 * @hidden
 */
export function resolveNodeByPathParts(
    base: AnyObjectNode,
    pathParts: string[],
    failIfResolveFails: boolean = true
): AnyNode | undefined {
    let current: AnyNode | null = base

    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]
        if (part === "..") {
            current = current!.parent
            if (current) continue // not everything has a parent
        } else if (part === ".") {
            continue
        } else if (current) {
            if (current instanceof ScalarNode) {
                // check if the value of a scalar resolves to a state tree node (e.g. references)
                // then we can continue resolving...
                try {
                    const value: any = current.value
                    if (isStateTreeNode(value)) {
                        current = getStateTreeNode(value)
                        // fall through
                    }
                } catch (e) {
                    if (!failIfResolveFails) {
                        return undefined
                    }
                    throw e
                }
            }
            if (current instanceof ObjectNode) {
                const subType = current.getChildType(part)
                if (subType) {
                    current = current.getChildNode(part)
                    if (current) continue
                }
            }
        }
        if (failIfResolveFails)
            throw fail(
                `Could not resolve '${part}' in path '${joinJsonPath(pathParts.slice(0, i)) ||
                    "/"}' while resolving '${joinJsonPath(pathParts)}'`
            )
        else return undefined
    }
    return current!
}

/**
 * @internal
 * @hidden
 */
export function convertChildNodesToArray(childNodes: IChildNodesMap | null): AnyNode[] {
    if (!childNodes) return EMPTY_ARRAY as AnyNode[]

    const keys = Object.keys(childNodes)
    if (!keys.length) return EMPTY_ARRAY as AnyNode[]

    const result = new Array(keys.length) as AnyNode[]
    keys.forEach((key, index) => {
        result[index] = childNodes![key]
    })
    return result
}
