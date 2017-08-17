import { test } from "ava"
import { getSnapshot, types, unprotect } from "../src"

test("it should provide a default value, if no snapshot is provided", t => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), [{ name: "test" }])
    })
    const doc = Factory.create()
    t.deepEqual<any>(getSnapshot(doc), { rows: [{ name: "test", quantity: 0 }] })
})

test("it should use the snapshot if provided", t => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), [{ name: "test" }])
    })
    const doc = Factory.create({ rows: [{ name: "snapshot", quantity: 0 }] })
    t.deepEqual<any>(getSnapshot(doc), { rows: [{ name: "snapshot", quantity: 0 }] })
})

test("it should throw if default value is invalid snapshot", t => {
    const Row = types.model({
        name: types.string,
        quantity: types.number
    })
    const error = t.throws(() => {
        types.model({
            rows: types.optional(types.array(Row), [{}])
        })
    })
})

test("it should throw bouncing errors from its sub-type", t => {
    const Row = types.model({
        name: types.string,
        quantity: types.number
    })
    const RowList = types.optional(types.array(Row), [])
    const error = t.throws(() => {
        RowList.create([{ name: "a", quantity: 1 }, { name: "b", quantity: "x" }])
    })
})

test("it should accept a function to provide dynamic values", t => {
    let defaultValue: any = 1
    const Factory = types.model({
        a: types.optional(types.number, () => defaultValue)
    })
    t.deepEqual(getSnapshot(Factory.create()), { a: 1 })
    defaultValue = 2
    t.deepEqual(getSnapshot(Factory.create()), { a: 2 })
    defaultValue = "hello world!"
    t.throws(
        () => Factory.create(),
        `[mobx-state-tree] Error while converting \`"hello world!"\` to \`number\`:\nvalue \`"hello world!"\` is not assignable to type: \`number\` (Value is not a number).`
    )
})

test("Values should reset to default if omitted in snapshot", t => {
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
    t.is(store.todo.done, true)
    store.todo = { title: "stuff", id: "2" } as any
    t.is(store.todo.title, "stuff")
    t.is(store.todo.done, false)
})

test("a model is a valid default value, snapshot will be used", t => {
    const Row = types.model({
        name: "",
        quantity: 0
    })
    const Factory = types.model({
        rows: types.optional(types.array(Row), types.array(Row).create())
    })
    const doc = Factory.create()
    t.deepEqual<any>(getSnapshot(doc), { rows: [] })
})
