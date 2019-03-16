import {
    types,
    IJsonPatch,
    IStateTreeNode,
    recordPatches,
    IPatchRecorder,
    createActionTrackingMiddleware2,
    getEnv,
    getRoot,
    applyPatch,
    flow,
    addMiddleware,
    addDisposer,
    decorate,
    IActionTrackingMiddleware2Call
} from "mobx-state-tree"
import { atomic } from "."

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
        let recordingDisabled = 0

        interface Context {
            recorder: IPatchRecorder
        }

        type GroupRecorder = Pick<IPatchRecorder, "patches" | "inversePatches">
        const groupRecorders: GroupRecorder[] = []

        const undoRedoMiddleware = createActionTrackingMiddleware2<Context>({
            filter(call) {
                if (call.env) {
                    // already recording
                    return false
                }
                if (call.context === self) {
                    // also skip actions over self
                    return false
                }

                return true
            },
            onStart(call) {
                const recorder = recordPatches(call.tree, () => !recordingDisabled)
                recorder.resume()
                call.env = {
                    recorder
                }
            },
            onFinish(call, error) {
                const recorder = call.env!.recorder
                call.env = undefined
                recorder.stop()

                if (error === undefined) {
                    if (groupRecorders.length > 0) {
                        const groupRecorder = groupRecorders[groupRecorders.length - 1]
                        groupRecorder.patches = groupRecorder.patches.concat(recorder.patches)
                        groupRecorder.inversePatches = groupRecorder.inversePatches.concat(
                            recorder.inversePatches
                        )
                    } else {
                        ;(self as any).addUndoState(recorder)
                    }
                } else {
                    recorder.undo()
                }
            }
        })

        const skipRecording = <T>(fn: () => T): T => {
            recordingDisabled++
            try {
                return fn()
            } finally {
                recordingDisabled--
            }
        }

        return {
            addUndoState(recorder: GroupRecorder) {
                this.withoutUndo(() => {
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
                })
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
                skipRecording(() => {
                    if (!self.canUndo) {
                        throw new Error("undo not possible, nothing to undo")
                    }
                    applyPatch(
                        getRoot(targetStore),
                        // n.b: reverse patches back to forth
                        self.history[self.undoIdx - 1].inversePatches.slice().reverse()
                    )
                    self.undoIdx--
                })
            }),
            redo: decorate(atomic, () => {
                skipRecording(() => {
                    if (!self.canRedo) {
                        throw new Error("redo not possible, nothing to redo")
                    }
                    applyPatch(getRoot(targetStore), self.history[self.undoIdx].patches)
                    self.undoIdx++
                })
            }),
            withoutUndo<T>(fn: () => T): T {
                return skipRecording(fn)
            },
            withoutUndoFlow(generatorFn: () => any) {
                return flow(function* __withoutUndoFlow__() {
                    recordingDisabled++
                    try {
                        return yield* generatorFn()
                    } finally {
                        recordingDisabled--
                    }
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
                skipRecording(() => {
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
            })
        }
    })

export default UndoManager
