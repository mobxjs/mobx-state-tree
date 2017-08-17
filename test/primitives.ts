import { types, applySnapshot, getSnapshot } from "../src"
import { test } from "ava"

test("Date instance can be reused", t => {
    const Model = types.model({
        a: types.model({
            b: types.string
        }),
        c: types.Date // types.string -> types.Date
    })
    const Store = types
        .model({
            one: Model,
            index: types.array(Model)
        })
        .actions(self => {
            function set(one) {
                self.one = one
            }
            function push(model) {
                self.index.push(model)
            }
            return {
                set,
                push
            }
        })
    const object = { a: { b: "string" }, c: new Date() } // string -> date (number)
    const instance = Store.create({
        one: object,
        index: [object]
    })
    instance.set(object)
    t.notThrows(() => instance.push(object))
    t.is(instance.one.c, object.c)
    t.is(instance.index[0].c, object.c)
})

test("Date can be rehydrated using unix timestamp", t => {
    const time = new Date()
    const newTime = 6813823163
    const Factory = types.model({
        date: types.optional(types.Date, () => time)
    })
    const store = Factory.create()
    t.is(store.date.getTime(), time.getTime())
    applySnapshot(store, { date: newTime })
    t.is(store.date.getTime(), newTime)
    t.is(getSnapshot(store).date, newTime)
})
