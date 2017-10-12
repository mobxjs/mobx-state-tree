import { test } from "ava"
import { UndoManager } from "../src"
import { types, addMiddleware, process, clone } from "mobx-state-tree"

const TestModel = types
    .model({
        x: 1
    })
    .actions(self => ({
        inc() {
            self.x += 1
        }
    }))

test("it can time travel", t => {
    const m = TestModel.create()
    const tt = UndoManager.create({}, { targetStore: m })

    t.is(tt.canUndo, false)
    t.is(tt.canRedo, false)
    t.is(m.x, 1)

    m.inc()
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, false)
    t.is(m.x, 2)

    m.inc()
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, false)
    t.is(m.x, 3)

    tt.undo()
    t.is(m.x, 2)
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, true)

    tt.undo()
    t.is(m.x, 1)
    t.is(tt.canUndo, false)
    t.is(tt.canRedo, true)

    tt.redo()
    t.is(m.x, 2)
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, true)

    // resets 'future'
    m.inc()
    t.is(m.x, 3)
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, false)
})

test("it can time travel same store and persist state", t => {
    const W = types.model({
        model: types.optional(TestModel, {}),
        traveler: types.optional(UndoManager, {})
    })
    const w = W.create()
    const m = w.model
    const tt = w.traveler

    t.is(tt.canUndo, false)
    t.is(tt.canRedo, false)
    t.is(m.x, 1)

    m.inc()
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, false)
    t.is(m.x, 2)

    m.inc()
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, false)
    t.is(m.x, 3)

    tt.undo()
    t.is(m.x, 2)
    t.is(tt.canUndo, true)
    t.is(tt.canRedo, true)

    // Clone of the store should inherit the same state!
    const w2 = clone(w)
    const m2 = w2.model
    const tt2 = w2.traveler

    tt2.undo()
    t.is(m2.x, 1)
    t.is(tt2.canUndo, false)
    t.is(tt2.canRedo, true)

    tt2.redo()
    t.is(m2.x, 2)
    t.is(tt2.canUndo, true)
    t.is(tt2.canRedo, true)

    // resets 'future'
    m2.inc()
    t.is(m2.x, 3)
    t.is(tt2.canUndo, true)
    t.is(tt2.canRedo, false)
})

// TODO: add test for async and interleaved processes
