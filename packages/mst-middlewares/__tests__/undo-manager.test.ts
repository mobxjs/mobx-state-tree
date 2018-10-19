import { UndoManager } from "../src"
import { types, clone, getSnapshot } from "mobx-state-tree"

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

test("on tree - withoutUndoFlow declaratively", async () => {
    // because async would allow overwriting the history within later tests
    // we need a another _undoManager
    let _undoManager: any = {}
    const _setUndoManagerSameTree = (targetStore: any) => {
        _undoManager = targetStore.history
    }

    function delay(time: number) {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    const HistoryOnTreeStoreModel = types
        .model({
            x: 1,
            y: 1,
            history: types.optional(UndoManager, {})
        })
        .actions(self => {
            _setUndoManagerSameTree(self)

            const loadPosition = function*() {
                try {
                    yield delay(2)
                    self.x = 4
                    yield delay(2)
                    self.y = 2
                    return { x: self.x, y: self.y }
                } catch (err) {
                    console.log("oops")
                }
            }

            return {
                loadPosition: () => _undoManager.withoutUndoFlow(loadPosition)()
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    expect(_undoManager.canUndo).toBe(false)
    expect(_undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)
    expect(store.y).toBe(1)

    const value = await store.loadPosition()
    expect(value.x).toBe(4)
    expect(store.y).toBe(2)
    expect(_undoManager.canUndo).toBe(false)
    expect(_undoManager.canRedo).toBe(false)
})

test("on tree - group", () => {
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

    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(false)
    expect(store.x).toBe(1)

    undoManager.startGroup(() => {
        store.inc()
        store.inc()
        store.inc()
        store.inc()
    })
    undoManager.stopGroup()
    expect(store.x).toBe(5)
    expect(undoManager.canUndo).toBe(true)
    undoManager.undo()
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(true)
    expect(store.x).toBe(1)

    undoManager.startGroup(() => {
        store.addNumber(1)
        store.addNumber(2)
    })
    undoManager.stopGroup()
    undoManager.undo()
    expect(undoManager.canUndo).toBe(false)
    expect(undoManager.canRedo).toBe(true)
    expect(store.numbers.length).toBe(0)
})
