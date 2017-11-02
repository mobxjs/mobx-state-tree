import {
    types,
    getEnv,
    recordPatches,
    addMiddleware,
    applyPatch,
    getRoot,
    createActionTrackingMiddleware,
    IStateTreeNode,
    IModelType,
    ISnapshottable,
    IMiddlewareEvent,
    IPatchRecorder,
    IJsonPatch
} from "mobx-state-tree"
import { IObservableArray } from "mobx"

const Entry = types.model("UndoManagerEntry", {
    patches: types.frozen,
    inversePatches: types.frozen
})

const UndoManager = types
    .model("UndoManager", {
        history: types.optional(types.array(Entry), []),
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
        let targetStore: IStateTreeNode
        let replaying = false
        let middlewareDisposer: () => void
        let grouping = false
        let groupRecorder: any = {
            patches: [] as ReadonlyArray<IJsonPatch>,
            inversePatches: [] as ReadonlyArray<IJsonPatch>
        }
        let recordingActionId: any = null
        let recordingActionLevel = 0

        const startRecordAction = (call: IMiddlewareEvent): any => {
            // level for the case that actions have the same name
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
            if (grouping) return cachePatchForGroup(recorder)
            ;(self as any).addUndoState(recorder)
        }
        const cachePatchForGroup = (recorder: IPatchRecorder): void => {
            groupRecorder = {
                patches: groupRecorder.patches.concat(recorder.patches),
                inversePatches: groupRecorder.inversePatches.concat(recorder.patches)
            }
        }
        const undoRedoMiddleware = createActionTrackingMiddleware({
            filter: call => skipping === false && call.context !== self, // don't undo / redo undo redo :)
            onStart: call => {
                if (!recordingActionId) {
                    return startRecordAction(call)
                }
            },
            onResume: (
                call,
                { recorder, actionId }: { recorder: any; actionId: any } = {
                    recorder: undefined,
                    actionId: undefined
                }
            ) => recorder && recorder.resume(),
            onSuspend: (
                call,
                { recorder, actionId }: { recorder: any; actionId: any } = {
                    recorder: undefined,
                    actionId: undefined
                }
            ) => recorder && recorder.stop(),
            onSuccess: (
                call,
                { recorder, actionId }: { recorder: any; actionId: any } = {
                    recorder: undefined,
                    actionId: undefined
                }
            ) => {
                if (recordingActionId === actionId) {
                    stopRecordingAction(recorder)
                }
            },
            onFail: (
                call,
                { recorder, actionId }: { recorder: any; actionId: any } = {
                    recorder: undefined,
                    actionId: undefined
                }
            ) => recorder && recorder.undo()
        })

        return {
            addUndoState(recorder: any) {
                if (replaying) {
                    // skip recording if this state was caused by undo / redo
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
                middlewareDisposer = addMiddleware(targetStore, undoRedoMiddleware)
            },
            beforeDestroy() {
                middlewareDisposer()
            },
            undo() {
                replaying = true
                self.undoIdx--
                // n.b: reverse patches back to forth
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(targetStore, self.history[self.undoIdx].inversePatches.slice().reverse())
                replaying = false
            },
            redo() {
                replaying = true
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(targetStore, self.history[self.undoIdx].patches)
                self.undoIdx++
                replaying = false
            },
            withoutUndo(fn: () => any) {
                try {
                    skipping = true
                    return fn()
                } finally {
                    skipping = false
                }
            },
            startGroup(fn: () => any) {
                grouping = true
                return fn()
            },
            endGroup(fn: () => any) {
                if (fn) fn()
                grouping = false
                ;(self as any).addUndoState(groupRecorder)
                groupRecorder = { patches: [], inversePatches: [] }
            }
        }
    })

export default UndoManager
