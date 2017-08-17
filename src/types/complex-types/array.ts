import {
    observable,
    IObservableArray,
    IArrayWillChange,
    IArrayWillSplice,
    IArrayChange,
    IArraySplice,
    action,
    intercept,
    observe,
    extras
} from "mobx"
import {
    createNode,
    getStateTreeNode,
    IJsonPatch,
    Node,
    isStateTreeNode,
    IStateTreeNode
} from "../../core"
import { addHiddenFinalProp, fail, isMutable, isArray, isPlainObject } from "../../utils"
import { ComplexType, IComplexType, IType } from "../type"
import { TypeFlags } from "../type-flags"
import {
    typecheck,
    flattenTypeErrors,
    getContextForPath,
    IContext,
    IValidationResult,
    typeCheckFailure
} from "../type-checker"

export function arrayToString(this: IObservableArray<any> & IStateTreeNode) {
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

    createNewInstance = () => {
        const array = observable.shallowArray()
        addHiddenFinalProp(array, "toString", arrayToString)
        return array
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.storedValue as IObservableArray<any>
        extras.getAdministration(instance).dehancer = node.unbox
        intercept(instance, change => this.willChange(change) as any)
        node.applySnapshot(snapshot)
        observe(instance, this.didChange)
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: S): Node {
        return createNode(
            this,
            parent,
            subpath,
            environment,
            snapshot,
            this.createNewInstance,
            this.finalizeNewInstance
        )
    }

    getChildren(node: Node): Node[] {
        return node.storedValue.peek()
    }

    getChildNode(node: Node, key: string): Node {
        const index = parseInt(key, 10)
        if (index < node.storedValue.length) return node.storedValue[index]
        return fail("Not a child: " + key)
    }

    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getStateTreeNode(change.object as IStateTreeNode)
        node.assertWritable()
        const childNodes = node.getChildren()

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index]) return null
                change.newValue = reconcileArrayChildren(
                    node,
                    this.subType,
                    [childNodes[change.index]],
                    [change.newValue],
                    [change.index]
                )[0]
                break
            case "splice":
                const { index, removedCount, added } = change
                change.added = reconcileArrayChildren(
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
        const node = getStateTreeNode(change.object as IStateTreeNode)
        switch (change.type) {
            case "update":
                return void node.emitPatch(
                    {
                        op: "replace",
                        path: "" + change.index,
                        value: change.newValue.snapshot,
                        oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                    },
                    node
                )
            case "splice":
                for (let i = change.removedCount - 1; i >= 0; i--)
                    node.emitPatch(
                        {
                            op: "remove",
                            path: "" + (change.index + i),
                            oldValue: change.removed[i].snapshot
                        },
                        node
                    )
                for (let i = 0; i < change.addedCount; i++)
                    node.emitPatch(
                        {
                            op: "add",
                            path: "" + (change.index + i),
                            value: node.getChildNode("" + (change.index + i)).snapshot,
                            oldValue: undefined
                        },
                        node
                    )
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

    @action
    applySnapshot(node: Node, snapshot: any[]): void {
        typecheck(this, snapshot)
        const target = node.storedValue as IObservableArray<any>
        target.replace(snapshot)
    }

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!isArray(value)) {
            return typeCheckFailure(context, value, "Value is not an array")
        }

        return flattenTypeErrors(
            value.map((item: any, index: any) =>
                this.subType.validate(item, getContextForPath(context, "" + index, this.subType))
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

/**
 * Creates a index based collection type who's children are all of a uniform declared type.
 *
 * This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)
 *
 * @example
 * ```javascript
 * const Todo = types.model({
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.array(Todo)
 * })
 *
 * const s = TodoStore.create({ todos: [] })
 * s.todos.push({ task: "Grab coffee" })
 * console.log(s.todos[0]) // prints: "Grab coffee"
 * ```
 * @export
 * @alias types.array
 * @param {IType<S, T>} subtype
 * @returns {IComplexType<S[], IObservableArray<T>>}
 */
export function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
    return new ArrayType<S, T>(subtype.name + "[]", subtype)
}

function reconcileArrayChildren<T>(
    parent: Node,
    childType: IType<any, T>,
    oldNodes: Node[],
    newValues: T[],
    newPaths: (string | number)[]
): Node[] {
    let oldNode: Node,
        newValue: any,
        hasNewNode = false,
        oldMatch: Node | undefined = undefined,
        encounteredNodes = {} as { [nodeId: string]: boolean }

    for (let i = 0; ; i++) {
        oldNode = oldNodes[i]
        newValue = newValues[i]

        hasNewNode = i <= newValues.length - 1

        // both are empty, end
        if (!oldNode && !hasNewNode) {
            break
            // new one does not exists, old one dies
        } else if (!hasNewNode) {
            oldNode.die()
            oldNodes.splice(i, 1)
            i--
            // there is no old node, create it
        } else if (!oldNode) {
            oldNodes.splice(
                i,
                0,
                valueAsNode(childType, parent, "" + newPaths[i], encounteredNodes, newValue)
            )
            // both are the same, reconcile
        } else if (areSame(oldNode, newValue)) {
            oldNodes[i] = valueAsNode(
                childType,
                parent,
                "" + newPaths[i],
                encounteredNodes,
                newValue,
                oldNode
            )
            // nothing to do, try to reorder
        } else {
            oldMatch = undefined

            // find a possible candidate to reuse
            for (let j = i; j < oldNodes.length; j++) {
                if (areSame(oldNodes[j], newValue)) {
                    oldMatch = oldNodes.splice(j, 1)[0]
                    break
                }
            }

            oldNodes.splice(
                i,
                0,
                valueAsNode(
                    childType,
                    parent,
                    "" + newPaths[i],
                    encounteredNodes,
                    newValue,
                    oldMatch
                )
            )
        }
    }

    return oldNodes
}

function valueAsNode(
    childType: IType<any, any>,
    parent: Node,
    subpath: string,
    encounteredNodes: { [nodeId: string]: boolean },
    newValue: any,
    oldNode?: Node
) {
    // the new value has a MST node
    if (isStateTreeNode(newValue)) {
        const childNode = getStateTreeNode(newValue)
        childNode.assertAlive()

        // the node lives here
        if (childNode.parent !== null && childNode.parent === parent) {
            // Came from this array already
            if (encounteredNodes[childNode.nodeId]) {
                // this node is owned by this parent, but not in the reconcilable set, so it must be double
                fail(
                    `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent.path}/${subpath}', but it lives already at '${childNode.path}'`
                )
            }

            childNode.setParent(parent, subpath)
            encounteredNodes[childNode.nodeId] = true
            if (oldNode) oldNode.die()
            return childNode
        }
    }
    // there is old node and new one is a value/snapshot
    if (oldNode) {
        const childNode = childType.reconcile(oldNode, newValue)
        childNode.setParent(parent, subpath)
        encounteredNodes[childNode.nodeId] = true
        return childNode
    }
    // nothing to do, create from scratch
    const childNode = childType.instantiate(parent, subpath, parent._environment, newValue)
    encounteredNodes[childNode.nodeId] = true
    return childNode
}

function areSame(oldNode: Node, newValue: any) {
    // the new value has the same node
    if (isStateTreeNode(newValue)) {
        return getStateTreeNode(newValue) === oldNode
    }
    // the provided value is the snapshot of the old node
    if (isMutable(newValue) && oldNode.snapshot === newValue) return true
    // new value is a snapshot with the correct identifier
    if (
        oldNode.identifier !== null &&
        oldNode.identifierAttribute &&
        isPlainObject(newValue) &&
        newValue[oldNode.identifierAttribute] === oldNode.identifier
    )
        return true
    return false
}
