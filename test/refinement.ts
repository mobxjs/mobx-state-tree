import { getSnapshot, types } from "../src"
import { test } from "ava"

test("it should allow if type and predicate is correct", t => {
    const Factory = types.model({
        number: types.refinement(
            "positive number",
            types.optional(types.number, 0),
            s => typeof s === "number" && s >= 0
        )
    })

    const doc = Factory.create({ number: 42 })

    t.deepEqual<any>(getSnapshot(doc), { number: 42 })
})

test("it should throw if a correct type with failing predicate is given", t => {
    const Factory = types.model("FactoryTest", {
        number: types.refinement(
            "positive number",
            types.optional(types.number, 0),
            s => typeof s === "number" && s >= 0
        )
    })

    t.throws(() => {
        Factory.create({ number: "givenStringInstead" })
    }, err => err.message.includes("[mobx-state-tree]") && err.message.includes('"givenStringInstead"') && err.message.includes("FactoryTest") && err.message.includes("/number") && err.message.includes("positive number"))

    t.throws(() => {
        Factory.create({ number: -4 })
    }, err => err.message.includes("[mobx-state-tree]") && err.message.includes("-4") && err.message.includes("FactoryTest") && err.message.includes("/number") && err.message.includes("positive number"))
})
