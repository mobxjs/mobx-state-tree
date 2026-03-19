import { applySnapshot, getSnapshot, types } from "../../src"
import { expect, test } from "bun:test"

test("it should allow if type and predicate is correct", () => {
    const Factory = types.model({
        number: types.refinement(
            "positive number",
            types.optional(types.number, 0),
            s => typeof s === "number" && s >= 0
        )
    })
    const doc = Factory.create({ number: 42 })
    expect(getSnapshot(doc)).toEqual({ number: 42 })
})
if (process.env.NODE_ENV !== "production") {
    test("it should throw if a correct type with failing predicate is given", () => {
        const Factory = types.model({
            number: types.refinement(
                "positive number",
                types.optional(types.number, 0),
                s => typeof s === "number" && s >= 0
            )
        })
        expect(() => {
            Factory.create({ number: "givenStringInstead" } as any)
        }).toThrow(
            `[mobx-state-tree] Error while converting \`{\"number\":\"givenStringInstead\"}\` to \`AnonymousModel\`:\n\n    at path \"/number\" value \`\"givenStringInstead\"\` is not assignable to type: \`positive number\` (Value is not a number).`
        )
        expect(() => {
            Factory.create({ number: -4 })
        }).toThrow(
            `[mobx-state-tree] Error while converting \`{\"number\":-4}\` to \`AnonymousModel\`:\n\n    at path \"/number\" value \`-4\` is not assignable to type: \`positive number\` (Value does not respect the refinement predicate).`
        )
    })
    test("it should throw custom error message with failing predicate is given", () => {
        const Factory = types.model({
            number: types.refinement(
                types.optional(types.number, 0),
                s => typeof s === "number" && s >= 0,
                s => "A positive number was expected"
            )
        })
        expect(() => {
            Factory.create({ number: "givenStringInstead" } as any)
        }).toThrow(
            `[mobx-state-tree] Error while converting \`{\"number\":\"givenStringInstead\"}\` to \`AnonymousModel\`:\n\n    at path \"/number\" value \`\"givenStringInstead\"\` is not assignable to type: \`number\` (Value is not a number).`
        )
        expect(() => {
            Factory.create({ number: -4 })
        }).toThrow(
            `[mobx-state-tree] Error while converting \`{\"number\":-4}\` to \`AnonymousModel\`:\n\n    at path "/number" value \`-4\` is not assignable to type: \`number\` (A positive number was expected).`
        )
    })

    test("it should reject refinement-violating snapshots via applySnapshot on a model property", () => {
        const Item = types.model("Item", {
            id: types.identifier,
            value: types.number
        })
        const Store = types.model("Store", {
            item: types.refinement(Item, snap => snap.value >= 0)
        })

        const store = Store.create({ item: { id: "1", value: 5 } })

        expect(() => {
            applySnapshot(store, { item: { id: "1", value: -1 } })
        }).toThrow()
    })

    test("it should reject refinement-violating snapshots via applySnapshot on an optional refinement property", () => {
        const Item = types.model("Item", {
            id: types.identifier,
            value: types.number
        })
        const Store = types.model("Store", {
            item: types.optional(
                types.refinement(Item, snap => snap.value >= 0),
                {
                    id: "1",
                    value: 0
                }
            )
        })

        const store = Store.create({ item: { id: "1", value: 5 } })

        expect(() => {
            applySnapshot(store, { item: { id: "1", value: -1 } })
        }).toThrow()
    })

    test("it should reject refinement-violating snapshots via applySnapshot on a late refinement property", () => {
        const Item = types.model("Item", {
            id: types.identifier,
            value: types.number
        })
        const RefinedItem = types.refinement(Item, snap => snap.value >= 0)
        const Store = types.model("Store", {
            item: types.late(() => RefinedItem)
        })

        const store = Store.create({ item: { id: "1", value: 5 } })

        expect(() => {
            applySnapshot(store, { item: { id: "1", value: -1 } })
        }).toThrow()
    })

    test("it should reject refinement-violating snapshots via applySnapshot in an array", () => {
        const Item = types.model("Item", {
            id: types.identifier,
            value: types.number
        })
        const Store = types.model("Store", {
            items: types.array(types.refinement(Item, snap => snap.value >= 0))
        })

        const store = Store.create({ items: [{ id: "1", value: 5 }] })

        expect(() => {
            applySnapshot(store, { items: [{ id: "1", value: -1 }] })
        }).toThrow()
    })

    test("it should reject refinement-violating snapshots via applySnapshot in a map", () => {
        const Item = types.model("Item", {
            id: types.identifier,
            value: types.number
        })
        const Store = types.model("Store", {
            items: types.map(types.refinement(Item, snap => snap.value >= 0))
        })

        const store = Store.create({ items: { "1": { id: "1", value: 5 } } })

        expect(() => {
            applySnapshot(store, { items: { "1": { id: "1", value: -1 } } })
        }).toThrow()
    })
}
