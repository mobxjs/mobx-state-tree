import { unprotect } from '../src/core';
import {test} from "ava"
import {getSnapshot, types} from "../src"

test("it should provide a default value, if no snapshot is provided", t => {
    const Row = types.model({
        name: '',
        quantity: 0
    })

    const Factory = types.model({
        rows: types.withDefault(types.array(Row), [{name: 'test'}])
    })

    const doc = Factory.create()
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'test', quantity: 0}]})
})


test("it should use the snapshot if provided", t => {
    const Row = types.model({
        name: '',
        quantity: 0
    })

    const Factory = types.model({
        rows: types.withDefault(types.array(Row), [{name: 'test'}])
    })

    const doc = Factory.create({rows: [{name: 'snapshot', quantity: 0}]})
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'snapshot', quantity: 0}]})
})


test("it should throw if default value is invalid snapshot", t => {
    const Row = types.model({
        name: types.string,
        quantity: types.number
    })

    const error = t.throws(() => {
        const Factory = types.model({
            rows: types.withDefault(types.array(Row), [{}])
        })
    })

    t.is(error.message, "[mobx-state-tree] Value \'[{}]\' is not assignable to type: AnonymousModel[], expected an instance of AnonymousModel[] or a snapshot like \'{ name: string; quantity: number }[]\' instead.")
})

test("it should accept a function to provide dynamic values", t => {
    let defaultValue: any = 1
    const Factory = types.model({
        a: types.withDefault(types.number, () => defaultValue)
    })

    t.deepEqual(getSnapshot(Factory.create()), {a: 1})

    defaultValue = 2
    t.deepEqual(getSnapshot(Factory.create()), {a: 2})

    defaultValue = "hello world!"
    const ex = t.throws(() => Factory.create())
    t.deepEqual(ex.message, "[mobx-state-tree] Value is not assignable to \'number\'")
})

test.skip("it should be possible to create types on the fly", t => {
    // TODO: enable again if TODOs in complex-type/object for parsing props are solved
    const Box = types.model({
        point: {
            x: 10,
            y: 10
        }
    }, {
        afterCreate() {
            unprotect(this)
        }
    })

    const b1 = Box.create()
    const b2 = Box.create()
    const b3 = Box.create({ point: { x: 5 }})

    b2.point.x = 42
    b2.point.y = 52

    t.is(b1.point.x, 10)
    t.is(b1.point.y, 10)
    t.is(b2.point.x, 42)
    t.is(b2.point.y, 52)
    t.is(b3.point.x, 5)
    t.is(b3.point.y, 10)
    t.is("" + b1.point, "AnonymousModel__point@/point")
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

    store.todo = { title: "stuff", id: "2"} as any

    t.is(store.todo.title, "stuff")
    t.is(store.todo.done, false)
})