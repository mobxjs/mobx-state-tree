import { observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe } from "mobx"
import {
    applySnapshot,
    getMSTAdministration,
    getType,
    IJsonPatch,
    isMST,
    maybeMST,
    MSTAdminisration,
    valueToSnapshot,
    hasParent,
    getPath
} from '../../core';
import { identity, invariant, fail, isMutable, nothing } from '../../utils';
import { IType, IComplexType, isType, typecheck } from "../type"
import { ComplexType } from "./complex-type"
import { getIdentifierAttribute } from "./object"
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
        intercept(instance, this.willChange as any)
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

    willChange = (change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null => {
        const node = getMSTAdministration(change.object)
        node.assertWritable()

        switch (change.type) {
            case "update":
                change.newValue = reconcileChildren(node, this.subType, [change.object[change.index]], [change.newValue], [change.index])[0]
                break
            case "splice":
                const {index, removedCount, added, object} = change
                change.added = reconcileChildren(
                    node,
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

/**
 * This function reconciles array items, given a splice. Example:
 *
 * Orig array:    [ a a b c]
 *                     ^
 *                    [ d d d ], delete 'b'
 * Splice:        index: 2, remove 1, add 3
 *
 * Reconciled     [ a a b - - c ]
 *                  | | |     |
 *                  v v v + + v
 * To:            [ a a d d d c]
 *
 */
function reconcileUnkeyedArrayItems(node: MSTAdminisration, target: IObservableArray<any>, subtype: IType<any, any>, index: number, added: any[], removedCount: number) {
    // TODO: improved reconcilation: see if the items being spliced in are part of the deleted set

    // possible optimization: loops instead of splice / map
    const reconcilableCount = Math.min(removedCount, added.length)

    // remove items that won't be reconciled...
    if (removedCount > reconcilableCount) {
        target.slice(index + reconcilableCount, index + removedCount).forEach(oldValue => {
            maybeMST(oldValue, adm => adm.setParent(null)) // TODO: or just die
        })
    }
    // give new indexes to items that will be pushed forward / backward..
    const delta = added.length - removedCount
    target.slice(index + removedCount).forEach((oldValue, idx) => {
        maybeMST(oldValue, adm => adm.setParent(node, "" + (index + removedCount + idx + delta)))
    })

    // reconcile + create new items for the new ones
    const reconciled = added.slice(0, reconcilableCount).map((newValue, pos) =>
        node.prepareChild("" + (index + pos), newValue)
    )
    // for new items, don't reconcile items currently at that position
    const created = added.slice(reconcilableCount).map((newValue, pos) =>
        node.prepareChild("" + (index + pos + reconcilableCount), newValue, false)
    )
    return reconciled.concat(created)
}

function reconcileKeyedArrayItems(node: MSTAdminisration, target: IObservableArray<any>, subtype: IType<any, any>, identifierAttr: string, index: number, added: any[], removedCount: number) {
    // possible optimization: loops instead of splice / map
    const currentItems: { [key: string]: MSTAdminisration } = {} // Optimization: cache this in the future
    target.forEach(item => {
        const id = item[identifierAttr]
        if (currentItems[id])
            fail(`Duplicate key ${id} in array '${node.path}'`)
        currentItems[id] = getMSTAdministration(item)
    })

    const itemsToBeRemoved: { [key: string]: MSTAdminisration } = {}
    target.slice(index, removedCount).forEach(item => {
        itemsToBeRemoved[item[identifierAttr]] = getMSTAdministration(item)
    })

    // check if we are not adding items which are already in the tree
    const newItems = added.map((item, idx) => {
        const id = item[identifierAttr]
        const reconcilableNode = itemsToBeRemoved[id]
        if (reconcilableNode) {
            // try to reconcile if possible
            // note that we are reconciling on maybe the wrong position, but the correct node
            const updatedItem = node.prepareChild(reconcilableNode.subpath, item)
            // update the path of the reconciled node
            getMSTAdministration(updatedItem).setParent(node, "" + (index + idx))
            return updatedItem
        } else if (id in currentItems) {
            // the id was not in the to-be-removed collection, but it is in the array
            return fail(`Cannot add item with id '${id}' to the tree, it already exists in the array '${node.path}'`)
        } else {
            // create a new node
            return node.prepareChild("" + (index + idx), item, false)
        }
    })

    // update path of remaining items
    const delta = added.length - removedCount
    target.slice(index + removedCount).forEach((item, idx) => {
        getMSTAdministration(item).setParent(node, "" + (index + removedCount + idx + delta))
    })

    return newItems
}

function reconcileChildren(parent: MSTAdminisration, childType: IType<any, any>, oldValues: any[], newValues: any[], newPaths: (string|number)[]): any {
    const res = new Array(newValues.length)
    const oldValuesByNode: any = {}
    const oldValuesById: any = {}
    const identifierAttribute = getIdentifierAttribute(childType)

    // Investigate which values we could reconcile
    oldValues.forEach(oldValue => {
        if (identifierAttribute) {
            const id = oldValue[identifierAttribute]
            if (id)
                oldValuesById[id] = oldValue
        }
        if (isMST(oldValue)) {
            oldValuesByNode[getMSTAdministration(oldValue).nodeId] = oldValue
        }
    })

    // Prepare new values, try to reconcile
    newValues.forEach((newValue, index) => {
        const subPath = "" + newPaths[index]
        if (isMST(newValue)) {
            const childNode = getMSTAdministration(newValue)
            childNode.assertAlive()
            if (childNode.parent && (childNode.parent !== parent || !oldValuesByNode[childNode.nodeId]))
                return fail(`Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent.path}/${subPath}', but it lives already at '${getPath(newValue)}'`)

            // Try to reconcile based on already existing nodes
            oldValuesByNode[childNode.nodeId] = undefined
            childNode.setParent(parent, subPath)
            res[index] = newValue
        } else if (identifierAttribute && isMutable(newValue)) {
            typecheck(childType, newValue)

            // Try to reconcile based on id
            const id = newValue[identifierAttribute]
            const existing = oldValuesById[id]
            if (existing) {
                const childNode = getMSTAdministration(existing)
                oldValuesByNode[childNode.nodeId] = undefined
                childNode.setParent(parent, subPath)
                childNode.applySnapshot(newValue)
                res[index] = existing
            } else {
                res[index] = (childType as any).create(newValue, undefined, parent, subPath) // any -> we don't want this typing public
            }
        } else {
            typecheck(childType, newValue)

            // create a fresh MST node
            res[index] = (childType as any).create(newValue, undefined, parent, subPath) // any -> we don't want this typing public
        }
    })

    // Kill non reconciled values
    for (let key in oldValuesByNode) if (oldValuesByNode[key])
        getMSTAdministration(oldValuesByNode[key]).die()

    return res
}

export function createArrayFactory<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
    return createDefaultValueFactory(new ArrayType(subtype.name + "[]", subtype), [])
}

export function isArrayFactory<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>> {
    return isType(type) && (type as any).isArrayFactory === true
}
