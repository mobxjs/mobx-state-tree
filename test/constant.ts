import {createFactory, unionOf, constant} from "../"
import {test} from "ava"

test("it should allow only primitives", t => {
    const error = t.throws(() => {
        const Factory = createFactory({
            complexArg: constant({a: 1})
        })
    })

    t.is(error.message, '[mobx-state-tree] Constant types can be built only on top of primitives')
})

test("it should throw if a different type is given", t => {
    const Factory = createFactory({
        shouldBeOne: constant(1)
    })

    const error = t.throws(() => {
        const doc = Factory({ shouldBeOne: 2 })
    })

    t.is(error.message, '[mobx-state-tree] Snapshot {"shouldBeOne":2} is not assignable to type unnamed-object-factory. Expected { shouldBeOne: 1 } instead.')
})