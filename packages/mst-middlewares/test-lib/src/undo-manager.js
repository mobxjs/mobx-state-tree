"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const mobx_state_tree_1 = require("mobx-state-tree")
const Entry = mobx_state_tree_1.types.model("UndoManagerEntry", {
    patches: mobx_state_tree_1.types.frozen,
    inversePatches: mobx_state_tree_1.types.frozen
})
const UndoManager = mobx_state_tree_1.types
    .model("UndoManager", {
        history: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(Entry), []),
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
        let targetStore
        let replaying = false
        let middlewareDisposer
        const undoRedoMiddleware = mobx_state_tree_1.createActionTrackingMiddleware({
            filter: call => skipping === false && call.context !== self,
            onStart: call => mobx_state_tree_1.recordPatches(call.tree),
            onResume: (call, recorder) => recorder.resume(),
            onSuspend: (call, recorder) => recorder.stop(),
            onSuccess: (call, recorder) => {
                self.addUndoState(recorder)
            },
            onFail: (call, recorder) => recorder.undo()
        })
        return {
            addUndoState(recorder) {
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
                targetStore = mobx_state_tree_1.getEnv(self).targetStore
                    ? mobx_state_tree_1.getEnv(self).targetStore
                    : mobx_state_tree_1.getRoot(self)
                if (!targetStore || targetStore === self)
                    throw new Error(
                        "UndoManager should be created as part of a tree, or with `targetStore` in it's environment"
                    )
                middlewareDisposer = mobx_state_tree_1.addMiddleware(
                    targetStore,
                    undoRedoMiddleware
                )
            },
            beforeDestroy() {
                middlewareDisposer()
            },
            undo() {
                replaying = true
                self.undoIdx--
                // n.b: reverse patches back to forth
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                mobx_state_tree_1.applyPatch(
                    targetStore,
                    self.history[self.undoIdx].inversePatches.slice().reverse()
                )
                replaying = false
            },
            redo() {
                replaying = true
                // TODO: add error handling when patching fails? E.g. make the operation atomic?
                mobx_state_tree_1.applyPatch(targetStore, self.history[self.undoIdx].patches)
                self.undoIdx++
                replaying = false
            },
            withoutUndo(fn) {
                try {
                    skipping = true
                    return fn()
                } finally {
                    skipping = false
                }
            }
        }
    })
exports.default = UndoManager
