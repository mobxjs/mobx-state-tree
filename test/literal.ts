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
    t.throws(
        () => {
            Factory.create()
        },
        `[mobx-state-tree] Error while converting \`undefined\` to \`hello\`:
value \`undefined\` is not assignable to type: \`hello\`, expected an instance of \`hello\` or a snapshot like \`"hello"\` instead.`
    )
})

test("it should throw if a different type is given", t => {
    const Factory = types.model("TestFactory", {
        shouldBeOne: types.literal(1)
    })

    const error = t.throws(
        () => {
            Factory.create({ shouldBeOne: 2 })
        },
        `[mobx-state-tree] Error while converting \`{"shouldBeOne":2}\` to \`TestFactory\`:
at path "/shouldBeOne" value \`2\` is not assignable to type: \`1\`, expected an instance of \`1\` or a snapshot like \`1\` instead.`
    )
})
