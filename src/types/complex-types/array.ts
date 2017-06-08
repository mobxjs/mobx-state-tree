import { observable, IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice, action, intercept, observe, extras } from "mobx"
import {
    getStateTreeNode,
    IJsonPatch,
    Node
} from "../../core"
import { addHiddenFinalProp, fail } from "../../utils"
import { IType, IComplexType, TypeFlags, isType, ComplexType } from "../type"
import { IContext, IValidationResult, typeCheckFailure, flattenTypeErrors, getContextForPath } from "../type-checker"

export function arrayToString(this: IObservableArray<any>) {
    return `${getStateTreeNode(this)}(${this.length} items)`
}

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    shouldAttachNode = true
    subType: IType<any, any>
    readonly flags = TypeFlags.Array

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return this.subType.describe() + "[]"
    }

    createNewInstance() {
        const array = observable.shallowArray()
        addHiddenFinalProp(array, "toString", arrayToString)
        return array
    }

    finalizeNewInstance(instance: IObservableArray<any>, snapshot: any) {
        extras.getAdministration(instance).dehancer = getStateTreeNode(instance).unbox
        intercept(instance, change => this.willChange(change) as any)
        observe(instance, this.didChange)
        getStateTreeNode(instance).applySnapshot(snapshot)
    }

    getChildren(node: Node): Node[] {
        return node.storedValue.peek()
    }

    getChildNode(node: Node, key: string): Node {
        const index = parseInt(key, 10)
        if (index < node.storedValue.length)
            return node.storedValue[index]
        return fail("Not a child: " + key)
    }

    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()
        const childNodes = node.getChildren()

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index])
                    return null
                change.newValue = node.reconcileChildren(node, this.subType, [childNodes[change.index]], [change.newValue], [change.index])[0]
                break
            case "splice":
                const {index, removedCount, added} = change
                change.added = node.reconcileChildren(
                    node,
                    this.subType,
                    childNodes.slice(index, index + removedCount),
                    added,
                    added.map((_, i) => index + i)
                )

                // update paths of remaining items
                for (let i = index + removedCount; i < childNodes.length; i++) {
                    childNodes[i].setParent(node, "" + (i + added.length - removedCount))
                }
                break
        }
        return change
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): any {
        return node.getChildren().map(childNode => childNode.snapshot)
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getStateTreeNode(change.object)
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "" + change.index,
                    value:  node.getChildNode("" + change.index).snapshot
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
                        value: node.getChildNode("" + (change.index + i)).snapshot
                    }, node)
                return
        }
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        const target = node.storedValue as IObservableArray<any>
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

    @action applySnapshot(node: Node, snapshot: any[]): void {
        node.pseudoAction(() => {
            const target = node.storedValue as IObservableArray<any>
            target.replace(snapshot)
        })
    }

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!Array.isArray(value)) {
            return typeCheckFailure(context, value)
        }

        return flattenTypeErrors(
            value.map(
                (item, index) => this.subType.validate(item, getContextForPath(context, "" + index, this.subType))
            )
        )
    }

    getDefaultSnapshot() {
        return []
    }

    removeChild(node: Node, subpath: string) {
        node.storedValue.splice(parseInt(subpath, 10), 1)
    }
}

export function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
    return new ArrayType<S, T>(subtype.name + "[]", subtype)
}

export function isArrayFactory<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>> {
    return isType(type) && ((type as IType<any, any>).flags & TypeFlags.Array) > 0
}
