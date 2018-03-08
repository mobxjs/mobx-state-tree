import { types, hasParent, tryResolve, getSnapshot } from "../src"
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
if (process.env.NODE_ENV !== "production") {
    test("it should complain about multiple applicable types no dispatch method", () => {
        const { Box, Plane, Square } = createTestFactories()
        expect(() => {
            Plane.create({ width: 2, height: 2 })
        }).toThrowErrorMatchingSnapshot()
    })
}
test("it should have parent whenever creating or applying from a complex data structure to a model which has Union typed children", () => {
    const { Block, Heighed } = createTestFactories()
    const block = Block.create({
        list: [{ width: 2, height: 2 }]
    })
    const child = tryResolve(block, "./list/0")
    expect(hasParent(child)).toBe(true)
})
if (process.env.NODE_ENV !== "production") {
    test("it should complain about no applicable types", () => {
        const { Heighed } = createTestFactories()
        expect(() => {
            Heighed.create({ height: 2 })
        }).toThrowErrorMatchingSnapshot
    })
}
test("it should be smart enough to discriminate by keys", () => {
    const { Box, Plane, Square } = createTestFactories()
    const doc = types.union(Square, Box).create({ width: 2 })
    expect(Box.is(doc)).toEqual(false)
    expect(Square.is(doc)).toEqual(true)
})
test("it should discriminate by value type", () => {
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
    expect(Picture.is(doc)).toEqual(true)
    expect(Square.is(doc)).toEqual(false)
})
test("it should compute exact union types", () => {
    const { Box, Plane, Square } = createTestFactories()
    expect(Plane.is(Box.create({ width: 3, height: 2 }))).toEqual(true)
    expect(Plane.is(Square.create({ width: 3 }))).toEqual(true)
})
test("it should compute exact union types - 2", () => {
    const { Box, DispatchPlane, Square } = createTestFactories()
    expect(DispatchPlane.is(Box.create({ width: 3, height: 2 }))).toEqual(true)
    expect(
        DispatchPlane.is(
            Square.create({ width: 3, height: 2 } as any /* incorrect type, superfluous attr!*/)
        )
    ).toEqual(true)
})
test("it should use dispatch to discriminate", () => {
    const { Box, DispatchPlane, Square } = createTestFactories()
    const a = DispatchPlane.create({ width: 3 })
    expect(getSnapshot(a)).toEqual({ width: 3 })
})
