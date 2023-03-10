import { TimeTraveller } from "../src"
import { types, clone } from "mobx-state-tree"

const TestModel = types
    .model({
        x: 1
    })
    .actions((self) => ({
        inc() {
            self.x += 1
        }
    }))

test("it can time travel", () => {
    const m = TestModel.create()
    const tt = TimeTraveller.create({}, { targetStore: m })

    expect(tt.canUndo).toBe(false)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(1)

    m.inc()
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(2)

    m.inc()
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(3)

    tt.undo()
    expect(m.x).toBe(2)
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(true)

    tt.undo()
    expect(m.x).toBe(1)
    expect(tt.canUndo).toBe(false)
    expect(tt.canRedo).toBe(true)

    tt.redo()
    expect(m.x).toBe(2)
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(true)

    // resets 'future'
    m.inc()
    expect(m.x).toBe(3)
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(false)
})

test("it can time travel same store and persist state", () => {
    const W = types.model({
        model: types.optional(TestModel, {}),
        traveler: types.optional(TimeTraveller, { targetPath: "../model" })
    })
    const w = W.create()
    const m = w.model
    const tt = w.traveler

    expect(tt.canUndo).toBe(false)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(1)

    m.inc()
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(2)

    m.inc()
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(false)
    expect(m.x).toBe(3)

    tt.undo()
    expect(m.x).toBe(2)
    expect(tt.canUndo).toBe(true)
    expect(tt.canRedo).toBe(true)

    // Clone of the store should inherit the same state!
    const w2 = clone(w)
    const m2 = w2.model
    const tt2 = w2.traveler

    tt2.undo()
    expect(m2.x).toBe(1)
    expect(tt2.canUndo).toBe(false)
    expect(tt2.canRedo).toBe(true)

    tt2.redo()
    expect(m2.x).toBe(2)
    expect(tt2.canUndo).toBe(true)
    expect(tt2.canRedo).toBe(true)

    // resets 'future'
    m2.inc()
    expect(m2.x).toBe(3)
    expect(tt2.canUndo).toBe(true)
    expect(tt2.canRedo).toBe(false)
})
