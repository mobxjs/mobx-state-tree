export class ObjectNode extends ScalarNode implements INode {
    middlewares: IMiddlewareHandler[]
    private snapshotSubscribers: ((snapshot: any) => void)[]
    // TODO: split patches in two; patch and reversePatch
    private patchSubscribers: ((patch: IJsonPatch, reversePatch: IJsonPatch) => void)[]
    private disposers: (() => void)[]
    // applyPatches: (patches: IJsonPatch[]) => void
    // applySnapshot: (snapshot: any) => void

    constructor(
        type: IType<any, any>,
        parent: INode | null,
        subpath: string,
        environment: any,
        initialValue: any,
        storedValue: any,
        canAttachTreeNode: boolean,
        finalizeNewInstance: (node: INode, initialValue: any) => void = noop
    ) {
        super(
            type,
            parent,
            subpath,
            environment,
            initialValue,
            storedValue,
            canAttachTreeNode,
            finalizeNewInstance
        )

        // optimization: don't keep the snapshot by default alive with a reaction by default
        // in prod mode. This saves lot of GC overhead (important for e.g. React Native)
        // if the feature is not actively used
        // downside; no structural sharing if getSnapshot is called incidently
        const snapshotDisposer = reaction(
            () => this.snapshot,
            snapshot => {
                this.emitSnapshot(snapshot)
            }
        )
        snapshotDisposer.onError((e: any) => {
            throw e
        })
        this.addDisposer(snapshotDisposer)
    }

    preboot() {
        this.disposers = []
        this.middlewares = []
        this.snapshotSubscribers = []
        this.patchSubscribers = []

        // Optimization: this does not need to be done per instance
        // if some pieces from createActionInvoker are extracted
        this.applyPatches = createActionInvoker(
            this.storedValue,
            "@APPLY_PATCHES",
            (patches: IJsonPatch[]) => {
                patches.forEach(patch => {
                    const parts = splitJsonPath(patch.path)
                    const node = this.resolvePath(parts.slice(0, -1))
                    node.applyPatchLocally(parts[parts.length - 1], patch)
                })
            }
        ).bind(this.storedValue)
        this.applySnapshot = createActionInvoker(
            this.storedValue,
            "@APPLY_SNAPSHOT",
            (snapshot: any) => {
                // if the snapshot is the same as the current one, avoid performing a reconcile
                if (snapshot === this.snapshot) return
                // else, apply it by calling the type logic
                return this.type.applySnapshot(this, snapshot)
            }
        ).bind(this.storedValue)
    }

    public die() {
        if (this._isDetaching) return

        if (isStateTreeNode(this.storedValue)) {
            walk(this.storedValue, child => getStateTreeNode(child).aboutToDie())
            walk(this.storedValue, child => getStateTreeNode(child).finalizeDeath())
        }
    }

    public aboutToDie() {
        this.disposers.splice(0).forEach(f => f())
        this.fireHook("beforeDestroy")
    }

    public finalizeDeath() {
        // invariant: not called directly but from "die"
        this.root.identifierCache!.notifyDied(this)
        const self = this
        const oldPath = this.path
        addReadOnlyProp(this, "snapshot", this.snapshot) // kill the computed prop and just store the last snapshot

        this.patchSubscribers.splice(0)
        this.snapshotSubscribers.splice(0)
        this.patchSubscribers.splice(0)
        this._isAlive = false
        this._parent = null
        this.subpath = ""

        // This is quite a hack, once interceptable objects / arrays / maps are extracted from mobx,
        // we could express this in a much nicer way
        // TODO: should be possible to obtain id's still...
        Object.defineProperty(this.storedValue, "$mobx", {
            get() {
                fail(
                    `This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '${self
                        .type
                        .name}') used to live at '${oldPath}'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.`
                )
            }
        })
    }

    public onSnapshot(onChange: (snapshot: any) => void): IDisposer {
        return registerEventHandler(this.snapshotSubscribers, onChange)
    }

    public emitSnapshot(snapshot: any) {
        this.snapshotSubscribers.forEach((f: Function) => f(snapshot))
    }

    public onPatch(handler: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer {
        return registerEventHandler(this.patchSubscribers, handler)
    }

    emitPatch(basePatch: IReversibleJsonPatch, source: INode) {
        if (this.patchSubscribers.length) {
            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
            })
            const [patch, reversePatch] = splitPatch(localizedPatch)
            this.patchSubscribers.forEach(f => f(patch, reversePatch))
        }
        if (this.parent) this.parent.emitPatch(basePatch, source)
    }

    addDisposer(disposer: () => void) {
        this.disposers.unshift(disposer)
    }

    addMiddleWare(handler: IMiddlewareHandler) {
        return registerEventHandler(this.middlewares, handler)
    }

    applyPatchLocally(subpath: string, patch: IJsonPatch): void {
        this.assertWritable()
        this.type.applyPatchLocally(this, subpath, patch)
    }
}

import { reaction } from "mobx"
import { ScalarNode } from "./scalar-node"
import { INode, isStateTreeNode, getStateTreeNode } from "./node-utils"
import { IJsonPatch, IReversibleJsonPatch, splitJsonPath, splitPatch } from "../json-patch"
import { IType } from "../type"
import { IDisposer, extend, noop, fail, registerEventHandler, addReadOnlyProp } from "../../utils"
import { walk } from "../mst-operations"
import { IMiddlewareHandler, createActionInvoker } from "../action"
