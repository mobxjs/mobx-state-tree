// noinspection ES6UnusedImports
import { action, computed, IComputedValue, reaction, _allowStateChangesInsideComputed } from "mobx"
import {
  addHiddenFinalProp,
  ComplexType,
  convertChildNodesToArray,
  createActionInvoker,
  EMPTY_OBJECT,
  extend,
  fail,
  freeze,
  IAnyType,
  IdentifierCache,
  IDisposer,
  IJsonPatch,
  IMiddleware,
  IMiddlewareHandler,
  IReversibleJsonPatch,
  NodeLifeCycle,
  resolveNodeByPathParts,
  splitJsonPath,
  splitPatch,
  toJSON,
  EventHandlers,
  Hook,
  BaseNode,
  getLivelinessChecking,
  normalizeIdentifier,
  ReferenceIdentifier,
  IMiddlewareEvent,
  escapeJsonPath,
  getPath,
  warnError,
  AnyNode,
  IStateTreeNode,
  ArgumentTypes,
  IType,
  devMode,
  getCurrentActionContext
} from "../../internal"

let nextNodeId = 1

const enum ObservableInstanceLifecycle {
  // the actual observable instance has not been created yet
  UNINITIALIZED,
  // the actual observable instance is being created
  CREATING,
  // the actual observable instance has been created
  CREATED
}

const enum InternalEvents {
  Dispose = "dispose",
  Patch = "patch",
  Snapshot = "snapshot"
}

/**
 * @internal
 * @hidden
 */
export interface IChildNodesMap {
  [key: string]: AnyNode
}

const snapshotReactionOptions = {
  onError(e: any) {
    throw e
  }
}

type InternalEventHandlers<S> = {
  [InternalEvents.Dispose]: IDisposer
  [InternalEvents.Patch]: (patch: IJsonPatch, reversePatch: IJsonPatch) => void
  [InternalEvents.Snapshot]: (snapshot: S) => void
}

/**
 * @internal
 * @hidden
 */
export class ObjectNode<C, S, T> extends BaseNode<C, S, T> {
  declare readonly type: ComplexType<C, S, T>
  declare storedValue: T & IStateTreeNode<IType<C, S, T>>

  readonly nodeId = ++nextNodeId
  readonly identifierAttribute?: string
  readonly identifier: string | null // Identifier is always normalized to string, even if the identifier property isn't
  readonly unnormalizedIdentifier: ReferenceIdentifier | null

  identifierCache?: IdentifierCache
  isProtectionEnabled = true
  middlewares?: IMiddleware[]
  hasSnapshotPostProcessor = false

  private _applyPatches?: (patches: IJsonPatch[]) => void

  applyPatches(patches: IJsonPatch[]): void {
    this.createObservableInstanceIfNeeded()
    this._applyPatches!(patches)
  }

  private _applySnapshot?: (snapshot: C) => void

  applySnapshot(snapshot: C): void {
    this.createObservableInstanceIfNeeded()
    this._applySnapshot!(snapshot)
  }

  private _autoUnbox = true // unboxing is disabled when reading child nodes
  _isRunningAction = false // only relevant for root
  private _hasSnapshotReaction = false

  private _observableInstanceState = ObservableInstanceLifecycle.UNINITIALIZED
  private _childNodes: IChildNodesMap
  private _initialSnapshot: C
  private _cachedInitialSnapshot?: S
  private _cachedInitialSnapshotCreated = false
  private _snapshotComputed: IComputedValue<S>

  constructor(
    complexType: ComplexType<C, S, T>,
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: C
  ) {
    super(complexType, parent, subpath, environment)
    this._snapshotComputed = computed<S>(() => freeze(this.getSnapshot()))

    this.unbox = this.unbox.bind(this)

    this._initialSnapshot = freeze(initialValue)
    this.identifierAttribute = complexType.identifierAttribute

    if (!parent) {
      this.identifierCache = new IdentifierCache()
    }

    this._childNodes = complexType.initializeChildNodes(this, this._initialSnapshot)

    // identifier can not be changed during lifecycle of a node
    // so we safely can read it from initial snapshot
    this.identifier = null
    this.unnormalizedIdentifier = null
    if (this.identifierAttribute && this._initialSnapshot) {
      let id = (this._initialSnapshot as any)[this.identifierAttribute]
      if (id === undefined) {
        // try with the actual node if not (for optional identifiers)
        const childNode = this._childNodes[this.identifierAttribute]
        if (childNode) {
          id = childNode.value
        }
      }

      if (typeof id !== "string" && typeof id !== "number") {
        throw fail(
          `Instance identifier '${this.identifierAttribute}' for type '${this.type.name}' must be a string or a number`
        )
      }

      // normalize internal identifier to string
      this.identifier = normalizeIdentifier(id)
      this.unnormalizedIdentifier = id
    }

    if (!parent) {
      this.identifierCache!.addNodeToCache(this)
    } else {
      parent.root.identifierCache!.addNodeToCache(this)
    }
  }

