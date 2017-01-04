import {createFactory, unionOf} from "../"
import {test} from "ava"

const createTestFactories = () => {
    const Box = createFactory("Box", {
        width: 0,
        height: 0
    })

    const Square = createFactory("Square", {
        width: 0
    })

    const Cube = createFactory("Cube", {
        width: 0,
        height: 0,
        depth: 0
    })

    const Plane = unionOf(Box, Square)
    const DispatchPlane = unionOf(snapshot => snapshot && 'height' in snapshot ? Box : Square, Box, Square)

    return {Box, Square, Cube, Plane, DispatchPlane}
}

test("it should compute exact union types", (t) => {
    const {Box, Plane, Square} = createTestFactories()

    t.deepEqual(Plane.is(Box()), true)
    t.deepEqual(Plane.is(Square()), true)
})


test("it should compute exact union types", (t) => {
    const {Box, DispatchPlane, Square} = createTestFactories()

    t.deepEqual(DispatchPlane.is(Box()), true)
    t.deepEqual(DispatchPlane.is(Square()), true)
})