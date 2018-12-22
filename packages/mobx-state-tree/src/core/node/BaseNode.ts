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
    state = NodeLifeCycle.INITIALIZING
    storedValue: any

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
            this.fireInternalHook(Hook.afterCreationFinalization)

            return true
        }
        return false
    }

    abstract finalizeDeath(): void

    protected partialFinalizeDeath() {
        Object.keys(this.hookSubscribers).forEach(k => this.hookSubscribers[k].clear())

        this.parent = null
        this.state = NodeLifeCycle.DEAD
        this.subpath = this.escapedSubpath = ""
        this.subpathAtom.reportChanged()
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
