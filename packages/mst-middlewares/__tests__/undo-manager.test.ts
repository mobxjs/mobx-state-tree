import { UndoManager } from "../src"
import { types, clone, getSnapshot, flow, Instance } from "mobx-state-tree"

let undoManager: any = {}
const setUndoManagerSameTree = (targetStore: any) => {
    undoManager = targetStore.history
}
const setUndoManagerDifferentTree = (targetStore: any) => {
    undoManager = UndoManager.create({}, { targetStore })
}

const canTimeTravel = (store: any) => {
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)

    store.inc()
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(2)

    store.inc()
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(3)

    undoManager.undo()
    expect(store.x).toBe(2)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(true)

    undoManager.undo()
    expect(store.x).toBe(1)
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(true)

    undoManager.redo()
    expect(store.x).toBe(2)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(true)

    // resets 'future'
    store.inc()
    expect(store.x).toBe(3)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
}

test("same tree - can time travel", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc() {
                    self.x += 1
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()
    canTimeTravel(store)
})

test("different tree - can time travel", () => {
    const HistoryDifferentTreeStoreModel = types
        .model({
            x: 1
        })
        .actions(self => {
            setUndoManagerDifferentTree(self)
            return {
                inc() {
                    self.x += 1
                }
            }
        })
    const store = HistoryDifferentTreeStoreModel.create()
    canTimeTravel(store)
})

test("same tree - can time travel and persist state", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc() {
                    self.x += 1
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)

    store.inc()
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(2)

    store.inc()
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(3)

    undoManager.undo()
    expect(store.x).toBe(2)
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(true)

    // Clone of the store should inherit the same state!
    const store2 = clone(store)
    const undoManager2 = store2.history

    undoManager2.undo()
    expect(store2.x).toBe(1)
    expect(undoManager2.canUndo).toBe(false)
    expect(undoManager2.canRedo).toBe(true)

    undoManager2.redo()
    expect(store2.x).toBe(2)
    expect(undoManager2.canUndo).toBe(true)
    expect(undoManager2.canRedo).toBe(true)

    // resets 'future'
    store2.inc()
    expect(store2.x).toBe(3)
    expect(undoManager2.canUndo).toBe(true)
    expect(undoManager2.canRedo).toBe(false)
})

test("can time travel with Mutable object", () => {
    const MutableUnion: any = types.union(
        types.string,
        types.boolean,
        types.number,
        types.map(types.late(() => MutableUnion)),
        types.array(types.late(() => MutableUnion))
    )
    const MutableStoreModel = types
        .model({
            mutable: MutableUnion
        })
        .actions(self => {
            setUndoManagerDifferentTree(self)
            return {
                setProp(k: string, v: any) {
                    ;(self.mutable as any).set(k, v)
                }
            }
        })
    const store = MutableStoreModel.create({ mutable: {} })
    const mutable = store.mutable

    expect(getSnapshot(mutable)).toEqual({})
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(undoManager.history.length).toBe(0)

    store.setProp("foo", 1)
    expect(getSnapshot(mutable)).toEqual({ foo: 1 })
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(undoManager.history.length).toBe(1)

    store.setProp("foo", {})
    expect(getSnapshot(mutable)).toEqual({ foo: {} })
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(false)
    expect(undoManager.history.length).toBe(2)

    undoManager.undo()
    expect(getSnapshot(mutable)).toEqual({ foo: 1 })
    expect(undoManager.canUndo).toBe(true)
    expect(undoManager.canRedo).toBe(true)
    expect(undoManager.history.length).toBe(2)

    undoManager.undo()
    expect(getSnapshot(mutable)).toEqual({})
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(true)
    expect(undoManager.history.length).toBe(2)
})

const withoutUndo = (store: any) => {
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)

    undoManager.withoutUndo(() => store.inc())
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(2)
}

test("same tree - withoutUndo", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc() {
                    self.x += 1
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()
    withoutUndo(store)
})

test("different tree - withoutUndo", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1
        })
        .actions(self => {
            setUndoManagerDifferentTree(self)
            return {
                inc() {
                    self.x += 1
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()
    withoutUndo(store)
})

test("same tree - withoutUndo declaratively", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc: () =>
                    undoManager.withoutUndo(() => {
                        self.x += 1
                    })
            }
        })

    const store = HistoryOnTreeStoreModel.create()
    withoutUndo(store)
})

