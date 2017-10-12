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
    ISnapshottable
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

        const undoRedoMiddleware = createActionTrackingMiddleware({
            filter: call => skipping === false && call.context !== self, // don't undo / redo undo redo :)
            onStart: call => recordPatches(call.tree),
            onResume: (call, recorder) => recorder.resume(),
            onSuspend: (call, recorder) => recorder.stop(),
            onSuccess: (call, recorder) => {
                ;(self as any).addUndoState(recorder)
            },
            onFail: (call, recorder) => recorder.undo()
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
            }
        }
    })

export default UndoManager
