import { describe, expect, test } from "bun:test"
import { applySnapshot, getSnapshot, types } from "../../src"

describe("applySnapshot on arrays of identified children", () => {
    const Child = types.model("Child", { id: types.identifier, value: types.number })
    const Store = types.model("Store", { items: types.array(Child) })

    function createStore(size: number) {
        const store = Store.create({
            items: Array.from({ length: size }, (_, i) => ({ id: `${i}`, value: i }))
        })
        store.items.forEach(item => item.value)
        return store
    }

    test("a moved child keeps its node", () => {
        const store = createStore(4)
        const [a, b, c, d] = store.items
        applySnapshot(
            store.items,
            [a, c, d, b].map(item => getSnapshot(item))
        )
        expect(store.items.map(item => item.id)).toEqual(["0", "2", "3", "1"])
        expect(store.items.every((item, i) => item === [a, c, d, b][i])).toBe(true)
    })

    test("a child moved while another changes keeps its node and takes the change", () => {
        const store = createStore(3)
        const [a, b, c] = store.items
        applySnapshot(store.items, [
            { ...getSnapshot(b), value: 10 },
            getSnapshot(a),
            getSnapshot(c)
        ])
        expect(store.items.map(item => item.value)).toEqual([10, 0, 2])
        expect(store.items.every((item, i) => item === [b, a, c][i])).toBe(true)
    })

    test("an inserted child is validated against the one node it can match", () => {
        const processed: string[] = []
        const Counted = types
            .model("Counted", { id: types.identifier })
            .preProcessSnapshot(snapshot => {
                processed.push(snapshot.id)
                return snapshot
            })
        const Root = types.model("Root", { items: types.array(Counted) })

        const count = (size: number) => {
            const root = Root.create({
                items: Array.from({ length: size }, (_, i) => ({ id: `${i}` }))
            })
            root.items.forEach(item => item.id)
            processed.length = 0
            applySnapshot(root.items, [{ id: "new" }, ...getSnapshot(root.items)])
            return processed.filter(id => id === "new").length
        }

        expect(count(40)).toBe(count(4))
    })
})
