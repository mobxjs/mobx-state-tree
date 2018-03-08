import { types } from "../src"
if (process.env.NODE_ENV === "development") {
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
