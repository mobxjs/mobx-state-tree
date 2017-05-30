import { AbstractNode } from "./abstract-node"
import { IType } from "../../types/type"
import { ComplexNode } from "./complex-node"
import { EMPTY_ARRAY, fail } from "../../utils"

export class ImmutableNode extends AbstractNode  {
    constructor(
        type: IType<any, any>,
        parent: ComplexNode | null,
        subpath: string,
        value: any
    ) {
        super(type, parent, subpath, value)
    }

    isLeaf() {
        return true
    }

    getChildren(): AbstractNode[] {
        return EMPTY_ARRAY as any
    }

    getChildNode(name: string) {
        return null
    }

    get snapshot() {
        return this.type.toSnapshot(this.storedValue)
    }

    setParent(newParent: ComplexNode, subpath: string): void {
        if (newParent !== this.parent)
            fail("Only complex types can be assigned to a new parent")
        this.subpath = subpath
    }
}
