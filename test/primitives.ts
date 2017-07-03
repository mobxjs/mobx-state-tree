import { types } from "../src"
import { test } from "ava"

test("Date instance can be reused", t => {
    const Model = types.model({
        a: types.model({
            b: types.string
        }),
        c: types.Date // types.string -> types.Date
    })

    const Store = types.model(
        { one: Model, index: types.array(Model) },
        {
            set(one) {
                this.one = one
            },
            push(model) {
                this.index.push(model)
            }
        }
    )

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
