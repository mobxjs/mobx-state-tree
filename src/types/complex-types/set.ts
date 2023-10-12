import {
  _getAdministration,
  action,
  observable,
  ObservableSet,
  IObservableSetInitialValues,
  intercept,
  observe,
  ISetWillChange,
  ISetDidChange,
  values
} from "mobx"
import { IJsonPatch } from "../../core/json-patch"
import { AnyNode } from "../../core/node/BaseNode"
import { IChildNodesMap, AnyObjectNode, ObjectNode } from "../../core/node/object-node"
import { TypeFlags } from "../../core/type/type"
import {
  IValidationContext,
  IValidationResult,
  flattenTypeErrors,
  getContextForPath,
  typeCheckFailure,
  typecheckInternal
} from "../../core/type/type-checker"
import {
  addHiddenFinalProp,
  addHiddenWritableProp,
  ComplexType,
  convertChildNodesToArray,
  // convertChildNodesToSet,
  createActionInvoker,
  createObjectNode,
  devMode,
  EMPTY_ARRAY,
  getStateTreeNode,
  IAnyStateTreeNode,
  IAnyType,
  IHooksGetter,
  isPlainObject,
  IStateTreeNode,
  IType,
  mobxShallow
} from "../../internal"

/** @hidden */
export interface IMSTSet<IT extends IAnyType> {
  // bases on ObservableSap, but fine tuned to the auto snapshot conversion of MST

  add(value: IT["Type"]): void
  clear(): void
  delete(value: IT["Type"]): boolean
  entries(): IterableIterator<[IT["Type"], IT["Type"]]>
  forEach(
    callbackfn: (value: IT["Type"], value2: IT["Type"], set: this) => void,
    thisArg?: any
  ): void
  has(value: IT["Type"]): boolean
  keys(): IterableIterator<IT["Type"]>
  values(): IterableIterator<IT["Type"]>
  toJSON(): IT["Type"][]
  readonly size: number
  [Symbol.iterator](): IterableIterator<IT["Type"]>
  [Symbol.toStringTag]: "Set"
}

/** @hidden */
export interface ISetType<IT extends IAnyType>
  extends IType<Set<IT["CreationType"]> | undefined, Set<IT["SnapshotType"]>, IMSTSet<IT>> {
  hooks(hooks: IHooksGetter<IMSTSet<IAnyType>>): ISetType<IT>
}

class MSTSet<IT extends IAnyType> extends ObservableSet<any> {
  constructor(initialData?: IObservableSetInitialValues<any> | undefined, name?: string) {
    super(initialData, (observable.ref as any).enhancer, name)
  }

  add(value: IT["Type"]) {
    return super.add(value)
  }

  clear() {
    return super.clear()
  }

  delete(value: IT["Type"]) {
    return super.delete(value)
  }

  has(value: IT["Type"]) {
    return super.has(value)
  }
}

/**
 * @internal
 * @hidden
 */
export class SetType<IT extends IAnyType> extends ComplexType<
  Set<IT["CreationType"]> | undefined,
  Set<IT["SnapshotType"]>,
  IMSTSet<IT>
