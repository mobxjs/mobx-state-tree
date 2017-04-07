import {types} from "../"
import {test} from "ava"

test("it should allow only primitives", t => {
    const error = t.throws(() => {
        const Factory = types.model({
            complexArg: types.literal({a: 1})
        })
    })

    t.is(error.message, '[mobx-state-tree] Literal types can be built only on top of primitives')
})

test("it should throw if a different type is given", t => {
    const Factory = types.model("TestFactory", {
        shouldBeOne: types.literal(1)
    })

    const error = t.throws(() => {
        const doc = Factory.create({ shouldBeOne: 2 })
    })

    t.is(error.message, `[mobx-state-tree] Value '{"shouldBeOne":2}' is not assignable to type: TestFactory. Expected { shouldBeOne: 1 } instead.`)
})