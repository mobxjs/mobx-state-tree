import {
  _getAdministration,
  action,
  IArrayDidChange,
  IArraySplice,
  IArrayWillChange,
  IArrayWillSplice,
  intercept,
  IObservableArray,
  observable,
  observe
} from "mobx"
import {
  addHiddenFinalProp,
  addHiddenWritableProp,
  AnyNode,
  AnyObjectNode,
  assertIsType,
  ComplexType,
  convertChildNodesToArray,
  createActionInvoker,
  createObjectNode,
  devMode,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  ExtractCSTWithSTN,
  fail,
  flattenTypeErrors,
  getContextForPath,
  getStateTreeNode,
  IAnyStateTreeNode,
  IAnyType,
  IChildNodesMap,
  IHooksGetter,
  IJsonPatch,
  isArray,
  isNode,
  isPlainObject,
  isStateTreeNode,
  IStateTreeNode,
  isType,
  IType,
  IValidationContext,
  IValidationResult,
  mobxShallow,
  normalizeIdentifier,
  ObjectNode,
  typeCheckFailure,
  typecheckInternal,
  TypeFlags
} from "../../internal"

/** @hidden */
export interface IMSTArray<IT extends IAnyType> extends IObservableArray<IT["Type"]> {
  // needs to be split or else it will complain about not being compatible with the array interface
  push(...items: IT["Type"][]): number
  push(...items: ExtractCSTWithSTN<IT>[]): number

  concat(...items: ConcatArray<IT["Type"]>[]): IT["Type"][]
  concat(...items: ConcatArray<ExtractCSTWithSTN<IT>>[]): IT["Type"][]

  concat(...items: (IT["Type"] | ConcatArray<IT["Type"]>)[]): IT["Type"][]
  concat(...items: (ExtractCSTWithSTN<IT> | ConcatArray<ExtractCSTWithSTN<IT>>)[]): IT["Type"][]

  splice(start: number, deleteCount?: number): IT["Type"][]
  splice(start: number, deleteCount: number, ...items: IT["Type"][]): IT["Type"][]
  splice(start: number, deleteCount: number, ...items: ExtractCSTWithSTN<IT>[]): IT["Type"][]

  unshift(...items: IT["Type"][]): number
  unshift(...items: ExtractCSTWithSTN<IT>[]): number
}

/** @hidden */
export interface IArrayType<IT extends IAnyType>
  extends IType<readonly IT["CreationType"][] | undefined, IT["SnapshotType"][], IMSTArray<IT>> {
  hooks(hooks: IHooksGetter<IMSTArray<IAnyType>>): IArrayType<IT>
}

/**
 * @internal
 * @hidden
 */
export class ArrayType<IT extends IAnyType> extends ComplexType<
  readonly IT["CreationType"][] | undefined,
  IT["SnapshotType"][],
  IMSTArray<IT>
