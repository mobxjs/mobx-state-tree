import { describe, expect, test } from "bun:test"
import { applySnapshot, getSnapshot, types } from "../../src"

describe("snapshot identity across lazy instantiation", () => {
    const Item = types.model("Item", { id: types.identifier, value: types.number })
    const Store = types.model("Store", { items: types.array(Item) })

    test("reading a child for the first time keeps the snapshot objects", () => {
        const store = Store.create({
            items: [
                { id: "a", value: 1 },
                { id: "b", value: 2 }
            ]
        })
        const before = getSnapshot(store)

        // MST instantiates nodes lazily; the read materializes the item.
        expect(store.items[0].value).toBe(1)

        expect(getSnapshot(store.items[0])).toBe(before.items[0])
        expect(getSnapshot(store.items)).toBe(before.items)
        expect(getSnapshot(store)).toBe(before)
    })

    test("a change made in afterCreate of a lazily instantiated child is visible", () => {
        const Child = types
            .model("Child", { id: types.identifier, value: types.number })
            .actions(self => ({
                afterCreate() {
                    self.value = 99
                }
            }))
        const Root = types.model("Root", { items: types.array(Child) })
        const root = Root.create({ items: [{ id: "a", value: 1 }] })
        expect(getSnapshot(root).items[0].value).toBe(1)

        expect(root.items[0].value).toBe(99)

        expect(getSnapshot(root.items[0]).value).toBe(99)
        expect(getSnapshot(root).items[0].value).toBe(99)
    })

    test("a snapshot taken before instantiation still skips the unchanged children", () => {
        const processed: string[] = []
        const Child = types
            .model("Child", { id: types.identifier, value: types.number })
            .preProcessSnapshot(snapshot => {
                processed.push(snapshot.id)
                return snapshot
            })
            .actions(self => ({
                setValue(value: number) {
                    self.value = value
                }
            }))
        const Root = types.model("Root", { items: types.array(Child) })

        const root = Root.create({
            items: [
                { id: "a", value: 1 },
                { id: "b", value: 2 }
            ]
        })
        const initial = getSnapshot(root)
        root.items.forEach(item => item.value)
        root.items[0].setValue(3)
        processed.length = 0

        applySnapshot(root, initial)

        expect(getSnapshot(root)).toEqual(initial)
        // Only "a" changed, so "b" is left alone instead of being processed again.
        expect(processed).not.toContain("b")
    })
})
