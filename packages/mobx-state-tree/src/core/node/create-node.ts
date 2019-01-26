import {
    fail,
    ObjectNode,
    ScalarNode,
    AnyNode,
    getStateTreeNodeSafe,
    AnyObjectNode,
    IAnyType,
    ExtractS,
    ExtractT,
    ExtractC
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export function createNode<IT extends IAnyType>(
    type: IT,
    parent: AnyObjectNode | null,
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

        throw fail(
            `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                parent ? parent.path : ""
            }/${subpath}', but it lives already at '${existingNode.path}'`
        )
    }

    if (type.shouldAttachNode) {
        return new ObjectNode<ExtractC<IT>, ExtractS<IT>, ExtractT<IT>>(
            type as any,
            parent,
            subpath,
            environment,
            initialValue
        )
    } else {
        return new ScalarNode<ExtractC<IT>, ExtractS<IT>, ExtractT<IT>>(
            type as any,
            parent,
            subpath,
            environment,
            initialValue
        )
    }
}

/**
 * @internal
 * @hidden
 */
export function isNode(value: any): value is AnyNode {
    return value instanceof ScalarNode || value instanceof ObjectNode
}
