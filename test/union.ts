import { types, hasParent, tryResolve, getSnapshot } from "../src"
import { test } from "ava"
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
    const Heighed = types.union(Box, Cube)
    const DispatchPlane = types.union(
        snapshot => (snapshot && "height" in snapshot ? Box : Square),
        Box,
        Square
    )
    const Block = types.model("Block", {
        list: types.array(Heighed)
    })
    return { Box, Square, Cube, Plane, DispatchPlane, Heighed, Block }
}
test("it should complain about no dispatch method", t => {
    const { Box, Plane, Square } = createTestFactories()
    t.throws(() => {
        Plane.create({ width: 2, height: 2 })
    }, `[mobx-state-tree] Error while converting \`{\"width\":2,\"height\":2}\` to \`Box | Square\`:\nsnapshot \`{\"width\":2,\"height\":2}\` is not assignable to type: \`Box | Square\` (Multiple types are applicable and no dispatch method is defined for the union), expected an instance of \`Box | Square\` or a snapshot like \`({ width: number; height: number } | { width: number })\` instead.`)
})
test("it should have parent whenever creating or applying from a complex data structure to a model which has Union typed children", t => {
    const { Block, Heighed } = createTestFactories()
    const block = Block.create({
        list: [{ width: 2, height: 2 }]
    })
    const child = tryResolve(block, "./list/0")
    t.is(hasParent(child), true)
})
test("it should complain about no dispatch method and multiple applicable types", t => {
    const { Heighed } = createTestFactories()
    t.throws(() => {
        Heighed.create({ height: 2 })
    }, `[mobx-state-tree] Error while converting \`{\"height\":2}\` to \`Cube | Box\`:\nsnapshot \`{\"height\":2}\` is not assignable to type: \`Cube | Box\` (No type is applicable and no dispatch method is defined for the union), expected an instance of \`Cube | Box\` or a snapshot like \`({ width: number; height: number; depth: number } | { width: number; height: number })\` instead.\nat path \"/width\" value \`undefined\` is not assignable to type: \`number\`.\nat path \"/depth\" value \`undefined\` is not assignable to type: \`number\`.\nat path \"/width\" value \`undefined\` is not assignable to type: \`number\`.`)
})
test("it should be smart enough to discriminate by keys", t => {
    const { Box, Plane, Square } = createTestFactories()
    const doc = types.union(Square, Box).create({ width: 2 })
    t.deepEqual(Box.is(doc), false)
    t.deepEqual(Square.is(doc), true)
})
test("it should discriminate by value type", t => {
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
    const doc = PictureOrSquare.create({ size: { width: 0, height: 0 } })
    t.deepEqual(Picture.is(doc), true)
    t.deepEqual(Square.is(doc), false)
})
test("it should compute exact union types", t => {
    const { Box, Plane, Square } = createTestFactories()
    t.deepEqual(Plane.is(Box.create({ width: 3, height: 2 })), true)
    t.deepEqual(Plane.is(Square.create({ width: 3 })), true)
})
test("it should compute exact union types - 2", t => {
    const { Box, DispatchPlane, Square } = createTestFactories()
    t.deepEqual(DispatchPlane.is(Box.create({ width: 3, height: 2 })), true)
    t.deepEqual(DispatchPlane.is(Square.create({ width: 3, height: 2 } as any)), true)
})
test("it should use dispatch to discriminate", t => {
    const { Box, DispatchPlane, Square } = createTestFactories()
    const a = DispatchPlane.create({ width: 3 })
    t.deepEqual<any>(getSnapshot(a), { width: 3 })
})
