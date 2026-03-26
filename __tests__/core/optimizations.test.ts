import { getSnapshot, applySnapshot, unprotect, types } from "../../src"
import { expect, test } from "bun:test"

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

test("it should only validate changed array items when applying a parent snapshot", () => {
    class Box {
        constructor(readonly value: string) {}
    }

    let validationCalls = 0

    const CountingBox = types.custom<string, Box>({
        name: "CountingBox",
        fromSnapshot(value) {
            return new Box(value)
        },
        toSnapshot(value) {
            return value.value
        },
        isTargetType(value): value is Box {
            return value instanceof Box
        },
        getValidationMessage(value) {
            validationCalls++
            return typeof value === "string" ? "" : "not a string"
        }
    })

    const Store = types.model({
        items: types.array(CountingBox)
    })

    const store = Store.create({
        items: ["1", "2", "3", "4", "5"]
    })
    const snapshot = getSnapshot(store)

    applySnapshot(store, {
        items: ["1", "2", "10", "4", "5"]
    })

    validationCalls = 0
    applySnapshot(store, snapshot)

    if (process.env.NODE_ENV !== "production") {
        expect(validationCalls).toBe(1)
    }
    expect(getSnapshot(store)).toEqual(snapshot)
})
