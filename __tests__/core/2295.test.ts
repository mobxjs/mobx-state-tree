// https://github.com/mobxjs/mobx-state-tree/issues/2295
import { describe, expect, test } from "bun:test"
import { applySnapshot, types } from "../../src/index"

describe("2295 - afterCreate runs for recreated array children", () => {
    test("applySnapshot recreates identifier-less children and runs afterCreate", () => {
        const calls: string[] = []

        const Child = types.model("Child", { email: types.string }).actions(self => ({
            afterCreate() {
                calls.push(self.email)
            }
        }))

        const Store = types.model("Store", { children: types.array(Child) })

        const store = Store.create({ children: [{ email: "one@example.com" }] })
        // MST instantiates nodes lazily, so read the child to materialize it.
        expect(store.children.map(child => child.email)).toEqual(["one@example.com"])
        expect(calls).toEqual(["one@example.com"])

        applySnapshot(store, { children: [{ email: "two@example.com" }] })
        expect(store.children.map(child => child.email)).toEqual(["two@example.com"])

        // Without an identifier MST cannot know the two snapshots describe the same
        // entity, so the child is replaced rather than updated in place, which means
        // afterCreate has to run for the newly created child.
        expect(calls).toEqual(["one@example.com", "two@example.com"])
    })

    test("identified children are still reconciled in place without re-running afterCreate", () => {
        const calls: string[] = []

        const Child = types
            .model("Child", { id: types.identifier, email: types.string })
            .actions(self => ({
                afterCreate() {
                    calls.push(self.id)
                }
            }))

        const Store = types.model("Store", { children: types.array(Child) })

        const store = Store.create({ children: [{ id: "a", email: "one@example.com" }] })
        expect(store.children.map(child => child.email)).toEqual(["one@example.com"])
        expect(calls).toEqual(["a"])

        applySnapshot(store, { children: [{ id: "a", email: "two@example.com" }] })

        // Same identifier means the same entity, so the node is reused and the hook
        // must not fire again.
        expect(store.children.map(child => child.email)).toEqual(["two@example.com"])
        expect(calls).toEqual(["a"])
    })

    test("entries spread across the array keep their own values", () => {
        const Child = types.model("Child", { value: types.number })
        const Store = types.model("Store", { children: types.array(Child) })

        const size = 20
        const store = Store.create({
            children: Array.from({ length: size }, (_, i) => ({ value: i }))
        })
        expect(store.children.map(child => child.value)).toEqual(
            Array.from({ length: size }, (_, i) => i)
        )

        // Change the first, a middle and the last entry, so the changes are not adjacent.
        const next = Array.from({ length: size }, (_, i) => ({ value: i }))
        next[0] = { value: 100 }
        next[7] = { value: 107 }
        next[size - 1] = { value: 200 }

        applySnapshot(store, { children: next })

        expect(store.children.map(child => child.value)).toEqual(next.map(child => child.value))
    })
})
