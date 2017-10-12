import { types } from "../src"
import { test } from "ava"

test("It should warn when using types.maybe(types.frozen)", t => {
    t.throws(
        () => types.maybe(types.frozen),
        `[mobx-state-tree] Unable to declare \`types.maybe(types.frozen)\`. Frozen already accepts \`null\`. Consider using \`types.optional(types.frozen, null)\` instead.`
    )
})