> {
  readonly flags = TypeFlags.Array
  private readonly hookInitializers: Array<IHooksGetter<IMSTArray<IT>>> = []
  constructor(
    name: string,
    private readonly _subType: IT,
    hookInitializers: Array<IHooksGetter<IMSTArray<IT>>> = []
  ) {
    super(name)
    this.hookInitializers = hookInitializers
  }

  hooks(hooks: IHooksGetter<IMSTArray<IT>>) {
    const hookInitializers =
      this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks]
    return new ArrayType(this.name, this._subType, hookInitializers)
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"] | this["T"]
  ): this["N"] {
    return createObjectNode(this, parent, subpath, environment, initialValue)
  }

  initializeChildNodes(objNode: this["N"], snapshot: this["C"] = []): IChildNodesMap {
    const subType = (objNode.type as this)._subType
    const result: IChildNodesMap = {}
    snapshot.forEach((item, index) => {
      const subpath = "" + index
      result[subpath] = subType.instantiate(objNode, subpath, undefined, item)
    })
    return result
  }

  createNewInstance(childNodes: IChildNodesMap): this["T"] {
    const options = { ...mobxShallow, name: this.name }
    return observable.array(convertChildNodesToArray(childNodes), options) as this["T"]
  }

  finalizeNewInstance(node: this["N"], instance: this["T"]): void {
    _getAdministration(instance).dehancer = node.unbox

    const type = node.type as this
    type.hookInitializers.forEach((initializer) => {
      const hooks = initializer(instance)
      Object.keys(hooks).forEach((name) => {
        const hook = hooks[name as keyof typeof hooks]!
        const actionInvoker = createActionInvoker(instance as IAnyStateTreeNode, name, hook)
        ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(instance, name, actionInvoker)
      })
    })

    intercept(instance as IObservableArray<AnyNode>, this.willChange)
    observe(instance as IObservableArray<AnyNode>, this.didChange)
  }

  describe() {
    return this.name
  }

  getChildren(node: this["N"]): AnyNode[] {
    return node.storedValue.slice()
  }

  getChildNode(node: this["N"], key: string): AnyNode {
    const index = Number(key)
    if (index < node.storedValue.length) return node.storedValue[index]
    throw fail("Not a child: " + key)
  }

  willChange(
    change: IArrayWillChange<AnyNode> | IArrayWillSplice<AnyNode>
  ): IArrayWillChange<AnyNode> | IArrayWillSplice<AnyNode> | null {
    const node = getStateTreeNode(change.object as IStateTreeNode<this>)
    node.assertWritable({ subpath: "" + change.index })
    const subType = (node.type as this)._subType
    const childNodes = node.getChildren()

    switch (change.type) {
      case "update":
        {
          if (change.newValue === change.object[change.index]) return null

          const updatedNodes = reconcileArrayChildren(
            node,
            subType,
            [childNodes[change.index]],
            [change.newValue],
            [change.index]
          )
          if (!updatedNodes) {
            return null
          }
          change.newValue = updatedNodes[0]
        }
        break
      case "splice":
        {
          const { index, removedCount, added } = change

          const addedNodes = reconcileArrayChildren(
            node,
            subType,
            childNodes.slice(index, index + removedCount),
            added,
            added.map((_, i) => index + i)
          )
          if (!addedNodes) {
            return null
          }
          change.added = addedNodes

          // update paths of remaining items
          for (let i = index + removedCount; i < childNodes.length; i++) {
            childNodes[i].setParent(node, "" + (i + added.length - removedCount))
          }
        }
        break
    }
    return change
  }

  getSnapshot(node: this["N"]): this["S"] {
    return node.getChildren().map((childNode) => childNode.snapshot)
  }

  processInitialSnapshot(childNodes: IChildNodesMap): this["S"] {
    const processed: this["S"] = []
    Object.keys(childNodes).forEach((key) => {
      processed.push(childNodes[key].getSnapshot())
    })
    return processed
  }

  didChange(change: IArrayDidChange<AnyNode> | IArraySplice<AnyNode>): void {
    const node = getStateTreeNode(change.object as IAnyStateTreeNode)
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

  applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
    const target = node.storedValue
    const index = subpath === "-" ? target.length : Number(subpath)
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

  applySnapshot(node: this["N"], snapshot: this["C"]): void {
    typecheckInternal(this, snapshot)
    const target = node.storedValue
    target.replace(snapshot as any)
  }

  getChildType(): IAnyType {
    return this._subType
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (!isArray(value)) {
      return typeCheckFailure(context, value, "Value is not an array")
    }

    return flattenTypeErrors(
      value.map((item, index) =>
        this._subType.validate(item, getContextForPath(context, "" + index, this._subType))
      )
    )
  }

  getDefaultSnapshot(): this["C"] {
    return EMPTY_ARRAY as this["C"]
  }

  removeChild(node: this["N"], subpath: string) {
    node.storedValue.splice(Number(subpath), 1)
  }
}
ArrayType.prototype.applySnapshot = action(ArrayType.prototype.applySnapshot)

