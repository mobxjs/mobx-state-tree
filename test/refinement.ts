import {getSnapshot, types} from "../src"
import {test} from "ava"

test("it should allow if type and predicate is correct", t => {
    const Factory = types.model({
        number: types.refinement("positive number", types.optional(types.number, 0), s => typeof s === "number" && s >= 0)
    })

    const doc = Factory.create({ number: 42 })

    t.deepEqual<any>(getSnapshot(doc), { number: 42 })
})

test("it should throw if a correct type with failing predicate is given", t => {
    const Factory = types.model({
        number: types.refinement("positive number", types.optional(types.number, 0), s => typeof s === "number" && s >= 0)
    })

    t.throws(() => {
        Factory.create({ number: "givenStringInstead" })
    }, `[mobx-state-tree] Error while converting \`{"number":"givenStringInstead"}\` to \`AnonymousModel\`:
at path "/number" value \`"givenStringInstead"\` is not assignable to type: \`positive number\`, expected an instance of \`positive number\` or a snapshot like \`positive number\` instead.`)

    t.throws(() => {
        Factory.create({ number: -4 })
    }, `[mobx-state-tree] Error while converting \`{"number":-4}\` to \`AnonymousModel\`:
at path "/number" value \`-4\` is not assignable to type: \`positive number\`, expected an instance of \`positive number\` or a snapshot like \`positive number\` instead.`)
})

test("it should throw if default value does not pass the predicate", t => {
    const error = t.throws(() => {
        types.model({
            number: types.refinement("Number", types.number, s => typeof s === "number")
        })
    })

    t.is(error.message, "[mobx-state-tree] Value is not assignable to \'number\'")
})