  createObservableInstanceIfNeeded(fireHooks = true): void {
    if (this._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED) {
      this.createObservableInstance(fireHooks)
    }
  }

  createObservableInstance(fireHooks = true): void {
    if (devMode()) {
      if (this.state !== NodeLifeCycle.INITIALIZING) {
        // istanbul ignore next
        throw fail(
          "assertion failed: the creation of the observable instance must be done on the initializing phase"
        )
      }
    }
    this._observableInstanceState = ObservableInstanceLifecycle.CREATING

    // make sure the parent chain is created as well

    // array with parent chain from parent to child
    const parentChain = []

    let parent = this.parent
    // for performance reasons we never go back further than the most direct
    // uninitialized parent
    // this is done to avoid traversing the whole tree to the root when using
    // the same reference again
    while (
      parent &&
      parent._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED
    ) {
      parentChain.unshift(parent)
      parent = parent.parent
    }

    // initialize the uninitialized parent chain from parent to child
    for (const p of parentChain) {
      // delay firing hooks until after all parents have been created
      p.createObservableInstanceIfNeeded(false)
    }

    const type = this.type

    try {
      this.storedValue = type.createNewInstance(this._childNodes)
      this.preboot()

      this._isRunningAction = true
      type.finalizeNewInstance(this, this.storedValue)
    } catch (e) {
      // short-cut to die the instance, to avoid the snapshot computed starting to throw...
      this.state = NodeLifeCycle.DEAD
      throw e
    } finally {
      this._isRunningAction = false
    }

    this._observableInstanceState = ObservableInstanceLifecycle.CREATED

    // NOTE: we need to touch snapshot, because non-observable
    // "_observableInstanceState" field was touched
    ;(this._snapshotComputed as any).trackAndCompute()

    if (this.isRoot) this._addSnapshotReaction()

    this._childNodes = EMPTY_OBJECT

    this.state = NodeLifeCycle.CREATED

    if (fireHooks) {
      this.fireHook(Hook.afterCreate)
      // Note that the parent might not be finalized at this point
      // so afterAttach won't be called until later in that case
      this.finalizeCreation()

      // fire the hooks of the parents that we created
      for (const p of parentChain.reverse()) {
        p.fireHook(Hook.afterCreate)
        // This will call afterAttach on the child if necessary
        p.finalizeCreation()
      }
    }
  }

  get root(): AnyObjectNode {
    const parent = this.parent
    return parent ? parent.root : this
  }

  clearParent(): void {
    if (!this.parent) return

    // detach if attached
    this.fireHook(Hook.beforeDetach)
    const previousState = this.state
    this.state = NodeLifeCycle.DETACHING

    const root = this.root
    const newEnv = root.environment
    const newIdCache = root.identifierCache!.splitCache(this)

    try {
      this.parent.removeChild(this.subpath)
      this.baseSetParent(null, "")
      this.environment = newEnv
      this.identifierCache = newIdCache
    } finally {
      this.state = previousState
    }
  }

  setParent(newParent: AnyObjectNode, subpath: string): void {
    const parentChanged = newParent !== this.parent
    const subpathChanged = subpath !== this.subpath

    if (!parentChanged && !subpathChanged) {
      return
    }

    if (devMode()) {
      if (!subpath) {
        // istanbul ignore next
        throw fail("assertion failed: subpath expected")
      }
      if (!newParent) {
        // istanbul ignore next
        throw fail("assertion failed: new parent expected")
      }

      if (this.parent && parentChanged) {
        throw fail(
          `A node cannot exists twice in the state tree. Failed to add ${this} to path '${newParent.path}/${subpath}'.`
        )
      }
      if (!this.parent && newParent.root === this) {
        throw fail(
          `A state tree is not allowed to contain itself. Cannot assign ${this} to path '${newParent.path}/${subpath}'`
        )
      }
      if (!this.parent && !!this.environment && this.environment !== newParent.root.environment) {
        throw fail(
          `A state tree cannot be made part of another state tree as long as their environments are different.`
        )
      }
    }

    if (parentChanged) {
      // attach to new parent
      this.environment = undefined // will use root's
      newParent.root.identifierCache!.mergeCache(this)
      this.baseSetParent(newParent, subpath)
      this.fireHook(Hook.afterAttach)
    } else if (subpathChanged) {
      // moving to a new subpath on the same parent
      this.baseSetParent(this.parent, subpath)
    }
  }