> {
  private readonly hookInitializers: Array<IHooksGetter<IMSTSet<IT>>> = []

  constructor(
    name: string,
    private readonly _subType: IT,
    hookInitializers: Array<IHooksGetter<IMSTSet<IT>>> = []
  ) {
    super(name)
    this.hookInitializers = hookInitializers
  }

  hooks(hooks: IHooksGetter<IMSTSet<IT>>) {
    const hookInitializers =
      this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks]
    return new SetType(this.name, this._subType, hookInitializers)
  }

  getDefaultSnapshot(): this["C"] {
    return EMPTY_ARRAY as unknown as this["C"]
  }

  createNewInstance(childNodes: IChildNodesMap): this["T"] {
    // const options = { ...mobxShallow, name: this.describe() }
    const mChildNodes = convertChildNodesToArray(childNodes)
    console.log({ mChildNodes })
    return new MSTSet(mChildNodes, this.describe()) as any
    // TODO: remove this
    // return observable.set(convertChildNodesToSet(childNodes), options) as this["T"]
  }

  finalizeNewInstance(node: this["N"], instance: any): void {
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

    intercept(instance, this.willChange)
    observe(instance, this.didChange)
  }

  willChange(change: ISetWillChange<AnyNode>): ISetWillChange<AnyNode> | null {
    const node = getStateTreeNode(change.object as IStateTreeNode<this>)
    console.log({ change })
    node.assertWritable({ subpath: "" + change.type })
    const subType = (node.type as this)._subType

    switch (change.type) {
      case "add":
        {
          const value = change.newValue as AnyNode
          typecheckInternal(subType, value)
          change.object.add(value)
          // TODO
          // Check if we need to add something
        }
        break

      case "delete":
        {
          const value = change.oldValue as AnyNode
          typecheckInternal(subType, value)
          change.object.delete(value)
          // TODO
          // Check if we need to add something
        }
        break
    }

    return change
  }

  didChange(change: ISetDidChange<AnyNode>): void {
    // TODO: verify this method too
    const node = getStateTreeNode(change.object as IStateTreeNode)
    switch (change.type) {
      case "add":
        return void node.emitPatch(
          {
            op: "add",
            path: "" + change.newValue,
            value: change.newValue.snapshot,
            oldValue: undefined
          },
          node
        )

      case "delete":
        return void node.emitPatch(
          {
            op: "remove",
            oldValue: change.oldValue.snapshot,
            path: "" + change.oldValue
          },
          node
        )
    }
  }

  applySnapshot(node: this["N"], snapshot: this["C"]): void {
    typecheckInternal(this, snapshot)
    const target = node.storedValue
    // TODO: verify if this is correct
    target.add(snapshot)
  }
  applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
    // TODO: verify this method
    console.log(
      "🚀 ~ file: set.ts:202 ~ applyPatchLocally ~ node, subpath, patch:",
      node,
      subpath,
      patch
    )
    const target = node.storedValue
    switch (patch.op) {
      case "add":
      case "replace":
        target.add(patch.value)
        break
      case "remove":
        target.delete(patch.value)
        break
    }
  }
  processInitialSnapshot(
    childNodes: IChildNodesMap,
    snapshot: Set<IT["CreationType"]> | undefined
  ): this["S"] {
    console.log("🚀 ~ file: set.ts:224 ~ snapshot:", snapshot)
    const processed: this["S"] = new Set()
    Object.keys(childNodes).forEach((key) => {
      // TODO: maybe use snapshot and simplify this method
      processed.add(childNodes[key].getSnapshot())
    })
    return processed
  }
  getChildren(node: this["N"]): readonly AnyNode[] {
    return values(node.storedValue)
  }
  getChildNode(node: this["N"], key: string): AnyNode {
    console.log("🚀 ~ file: set.ts:237 ~ getChildNode ~ key:", key)
    console.log("🚀 ~ file: set.ts:237 ~ getChildNode ~ node:", node)
    const childNode = node.storedValue.has(key) ? key : undefined
    if (!childNode) throw fail("Not a child " + key)
    const index = Number(key)
    return [...node.storedValue][index]
  }
  getChildType(propertyName?: string): IAnyType {
    return this._subType
  }
  initializeChildNodes(node: this["N"], snapshot: this["C"]): IChildNodesMap {
    const subType = (node.type as this)._subType
    const result: IChildNodesMap = {}
    snapshot?.forEach((item, index) => {
      const subpath = "" + index
      result[subpath] = subType.instantiate(node, subpath, undefined, item)
    })
    return result
  }
  removeChild(node: this["N"], subpath: string): void {
    // TODO: check if any typecasting is necessary
    node.storedValue.delete(subpath)
  }
  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: Set<IT["CreationType"]> | IMSTSet<IT> | undefined
  ): ObjectNode<Set<IT["CreationType"]> | undefined, Set<IT["SnapshotType"]>, IMSTSet<IT>> {
    return createObjectNode(this, parent, subpath, environment, initialValue)
  }
  readonly flags = TypeFlags.Set
  describe(): string {
    return this._subType.describe() + "Set"
  }
  // TODO: verify this
  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    if (!isPlainObject(value)) {
      return typeCheckFailure(context, value, "Value is not a plain object")
    }

    return flattenTypeErrors(
      Object.keys(value).map((item, index) =>
        this._subType.validate(item, getContextForPath(context, "" + index, this._subType))
      )
    )
  }
}
SetType.prototype.applySnapshot = action(SetType.prototype.applySnapshot)

export function set<IT extends IAnyType>(subtype: IT): ISetType<IT> {
  return new SetType<IT>(`${subtype.name} Set`, subtype)
}
