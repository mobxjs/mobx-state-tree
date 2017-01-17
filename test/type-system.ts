import {createFactory} from "../"
import {test} from "ava"

const createTestFactories = () => {
    const Box = createFactory({
        width: 0,
        height: 0
    })

    const Square = createFactory({
        width: 0,
        height: 0
    })

    const Cube = createFactory({
        width: 0,
        height: 0,
        depth: 0
    })

    return {Box, Square, Cube}
}

test("it should recognize a valid snapshot", (t) => {
    const {Box} = createTestFactories()

    t.deepEqual(Box.is({width: 1, height: 2}), true)
})

test("it should recognize an invalid snapshot", (t) => {
    const {Box} = createTestFactories()

    t.deepEqual(Box.is({width: 1, height: 2, depth: 3}), false)
})

test("it should check valid nodes as well", (t) => {
    const {Box} = createTestFactories()

    const doc = Box()

    t.deepEqual(Box.is(doc), true)
})

test("it should check invalid nodes as well", (t) => {
    const {Box, Cube} = createTestFactories()

    const doc = Cube()

    t.deepEqual(Box.is(doc), false)
})

test("it should cast different compatible factories", (t) => {
    const {Box, Square} = createTestFactories()

    const doc = Square()

    t.deepEqual(Box.is(doc), true)
})