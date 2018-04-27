import { getSnapshot, types, unprotect } from "../src"
test("it should provide a default value, if no snapshot is provided", () => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), [{ name: "test" }])
    })
    const doc = Factory.create()
    expect(getSnapshot(doc)).toEqual({ rows: [{ name: "test", quantity: 0 }] })
})
test("it should use the snapshot if provided", () => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), [{ name: "test" }])
    })
    const doc = Factory.create({ rows: [{ name: "snapshot", quantity: 0 }] })
    expect(getSnapshot(doc)).toEqual({ rows: [{ name: "snapshot", quantity: 0 }] })
})
if (process.env.NODE_ENV !== "production") {
    test("it should throw if default value is invalid snapshot", () => {
        const Row = types.model({
            name: types.string,
            quantity: types.number
        })
        const error = expect(() => {
            types.model({
                rows: types.optional(types.array(Row), [{}] as any)
            })
        }).toThrow()
    })
}
if (process.env.NODE_ENV !== "production") {
    test("it should throw bouncing errors from its sub-type", () => {
        const Row = types.model({
            name: types.string,
            quantity: types.number
        })
        const RowList = types.optional(types.array(Row), [])
        const error = expect(() => {
            RowList.create([{ name: "a", quantity: 1 }, { name: "b", quantity: "x" }] as any)
        }).toThrow()
    })
}
test("it should accept a function to provide dynamic values", () => {
    let defaultValue: any = 1
    const Factory = types.model({
        a: types.optional(types.number, () => defaultValue)
    })
    expect(getSnapshot(Factory.create())).toEqual({ a: 1 })
    defaultValue = 2
    expect(getSnapshot(Factory.create())).toEqual({ a: 2 })
    defaultValue = "hello world!"
    if (process.env.NODE_ENV !== "production") {
        expect(() => Factory.create()).toThrowError(
            `[mobx-state-tree] Error while converting \`"hello world!"\` to \`number\`:\n\n    value \`"hello world!"\` is not assignable to type: \`number\` (Value is not a number).`
        )
    }
})
test("Values should reset to default if omitted in snapshot", () => {
    const Store = types.model({
        todo: types.model({
            id: types.identifier(),
            done: false,
            title: "test"
        })
    })
    const store = Store.create({ todo: { id: "2" } })
    unprotect(store)
    store.todo.done = true
    expect(store.todo.done).toBe(true)
    store.todo = { title: "stuff", id: "2" } as any
    expect(store.todo.title).toBe("stuff")
    expect(store.todo.done).toBe(false)
})
test("a model is a valid default value, snapshot will be used", () => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), types.array(Row).create())
    })
    const doc = Factory.create()
    expect(getSnapshot(doc)).toEqual({ rows: [] })
})
