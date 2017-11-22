export function createNode<S, T>(
    type: IType<S, T>,
    parent: INode | null,
    subpath: string,
    environment: any,
    initialValue: any,
    createNewInstance: (initialValue: any) => T = identity,
    finalizeNewInstance: (node: INode, initialValue: any) => void = noop
) {
    if (isStateTreeNode(initialValue)) {
        const targetNode = getStateTreeNode(initialValue)
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
    const canAttachTreeNode = canAttachNode(storedValue)

    if (canAttachTreeNode) {
        // tslint:disable-next-line:no_unused-variable
        return new ObjectNode(
            type,
            parent,
            subpath,
            environment,
            initialValue,
            storedValue,
            canAttachTreeNode,
            finalizeNewInstance
        )
    }
    return new ScalarNode(
        type,
        parent,
        subpath,
        environment,
        initialValue,
        storedValue,
        canAttachTreeNode,
        finalizeNewInstance
    )
}

export function isNode(value: any): value is INode {
    return value instanceof ScalarNode || value instanceof ObjectNode
}

import { canAttachNode, isStateTreeNode, getStateTreeNode, INode } from "./node-utils"
import { identity, noop, fail } from "../../utils"
import { ObjectNode } from "./object-node"
import { ScalarNode } from "./scalar-node"
import { IType } from "../type"
