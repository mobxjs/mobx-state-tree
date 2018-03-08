import { getSnapshot, applySnapshot, unprotect, types } from "../src"
test("it should avoid processing patch if is exactly the current one in applySnapshot", () => {
    let called = false
    const Model = types.model({
        a: types.number,
        b: types.string
    })
    const store = Model.create({ a: 1, b: "hello" })
    called = false
    const snapshot = getSnapshot(store)
    applySnapshot(store, snapshot)
    expect(getSnapshot(store)).toBe(snapshot) // no new snapshot emitted
})
test("it should avoid processing patch if is exactly the current one in reconcile", () => {
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
    expect(getSnapshot(store.a)).toBe(snapshot.a)
    expect(getSnapshot(store)).toEqual(snapshot)
})
