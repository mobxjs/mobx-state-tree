import { INode, fail, ObjectNode, ScalarNode, IType, getStateTreeNodeSafe } from "../../internal"

/** @internal */
export function createNode<C, S, T>(
    type: IType<C, S, T>,
    parent: ObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: any
) {
    const existingNode = getStateTreeNodeSafe(initialValue)
    if (existingNode) {
        if (existingNode.isRoot) {
            existingNode.setParent(parent, subpath)
            return existingNode
        }

        fail(
            `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                parent ? parent.path : ""
            }/${subpath}', but it lives already at '${existingNode.path}'`
        )
    }

    const Node = type.shouldAttachNode ? ObjectNode : ScalarNode
    return new Node(type, parent, subpath, environment, initialValue)
}

/** @internal */
export function isNode(value: any): value is INode {
    return value instanceof ScalarNode || value instanceof ObjectNode
}
