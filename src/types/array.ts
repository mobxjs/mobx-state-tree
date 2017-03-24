import { createDefaultValueFactory } from './with-default';
import {observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe} from "mobx"
import { applySnapshot } from "../top-level-api"
import { MSTAdminisration, maybeMST, valueToSnapshot, getMST, IJsonPatch, getType, IMSTNode, ComplexType, IType, isType } from "../core"
import {identity, nothing, invariant} from "../utils"
import {getIdentifierAttribute} from "./object"

export class ArrayType<T> extends ComplexType<T[], IObservableArray<T>> {
    isArrayFactory = true
    subType: IType<any, any> // TODO: type

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return this.subType.describe() + "[]"
    }

    createNewInstance() {
        return observable.shallowArray()
    }

    finalizeNewInstance(instance: IObservableArray<any>, snapshot: any) {
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
        getMST(instance).applySnapshot(snapshot)
    }

    getChildMSTs(_: MSTAdminisration, target: IObservableArray<any>): [string, MSTAdminisration][] {
        const res: [string, MSTAdminisration][] = []
        target.forEach((value, index) => {
            maybeMST(value, node => { res.push(["" + index, node])})
        })
        return res
    }

    getChildMST(node: MSTAdminisration, target: IObservableArray<any>, key: string): MSTAdminisration | null {
        const index = parseInt(key, 10)
        if (index < target.length)
            return maybeMST(target[index], identity, nothing)
        return null
    }

    willChange = (change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null => {
        // TODO: verify type
                // TODO check type
        // TODO: check if tree is editable
        // TODO: check for key duplication
        const node = getMST(change.object)
        switch (change.type) {
            case "update":
                const {newValue} = change
                const oldValue = change.object[change.index]
                if (newValue === oldValue)
                    return null
                change.newValue = node.prepareChild("" + change.index, newValue)
                break
            case "splice":
                change.object.slice(change.index, change.removedCount).forEach(oldValue => {
                    maybeMST(oldValue, adm => adm.setParent(null))
                })
                change.added = change.added.map((newValue, pos) => {
                    return node.prepareChild("" + (change.index + pos), newValue)
                })
                break
        }
        return change
    }

    serialize(node: MSTAdminisration, target: IObservableArray<any>): any {
        return target.map(valueToSnapshot)
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getMST(change.object)
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "/" + change.index,
                    value: valueToSnapshot(change.newValue)
                }, node)
            case "splice":
                for (let i = change.index + change.removedCount - 1; i >= change.index; i--)
                    node.emitPatch({
                        op: "remove",
                        path: "/" + i
                    }, node)
                for (let i = 0; i < change.addedCount; i++)
                    node.emitPatch({
                        op: "add",
                        path: "/" + (change.index + i),
                        value: valueToSnapshot(change.added[i])
                    }, node)
                return
        }
    }

    applyPatchLocally(node: MSTAdminisration, target: IObservableArray<any>, subpath: string, patch: IJsonPatch): void {
        const index = subpath === "-" ? target.length : parseInt(subpath)
        switch (patch.op) {
            case "replace":
                target[index] = patch.value
                break
            case "add":
                target.splice(index, 0, patch.value)
                break
            case "remove":
                target.splice(index, 1)
                break
        }
    }

    @action applySnapshot(node: MSTAdminisration, target: IObservableArray<any>, snapshot: any[]): void {
        const identifierAttr = getIdentifierAttribute(this.subType)
        if (identifierAttr)
            target.replace(reconcileArrayItems(identifierAttr, target, snapshot, this.subType))
        else
            target.replace(snapshot)
    }

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(snapshot: any) {
        return Array.isArray(snapshot) && snapshot.every(item => this.subType.is(item))
    }

    getDefaultSnapshot() {
        return []
    }
}

function reconcileArrayItems(identifierAttr: string, target: IObservableArray<any>, snapshot: any[], factory: IType<any, any>): any[] {
    const current: any = {}
    target.forEach(item => {
        const id = item[identifierAttr]
        invariant(!current[id], `Identifier '${id}' (of ${getMST(item).path}) is not unique!`)
        current[id] = item
    })
    return snapshot.map(item => {
        const existing = current[item[identifierAttr]]
        if (existing && getType(existing).is(item)) {
            applySnapshot(existing, item)
            return existing
        } else {
            return factory.create(item)
        }
    })
}

export function createArrayFactory<S, T>(subtype: IType<S, T>): IType<S[], IObservableArray<T> & IMSTNode> {
    return createDefaultValueFactory(new ArrayType(subtype.name + "[]", subtype), [])
}

export function isArrayFactory(type: any): boolean {
    return isType(type) && (type as any).isArrayFactory === true
}
