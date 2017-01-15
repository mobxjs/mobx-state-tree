import {IModelFactory, createFactory, Type} from "../core/factories"
import {invariant, isPrimitive, extend, fail} from "../utils"
import {Node} from "../core/node"

export class PrimitiveType extends Type {
    name: string
    constructor(name, args) {
        super(name)
        // TODO: support specializations
    }

    createNewInstance() {
        return fail("Nope.")
    }

    applySnapshot() {
        return fail("Nope.")
    }

    getChildNodes() {
        return fail("Nope.")
    }

    getChildNode() {
        return fail("Nope.")
    }

    willChange(node: Node, change): Object | null {
        return fail("Nope.")
    }
    didChange(node: Node, change): void {
        return fail("Nope.")
    }
    serialize(node: Node, target): any {
        return fail("Nope.")
    }
    applyPatchLocally(node: Node, target, subpath: string, patch): void {
        return fail("Nope.")
    }
    getChildFactory(key: string): IModelFactory<any, any> {
        return fail("Nope.")
    }
    is(thing) {
        return isPrimitive(thing)
    }
}

export const primitiveFactory = createFactory(
        "primitive",
        PrimitiveType,
        []
    )
