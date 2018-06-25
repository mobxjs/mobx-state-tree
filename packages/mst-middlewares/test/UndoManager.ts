import { test } from "ava"
import { UndoManager } from "../src"
import { types, flow, clone } from "mobx-state-tree"

let undoManager: any = {}
const setUndoManagerSameTree = targetStore => {
    undoManager = targetStore.history
}
const setUndoManagerDifferentTree = targetStore => {
    undoManager = UndoManager.create({}, { targetStore })
}

const canTimeTravel = (t, store) => {
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 1)

    store.inc()
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 2)

    store.inc()
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 3)

    undoManager.undo()
    t.is(store.x, 2)
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, true)

    undoManager.undo()
    t.is(store.x, 1)
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, true)

    undoManager.redo()
    t.is(store.x, 2)
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, true)

    // resets 'future'
    store.inc()
    t.is(store.x, 3)
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
}

test("same tree - can time travel", t => {
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
    canTimeTravel(t, store)
})

test("different tree - can time travel", t => {
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
    canTimeTravel(t, store)
})

test("same tree - can time travel and persist state", t => {
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

    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 1)

    store.inc()
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 2)

    store.inc()
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 3)

    undoManager.undo()
    t.is(store.x, 2)
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, true)

    // Clone of the store should inherit the same state!
    const store2 = clone(store)
    const undoManager2 = store2.history

    undoManager2.undo()
    t.is(store2.x, 1)
    t.is(undoManager2.canUndo, false)
    t.is(undoManager2.canRedo, true)

    undoManager2.redo()
    t.is(store2.x, 2)
    t.is(undoManager2.canUndo, true)
    t.is(undoManager2.canRedo, true)

    // resets 'future'
    store2.inc()
    t.is(store2.x, 3)
    t.is(undoManager2.canUndo, true)
    t.is(undoManager2.canRedo, false)
})

test("can time travel with Mutable object", t => {
    const MutableUnion = types.union(
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
                setProp(k, v) {
                    self.mutable.set(k, v)
                }
            }
        })
    const store = MutableStoreModel.create({ mutable: {} })
    const mutable = store.mutable

    t.deepEqual(mutable.toJSON(), {})
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(undoManager.history.length, 0)

    store.setProp("foo", 1)
    t.deepEqual(mutable.toJSON(), { foo: 1 })
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(undoManager.history.length, 1)

    store.setProp("foo", {})
    t.deepEqual(mutable.toJSON(), { foo: {} })
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, false)
    t.is(undoManager.history.length, 2)

    undoManager.undo()
    t.deepEqual(mutable.toJSON(), { foo: 1 })
    t.is(undoManager.canUndo, true)
    t.is(undoManager.canRedo, true)
    t.is(undoManager.history.length, 2)

    undoManager.undo()
    t.deepEqual(mutable.toJSON(), {})
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, true)
    t.is(undoManager.history.length, 2)
})

const withoutUndo = (t, store) => {
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 1)

    undoManager.withoutUndo(() => store.inc())
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 2)
}

test("same tree - withoutUndo", t => {
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
    withoutUndo(t, store)
})

test("different tree - withoutUndo", t => {
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
    withoutUndo(t, store)
})

test("same tree - withoutUndo declaratively", t => {
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
    withoutUndo(t, store)
})

test("on tree - withoutUndoFlow declaratively", async t => {
    // because async would allow overwriting the history within later tests
    // we need a another _undoManager
    let _undoManager: any = {}
    const _setUndoManagerSameTree = targetStore => {
        _undoManager = targetStore.history
    }

    function delay(time) {
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

    t.is(_undoManager.canUndo, false)
    t.is(_undoManager.canRedo, false)
    t.is(store.x, 1)
    t.is(store.y, 1)

    const value = await store.loadPosition()
    t.is(value.x, 4)
    t.is(store.y, 2)
    t.is(_undoManager.canUndo, false)
    t.is(_undoManager.canRedo, false)
})

test("on tree - group", t => {
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
                addNumber(number) {
                    self.numbers.push(number)
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 1)

    undoManager.startGroup(() => {
        store.inc()
        store.inc()
        store.inc()
        store.inc()
    })
    undoManager.stopGroup()
    t.is(store.x, 5)
    t.is(undoManager.canUndo, true)
    undoManager.undo()
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, true)
    t.is(store.x, 1)

    undoManager.startGroup(() => {
        store.addNumber(1)
        store.addNumber(2)
    })
    undoManager.stopGroup()
    undoManager.undo()
    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, true)
    t.is(store.numbers.length, 0)
})

test("timestamp", t => {
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
                addNumber(number) {
                    self.numbers.push(number)
                }
            }
        })
    const store = HistoryOnTreeStoreModel.create()

    t.is(undoManager.canUndo, false)
    t.is(undoManager.canRedo, false)
    t.is(store.x, 1)

    store.inc()

    t.is(undoManager.canUndo, true)
    const timestamp1 = undoManager.history[undoManager.history.length - 1].timestamp
    t.true(timestamp1 > 0 && typeof timestamp1 === "number")

    store.inc()
    const timestamp2 = undoManager.history[undoManager.history.length - 1].timestamp
    t.true(timestamp2 >= timestamp1 && typeof timestamp2 === "number")

    undoManager.startGroup(() => {
        store.inc()
        store.inc()
        store.inc()
        store.inc()
    })
    undoManager.stopGroup()
    const timestamp3 = undoManager.history[undoManager.history.length - 1].timestamp
    t.true(timestamp3 >= timestamp2 && typeof timestamp3 === "number")
})
