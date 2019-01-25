import {
    _getAdministration,
    action,
    IArrayChange,
    IArraySplice,
    IArrayWillChange,
    IArrayWillSplice,
    intercept,
    IObservableArray,
    observable,
    observe
} from "mobx"
import {
    ComplexType,
    convertChildNodesToArray,
    createNode,
    EMPTY_ARRAY,
    fail,
    flattenTypeErrors,
    getContextForPath,
    getStateTreeNode,
    IAnyType,
    IChildNodesMap,
    IContext,
    IJsonPatch,
    INode,
    isArray,
    isNode,
    isPlainObject,
    isStateTreeNode,
    IStateTreeNode,
    isType,
    IType,
    IValidationResult,
    mobxShallow,
    ObjectNode,
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    OptionalProperty,
    ExtractS,
    ExtractC,
    ExtractT,
    ExtractCST,
    normalizeIdentifier,
    EMPTY_OBJECT
} from "../../internal"

/** @hidden */
export interface IMSTArray<IT extends IAnyType>
    extends IObservableArray<ExtractT<IT>>,
        IStateTreeNode<ExtractC<IT>[] | undefined, ExtractS<IT>[]> {
    // needs to be split or else it will complain about not being compatible with the array interface
    push(...items: ExtractT<IT>[]): number
    push(...items: ExtractCST<IT>[]): number

    concat(...items: ConcatArray<ExtractT<IT>>[]): ExtractT<IT>[]
    concat(...items: ConcatArray<ExtractCST<IT>>[]): ExtractT<IT>[]

    concat(...items: (ExtractT<IT> | ConcatArray<ExtractT<IT>>)[]): ExtractT<IT>[]
    concat(...items: (ExtractCST<IT> | ConcatArray<ExtractCST<IT>>)[]): ExtractT<IT>[]

    splice(start: number, deleteCount?: number): ExtractT<IT>[]
    splice(start: number, deleteCount: number, ...items: ExtractT<IT>[]): ExtractT<IT>[]
    splice(start: number, deleteCount: number, ...items: ExtractCST<IT>[]): ExtractT<IT>[]

    unshift(...items: ExtractT<IT>[]): number
    unshift(...items: ExtractCST<IT>[]): number
}

/** @hidden */
export interface IArrayType<IT extends IAnyType>
    extends IType<ExtractC<IT>[] | undefined, ExtractS<IT>[], IMSTArray<IT>>,
        OptionalProperty {}

/**
 * @internal
 * @hidden
 */
export class ArrayType<IT extends IAnyType, C = ExtractC<IT>, S = ExtractS<IT>> extends ComplexType<
    C[] | undefined,
    S[],
    IMSTArray<IT>
> {
    shouldAttachNode = true
    subType: IAnyType
    readonly flags = TypeFlags.Array

    constructor(name: string, subType: IAnyType) {
        super(name)
        this.subType = subType
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode {
        return createNode(this, parent, subpath, environment, snapshot)
    }

    initializeChildNodes(objNode: ObjectNode, snapshot: S[] = []): IChildNodesMap {
        const subType = (objNode.type as ArrayType<any, any, any>).subType
        const environment = objNode.environment
        const result = {} as IChildNodesMap
        snapshot.forEach((item, index) => {
            const subpath = `${index}`
            result[subpath] = subType.instantiate(objNode, subpath, environment, item)
        })
        return result
    }

    createNewInstance(
        node: ObjectNode,
        childNodes: IChildNodesMap,
        snapshot: any
    ): IObservableArray<any> {
        return observable.array(convertChildNodesToArray(childNodes), mobxShallow)
    }

    finalizeNewInstance(node: ObjectNode, instance: IObservableArray<any>): void {
        _getAdministration(instance).dehancer = node.unbox
        intercept(instance, this.willChange as any)
        observe(instance, this.didChange)
    }

    describe() {
        return this.subType.describe() + "[]"
    }

    getChildren(node: ObjectNode): INode[] {
        return node.storedValue.slice()
    }

    getChildNode(node: ObjectNode, key: string): INode {
        const index = parseInt(key, 10)
        if (index < node.storedValue.length) return node.storedValue[index]
        throw fail("Not a child: " + key)
    }

    willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getStateTreeNode(change.object as IMSTArray<IT>)
        node.assertWritable({ subpath: String(change.index) })
        const subType = (node.type as ArrayType<IT>).subType
        const childNodes = node.getChildren()
        let nodes = null

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index]) return null
                nodes = reconcileArrayChildren(
                    node,
                    subType,
                    [childNodes[change.index]],
                    [change.newValue],
                    [change.index]
                )
                if (!nodes) {
                    return null
                }
                change.newValue = nodes[0]
                break
            case "splice":
                const { index, removedCount, added } = change
                nodes = reconcileArrayChildren(
                    node,
                    subType,
                    childNodes.slice(index, index + removedCount),
                    added,
                    added.map((_, i) => index + i)
                )
                if (!nodes) {
                    return null
                }
                change.added = nodes

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

    processInitialSnapshot(childNodes: IChildNodesMap, snapshot: any): any {
        const processed = [] as any[]
        Object.keys(childNodes).forEach(key => {
            processed.push(childNodes[key].getSnapshot())
        })
        return processed
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getStateTreeNode(change.object as IMSTArray<IT>)
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
        typecheckInternal(this, snapshot)
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
        return EMPTY_ARRAY
    }

    removeChild(node: ObjectNode, subpath: string) {
        node.storedValue.splice(parseInt(subpath, 10), 1)
    }
}

