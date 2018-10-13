import * as mst from "mobx-state-tree"
import { IObservableArray } from "mobx"

const TimeTraveller = mst.types
    .model("TimeTraveller", {
        history: mst.types.array(mst.types.frozen()),
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
        let targetStore: any
        let snapshotDisposer: any
        let skipNextUndoState = false

        return {
            addUndoState(todos: any) {
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
                    ? mst.resolvePath(self, self.targetPath)
                    : mst.getEnv(self).targetStore
                if (!targetStore)
                    throw new Error(
                        "Failed to find target store for TimeTraveller. Please provide `targetPath`  property, or a `targetStore` in the environment"
                    )
                // TODO: check if targetStore doesn't contain self
                // if (contains(targetStore, self)) throw new Error("TimeTraveller shouldn't be recording itself. Please specify a sibling as taret, not some parent")
                // start listening to changes
                snapshotDisposer = mst.onSnapshot(targetStore, snapshot =>
                    this.addUndoState(snapshot)
                )
                // record an initial state if no known
                if (self.history.length === 0) {
                    this.addUndoState(mst.getSnapshot(targetStore))
                }
            },
            beforeDestroy() {
                snapshotDisposer()
            },
            undo() {
                self.undoIdx--
                skipNextUndoState = true
                mst.applySnapshot(targetStore, self.history[self.undoIdx])
            },
            redo() {
                self.undoIdx++
                skipNextUndoState = true
                mst.applySnapshot(targetStore, self.history[self.undoIdx])
            }
        }
    })

export default TimeTraveller
