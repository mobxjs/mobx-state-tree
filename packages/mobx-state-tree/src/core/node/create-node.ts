import {
    fail,
    getStateTreeNodeSafe,
    ComplexType,
    SimpleType,
    ParentNode,
    Node,
    nodeOps,
    NodeObj,
    NodeScalar
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export function createObjectNode<C, S, T>(
    type: ComplexType<C, S, T>,
    parent: ParentNode,
    subpath: string,
    environment: any,
    initialValue: C | T
): NodeObj<C, S, T> {
    const existingNode = getStateTreeNodeSafe(initialValue)
    if (existingNode) {
        if (nodeOps.isRoot(existingNode)) {
            nodeOps.setParent(existingNode, parent, subpath)
            return existingNode
        }

        throw fail(
            `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                parent ? nodeOps.getPath(parent) : ""
            }/${subpath}', but it lives already at '${nodeOps.getPath(existingNode)}'`
        )
    }

    // not a node, a snapshot
    return nodeOps.createObjectNode(type, parent, subpath, environment, initialValue as C)
}

/**
 * @internal
 * @hidden
 */
export function createScalarNode<C, S, T>(
    type: SimpleType<C, S, T>,
    parent: ParentNode,
    subpath: string,
    environment: any,
    initialValue: C
): NodeScalar<C, S, T> {
    return nodeOps.createScalarNode(type, parent, subpath, environment, initialValue)
}

/**
 * @internal
 * @hidden
 */
export function isNode(value: any): value is Node {
    return value && typeof value === "object" && value.__isMstNode === true
}
