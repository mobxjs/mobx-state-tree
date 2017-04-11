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

    create(snapshot: any = this.getDefaultSnapshot()) {
        typecheck(this, snapshot)
        const instance = this.createNewInstance()
        // tslint:disable-next-line:no_unused-variable
        const node = new MSTAdminisration(instance, this)
        this.finalizeNewInstance(instance, snapshot)
        Object.seal(instance)
        return instance
    }

    abstract createNewInstance(): any
    abstract finalizeNewInstance(target: any, snapshot: any): void
    abstract applySnapshot(node: MSTAdminisration, snapshot: any): void
    abstract getDefaultSnapshot(): any
    abstract getChildMSTs(node: MSTAdminisration): [string, MSTAdminisration][]
    abstract getChildMST(node: MSTAdminisration, key: string): MSTAdminisration | null
    abstract serialize(node: MSTAdminisration): any
    abstract applyPatchLocally(node: MSTAdminisration, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract isValidSnapshot(snapshot: any): boolean
    abstract removeChild(node: MSTAdminisration, subpath: string): void

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
import { MSTAdminisration } from "../../core/mst-node-administration"
import { IJsonPatch } from "../../core/json-patch"
