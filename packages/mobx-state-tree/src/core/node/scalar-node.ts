import {
    fail,
    freeze,
    NodeLifeCycle,
    ObjectNode,
    IAnyType,
    Hook,
    BaseNode,
    escapeJsonPath
} from "../../internal"
import { action } from "mobx"

/**
 * @internal
 * @private
 */
export class ScalarNode extends BaseNode {
    constructor(
        type: IAnyType,
        parent: ObjectNode | null,
        subpath: string,
        environment: any,
        initialSnapshot: any
    ) {
        super(type, parent, subpath, environment)

        let sawException = true
        try {
            this.storedValue = type.createNewInstance(this, {}, initialSnapshot)
            this.state = NodeLifeCycle.CREATED
            this.fireHook(Hook.AfterCreate)
            sawException = false
        } finally {
            if (sawException) {
                // short-cut to die the instance, to avoid the snapshot computed starting to throw...
                this.state = NodeLifeCycle.DEAD
            }
        }

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
            if (this.subpath !== newPath) {
                this.subpath = newPath
                this.escapedSubpath = escapeJsonPath(this.subpath)
                this.subpathAtom.reportChanged()
            }
            if (newParent && newParent !== this.parent) {
                // newParent.root.identifierCache!.mergeCache(this)
                this.parent = newParent
                this.subpathAtom.reportChanged()
                this.fireHook(Hook.AfterAttach)
            }
        }
    }

    get value(): any {
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
        this.internalFinalizeCreation()
    }

    aboutToDie() {
        this.internalAboutToDie()
    }

    finalizeDeath() {
        this.internalFinalizeDeath()
    }

    protected fireHook(name: Hook) {
        this.internalFireHook(name)
    }
}
