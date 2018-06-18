import { types, typecheck } from "../src"
if (process.env.NODE_ENV !== "production") {
    test("it should throw if late doesnt received a function as parameter", () => {
        expect(() => {
            types.model({
                after: types.late(1 as any)
            })
        }).toThrow()
    })
}
test("it should accept a type and infer it correctly", () => {
    const Before = types.model({
        after: types.late(() => After)
    })
    const After = types.model({
        name: types.maybe(types.string)
    })
    expect(() => Before.create({ after: { name: "Hello, it's me." } })).not.toThrow()
})
test("late should allow circular references", () => {
    // TypeScript is'nt smart enough to infer self referencing types.
    const Node = types.model({
        childs: types.optional(types.array(types.late(() => Node)), [])
    })
    expect(() => Node.create()).not.toThrow()
    expect(() => Node.create({ childs: [{}, { childs: [] }] })).not.toThrow()
})
test("late should describe correctly circular references", () => {
    // TypeScript is'nt smart enough to infer self referencing types.
    const Node = types.model("Node", {
        childs: types.array(types.late(() => Node))
    })
    expect(Node.describe()).toEqual("{ childs: Node[] }")
})
test("should typecheck", () => {
    const NodeObject = types.model("NodeObject", {
        id: types.identifier(types.number),
        text: "Hi",
        child: types.maybe(types.late(() => NodeObject))
    })
    const x = NodeObject.create({ id: 1 })
    try {
        x.child = 3 // TODO: better typings, should give compilation error!
        x.floepie = 3 // TODO: better typings, should give compilation error!
    } catch (e) {
        // ignore, this is about TS
    }
})

test("typecheck should throw an Error when called at runtime, but not log the error", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    const NodeObject = types.model("NodeObject", {
        id: types.identifier(types.number),
        text: types.string
    })

    expect(() => {
        typecheck(NodeObject, { id: 1, text: 1 })
    }).toThrow()

    try {
        typecheck(NodeObject, { id: 1, text: 1 })
    } catch (error) {
        expect(error).toBeDefined()
        expect(consoleSpy).not.toHaveBeenCalled()
    }
})

test("#825, late type checking ", () => {
    const Product = types.model({
        details: types.late(() => types.optional(Details, {}))
    })
    const Details = types.model({
        name: types.maybe(types.string)
    })

    const p2 = Product.create({})
    const p = Product.create({ details: { name: "bla" } })
})