  protected fireHook(name: Hook): void {
    this.fireInternalHook(name)

    const fn =
      this.storedValue && typeof this.storedValue === "object" && (this.storedValue as any)[name]
    if (typeof fn === "function") {
      // we check for it to allow old mobx peer dependencies that don't have the method to work (even when still bugged)
      if (_allowStateChangesInsideComputed) {
        _allowStateChangesInsideComputed(() => {
          fn.apply(this.storedValue)
        })
      } else {
        fn.apply(this.storedValue)
      }
    }
  }

  private _snapshotUponDeath?: S

  // advantage of using computed for a snapshot is that nicely respects transactions etc.
  get snapshot(): S {
    if (this.hasSnapshotPostProcessor) {
      this.createObservableInstanceIfNeeded()
    }
    return this._snapshotComputed.get()
  }

  // NOTE: we use this method to get snapshot without creating @computed overhead
  getSnapshot(): S {
    if (!this.isAlive) return this._snapshotUponDeath!
    return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
      ? this._getActualSnapshot()
      : this._getCachedInitialSnapshot()
  }

  private _getActualSnapshot(): S {
    return this.type.getSnapshot(this)
  }

  private _getCachedInitialSnapshot(): S {
    if (!this._cachedInitialSnapshotCreated) {
      const type = this.type
      const childNodes = this._childNodes
      const snapshot = this._initialSnapshot

      this._cachedInitialSnapshot = type.processInitialSnapshot(childNodes, snapshot)
      this._cachedInitialSnapshotCreated = true
    }

    return this._cachedInitialSnapshot!
  }

  private isRunningAction(): boolean {
    if (this._isRunningAction) return true
    if (this.isRoot) return false
    return this.parent!.isRunningAction()
  }

  assertAlive(context: AssertAliveContext): void {
    const livelinessChecking = getLivelinessChecking()
    if (!this.isAlive && livelinessChecking !== "ignore") {
      const error = this._getAssertAliveError(context)
      switch (livelinessChecking) {
        case "error":
          throw fail(error)
        case "warn":
          warnError(error)
      }
    }
  }

  private _getAssertAliveError(context: AssertAliveContext): string {
    const escapedPath = this.getEscapedPath(false) || this.pathUponDeath || ""
    const subpath = (context.subpath && escapeJsonPath(context.subpath)) || ""

    let actionContext = context.actionContext || getCurrentActionContext()

    // try to use a real action context if possible since it includes the action name
    if (actionContext && actionContext.type !== "action" && actionContext.parentActionEvent) {
      actionContext = actionContext.parentActionEvent
    }

    let actionFullPath = ""
    if (actionContext && actionContext.name != null) {
      // try to use the context, and if it not available use the node one
      const actionPath =
        (actionContext && actionContext.context && getPath(actionContext.context)) || escapedPath
      actionFullPath = `${actionPath}.${actionContext.name}()`
    }

    return `You are trying to read or write to an object that is no longer part of a state tree. (Object type: '${this.type.name}', Path upon death: '${escapedPath}', Subpath: '${subpath}', Action: '${actionFullPath}'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.`
  }

  getChildNode(subpath: string): AnyNode {
    this.assertAlive({
      subpath
    })
    this._autoUnbox = false
    try {
      return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
        ? this.type.getChildNode(this, subpath)
        : this._childNodes![subpath]
    } finally {
      this._autoUnbox = true
    }
  }

  getChildren(): ReadonlyArray<AnyNode> {
    this.assertAlive(EMPTY_OBJECT)
    this._autoUnbox = false
    try {
      return this._observableInstanceState === ObservableInstanceLifecycle.CREATED
        ? this.type.getChildren(this)
        : convertChildNodesToArray(this._childNodes)
    } finally {
      this._autoUnbox = true
    }
  }

