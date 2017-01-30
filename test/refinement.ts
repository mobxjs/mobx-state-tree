import {createFactory, refinement, primitiveFactory, getSnapshot} from "../"
import {test} from "ava"

test("it should allow if type and predicate is correct", t => {
    const Factory = createFactory({
        number: refinement('Number', primitiveFactory, s => typeof s === "number")
    })

    const doc = Factory({ number: 42 })

    t.deepEqual<any>(getSnapshot(doc), { number: 42 })
})

test("it should throw if a correct type with failing predicate is given", t => {
    const Factory = createFactory({
        number: refinement('Number', primitiveFactory, s => { 
            console.log(s)
            return s
        })
    })

    const error = t.throws(() => {
        const doc = Factory({ number: "givenStringInstead" })
    })

    t.is(error.message, '[mobx-state-tree] Snapshot {"shouldBeOne":2} is not assignable to type unnamed-object-factory. Expected { shouldBeOne: 1 } instead.')
})