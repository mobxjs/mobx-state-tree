import { observable } from "mobx"
import { IStateTreeNode, isProtected, IPatchRecorder, recordPatches, addMiddleware } from "../core"
import { fail, IDisposer } from "../utils"
import { IRawActionCall } from "../core/action"

enum UndoManagerState {
    IDLE,
    RECORDING,
    REPLAYING
}

type UndoEntry<T> = {
    description: T
    recorder: IPatchRecorder
}

export class UndoManager<T> {
    private state = UndoManagerState.IDLE
    private readonly undoEntries = observable.shallowArray<UndoEntry<T>>()
    private readonly redoEntries = observable.shallowArray<UndoEntry<T>>()

    constructor(private readonly subject: IStateTreeNode) {
        if (!isProtected(subject))
            console.warn("Using undoManager on a unprotected tree might not work as expected")
    }

    //  get undoEntries(): ReadonlyArray<T> {
    //         return this.undoEntries.map(e => e.description)
    //     }
    //     get redoEntries(): ReadonlyArray<T> {
    //         return this.redoEntries.map(e => e.description)
    //     }
    startUndoTransaction(description: T) {
        switch (this.state) {
            case UndoManagerState.IDLE:
                this.redoEntries.clear()
                this.undoEntries.push({
                    description,
                    recorder: recordPatches(this.subject)
                })
                // TODO check limit
                this.state = UndoManagerState.RECORDING
                return
            case UndoManagerState.RECORDING:
                return fail("Already in recording state")
            case UndoManagerState.REPLAYING:
                // NOOP
                return
        }
    }
    endUndoTransaction() {
        switch (this.state) {
            case UndoManagerState.RECORDING:
                this.undoEntries[this.undoEntries.length - 1].recorder.stop()
                this.state = UndoManagerState.IDLE
                return
            case UndoManagerState.IDLE:
                return fail("Already in idle state")
            case UndoManagerState.REPLAYING:
                // NOOP
                return
        }
    }
    undo() {
        switch (this.state) {
            case UndoManagerState.RECORDING:
            case UndoManagerState.REPLAYING:
                return fail("Not ready for undo")
            case UndoManagerState.IDLE:
                if (this.canUndo()) {
                    try {
                        this.state = UndoManagerState.REPLAYING
                        const entry = this.undoEntries.pop()
                        entry!.recorder.undo()
                        this.redoEntries.push(entry!)
                    } finally {
                        this.state = UndoManagerState.IDLE
                    }
                }
        }
    }
    redo() {
        switch (this.state) {
            case UndoManagerState.RECORDING:
            case UndoManagerState.REPLAYING:
                return fail("Not ready for redo")
            case UndoManagerState.IDLE:
                if (this.canUndo()) {
                    try {
                        this.state = UndoManagerState.REPLAYING
                        const entry = this.redoEntries.pop()
                        entry!.recorder.replay(this.subject)
                        this.undoEntries.push(entry!)
                    } finally {
                        this.state = UndoManagerState.IDLE
                    }
                }
        }
    }
    canUndo(): boolean {
        return this.undoEntries.length > 0
    }
    canRedo(): boolean {
        return this.redoEntries.length > 0
    }
    stop() {
        if (this.middleWareDisposer) this.middleWareDisposer()
    }
}

// TODO: tpyings:
// export function createUndoManager<{ action: string }>(subject: IStateTreeNode, createMiddleWare: true)
// export function createUndoManager<T>(subject: IStateTreeNode, createMiddleWare: false)
export function createUndoManager<T>(subject: IStateTreeNode, createMiddleWare = true) {
    let middleWareDisposer: IDisposer | null = null
    if (createMiddleWare) {
        middleWareDisposer = addMiddleware(subject, function undoMiddleWare(
            action: IRawActionCall,
            next: (call: IRawActionCall) => void
        ) {
            // TODO: add predicate for which actions should be tracked
            manager.startUndoTransaction((action.name as any) as T) // TODO: seperate function and proper typings
            try {
                return next(action)
            } finally {
                manager.endUndoTransaction()
            }
        })
    }

    const manager = {}
    return manager
}
