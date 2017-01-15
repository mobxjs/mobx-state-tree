// import {createFactory, unionOf} from "../"
import {test} from "ava"

// const createTestFactories = () => {
//     const Box = createFactory("Box", {
//         width: 0,
//         height: 0
//     })

//     const Square = createFactory("Square", {
//         width: 0
//     })

//     const Cube = createFactory("Cube", {
//         width: 0,
//         height: 0,
//         depth: 0
//     })

//     const Plane = unionOf(Box, Square)
//     const DispatchPlane = unionOf(snapshot => snapshot && 'height' in snapshot ? Box : Square, Box, Square)

//     return {Box, Square, Cube, Plane, DispatchPlane}
// }

// test("it should complain about no dispatch method", (t) => {
//     const {Box, Plane, Square} = createTestFactories()

//     const error = t.throws(() => {
//         const doc = Plane({width: 2})
//     })
//     t.is(error.message, '[mobx-state-tree] Ambiguos snapshot {"width":2} for union Square | Box. Please provide a dispatch in the union declaration.')
// })

// test("it should be smart enough to discriminate by keys", (t) => {
//     const {Box, Plane, Square} = createTestFactories()

//     const doc = Plane({height: 1, width: 2})

//     t.deepEqual(Box.is(doc), true)
//     t.deepEqual(Square.is(doc), false)
// })

// test("it should discriminate by value type", (t) => {
//     const Size = createFactory("Size", {
//         width: 0,
//         height: 0
//     })

//     const Picture = createFactory("Picture", {
//         url: "",
//         size: Size
//     })

//     const Square = createFactory("Square", {
//         size: 0
//     })

//     const PictureOrSquare = unionOf(Picture, Square)

//     const doc = PictureOrSquare({ size: {width: 0, height: 0}})

//     t.deepEqual(Picture.is(doc), true)
//     t.deepEqual(Square.is(doc), false)
// })

// test("it should compute exact union types", (t) => {
//     const {Box, Plane, Square} = createTestFactories()

//     t.deepEqual(Plane.is(Box()), true)
//     t.deepEqual(Plane.is(Square()), true)
// })

// test("it should compute exact union types", (t) => {
//     const {Box, DispatchPlane, Square} = createTestFactories()

//     t.deepEqual(DispatchPlane.is(Box()), true)
//     t.deepEqual(DispatchPlane.is(Square()), true)
// })


// test("it should resolve the exact type", (t) => {
//     const {Box, DispatchPlane, Square} = createTestFactories()

//     const doc = DispatchPlane()

//     t.deepEqual(DispatchPlane.dispatch(doc), Square)
// })