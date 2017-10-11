"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const mobx_state_tree_1 = require("mobx-state-tree")
const TimeTraveller = mobx_state_tree_1.types
    .model("TimeTraveller", {
        history: mobx_state_tree_1.types.optional(
            mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen),
            []
        ),
        undoIdx: -1,
        targetPath: ""
    })
    .views(self => ({
        get canUndo() {
            return self.undoIdx > 0
        },
        get canRedo() {
            return self.undoIdx < self.history.length - 1
        }
    }))
    .actions(self => {
        let targetStore
        let snapshotDisposer
        let skipNextUndoState = false
        return {
            addUndoState(todos) {
                if (skipNextUndoState) {
                    // skip recording if this state was caused by undo / redo
                    skipNextUndoState = false
                    return
                }
                self.history.splice(self.undoIdx + 1)
                self.history.push(todos)
                self.undoIdx = self.history.length - 1
            },
            afterCreate() {
                targetStore = self.targetPath
                    ? mobx_state_tree_1.resolvePath(self, self.targetPath)
                    : mobx_state_tree_1.getEnv(self).targetStore
                if (!targetStore)
                    throw new Error(
                        "Failed to find target store for TimeTraveller. Please provide `targetPath`  property, or a `targetStore` in the environment"
                    )
                // TODO: check if targetStore doesn't contain self
                // if (contains(targetStore, self)) throw new Error("TimeTraveller shouldn't be recording itself. Please specify a sibling as taret, not some parent")
                // start listening to changes
                snapshotDisposer = mobx_state_tree_1.onSnapshot(targetStore, snapshot =>
                    self.addUndoState(snapshot)
                )
                // record an initial state if no known
                if (self.history.length === 0)
                    self.addUndoState(mobx_state_tree_1.getSnapshot(targetStore))
            },
            beforeDestroy() {
                snapshotDisposer()
            },
            undo() {
                self.undoIdx--
                skipNextUndoState = true
                mobx_state_tree_1.applySnapshot(targetStore, self.history[self.undoIdx])
            },
            redo() {
                self.undoIdx++
                skipNextUndoState = true
                mobx_state_tree_1.applySnapshot(targetStore, self.history[self.undoIdx])
            }
        }
    })
exports.default = TimeTraveller