  getChildType(propertyName?: string): IAnyType {
    return this.type.getChildType(propertyName)
  }

  get isProtected(): boolean {
    return this.root.isProtectionEnabled
  }

  assertWritable(context: AssertAliveContext): void {
    this.assertAlive(context)
    if (!this.isRunningAction() && this.isProtected) {
      throw fail(
        `Cannot modify '${this}', the object is protected and can only be modified by using an action.`
      )
    }
  }

  removeChild(subpath: string): void {
    this.type.removeChild(this, subpath)
  }

  // bound on the constructor
  unbox(childNode: AnyNode | undefined): AnyNode | undefined {
    if (!childNode) return childNode

    this.assertAlive({
      subpath: childNode.subpath || childNode.subpathUponDeath
    })
    return this._autoUnbox ? childNode.value : childNode
  }

  toString(): string {
    const path = (this.isAlive ? this.path : this.pathUponDeath) || "<root>"
    const identifier = this.identifier ? `(id: ${this.identifier})` : ""
    return `${this.type.name}@${path}${identifier}${this.isAlive ? "" : " [dead]"}`
  }

  finalizeCreation(): void {
    this.baseFinalizeCreation(() => {
      for (let child of this.getChildren()) {
        child.finalizeCreation()
      }

      this.fireInternalHook(Hook.afterCreationFinalization)
    })
  }

  detach(): void {
    if (!this.isAlive) throw fail(`Error while detaching, node is not alive.`)

    this.clearParent()
  }

  private preboot(): void {
    const self = this
    this._applyPatches = createActionInvoker(
      this.storedValue,
      "@APPLY_PATCHES",
      (patches: IJsonPatch[]) => {
        patches.forEach((patch) => {
          if (!patch.path) {
            self.type.applySnapshot(self, patch.value)
            return
          }
          const parts = splitJsonPath(patch.path)
          const node = resolveNodeByPathParts(self, parts.slice(0, -1)) as AnyObjectNode
          node.applyPatchLocally(parts[parts.length - 1], patch)
        })
      }
    )
    this._applySnapshot = createActionInvoker(
      this.storedValue,
      "@APPLY_SNAPSHOT",
      (snapshot: C) => {
        // if the snapshot is the same as the current one, avoid performing a reconcile
        if (snapshot === (self.snapshot as any)) return
        // else, apply it by calling the type logic
        return self.type.applySnapshot(self, snapshot as any)
      }
    )

    addHiddenFinalProp(this.storedValue, "$treenode", this)
    addHiddenFinalProp(this.storedValue, "toJSON", toJSON)
  }

  die(): void {
    if (!this.isAlive || this.state === NodeLifeCycle.DETACHING) return
    this.aboutToDie()
    this.finalizeDeath()
  }

  aboutToDie(): void {
    if (this._observableInstanceState === ObservableInstanceLifecycle.UNINITIALIZED) {
      return
    }

    this.getChildren().forEach((node) => {
      node.aboutToDie()
    })

    // beforeDestroy should run before the disposers since else we could end up in a situation where
    // a disposer added with addDisposer at this stage (beforeDestroy) is actually never released
    this.baseAboutToDie()

    this._internalEventsEmit(InternalEvents.Dispose)
    this._internalEventsClear(InternalEvents.Dispose)
  }

  finalizeDeath(): void {
    // invariant: not called directly but from "die"
    this.getChildren().forEach((node) => {
      node.finalizeDeath()
    })
    this.root.identifierCache!.notifyDied(this)

    // "kill" the computed prop and just store the last snapshot
    const snapshot = this.snapshot
    this._snapshotUponDeath = snapshot

    this._internalEventsClearAll()

    this.baseFinalizeDeath()
  }

  onSnapshot(onChange: (snapshot: S) => void): IDisposer {
    this._addSnapshotReaction()
    return this._internalEventsRegister(InternalEvents.Snapshot, onChange)
  }

  protected emitSnapshot(snapshot: S): void {
    this._internalEventsEmit(InternalEvents.Snapshot, snapshot)
  }

  onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
    return this._internalEventsRegister(InternalEvents.Patch, handler)
  }

  emitPatch(basePatch: IReversibleJsonPatch, source: AnyNode): void {
    if (this._internalEventsHasSubscribers(InternalEvents.Patch)) {
      const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
        path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
      })
      const [patch, reversePatch] = splitPatch(localizedPatch)
      this._internalEventsEmit(InternalEvents.Patch, patch, reversePatch)
    }
    if (this.parent) this.parent.emitPatch(basePatch, source)
  }

  hasDisposer(disposer: () => void): boolean {
    return this._internalEventsHas(InternalEvents.Dispose, disposer)
  }

  addDisposer(disposer: () => void): void {
    if (!this.hasDisposer(disposer)) {
      this._internalEventsRegister(InternalEvents.Dispose, disposer, true)
      return
    }
    throw fail("cannot add a disposer when it is already registered for execution")
  }

  removeDisposer(disposer: () => void): void {
    if (!this._internalEventsHas(InternalEvents.Dispose, disposer)) {
      throw fail("cannot remove a disposer which was never registered for execution")
    }
    this._internalEventsUnregister(InternalEvents.Dispose, disposer)
  }

  private removeMiddleware(middleware: IMiddleware): void {
    if (this.middlewares) {
      const index = this.middlewares.indexOf(middleware)
      if (index >= 0) {
        this.middlewares.splice(index, 1)
      }
    }
  }

  addMiddleWare(handler: IMiddlewareHandler, includeHooks: boolean = true): IDisposer {
    const middleware = { handler, includeHooks }
    if (!this.middlewares) this.middlewares = [middleware]
    else this.middlewares.push(middleware)

    return () => {
      this.removeMiddleware(middleware)
    }
  }

  applyPatchLocally(subpath: string, patch: IJsonPatch): void {
    this.assertWritable({
      subpath
    })
    this.createObservableInstanceIfNeeded()
    this.type.applyPatchLocally(this, subpath, patch)
  }

  private _addSnapshotReaction(): void {
    if (!this._hasSnapshotReaction) {
      const snapshotDisposer = reaction(
        () => this.snapshot,
        (snapshot) => this.emitSnapshot(snapshot),
        snapshotReactionOptions
      )
      this.addDisposer(snapshotDisposer)
      this._hasSnapshotReaction = true
    }
  }

  // #region internal event handling

  private _internalEvents?: EventHandlers<InternalEventHandlers<S>>

  // we proxy the methods to avoid creating an EventHandlers instance when it is not needed

  private _internalEventsHasSubscribers(event: InternalEvents): boolean {
    return !!this._internalEvents && this._internalEvents.hasSubscribers(event)
  }

  private _internalEventsRegister<IE extends InternalEvents>(
    event: IE,
    eventHandler: InternalEventHandlers<S>[IE],
    atTheBeginning = false
  ): IDisposer {
    if (!this._internalEvents) {
      this._internalEvents = new EventHandlers()
    }
    return this._internalEvents.register(event, eventHandler, atTheBeginning)
  }

  private _internalEventsHas<IE extends InternalEvents>(
    event: IE,
    eventHandler: InternalEventHandlers<S>[IE]
  ): boolean {
    return !!this._internalEvents && this._internalEvents.has(event, eventHandler)
  }

  private _internalEventsUnregister<IE extends InternalEvents>(
    event: IE,
    eventHandler: InternalEventHandlers<S>[IE]
  ): void {
    if (this._internalEvents) {
      this._internalEvents.unregister(event, eventHandler)
    }
  }

  private _internalEventsEmit<IE extends InternalEvents>(
    event: IE,
    ...args: ArgumentTypes<InternalEventHandlers<S>[IE]>
  ): void {
    if (this._internalEvents) {
      this._internalEvents.emit(event, ...args)
    }
  }

  private _internalEventsClear(event: InternalEvents): void {
    if (this._internalEvents) {
      this._internalEvents.clear(event)
    }
  }

  private _internalEventsClearAll(): void {
    if (this._internalEvents) {
      this._internalEvents.clearAll()
    }
  }

  // #endregion
}
ObjectNode.prototype.createObservableInstance = action(
  ObjectNode.prototype.createObservableInstance
)
ObjectNode.prototype.detach = action(ObjectNode.prototype.detach)
ObjectNode.prototype.die = action(ObjectNode.prototype.die)

/**
 * @internal
 * @hidden
 */
export type AnyObjectNode = ObjectNode<any, any, any>

/**
 * @internal
 * @hidden
 */
export interface AssertAliveContext {
  subpath?: string
  actionContext?: IMiddlewareEvent
}
