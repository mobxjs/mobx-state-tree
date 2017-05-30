import { action } from "mobx"
import { IType, Type } from "../type"
import { addReadOnlyProp } from "../../utils"

function toJSON(this: IMSTNode) {
    return getMSTAdministration(this).snapshot
}

/**
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<S, T> extends Type<S, T> {
    constructor(name: string) {
        super(name)
    }

    instantiate(parent: MSTAdministration | null, subpath: string, environment: any, snapshot: any = this.getDefaultSnapshot()): AbstractNode {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        // tslint:disable-next-line:no_unused-variable
        const node = new MSTAdministration(parent, subpath, instance, this, environment)
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

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: MSTAdministration, snapshot: any): void
    // TODO: Maybe optional could resolve to this if omitted?
    abstract getDefaultSnapshot(): any
    abstract getChildren(node: MSTAdministration): AbstractNode[]
    abstract getChildNode(node: MSTAdministration, key: string): AbstractNode
    abstract serialize(node: MSTAdministration): any
    abstract applyPatchLocally(node: MSTAdministration, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract removeChild(node: MSTAdministration, subpath: string): void
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

import { IMSTNode, isMST, getType, getMSTAdministration, AbstractNode, MSTAdministration } from "../../core"
import { IJsonPatch } from "../../core/json-patch"
import { IContext, IValidationResult, typeCheckFailure, typeCheckSuccess, getDefaultContext, typecheck } from "../type-checker"
