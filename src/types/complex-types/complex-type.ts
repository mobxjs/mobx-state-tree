import { action } from "mobx"
import { IType, Type, typecheck } from "../type"

/**
 * A complex type produces a MST node (Node in the state tree)
 */
export abstract class ComplexType<S, T> extends Type<S, T> {
    constructor(name: string) {
        super(name)
        this.create = action(this.name, this.create)
    }

    create(snapshot: any = this.getDefaultSnapshot(), environment: any = undefined, parent: MSTAdministration | null = null, subpath: string = "") {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        // tslint:disable-next-line:no_unused-variable
        const node = new MSTAdministration(parent, subpath, instance, this, environment)
        node.pseudoAction(() => {
            this.finalizeNewInstance(instance, snapshot)
        })
        node.fireHook("afterCreate")
        if (parent)
            node.fireHook("afterAttach")
        return instance
    }

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: MSTAdministration, snapshot: any): void
    // TODO: Maybe optional could resolve to this if omitted?
    abstract getDefaultSnapshot(): any
    abstract getChildMSTs(node: MSTAdministration): [string, MSTAdministration][]
    abstract getChildMST(node: MSTAdministration, key: string): MSTAdministration | null
    abstract serialize(node: MSTAdministration): any
    abstract applyPatchLocally(node: MSTAdministration, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract isValidSnapshot(snapshot: any): boolean
    abstract removeChild(node: MSTAdministration, subpath: string): void

    is(value: any): value is S | (T & IMSTNode) {
        if (!value || typeof value !== "object")
            return false
        if (isMST(value)) {
            return getType(value) === this
            // it is tempting to compare snapshots, but in that case we should always clone on assignments...
        }
        return this.isValidSnapshot(value)
    }
}

import { IMSTNode, isMST, getType } from "../../core/mst-node"
import { MSTAdministration } from "../../core/mst-node-administration"
import { IJsonPatch } from "../../core/json-patch"
