import { getSnapshot, applySnapshot, unprotect, types } from "../../src"

test("it should avoid processing patch if is exactly the current one in applySnapshot", () => {
  const Model = types.model({
    a: types.number,
    b: types.string
  })
  const store = Model.create({ a: 1, b: "hello" })
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
  // NOTE: snapshots are not equal after property access anymore,
  // so we test initial and actual ones separately
  const snapshot = getSnapshot(store)
  expect(getSnapshot(store)).toEqual(snapshot)

  store.a = snapshot.a
  // check whether reconciliation works on initial values
  expect(getSnapshot(store)).toEqual(snapshot)

  // access property to initialize observable instance
  expect(getSnapshot(store.a)).toEqual(snapshot.a)

  // check whether initializing instance does not cause snapshot invalidation
  const actualSnapshot = getSnapshot(store)
  expect(actualSnapshot.a).toBe(snapshot.a)
})