/**
 * `types.array` - Creates an index based collection type who's children are all of a uniform declared type.
 *
 * This type will always produce [observable arrays](https://mobx.js.org/api.html#observablearray)
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
  assertIsType(subtype, 1)
  return new ArrayType<IT>(`${subtype.name}[]`, subtype)
}

function reconcileArrayChildren<TT>(
  parent: AnyObjectNode,
  childType: IType<any, any, TT>,
  oldNodes: AnyNode[],
  newValues: TT[],
  newPaths: (string | number)[]
): AnyNode[] | null {
  let nothingChanged = true

  for (let i = 0; ; i++) {
    const hasNewNode = i <= newValues.length - 1
    const oldNode = oldNodes[i]
    let newValue = hasNewNode ? newValues[i] : undefined
    const newPath = "" + newPaths[i]

    // for some reason, instead of newValue we got a node, fallback to the storedValue
    // TODO: https://github.com/mobxjs/mobx-state-tree/issues/340#issuecomment-325581681
    if (isNode(newValue)) newValue = newValue.storedValue

    if (!oldNode && !hasNewNode) {
      // both are empty, end
      break
    } else if (!hasNewNode) {
      // new one does not exists
      nothingChanged = false
      oldNodes.splice(i, 1)
      if (oldNode instanceof ObjectNode) {
        // since it is going to be returned by pop/splice/shift better create it before killing it
        // so it doesn't end up in an undead state
        oldNode.createObservableInstanceIfNeeded()
      }
      oldNode.die()
      i--
    } else if (!oldNode) {
      // there is no old node, create it
      // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
      if (isStateTreeNode(newValue) && getStateTreeNode(newValue).parent === parent) {
        // this node is owned by this parent, but not in the reconcilable set, so it must be double
        throw fail(
          `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
            parent.path
          }/${newPath}', but it lives already at '${getStateTreeNode(newValue).path}'`
        )
      }
      nothingChanged = false
      const newNode = valueAsNode(childType, parent, newPath, newValue)
      oldNodes.splice(i, 0, newNode)
    } else if (areSame(oldNode, newValue)) {
      // both are the same, reconcile
      oldNodes[i] = valueAsNode(childType, parent, newPath, newValue, oldNode)
    } else {
      // nothing to do, try to reorder
      let oldMatch = undefined

      // find a possible candidate to reuse
      for (let j = i; j < oldNodes.length; j++) {
        if (areSame(oldNodes[j], newValue)) {
          oldMatch = oldNodes.splice(j, 1)[0]
          break
        }
      }

      nothingChanged = false
      const newNode = valueAsNode(childType, parent, newPath, newValue, oldMatch)
      oldNodes.splice(i, 0, newNode)
    }
  }

  return nothingChanged ? null : oldNodes
}

/**
 * Convert a value to a node at given parent and subpath. Attempts to reuse old node if possible and given.
 */
function valueAsNode(
  childType: IAnyType,
  parent: AnyObjectNode,
  subpath: string,
  newValue: any,
  oldNode?: AnyNode
) {
  // ensure the value is valid-ish
  typecheckInternal(childType, newValue)

  function getNewNode() {
    // the new value has a MST node
    if (isStateTreeNode(newValue)) {
      const childNode = getStateTreeNode(newValue)
      childNode.assertAlive(EMPTY_OBJECT)

      // the node lives here
      if (childNode.parent !== null && childNode.parent === parent) {
        childNode.setParent(parent, subpath)
        return childNode
      }
    }
    // there is old node and new one is a value/snapshot
    if (oldNode) {
      return childType.reconcile(oldNode, newValue, parent, subpath)
    }

    // nothing to do, create from scratch
    return childType.instantiate(parent, subpath, undefined, newValue)
  }

  const newNode = getNewNode()
  if (oldNode && oldNode !== newNode) {
    if (oldNode instanceof ObjectNode) {
      // since it is going to be returned by pop/splice/shift better create it before killing it
      // so it doesn't end up in an undead state
      oldNode.createObservableInstanceIfNeeded()
    }
    oldNode.die()
  }
  return newNode
}

/**
 * Check if a node holds a value.
 */
function areSame(oldNode: AnyNode, newValue: any) {
  // never consider dead old nodes for reconciliation
  if (!oldNode.isAlive) {
    return false
  }

  // the new value has the same node
  if (isStateTreeNode(newValue)) {
    const newNode = getStateTreeNode(newValue)
    return newNode.isAlive && newNode === oldNode
  }

  // the provided value is the snapshot of the old node
  if (oldNode.snapshot === newValue) {
    return true
  }

  // Non object nodes don't get reconciled
  if (!(oldNode instanceof ObjectNode)) {
    return false
  }

  const oldNodeType = oldNode.getReconciliationType()
  // new value is a snapshot with the correct identifier
  return (
    oldNode.identifier !== null &&
    oldNode.identifierAttribute &&
    isPlainObject(newValue) &&
    oldNodeType.is(newValue) &&
    (oldNodeType as any).isMatchingSnapshotId(oldNode, newValue)
  )
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
