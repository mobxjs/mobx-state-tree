import {
    types,
    flow,
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
        let targetStore: IStateTreeNode
        let middlewareDisposer: () => void
        let skipping = false
        let grouping = false
        let recorder: any = null
        let groupRecorder: any = {
            patches: [] as ReadonlyArray<IJsonPatch>,
            inversePatches: [] as ReadonlyArray<IJsonPatch>
        }
        let tmpHistoryRecorder: any = {
            patches: [] as ReadonlyArray<IJsonPatch>,
            inversePatches: [] as ReadonlyArray<IJsonPatch>
        }
        let recordingActionId: any = null
        let potentialSkippingActionId: any = null
        let skippingActionId: any = null

        const uuidv4 = () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c: any) => {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        }
        const tryStopSkipping = (actionId: any) => {
            if (actionId !== skippingActionId) return

            recorder && recorder.resume()
            skippingActionId = null
            potentialSkippingActionId = null
        }
        const startRecordAction = (call: IMiddlewareEvent, actionId: any): any => {
            // outermost action
            recordingActionId = actionId
            recorder = recordPatches(call.tree)
            return { recorder, actionId }
        }
        const addUndoStateTmp = () => {
            if (!recorder || !recorder.patches.length) return
            // tmp history group used to not have problems with computed
            tmpHistoryRecorder = {
                patches: tmpHistoryRecorder.patches.concat(recorder.patches),
                inversePatches: tmpHistoryRecorder.inversePatches.concat(recorder.inversePatches)
            }
        }
        const stopRecordingAction = (actionId: any): void => {
            // global recorder used here to gather all patches inside an action
            addUndoStateTmp()
            if (recordingActionId === actionId) {
                if (grouping) {
                    cachePatchForGroup(tmpHistoryRecorder)
                } else {
                    ;(self as any).addUndoState(tmpHistoryRecorder)
                }
                recordingActionId = null
                tmpHistoryRecorder = {
                    patches: [] as ReadonlyArray<IJsonPatch>,
                    inversePatches: [] as ReadonlyArray<IJsonPatch>
                }
                skipping = false
                recorder = null
                tryStopSkipping(actionId)
            } else {
                tryStopSkipping(actionId)
            }
        }
        const cachePatchForGroup = (recorder: IPatchRecorder): void => {
            groupRecorder = {
                patches: groupRecorder.patches.concat(recorder.patches),
                inversePatches: groupRecorder.inversePatches.concat(recorder.patches)
            }
        }
        const undoRedoMiddleware = createActionTrackingMiddleware({
            // don't record internal undo/ redo actions, wrapped with withoutUndo actions
            filter: call => !skipping && call.context !== self,
            onStart: call => {
                // id to make actionIds unique in case of sub actions with the same name
                const actionId = `${call.name}-${uuidv4()}`
                potentialSkippingActionId = actionId
                if (!recordingActionId) return startRecordAction(call, actionId)
                return { actionId }
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
                stopRecordingAction(actionId)
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
            addUndoState(recorder: any = null) {
                if (recorder.patches.length === 0) return

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
                skipping = true
                self.undoIdx--
                // n.b: reverse patches back to forth
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(targetStore, self.history[self.undoIdx].inversePatches.slice().reverse())
                skipping = false
            },
            redo() {
                skipping = true
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                applyPatch(targetStore, self.history[self.undoIdx].patches)
                self.undoIdx++
                skipping = false
            },
            withoutUndo(fn: () => any) {
                try {
                    recorder && recorder.stop()
                    skipping = true
                    if (!skippingActionId) skippingActionId = potentialSkippingActionId
                    return fn()
                } finally {
                    skipping = false
                }
            },
            withoutUndoFlow(generatorFn: () => any) {
                return flow(function*() {
                    recorder && recorder.stop()
                    skipping = true
                    if (!skippingActionId) skippingActionId = potentialSkippingActionId
                    const result = yield* generatorFn()
                    skipping = false
                    return result
                })
            },
            startGroup(fn: () => any) {
                grouping = true
                return fn()
            },
            stopGroup(fn: () => any) {
                if (fn) fn()
                grouping = false
                ;(self as any).addUndoState(groupRecorder)
                groupRecorder = { patches: [], inversePatches: [] }
            }
        }
    })

export default UndoManager
