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
    _getAdministration
} from "mobx"
import {
    createNode,
    getStateTreeNode,
    IJsonPatch,
    INode,
    isStateTreeNode,
    IStateTreeNode,
    isNode,
    typecheck,
    flattenTypeErrors,
    getContextForPath,
    IContext,
    IValidationResult,
    typeCheckFailure,
    ComplexType,
    IComplexType,
    IType,
    isType,
    addHiddenFinalProp,
    fail,
    isMutable,
    isArray,
    isPlainObject,
    TypeFlags,
    ObjectNode,
    mobxShallow,
    IAnyType
} from "../../internal"

export function arrayToString(this: IObservableArray<any> & IStateTreeNode) {
    return `${getStateTreeNode(this)}(${this.length} items)`
}

export class ArrayType<C, S, T> extends ComplexType<C[], S[], IObservableArray<T>> {
    shouldAttachNode = true
    subType: IAnyType
    readonly flags = TypeFlags.Array

    constructor(name: string, subType: IAnyType) {
        super(name)
        this.subType = subType
    }

    describe() {
        return this.subType.describe() + "[]"
    }

    createNewInstance = () => {
        const array = observable.array([], mobxShallow)
        addHiddenFinalProp(array, "toString", arrayToString)
        return array
    }

    finalizeNewInstance = (node: INode, snapshot: any) => {
        const objNode = node as ObjectNode
        const instance = objNode.storedValue as IObservableArray<any>
        _getAdministration(instance).dehancer = objNode.unbox
        intercept(instance, change => this.willChange(change) as any)
        objNode.applySnapshot(snapshot)
        observe(instance, this.didChange)
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode {
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

    getChildren(node: ObjectNode): INode[] {
        return node.storedValue.peek()
    }

    getChildNode(node: ObjectNode, key: string): INode {
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

    getValue(node: ObjectNode): any {
        return node.storedValue
    }

    getSnapshot(node: ObjectNode): any {
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

    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void {
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
    applySnapshot(node: ObjectNode, snapshot: any[]): void {
        typecheck(this, snapshot)
        const target = node.storedValue as IObservableArray<any>
        target.replace(snapshot)
    }

    getChildType(key: string): IAnyType {
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

    removeChild(node: ObjectNode, subpath: string) {
        node.storedValue.splice(parseInt(subpath, 10), 1)
    }
}

/**
 * Creates an index based collection type who's children are all of a uniform declared type.
 *
 * This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)
 *
 * @example
 * const Todo = types.model({
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.array(Todo)
 * })
 *
 * const s = TodoStore.create({ todos: [] })
 * unprotect(s) // needed to allow modifying outside of an action
 * s.todos.push({ task: "Grab coffee" })
 * console.log(s.todos[0]) // prints: "Grab coffee"
 *
 * @export
 * @alias types.array
 * @param {IType<S, T>} subtype
 * @returns {IComplexType<S[], IObservableArray<T>>}
 */
export function array<C, S, T>(
    subtype: IType<C, S, T>
): IComplexType<ReadonlyArray<C>, ReadonlyArray<S>, IObservableArray<T>> {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(subtype))
            fail("expected a mobx-state-tree type as first argument, got " + subtype + " instead")
    }
    return new ArrayType<C, S, T>(subtype.name + "[]", subtype)
}

function reconcileArrayChildren<T>(
    parent: ObjectNode,
    childType: IType<any, any, T>,
    oldNodes: INode[],
    newValues: T[],
    newPaths: (string | number)[]
): INode[] {
    let oldNode: INode,
        newValue: any,
        hasNewNode = false,
        oldMatch: INode | undefined = undefined

    for (let i = 0; ; i++) {
        hasNewNode = i <= newValues.length - 1
        oldNode = oldNodes[i]
        newValue = hasNewNode ? newValues[i] : undefined

        // for some reason, instead of newValue we got a node, fallback to the storedValue
        // TODO: https://github.com/mobxjs/mobx-state-tree/issues/340#issuecomment-325581681
        if (isNode(newValue)) newValue = newValue.storedValue

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
            // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
            if (isStateTreeNode(newValue) && getStateTreeNode(newValue).parent === parent) {
                // this node is owned by this parent, but not in the reconcilable set, so it must be double
                fail(
                    `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                        parent.path
                    }/${newPaths[i]}', but it lives already at '${getStateTreeNode(newValue).path}'`
                )
            }
            oldNodes.splice(i, 0, valueAsNode(childType, parent, "" + newPaths[i], newValue))
            // both are the same, reconcile
        } else if (areSame(oldNode, newValue)) {
            oldNodes[i] = valueAsNode(childType, parent, "" + newPaths[i], newValue, oldNode)
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
                valueAsNode(childType, parent, "" + newPaths[i], newValue, oldMatch)
            )
        }
    }

    return oldNodes
}

// convert a value to a node at given parent and subpath. attempts to reuse old node if possible and given
function valueAsNode(
    childType: IAnyType,
    parent: ObjectNode,
    subpath: string,
    newValue: any,
    oldNode?: INode
) {
    // ensure the value is valid-ish
    typecheck(childType, newValue)

    // the new value has a MST node
    if (isStateTreeNode(newValue)) {
        const childNode = getStateTreeNode(newValue)
        childNode.assertAlive()

        // the node lives here
        if (childNode.parent !== null && childNode.parent === parent) {
            childNode.setParent(parent, subpath)
            if (oldNode && oldNode !== childNode) oldNode.die()
            return childNode
        }
    }
    // there is old node and new one is a value/snapshot
    if (oldNode) {
        const childNode = childType.reconcile(oldNode, newValue)
        childNode.setParent(parent, subpath)
        return childNode
    }
    // nothing to do, create from scratch
    const childNode = childType.instantiate(parent, subpath, parent._environment, newValue)
    return childNode
}

// given a value
function areSame(oldNode: INode, newValue: any) {
    // the new value has the same node
    if (isStateTreeNode(newValue)) {
        return getStateTreeNode(newValue) === oldNode
    }
    // the provided value is the snapshot of the old node
    if (isMutable(newValue) && oldNode.snapshot === newValue) return true
    // new value is a snapshot with the correct identifier
    if (
        oldNode instanceof ObjectNode &&
        oldNode.identifier !== null &&
        oldNode.identifierAttribute &&
        isPlainObject(newValue) &&
        newValue[oldNode.identifierAttribute] === oldNode.identifier
    )
        return true
    return false
}

export function isArrayType<C, S, T>(
    type: any
): type is IComplexType<C[], S[], IObservableArray<T>> {
    return isType(type) && (type.flags & TypeFlags.Array) > 0
}
