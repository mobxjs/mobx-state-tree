import {
    types,
    IJsonPatch,
    IStateTreeNode,
    IMiddlewareEvent,
    recordPatches,
    IPatchRecorder,
    createActionTrackingMiddleware,
    getEnv,
    getRoot,
    applyPatch,
    flow,
    addMiddleware,
    addDisposer,
    decorate
} from "mobx-state-tree"
import { IObservableArray } from "mobx"
import { atomic } from "."

const EMPTY_ARRAY: any[] = []

const Entry = types.model("UndoManagerEntry", {
    patches: types.frozen<ReadonlyArray<IJsonPatch>>(),
    inversePatches: types.frozen<ReadonlyArray<IJsonPatch>>()
})

const UndoManager = types
    .model("UndoManager", {
        history: types.array(Entry),
        undoIdx: 0
    })
    .views(self => ({
        get undoLevels() {
            return self.undoIdx
        },
        get redoLevels() {
            return self.history.length - self.undoIdx
        },
        get canUndo() {
            return this.undoLevels > 0
        },
        get canRedo() {
            return this.redoLevels > 0
        }
    }))
    .actions(self => {
        let targetStore: IStateTreeNode

        interface Context {
            recorder: IPatchRecorder
            // one false in this array means that recording has been disabled
            recordingAllowed: boolean[]
        }

        const canRecordPatches = (call: IMiddlewareEvent, recordingAllowed: boolean[]) => {
            if (recordingAllowed.indexOf(false) >= 0) {
                return false
            }

            if (call.name === "__withoutUndoFlow__") {
                return false
            }
            if (call.context === self) {
                return call.name === "startGroup"
            }
            return true
        }

        type GroupRecorder = Pick<IPatchRecorder, "patches" | "inversePatches">
        const groupRecorders: GroupRecorder[] = []

        const undoRedoMiddleware = createActionTrackingMiddleware<Context | undefined>({
            onStart(call) {
                if (!call.parentId && canRecordPatches(call, EMPTY_ARRAY)) {
                    return {
                        recorder: recordPatches(call.tree),
                        recordingAllowed: []
                    }
                }
                return undefined
            },
            onResume(call, ctx) {
                if (!ctx) {
                    return
                }
                if (canRecordPatches(call, ctx.recordingAllowed)) {
                    ctx.recordingAllowed.push(true)
                    ctx.recorder.resume()
                } else {
                    ctx.recordingAllowed.push(false)
                }
            },
            onSuspend(call, ctx) {
                if (!ctx) {
                    return
                }
                ctx.recordingAllowed.pop()
                ctx.recorder.stop()
            },
            onSuccess(call, ctx) {
                if (!ctx) {
                    return
                }

                const recorder = ctx.recorder
                recorder.stop()
                if (groupRecorders.length > 0) {
                    const groupRecorder = groupRecorders[groupRecorders.length - 1]
                    groupRecorder.patches = groupRecorder.patches.concat(recorder.patches)
                    groupRecorder.inversePatches = groupRecorder.inversePatches.concat(
                        recorder.inversePatches
                    )
                } else {
                    ;(self as any).addUndoState(recorder)
                }
            },
            onFail(call, ctx) {
                if (!ctx) {
                    return
                }

                ctx.recorder.stop()
                ctx.recorder.undo()
            }
        })

        return {
            addUndoState(recorder: GroupRecorder) {
                if (recorder.patches.length === 0) {
                    // skip recording if patches is empty
                    return
                }
                self.history.splice(self.undoIdx)
                self.history.push({
                    patches: recorder.patches,
                    inversePatches: recorder.inversePatches
                })
                self.undoIdx = self.history.length
            },
            afterCreate() {
                const selfRoot = getRoot(self)
                targetStore = getEnv(self).targetStore || selfRoot
                if (targetStore === self) {
                    throw new Error(
                        "UndoManager should be created as part of a tree, or with `targetStore` in it's environment"
                    )
                }
                addDisposer(self, addMiddleware(targetStore, undoRedoMiddleware, false))
            },
            undo: decorate(atomic, () => {
                if (!self.canUndo) {
                    throw new Error("undo not possible, nothing to undo")
                }
                applyPatch(
                    getRoot(targetStore),
                    // n.b: reverse patches back to forth
                    self.history[self.undoIdx - 1].inversePatches.slice().reverse()
                )
                self.undoIdx--
            }),
            redo: decorate(atomic, () => {
                if (!self.canRedo) {
                    throw new Error("redo not possible, nothing to redo")
                }
                applyPatch(getRoot(targetStore), self.history[self.undoIdx].patches)
                self.undoIdx++
            }),
            withoutUndo<T>(fn: () => T): T {
                return fn()
            },
            withoutUndoFlow(generatorFn: () => any) {
                // the name of the function generator matters!
                return flow(function* __withoutUndoFlow__() {
                    return yield* generatorFn()
                })
            },
            startGroup<T>(fn: () => T): T {
                if (groupRecorders.length >= 1) {
                    throw new Error(
                        "a previous startGroup is still running, did you forget to call stopGroup?"
                    )
                }
                groupRecorders.push({
                    patches: [],
                    inversePatches: []
                })
                return fn()
            },
            stopGroup() {
                const groupRecorder = groupRecorders.pop()
                if (!groupRecorder) {
                    throw new Error(
                        "each call to stopGroup requires a previous call to startGroup, did you forget to call startGroup?"
                    )
                }
                this.addUndoState(groupRecorder)
            },
            clear: decorate(atomic, (options?: { undo?: boolean; redo?: boolean }) => {
                const opts = {
                    undo: true,
                    redo: true,
                    ...options
                }
                if (opts.undo && opts.redo) {
                    self.history.clear()
                    self.undoIdx = 0
                } else if (opts.undo) {
                    self.history.splice(0, self.undoLevels)
                    self.undoIdx = 0
                } else if (opts.redo) {
                    self.history.splice(self.undoIdx, self.redoLevels)
                }
            })
        }
    })

export default UndoManager
