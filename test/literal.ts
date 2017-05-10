import {types} from "../src"
import {test} from "ava"

test("it should allow only primitives", t => {
    const error = t.throws(() => {
        types.model({
            complexArg: types.literal({a: 1})
        })
    })

    t.is(error.message, "[mobx-state-tree] Literal types can be built only on top of primitives")
})

test("it should fail if not optional and no default provided", (t) => {
    const Factory = types.literal("hello")
    const ex = t.throws(() => {
        Factory.create()
    })
    t.deepEqual(ex.message, "[mobx-state-tree] Value \'undefined\' is not assignable to type: hello, expected an instance of hello or a snapshot like \'\"hello\"\' instead.")
})

test("it should throw if a different type is given", t => {
    const Factory = types.model("TestFactory", {
        shouldBeOne: types.literal(1)
    })

    const error = t.throws(() => {
        Factory.create({ shouldBeOne: 2 })
    })

    t.is(error.message, `[mobx-state-tree] Value '{"shouldBeOne":2}' is not assignable to type: TestFactory, expected an instance of TestFactory or a snapshot like \'{ shouldBeOne: 1 }\' instead.`)
})