import { getSnapshot, applySnapshot, unprotect, types } from "../src"
import { test } from "ava"

test("it should avoid processing patch if is exactly the current one in applySnapshot", t => {
    let called = false
    const Model = types.model({
        a: types.number,
        b: types.string
    })
    const store = Model.create({ a: 1, b: "hello" })
    called = false
    const snapshot = getSnapshot(store)
    applySnapshot(store, snapshot)
    t.is(getSnapshot(store), snapshot) // no new snapshot emitted
})

test("it should avoid processing patch if is exactly the current one in reconcile", t => {
    const Model = types.model({
        a: types.number,
        b: types.string
    })
    const RootModel = types.model({
        a: Model
    })
    const store = RootModel.create({ a: { a: 1, b: "hello" } })
    unprotect(store)
    const snapshot = getSnapshot(store)
    store.a = snapshot.a
    t.is(getSnapshot(store.a), snapshot.a)
    t.deepEqual(getSnapshot(store), snapshot)
})
