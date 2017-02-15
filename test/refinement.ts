import {createFactory, refinement, primitiveFactory, getSnapshot, withDefault} from "../"
import {test} from "ava"

test("it should allow if type and predicate is correct", t => {
    const Factory = createFactory({
        number: refinement('Number', withDefault(primitiveFactory, 0), s => typeof s === "number")
    })

    const doc = Factory({ number: 42 })

    t.deepEqual<any>(getSnapshot(doc), { number: 42 })
})

test("it should throw if a correct type with failing predicate is given", t => {
    const Factory = createFactory({
        number: refinement('Number', withDefault(primitiveFactory, 0), s => typeof s === "number")
    })

    const error = t.throws(() => {
        const doc = Factory({ number: "givenStringInstead" })
    })

    t.is(error.message, '[mobx-state-tree] Snapshot {\"number\":\"givenStringInstead\"} is not assignable to type unnamed-object-factory. Expected { number: Number } instead.')
})

test("it should throw if default value does not pass the predicate", t => {

    const error = t.throws(() => {
        const Factory = createFactory({
            number: refinement('Number', primitiveFactory, s => typeof s === "number")
        })
    })

    t.is(error.message, '[mobx-state-tree] Default value for refinement type Number does not pass the predicate.')
})