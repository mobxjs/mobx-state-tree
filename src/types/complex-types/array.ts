import { observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe } from "mobx"
import {
    getMSTAdministration,
    IJsonPatch,
    maybeMST,
    MSTAdminisration,
    valueToSnapshot
} from "../../core"
import { identity, nothing } from "../../utils"
import { IType, IComplexType, isType } from "../type"
import { ComplexType } from "./complex-type"
import { createDefaultValueFactory } from "../utility-types/with-default"

export class ArrayType<T> extends ComplexType<T[], IObservableArray<T>> {
    isArrayFactory = true
    subType: IType<any, any>

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
        intercept(instance, change => this.willChange(change) as any)
        observe(instance, this.didChange)
        getMSTAdministration(instance).applySnapshot(snapshot)
    }

    getChildMSTs(node: MSTAdminisration): [string, MSTAdminisration][] {
        const target = node.target as IObservableArray<any>
        const res: [string, MSTAdminisration][] = []
        target.forEach((value, index) => {
            maybeMST(value, childNode => { res.push(["" + index, childNode])})
        })
        return res
    }

    getChildMST(node: MSTAdminisration, key: string): MSTAdminisration | null {
        const target = node.target as IObservableArray<any>
        const index = parseInt(key, 10)
        if (index < target.length)
            return maybeMST(target[index], identity, nothing)
        return null
    }

    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getMSTAdministration(change.object)
        node.assertWritable()

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index])
                    return null
                change.newValue = node.reconcileChildren(this.subType, [change.object[change.index]], [change.newValue], [change.index])[0]
                break
            case "splice":
                const {index, removedCount, added, object} = change
                change.added = node.reconcileChildren(
                    this.subType,
                    object.slice(index, index + removedCount),
                    added,
                    added.map((_, i) => index + i)
                )

                // update paths of remaining items
                for (let i = index + removedCount; i < object.length; i++) {
                    maybeMST(object[i], child => {
                        child.setParent(node, "" + (i + added.length - removedCount))
                    })
                }
                break
        }
        return change
    }

    serialize(node: MSTAdminisration): any {
        const target = node.target as IObservableArray<any>
        return target.map(valueToSnapshot)
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getMSTAdministration(change.object)
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "" + change.index,
                    value: valueToSnapshot(change.newValue)
                }, node)
            case "splice":
                for (let i = change.index + change.removedCount - 1; i >= change.index; i--)
                    node.emitPatch({
                        op: "remove",
                        path: "" + i
                    }, node)
                for (let i = 0; i < change.addedCount; i++)
                    node.emitPatch({
                        op: "add",
                        path: "" + (change.index + i),
                        value: valueToSnapshot(change.added[i])
                    }, node)
                return
        }
    }

    applyPatchLocally(node: MSTAdminisration, subpath: string, patch: IJsonPatch): void {
        const target = node.target as IObservableArray<any>
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

    @action applySnapshot(node: MSTAdminisration, snapshot: any[]): void {
        const target = node.target as IObservableArray<any>
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

    removeChild(node: MSTAdminisration, subpath: string) {
        node.target.splice(parseInt(subpath, 10), 1)
    }
}

export function createArrayFactory<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
    return createDefaultValueFactory(new ArrayType(subtype.name + "[]", subtype), [])
}

export function isArrayFactory<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>> {
    return isType(type) && (type as any).isArrayFactory === true
}
