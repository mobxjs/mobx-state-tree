import { describe, expect, test } from "bun:test"
import { applySnapshot, getSnapshot, types } from "../../src"

describe("applySnapshot on arrays of identified children", () => {
    const Child = types.model("Child", { id: types.identifier, value: types.number })
    const Store = types.model("Store", { items: types.array(Child) })

    // toEqual compares instances structurally; the nodes have to be the same objects.
    const sameNodes = (actual: unknown[], expected: unknown[]) =>
        actual.length === expected.length && actual.every((node, i) => node === expected[i])

    function createStore(size: number) {
        const store = Store.create({
            items: Array.from({ length: size }, (_, i) => ({ id: `${i}`, value: i }))
        })
        // MST instantiates nodes lazily; the read materializes the items.
        store.items.forEach(item => item.value)
        return store
    }

    test("a moved child keeps its node", () => {
        const store = createStore(4)
        const nodes = store.items.slice()
        const [a, b, c, d] = getSnapshot(store.items)

        applySnapshot(store.items, [a, c, d, b])

        expect(store.items.map(item => item.id)).toEqual(["0", "2", "3", "1"])
        expect(sameNodes(store.items.slice(), [nodes[0], nodes[2], nodes[3], nodes[1]])).toBe(true)
    })

    test("a child moved while another changes keeps its node and takes the change", () => {
        const store = createStore(3)
        const nodes = store.items.slice()
        const [a, b, c] = getSnapshot(store.items)

        applySnapshot(store.items, [{ ...b, value: 10 }, a, c])

        expect(store.items.map(item => item.value)).toEqual([10, 0, 2])
        expect(sameNodes(store.items.slice(), [nodes[1], nodes[0], nodes[2]])).toBe(true)
    })

    test("a safe reference to a moved child still resolves", () => {
        const Root = types
            .model("Root", {
                items: types.array(Child),
                selected: types.safeReference(Child)
            })
            .actions(self => ({
                select(id: string) {
                    self.selected = self.items.find(item => item.id === id)
                }
            }))
        const root = Root.create({
            items: Array.from({ length: 4 }, (_, i) => ({ id: `${i}`, value: i }))
        })
        root.items.forEach(item => item.value)
        root.select("1")
        const selected = root.selected
        const [a, b, c, d] = getSnapshot(root.items)

        applySnapshot(root.items, [a, c, d, b])

        expect(selected).toBeDefined()
        expect(root.selected === selected).toBe(true)
        expect(root.items[3] === selected).toBe(true)
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
            expect(root.items.map(item => item.id)[0]).toBe("new")
            return processed.filter(id => id === "new").length
        }

        // The work for the inserted snapshot must not grow with the array length.
        expect(count(40)).toBe(count(4))
    })
})
