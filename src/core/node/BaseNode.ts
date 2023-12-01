import {
  AnyObjectNode,
  NodeLifeCycle,
  Hook,
  escapeJsonPath,
  EventHandlers,
  IAnyType,
  IDisposer,
  devMode,
  fail
} from "../../internal"
import { createAtom, IAtom } from "mobx"

type HookSubscribers = {
  [Hook.afterAttach]: (node: AnyNode, hook: Hook) => void
  [Hook.afterCreate]: (node: AnyNode, hook: Hook) => void
  [Hook.afterCreationFinalization]: (node: AnyNode, hook: Hook) => void
  [Hook.beforeDestroy]: (node: AnyNode, hook: Hook) => void
  [Hook.beforeDetach]: (node: AnyNode, hook: Hook) => void
}

/**
 * @internal
 * @hidden
 */
export abstract class BaseNode<C, S, T> {
  private _escapedSubpath?: string

  private _subpath!: string
  get subpath() {
    return this._subpath
  }

  private _subpathUponDeath?: string
  get subpathUponDeath() {
    return this._subpathUponDeath
  }

  private _pathUponDeath?: string
  protected get pathUponDeath() {
    return this._pathUponDeath
  }

  storedValue!: any // usually the same type as the value, but not always (such as with references)
  get value(): T {
    return (this.type as any).getValue(this)
  }

  private aliveAtom?: IAtom
  private _state = NodeLifeCycle.INITIALIZING
  get state() {
    return this._state
  }
  set state(val: NodeLifeCycle) {
    const wasAlive = this.isAlive
    this._state = val
    const isAlive = this.isAlive

    if (this.aliveAtom && wasAlive !== isAlive) {
      this.aliveAtom.reportChanged()
    }
  }

  private _hookSubscribers?: EventHandlers<HookSubscribers>

  protected abstract fireHook(name: Hook): void

  protected fireInternalHook(name: Hook) {
    if (this._hookSubscribers) {
      this._hookSubscribers.emit(name, this, name)
    }
  }

  registerHook<H extends Hook>(hook: H, hookHandler: HookSubscribers[H]): IDisposer {
    if (!this._hookSubscribers) {
      this._hookSubscribers = new EventHandlers()
    }
    return this._hookSubscribers.register(hook, hookHandler)
  }

  private _parent!: AnyObjectNode | null
  get parent() {
    return this._parent
  }

  constructor(
    readonly type: IAnyType,
    parent: AnyObjectNode | null,
    subpath: string,
    public environment: any
  ) {
    this.environment = environment
    this.baseSetParent(parent, subpath)
  }

  getReconciliationType() {
    return this.type
  }

  private pathAtom?: IAtom
  protected baseSetParent(parent: AnyObjectNode | null, subpath: string) {
    this._parent = parent
    this._subpath = subpath
    this._escapedSubpath = undefined // regenerate when needed
    if (this.pathAtom) {
      this.pathAtom.reportChanged()
    }
  }

  /*
   * Returns (escaped) path representation as string
   */
  get path(): string {
    return this.getEscapedPath(true)
  }

  protected getEscapedPath(reportObserved: boolean): string {
    if (reportObserved) {
      if (!this.pathAtom) {
        this.pathAtom = createAtom(`path`)
      }
      this.pathAtom.reportObserved()
    }
    if (!this.parent) return ""
    // regenerate escaped subpath if needed
    if (this._escapedSubpath === undefined) {
      this._escapedSubpath = !this._subpath ? "" : escapeJsonPath(this._subpath)
    }
    return this.parent.getEscapedPath(reportObserved) + "/" + this._escapedSubpath
  }

  get isRoot(): boolean {
    return this.parent === null
  }

  abstract get root(): AnyObjectNode

  abstract setParent(newParent: AnyObjectNode | null, subpath: string | null): void

  abstract get snapshot(): S
  abstract getSnapshot(): S

  get isAlive() {
    return this.state !== NodeLifeCycle.DEAD
  }

  get isDetaching() {
    return this.state === NodeLifeCycle.DETACHING
  }

  get observableIsAlive() {
    if (!this.aliveAtom) {
      this.aliveAtom = createAtom(`alive`)
    }
    this.aliveAtom.reportObserved()
    return this.isAlive
  }

  abstract die(): void

  abstract finalizeCreation(): void

  protected baseFinalizeCreation(whenFinalized?: () => void) {
    if (devMode()) {
      if (!this.isAlive) {
        // istanbul ignore next
        throw fail("assertion failed: cannot finalize the creation of a node that is already dead")
      }
    }

    // goal: afterCreate hooks runs depth-first. After attach runs parent first, so on afterAttach the parent has completed already
    if (this.state === NodeLifeCycle.CREATED) {
      if (this.parent) {
        if (this.parent.state !== NodeLifeCycle.FINALIZED) {
          // parent not ready yet, postpone
          return
        }
        this.fireHook(Hook.afterAttach)
      }

      this.state = NodeLifeCycle.FINALIZED

      if (whenFinalized) {
        whenFinalized()
      }
    }
  }

  abstract finalizeDeath(): void

  protected baseFinalizeDeath() {
    if (this._hookSubscribers) {
      this._hookSubscribers.clearAll()
    }

    this._subpathUponDeath = this._subpath
    this._pathUponDeath = this.getEscapedPath(false)
    this.baseSetParent(null, "")
    this.state = NodeLifeCycle.DEAD
  }

  abstract aboutToDie(): void

  protected baseAboutToDie() {
    this.fireHook(Hook.beforeDestroy)
  }
}

/**
 * @internal
 * @hidden
 */
export type AnyNode = BaseNode<any, any, any>
