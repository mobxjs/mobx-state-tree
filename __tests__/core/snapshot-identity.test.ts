import { describe, expect, test } from "bun:test"
import { applySnapshot, getSnapshot, types } from "../../src"

describe("snapshot identity across lazy instantiation", () => {
    test("reading a child for the first time keeps the snapshot objects", () => {
        const Item = types.model("Item", { id: types.identifier, value: types.number })
        const Store = types.model("Store", { items: types.array(Item) })
        const store = Store.create({ items: [{ id: "a", value: 1 }] })
        const before = getSnapshot(store)

        expect(store.items[0].value).toBe(1)

        expect(getSnapshot(store.items[0])).toBe(before.items[0])
        expect(getSnapshot(store)).toBe(before)
    })

    test("a snapshot taken before instantiation still skips the unchanged children", () => {
        const processed: string[] = []
        const Item = types
            .model("Item", { id: types.identifier, value: types.number })
            .preProcessSnapshot(snapshot => {
                processed.push(snapshot.id)
                return snapshot
            })
            .actions(self => ({
                setValue(value: number) {
                    self.value = value
                }
            }))
        const Store = types.model("Store", { items: types.array(Item) })
        const store = Store.create({
            items: [
                { id: "a", value: 1 },
                { id: "b", value: 2 }
            ]
        })
        const initial = getSnapshot(store)
        store.items.forEach(item => item.value)
        store.items[0].setValue(3)
        processed.length = 0

        applySnapshot(store, initial)

        expect(getSnapshot(store)).toEqual(initial)
        expect(processed).not.toContain("b")
    })
})
