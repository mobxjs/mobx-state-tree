import {
    fail,
    freeze,
    NodeLifeCycle,
    ObjectNode,
    IAnyType,
    Hook,
    BaseNode,
    escapeJsonPath,
    EventHandler
} from "../../internal"
import { action } from "mobx"

/**
 * @internal
 * @private
 */
export class ScalarNode extends BaseNode {
    readonly hookSubscribers = {
        // afterCreate in scalar nodes is executed in the constructor, so it cannot be registered before it is already executed
        // [Hook.afterCreate]: new EventHandler<(node: ScalarNode) => void>(),

        [Hook.afterAttach]: new EventHandler<(node: ScalarNode) => void>(),
        [Hook.afterCreationFinalization]: new EventHandler<
            (node: ObjectNode, hook: Hook) => void
        >(),

        // beforeDetach is never executed for scalar nodes, since they cannot be detached
        // [Hook.beforeDetach]: new EventHandler<(node: ScalarNode) => void>(),

        [Hook.beforeDestroy]: new EventHandler<(node: ScalarNode) => void>()
    }
    constructor(
        type: IAnyType,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialSnapshot: any
    ) {
        super(type, parent, subpath, environment)

        try {
            this.storedValue = type.createNewInstance(this, {}, initialSnapshot)
        } catch (e) {
            // short-cut to die the instance, to avoid the snapshot computed starting to throw...
            this.state = NodeLifeCycle.DEAD
            throw e
        }

        this.state = NodeLifeCycle.CREATED
        // for scalar nodes there's no point in firing this event since it would fire on the constructor, before
        // anybody can actually register for/listen to it
        // this.fireHook(Hook.AfterCreate)

        this.finalizeCreation()
    }

    get root(): ObjectNode {
        // future optimization: store root ref in the node and maintain it
        if (!this.parent) return fail(`This scalar node is not part of a tree`)
        return this.parent.root
    }

    setParent(newParent: ObjectNode | null, subpath: string | null = null) {
        if (this.parent === newParent && this.subpath === subpath) return
        if (this.parent && !newParent) {
            this.die()
        } else {
            const newPath = subpath === null ? "" : subpath
            if (newParent && newParent !== this.parent) {
                fail("assertion failed: scalar nodes cannot change their parent")
            } else if (this.subpath !== newPath) {
                this.baseSetParent(this.parent, newPath)
            }
        }
    }

    get value(): any {
        // make sure the parent chain is created when this is accessed
        if (this.parent) {
            this.parent.createObservableInstanceIfNeeded()
        }
        return this.type.getValue(this)
    }

    get snapshot(): any {
        return freeze(this.getSnapshot())
    }

    getSnapshot(): any {
        return this.type.getSnapshot(this)
    }

    toString(): string {
        return `${this.type.name}@${this.path || "<root>"}${this.isAlive ? "" : "[dead]"}`
    }

    @action
    die() {
        if (this.state === NodeLifeCycle.DETACHING) return
        this.aboutToDie()
        this.finalizeDeath()
    }

    finalizeCreation() {
        this.baseFinalizeCreation()
    }

    aboutToDie() {
        this.baseAboutToDie()
    }

    finalizeDeath() {
        this.baseFinalizeDeath()
    }

    protected fireHook(name: Hook) {
        this.fireInternalHook(name)
    }
}
