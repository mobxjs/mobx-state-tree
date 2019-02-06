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
    IDisposer
} from "mobx-state-tree"
import { IObservableArray } from "mobx"

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
        get canUndo() {
            return self.undoIdx > 0
        },
        get canRedo() {
            return self.undoIdx < self.history.length
        }
    }))
    .actions(self => {
        let skipping = false
        let flagSkipping = false
        let targetStore: IStateTreeNode
        let replaying = false
        let middlewareDisposer: IDisposer
        let grouping = false

        type GroupRecorder = Pick<IPatchRecorder, "patches" | "inversePatches">
        let groupRecorder: GroupRecorder = {
            patches: [],
            inversePatches: []
        }

        let recordingActionId: string | null = null
        let recordingActionLevel = 0

        const startRecordAction = (call: IMiddlewareEvent) => {
            // level for the case that actions have the same name
            skipping = flagSkipping
            recordingActionLevel++
            const actionId = call.name + recordingActionLevel
            recordingActionId = actionId
            return {
                recorder: recordPatches(call.tree),
                actionId
            }
        }
        const stopRecordingAction = (recorder: IPatchRecorder): void => {
            recordingActionId = null
            if (!skipping) {
                if (grouping) return cachePatchForGroup(recorder)
                ;(self as any).addUndoState(recorder)
            }
            skipping = flagSkipping
        }
        const cachePatchForGroup = (recorder: IPatchRecorder): void => {
            groupRecorder = {
                patches: groupRecorder.patches.concat(recorder.patches),
                inversePatches: groupRecorder.inversePatches.concat(recorder.inversePatches)
            }
        }

        interface Context {
            recorder?: IPatchRecorder
            actionId?: string
        }
        const defaultContext: Context = {}

        const undoRedoMiddleware = createActionTrackingMiddleware<Context>({
            // the flagSkipping === false check is mainly a performance optimisation
            filter: call => flagSkipping === false && call.context !== self, // don't undo / redo undo redo :)
            onStart: call => {
                if (!recordingActionId) {
                    return startRecordAction(call)
                }
                return {}
            },
            onResume: (call, { recorder } = defaultContext) => recorder && recorder.resume(),
            onSuspend: (call, { recorder } = defaultContext) => recorder && recorder.stop(),
            onSuccess: (call, { recorder, actionId } = defaultContext) => {
                if (recordingActionId === actionId) {
                    stopRecordingAction(recorder!)
                }
            },
            onFail: (call, { recorder } = defaultContext) => recorder && recorder.undo()
        })

        return {
            addUndoState(recorder: GroupRecorder) {
                if (replaying || (recorder.patches && recorder.patches.length === 0)) {
                    // skip recording if this state was caused by undo / redo
                    // or if patches is empty
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
                targetStore = getEnv(self).targetStore ? getEnv(self).targetStore : getRoot(self)
                if (!targetStore || targetStore === self)
                    throw new Error(
                        "UndoManager should be created as part of a tree, or with `targetStore` in it's environment"
                    )
                middlewareDisposer = addMiddleware(targetStore, undoRedoMiddleware, false)
            },
            beforeDestroy() {
                middlewareDisposer()
            },
            undo() {
                replaying = true
                self.undoIdx--
                // n.b: reverse patches back to forth
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(
                    getRoot(targetStore),
                    self.history[self.undoIdx].inversePatches!.slice().reverse()
                )
                replaying = false
            },
            redo() {
                replaying = true
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(getRoot(targetStore), self.history[self.undoIdx].patches)
                self.undoIdx++
                replaying = false
            },
            withoutUndo<T>(fn: () => T): T {
                try {
                    skipping = true
                    flagSkipping = true
                    return fn()
                } finally {
                    flagSkipping = false
                }
            },
            withoutUndoFlow(generatorFn: () => any) {
                return flow(function*() {
                    skipping = true
                    flagSkipping = true
                    const result = yield* generatorFn()
                    flagSkipping = false
                    return result
                })
            },
            startGroup<T>(fn: () => T): T {
                grouping = true
                return fn()
            },
            stopGroup(fn?: () => void) {
                if (fn) fn()
                grouping = false
                this.addUndoState(groupRecorder)
                groupRecorder = {
                    patches: [],
                    inversePatches: []
                }
            },
            clear() {
                self.history.clear()
                self.undoIdx = 0
            }
        }
    })

export default UndoManager
