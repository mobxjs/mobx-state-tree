import { action } from "mobx"
import { IType, Type, typecheck } from "./type"

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
    abstract applySnapshot(node: MSTAdminisration, target: any, snapshot: any): void
    abstract getDefaultSnapshot(): any
    abstract getChildMSTs(node: MSTAdminisration, target: any): [string, MSTAdminisration][]
    abstract getChildMST(node: MSTAdminisration, target: any, key: string): MSTAdminisration | null
    abstract serialize(node: MSTAdminisration, target: any): any
    abstract applyPatchLocally(node: MSTAdminisration, target: any, subpath: string, patch: IJsonPatch): void
    abstract getChildType(key: string): IType<any, any>
    abstract isValidSnapshot(snapshot: any): boolean
    abstract removeChild(node: MSTAdminisration, subpath: string): void

    is(value: any): value is S | (T & IMSTNode) {
        if (!value || typeof value !== "object")
            return false
        if (isMST(value)) {
            if (getType(value) === this)
                return true
            return this.isValidSnapshot(getMST(value).snapshot)
        }
        return this.isValidSnapshot(value)
    }
}

import { IMSTNode, isMST, getType, getMST } from "./mst-node"
import { MSTAdminisration } from "./mst-node-administration"
import { IJsonPatch } from "./json-patch"