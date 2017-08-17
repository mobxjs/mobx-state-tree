import { types } from "../src"
import { test } from "ava"

test("it should allow only primitives", t => {
    const error = t.throws(() => {
        types.model({
            complexArg: types.literal({ a: 1 })
        })
    }, "[mobx-state-tree] Literal types can be built only on top of primitives")
})

test("it should fail if not optional and no default provided", t => {
    const Factory = types.literal("hello")
    t.snapshot(
        t.throws(() => {
            Factory.create()
        }).message
    )
})

test("it should throw if a different type is given", t => {
    const Factory = types.model("TestFactory", {
        shouldBeOne: types.literal(1)
    })
    t.snapshot(
        t.throws(() => {
            Factory.create({ shouldBeOne: 2 })
        }).message
    )
})

test("it should support null type", t => {
    const M = types.model({
        nullish: types.null
    })
    t.is(
        M.is({
            nullish: null
        }),
        true
    )
    t.is(M.is({ nullish: undefined }), false)
    t.is(M.is({ nullish: 17 }), false)
})

test("it should support undefined type", t => {
    const M = types.model({
        undefinedish: types.undefined
    })
    t.is(
        M.is({
            undefinedish: undefined
        }),
        true
    )
    t.is(M.is({}), true) // MWE: disputable, should be false?
    t.is(M.is({ undefinedish: null }), false)
    t.is(M.is({ undefinedish: 17 }), false)
})
