import { types, typecheck } from "../../src"

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
    const Node: any = types.model({
        childs: types.optional(types.array(types.late(() => Node)), [])
    })
    expect(() => Node.create()).not.toThrow()
    expect(() => Node.create({ childs: [{}, { childs: [] }] })).not.toThrow()
})
test("late should describe correctly circular references", () => {
    // TypeScript is'nt smart enough to infer self referencing types.
    const Node: any = types.model("Node", {
        childs: types.array(types.late(() => Node))
    })
    expect(Node.describe()).toEqual("{ childs: Node[]? }")
})
test("should typecheck", () => {
    const NodeObject: any = types.model("NodeObject", {
        id: types.identifierNumber,
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
        id: types.identifierNumber,
        text: types.string
    })

    expect(() => {
        typecheck(NodeObject, { id: 1, text: 1 } as any)
    }).toThrow()

    try {
        typecheck(NodeObject, { id: 1, text: 1 } as any)
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

test("#916 - 0", () => {
    const Todo: any = types.model("Todo", {
        title: types.string,
        newTodo: types.optional(types.late(() => Todo), {}) // N.B. this definition is never instantiateable!
    })
})

test("#916 - 1", () => {
    const Todo: any = types.model("Todo", {
        title: types.string,
        newTodo: types.maybe(types.late(() => Todo))
    })
    const t = Todo.create({
        title: "Get Coffee"
    })
})

test("#916 - 2", () => {
    const Todo: any = types.model("Todo", {
        title: types.string,
        newTodo: types.maybe(types.late(() => Todo))
    })
    expect(
        Todo.is({
            title: "A",
            newTodo: { title: " test" }
        })
    ).toBe(true)
    expect(
        Todo.is({
            title: "A",
            newTodo: { title: 7 }
        })
    ).toBe(false)
})

test("#916 - 3", () => {
    const Todo: any = types.model("Todo", {
        title: types.string,
        newTodo: types.maybe(types.late(() => Todo))
    })
    const t = Todo.create({
        title: "Get Coffee",
        newTodo: { title: "test" }
    })

    expect(t.newTodo.title).toBe("test")
})
