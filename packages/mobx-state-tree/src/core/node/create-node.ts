import {
    isStateTreeNode,
    INode,
    identity,
    noop,
    fail,
    ObjectNode,
    ScalarNode,
    IType
} from "../../internal"

// TODO: split into object and scalar node?
export function createNode<S, T>(
    type: IType<S, T>,
    parent: ObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: any,
    createNewInstance: (initialValue: any) => T = identity,
    finalizeNewInstance: (node: INode, initialValue: any) => void = noop
) {
    if (isStateTreeNode(initialValue)) {
        const targetNode = initialValue.$treenode as ObjectNode
        if (!targetNode.isRoot)
            fail(
                `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent
                    ? parent.path
                    : ""}/${subpath}', but it lives already at '${targetNode.path}'`
            )
        targetNode.setParent(parent, subpath)
        return targetNode
    }

    const storedValue = createNewInstance(initialValue)

    if (type.shouldAttachNode) {
        const node = new ObjectNode(
            type,
            parent,
            subpath,
            environment,
            initialValue,
            storedValue,
            type.shouldAttachNode,
            finalizeNewInstance
        )
        node.finalizeCreation()
        return node
    }
    return new ScalarNode(
        type,
        parent,
        subpath,
        environment,
        initialValue,
        storedValue,
        type.shouldAttachNode,
        finalizeNewInstance
    )
}

export function isNode(value: any): value is INode {
    return value instanceof ScalarNode || value instanceof ObjectNode
}