/**
 * `types.array` - Creates an index based collection type who's children are all of a uniform declared type.
 *
 * This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)
 *
 * Example:
 * ```ts
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
 * ```
 *
 * @param subtype
 * @returns
 */
export function array<IT extends IAnyType>(subtype: IT): IArrayType<IT> {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(subtype))
            throw fail(
                "expected a mobx-state-tree type as first argument, got " + subtype + " instead"
            )
    }
    const ret = new ArrayType<IT>(subtype.name + "[]", subtype)
    return ret as typeof ret & OptionalProperty
}

function reconcileArrayChildren<T>(
    parent: ObjectNode,
    childType: IType<any, any, T>,
    oldNodes: INode[],
    newValues: T[],
    newPaths: (string | number)[]
): INode[] | null {
    let oldNode: INode,
        newValue: any,
        hasNewNode = false,
        oldMatch: INode | undefined = undefined,
        nothingChanged = true

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
            nothingChanged = false
            // there is no old node, create it
        } else if (!oldNode) {
            // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
            if (isStateTreeNode(newValue) && getStateTreeNode(newValue).parent === parent) {
                // this node is owned by this parent, but not in the reconcilable set, so it must be double
                throw fail(
                    `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                        parent.path
                    }/${newPaths[i]}', but it lives already at '${getStateTreeNode(newValue).path}'`
                )
            }
            oldNodes.splice(i, 0, valueAsNode(childType, parent, "" + newPaths[i], newValue))
            nothingChanged = false
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
            nothingChanged = false
        }
    }

    return nothingChanged ? null : oldNodes
}

/**
 * Convert a value to a node at given parent and subpath. Attempts to reuse old node if possible and given.
 */
function valueAsNode(
    childType: IAnyType,
    parent: ObjectNode,
    subpath: string,
    newValue: any,
    oldNode?: INode
) {
    // ensure the value is valid-ish
    typecheckInternal(childType, newValue)

    // the new value has a MST node
    if (isStateTreeNode(newValue)) {
        const childNode = getStateTreeNode(newValue)
        childNode.assertAlive(EMPTY_OBJECT)

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
    return childType.instantiate(parent, subpath, parent.environment, newValue)
}

/**
 * Check if a node holds a value.
 */
function areSame(oldNode: INode, newValue: any) {
    // the new value has the same node
    if (isStateTreeNode(newValue)) {
        return getStateTreeNode(newValue) === oldNode
    }
    // the provided value is the snapshot of the old node
    if (oldNode.snapshot === newValue) return true
    // new value is a snapshot with the correct identifier
    if (
        oldNode instanceof ObjectNode &&
        oldNode.identifier !== null &&
        oldNode.identifierAttribute &&
        isPlainObject(newValue) &&
        oldNode.identifier === normalizeIdentifier(newValue[oldNode.identifierAttribute]) &&
        oldNode.type.is(newValue)
    )
        return true
    return false
}

/**
 * Returns if a given value represents an array type.
 *
 * @param type
 * @returns `true` if the type is an array type.
 */
export function isArrayType<Items extends IAnyType = IAnyType>(
    type: IAnyType
): type is IArrayType<Items> {
    return isType(type) && (type.flags & TypeFlags.Array) > 0
}
