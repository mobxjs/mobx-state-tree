import {
    fail,
    freeze,
    NodeLifeCycle,
    IAnyType,
    Hook,
    BaseNode,
    AnyObjectNode
} from "../../internal"
import { action } from "mobx"

/**
 * @internal
 * @hidden
 */
export class ScalarNode<S, T> extends BaseNode<S, T> {
    // note about hooks:
    // - afterCreate is not emmited in scalar nodes, since it would be emitted in the
    //   constructor, before it can be subscribed by anybody
    // - afterCreationFinalization could be emitted, but there's no need for it right now
    // - beforeDetach is never emitted for scalar nodes, since they cannot be detached

    constructor(
        type: IAnyType,
        parent: AnyObjectNode | null,
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

    get root(): AnyObjectNode {
        // future optimization: store root ref in the node and maintain it
        if (!this.parent) throw fail(`This scalar node is not part of a tree`)
        return this.parent.root
    }

    setParent(newParent: AnyObjectNode | null, subpath: string | null = null): void {
        if (this.parent === newParent && this.subpath === subpath) return
        if (this.parent && !newParent) {
            this.die()
        } else {
            const newPath = subpath === null ? "" : subpath
            if (newParent && newParent !== this.parent) {
                throw fail("assertion failed: scalar nodes cannot change their parent")
            } else if (this.subpath !== newPath) {
                this.baseSetParent(this.parent, newPath)
            }
        }
    }

    get value(): any {
        // if we ever find a case where scalar nodes can be accessed without iterating through its parent
        // uncomment this to make sure the parent chain is created when this is accessed
        // if (this.parent) {
        //     this.parent.createObservableInstanceIfNeeded()
        // }
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
