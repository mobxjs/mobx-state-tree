import {
    IAnyType,
    ObjectNode,
    NodeLifeCycle,
    EventHandler,
    Hook,
    escapeJsonPath
} from "../../internal"
import { createAtom } from "mobx"

/**
 * @internal
 * @private
 */
export abstract class BaseNode {
    protected readonly subpathAtom = createAtom(`path`)
    protected escapedSubpath: string
    storedValue: any

    private readonly aliveAtom = createAtom(`alive`)
    private _state = NodeLifeCycle.INITIALIZING
    get state() {
        return this._state
    }
    set state(val: NodeLifeCycle) {
        const wasAlive = this.isAlive
        this._state = val
        const isAlive = this.isAlive

        if (wasAlive !== isAlive) {
            this.aliveAtom.reportChanged()
        }
    }

    readonly type: IAnyType
    readonly hookSubscribers: { [k: string]: EventHandler<(node: any, hook: Hook) => void> } = {}

    environment: any = undefined
    subpath: string = ""
    parent: ObjectNode | null = null

    constructor(type: IAnyType, parent: ObjectNode | null, subpath: string, environment: any) {
        this.environment = environment
        this.type = type
        this.parent = parent
        this.subpath = subpath
        this.escapedSubpath = escapeJsonPath(this.subpath)
    }

    /*
     * Returns (escaped) path representation as string
     */
    get path(): string {
        this.subpathAtom.reportObserved()
        if (!this.parent) return ""
        return this.parent.path + "/" + this.escapedSubpath
    }

    get isRoot(): boolean {
        return this.parent === null
    }

    abstract get root(): ObjectNode

    abstract setParent(newParent: ObjectNode | null, subpath: string | null): void

    protected abstract fireHook(name: Hook): void

    protected fireInternalHook(name: Hook) {
        this.hookSubscribers[name].emit(this, name)
    }

    value: any

    snapshot: any
    abstract getSnapshot(): any

    get isAlive() {
        return this.state !== NodeLifeCycle.DEAD
    }

    get observableIsAlive() {
        this.aliveAtom.reportObserved()
        return this.isAlive
    }

    abstract die(): void

    abstract finalizeCreation(): void

    protected partialFinalizeCreation() {
        // goal: afterCreate hooks runs depth-first. After attach runs parent first, so on afterAttach the parent has completed already
        if (this.state === NodeLifeCycle.CREATED) {
            if (this.parent) {
                if (this.parent.state !== NodeLifeCycle.FINALIZED) {
                    // parent not ready yet, postpone
                    return false
                }
                this.fireHook(Hook.afterAttach)
            }
            this.state = NodeLifeCycle.FINALIZED

            return true
        }
        return false
    }

    abstract finalizeDeath(): void

    protected partialFinalizeDeath() {
        Object.keys(this.hookSubscribers).forEach(k => this.hookSubscribers[k].clear())

        this.parent = null
        this.subpath = this.escapedSubpath = ""
        this.subpathAtom.reportChanged()
        this.state = NodeLifeCycle.DEAD
    }

    abstract aboutToDie(): void

    protected partialAboutToDie() {
        this.fireHook(Hook.beforeDestroy)
    }
}

/**
 * @internal
 * @private
 */
export type INode = BaseNode
