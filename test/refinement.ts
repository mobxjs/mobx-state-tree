import {getSnapshot, types} from "../"
import {test} from "ava"

test("it should allow if type and predicate is correct", t => {
    const Factory = types.model({
        number: types.refinement('Number', types.withDefault(types.primitive, 0), s => typeof s === "number")
    })

    const doc = Factory.create({ number: 42 })

    t.deepEqual<any>(getSnapshot(doc), { number: 42 })
})

test("it should throw if a correct type with failing predicate is given", t => {
    const Factory = types.model({
        number: types.refinement('Number', types.withDefault(types.primitive, 0), s => typeof s === "number")
    })

    const error = t.throws(() => {
        const doc = Factory.create({ number: "givenStringInstead" })
    })

    t.is(error.message, '[mobx-state-tree] Snapshot {\"number\":\"givenStringInstead\"} is not assignable to type AnonymousModel. Expected { number: Number } instead.')
})

test("it should throw if default value does not pass the predicate", t => {

    const error = t.throws(() => {
        const Factory = types.model({
            number: types.refinement('Number', types.primitive, s => typeof s === "number")
        })
    })

    t.is(error.message, '[mobx-state-tree] Default value for refinement type Number does not pass the predicate.')
})