test("same tree - withoutUndoFlow declaratively", async () => {
    // because async would allow overwriting the history within later tests
    // we need a another _undoManager
    let _undoManager: any = {}
    const _setUndoManagerSameTree = (targetStore: any) => {
        _undoManager = targetStore.history
    }

    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            y: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            _setUndoManagerSameTree(self)

            return {
                loadPosition2: flow(function*(n: number) {
                    yield Promise.resolve()
                    self.y = n
                }),
                loadPosition: _undoManager.withoutUndoFlow(function*() {
                    yield Promise.resolve()
                    self.x = 4
                    yield (self as any).loadPosition2(2)

                    return { x: self.x, y: self.y }
                })
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    expect(_undoManager.canUndo).toBe(false)
    expect(_undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)
    expect(store.y).toBe(1)

    const value = await store.loadPosition()
    expect(store.x).toBe(4)
    expect(store.y).toBe(2)
    expect(value.x).toBe(4)
    expect(value.y).toBe(2)
    expect(_undoManager.canUndo).toBe(false)
    expect(_undoManager.canRedo).toBe(false)
})

test("same tree - group", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            numbers: types.optional(types.array(types.number), []),
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc() {
                    self.x += 1
                },
                addNumber(n: number) {
                    self.numbers.push(n)
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    expect(undoManager.undoLevels).toBe(0)
    expect(undoManager.redoLevels).toBe(0)
    expect(store.x).toBe(1)

    undoManager.startGroup(() => {
        store.inc()
        store.inc()
        store.inc()
    })
    expect(store.x).toBe(4)
    expect(undoManager.undoLevels).toBe(0) // nothing to undo until stopGroup
    expect(undoManager.redoLevels).toBe(0) // nothing to redo yet

    // an action outside start group, but before stopGroup should also be part of the group
    store.inc()
    expect(store.x).toBe(5)
    expect(undoManager.undoLevels).toBe(0) // nothing to undo until stopGroup
    expect(undoManager.redoLevels).toBe(0) // nothing to redo yet

    undoManager.stopGroup()
    expect(store.x).toBe(5)
    expect(undoManager.undoLevels).toBe(1) // incs can be undone now
    expect(undoManager.redoLevels).toBe(0) // nothing to redo yet
    expect(undoManager.history.length).toBe(1)
    expect(undoManager.history[0].patches).toEqual([
        { op: "replace", path: "/x", value: 2 },
        { op: "replace", path: "/x", value: 3 },
        { op: "replace", path: "/x", value: 4 },
        { op: "replace", path: "/x", value: 5 }
    ])
    undoManager.undo()
    expect(undoManager.undoLevels).toBe(0) // incs undone
    expect(undoManager.redoLevels).toBe(1) // incs can be redone
    expect(store.x).toBe(1)

    undoManager.startGroup(() => {
        store.addNumber(1)
        store.addNumber(2)
    })
    expect(store.numbers.length).toBe(2)
    expect(undoManager.undoLevels).toBe(0) // nothing to undo until stopGroup
    expect(undoManager.redoLevels).toBe(1) // incs can be redone
    undoManager.stopGroup()
    expect(undoManager.undoLevels).toBe(1) // addNumbers can be undone
    expect(undoManager.redoLevels).toBe(0) // incs redo is now lost
    undoManager.undo()
    expect(undoManager.undoLevels).toBe(0) // addNumbers undone
    expect(undoManager.redoLevels).toBe(1) // addNumbers can be redone
    expect(store.numbers.length).toBe(0)
})

describe("same tree - clean", () => {
    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            setUndoManagerSameTree(self)
            return {
                inc() {
                    self.x++
                }
            }
        })

    let store: Instance<typeof HistoryOnTreeStoreModel>
    beforeEach(() => {
        store = HistoryOnTreeStoreModel.create()
        store.inc()
        store.inc()
        store.history.undo()
        expect(undoManager.undoLevels).toBe(1)
        expect(undoManager.redoLevels).toBe(1)
    })

    test("clear all", () => {
        store.history.clear()
        expect(undoManager.undoLevels).toBe(0)
        expect(undoManager.redoLevels).toBe(0)
    })

    test("clear redo", () => {
        store.history.clear({ undo: false, redo: true })
        expect(undoManager.undoLevels).toBe(1)
        expect(undoManager.redoLevels).toBe(0)
    })

    test("clear undo", () => {
        store.history.clear({ undo: true, redo: false })
        expect(undoManager.undoLevels).toBe(0)
        expect(undoManager.redoLevels).toBe(1)
    })
})
