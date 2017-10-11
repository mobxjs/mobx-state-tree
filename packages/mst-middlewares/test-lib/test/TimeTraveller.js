"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const ava_1 = require("ava")
const src_1 = require("../src")
const mobx_state_tree_1 = require("mobx-state-tree")
const TestModel = mobx_state_tree_1.types
    .model({
        x: 1
    })
    .actions(self => ({
        inc() {
            self.x += 1
        }
    }))
ava_1.test("it can time travel", t => {
    const m = TestModel.create()
    const tt = src_1.TimeTraveller.create({}, { targetStore: m })
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
ava_1.test("it can time travel same store and persist state", t => {
    const W = mobx_state_tree_1.types.model({
        model: mobx_state_tree_1.types.optional(TestModel, {}),
        traveler: mobx_state_tree_1.types.optional(src_1.TimeTraveller, { targetPath: "../model" })
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
    const w2 = mobx_state_tree_1.clone(w)
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
