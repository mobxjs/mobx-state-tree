import { action, reaction } from "mobx"
import { IType, Type } from "../type"
import { addReadOnlyProp, addHiddenFinalProp } from "../../utils"

function toJSON(this: IMSTNode) {
    return getComplexNode(this).snapshot
}

/**
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<S, T> extends Type<S, T> {
    constructor(name: string) {
        super(name)
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any = this.getDefaultSnapshot()): Node {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        // tslint:disable-next-line:no_unused-variable
        const node = new Node(this, parent, subpath, environment, instance)

        addHiddenFinalProp(instance, "$treenode", node)
        // optimization: don't keep the snapshot by default alive with a reaction by default
        // in prod mode. This saves lot of GC overhead (important for e.g. React Native)
        // if the feature is not actively used
        // downside; no structural sharing if getSnapshot is called incidently
        const snapshotDisposer = reaction(() => node.snapshot, snapshot => {
            node.emitSnapshot(snapshot)
        })
        snapshotDisposer.onError((e: any) => {
            throw e
        })
        node.addDisposer(snapshotDisposer)

        let sawException = true
        try {
            node.pseudoAction(() => {
                this.finalizeNewInstance(instance, snapshot)
            })
            addReadOnlyProp(instance, "toJSON", toJSON)
            node.fireHook("afterCreate")
            if (parent)
                node.fireHook("afterAttach")
            sawException = false
            return node
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                (node as any)._isAlive = false
            }
        }
    }

    toSnapshot(node: Node) {
        return this.serialize(node) // TODO: factor out
    }

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: Node, snapshot: any): void
    // TODO: Maybe optional could resolve to this if omitted?
    abstract getDefaultSnapshot(): any
    abstract getChildren(node: Node): Node[]
    abstract getChildNode(node: Node, key: string): Node
    abstract serialize(node: Node): any
    abstract applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract removeChild(node: Node, subpath: string): void
    abstract isValidSnapshot(value: any, context: IContext): IValidationResult

    validate(value: any, context: IContext): IValidationResult {
        if (!value || typeof value !== "object")
            return typeCheckFailure(context, value)
        if (isMST(value)) {
            return getType(value) === this ? typeCheckSuccess() : typeCheckFailure(context, value)
            // it is tempting to compare snapshots, but in that case we should always clone on assignments...
        }
        return this.isValidSnapshot(
            value,
            context
        )
    }
}

export interface IMSTNode {
    readonly $treenode?: Node
}

export function isMST(value: any): value is IMSTNode {
    return value && value.$treenode
}

import { getType, getComplexNode, Node } from "../../core"
import { IJsonPatch } from "../../core/json-patch"
import { IContext, IValidationResult, typeCheckFailure, typeCheckSuccess, getDefaultContext, typecheck } from "../type-checker"
