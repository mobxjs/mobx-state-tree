import { getSnapshot, types, unprotect, applySnapshot, cast, Instance } from "../../src"

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

    test("it should throw bouncing errors from its sub-type", () => {
        const Row = types.model({
            name: types.string,
            quantity: types.number
        })
        const RowList = types.optional(types.array(Row), [])
        const error = expect(() => {
            RowList.create([
                { name: "a", quantity: 1 },
                { name: "b", quantity: "x" }
            ] as any)
        }).toThrow()
    })
}

test("it should accept a function to provide dynamic values", () => {
    let defaultValue = 1
    const Factory = types.model({
        a: types.optional(types.number, () => defaultValue)
    })
    expect(getSnapshot(Factory.create())).toEqual({ a: 1 })
    defaultValue = 2
    expect(getSnapshot(Factory.create())).toEqual({ a: 2 })
    defaultValue = "hello world!" as any
    if (process.env.NODE_ENV !== "production") {
        expect(() => Factory.create()).toThrowError(
            `[mobx-state-tree] Error while converting \`"hello world!"\` to \`number\`:\n\n    value \`"hello world!"\` is not assignable to type: \`number\` (Value is not a number).`
        )
    }
})

test("Values should reset to default if omitted in snapshot", () => {
    const Store = types.model({
        todo: types.model({
            id: types.identifier,
            done: false,
            title: "test",
            thing: types.frozen({})
        })
    })
    const store = Store.create({ todo: { id: "2" } })
    unprotect(store)
    store.todo.done = true
    expect(store.todo.done).toBe(true)
    store.todo = cast({ title: "stuff", id: "2" })
    expect(store.todo.title).toBe("stuff")
    expect(store.todo.done).toBe(false)
})

test("optional frozen should fallback to default value if snapshot is undefined", () => {
    const Store = types.model({ thing: types.frozen({}) })
    const store = Store.create({
        thing: null
    })

    expect(store.thing).toBeNull()
    applySnapshot(store, {})
    expect(store.thing).toBeDefined()
    expect(store.thing).toEqual({})
})

test("an instance is not a valid default value, snapshot or function that creates instance must be used", () => {
    const Row = types.model("Row", {
        name: "",
        quantity: 0
    })

    // passing a node directly, without a generator function
    expect(() => {
        types.model({ rows: types.optional(types.array(Row), types.array(Row).create()) })
    }).toThrow(
        "default value cannot be an instance, pass a snapshot or a function that creates an instance/snapshot instead"
    )

    // an alike node but created from a different yet equivalent type
    const e = expect(() => {
        const Factory = types.model({
            rows: types.optional(types.array(Row), () => types.array(Row).create())
        })
        // we need to create the node for it to throw, since generator functions are typechecked when nodes are created
        // tslint:disable-next-line:no-unused-expression
        Factory.create()
    })
    if (process.env.NODE_ENV === "production") {
        e.not.toThrow()
    } else {
        e.toThrow("Error while converting <> to `Row[]`")
    }

    {
        // a node created on a generator function of the exact same type
        const RowArray = types.array(Row)
        const Factory = types.model("Factory", {
            rows: types.optional(RowArray, () => RowArray.create())
        })
        const doc = Factory.create()
        expect(getSnapshot(doc)).toEqual({ rows: [] })
    }
})

test("undefined can work as a missing value", () => {
    const M = types.model({ x: types.union(types.undefined, types.number) })
    const m1 = M.create({ x: 5 })
    expect(m1.x).toBe(5)
    const m2 = M.create({ x: undefined })
    expect(m2.x).toBe(undefined)
    const m3 = M.create({}) // is ok as well (even in TS)
    expect(m3.x).toBe(undefined)

    // can omit optional values in inferred types
    type MType = Instance<typeof M>
    const m4: MType = { x: 5 }
    expect(m4.x).toBe(5)
    const m5: MType = { x: undefined }
    expect(m5.x).toBe(undefined)
    const m6: MType = {} // should be okay in typescript too
    expect(m6.x).toBe(undefined)
})
