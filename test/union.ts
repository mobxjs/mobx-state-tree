import {types} from "../"
import {test} from "ava"

const createTestFactories = () => {
    const Box = types.model("Box", {
        width: types.number,
        height: types.number
    })

    const Square = types.model("Square", {
        width: types.number
    })

    const Cube = types.model("Cube", {
        width: types.number,
        height: types.number,
        depth: types.number
    })

    const Plane = types.union(Square, Box)

    const DispatchPlane = types.union(snapshot => snapshot && 'height' in snapshot ? Box : Square, Box, Square)

    return {Box, Square, Cube, Plane, DispatchPlane}
}

test("it should complain about no dispatch method", (t) => {
    const {Box, Plane, Square} = createTestFactories()

    const error = t.throws(() => {
        const doc = Plane.create({width: 2, height: 2})
    })
    t.is(error.message, '[mobx-state-tree] Ambiguos snapshot {"width":2,"height":2} for union Box | Square. Please provide a dispatch in the union declaration.')
})

test("it should be smart enough to discriminate by keys", (t) => {
    const {Box, Plane, Square} = createTestFactories()

    const doc = types.union(Square, Box).create({width: 2})

    t.deepEqual(Box.is(doc), false)
    t.deepEqual(Square.is(doc), true)
})

test("it should discriminate by value type", (t) => {
    const Size = types.model("Size", {
        width: 0,
        height: 0
    })

    const Picture = types.model("Picture", {
        url: "",
        size: Size
    })

    const Square = types.model("Square", {
        size: 0
    })

    const PictureOrSquare = types.union(Picture, Square)

    const doc = PictureOrSquare.create({ size: {width: 0, height: 0}})

    t.deepEqual(Picture.is(doc), true)
    t.deepEqual(Square.is(doc), false)
})

test("it should compute exact union types", (t) => {
    const {Box, Plane, Square} = createTestFactories()

    t.deepEqual(Plane.is(Box.create({ width: 3, height: 2})), true)
    t.deepEqual(Plane.is(Square.create({ width: 3})), true)
})

test("it should compute exact union types - 2", (t) => {
    const {Box, DispatchPlane, Square} = createTestFactories()

    t.deepEqual(DispatchPlane.is(Box.create({ width: 3, height: 2})), true)
    t.deepEqual(DispatchPlane.is(Square.create({ width: 3, height: 2} as any)), true)
})