import { types } from "../src"
import { test } from "ava"

test("it should accept a type and infer it correctly", t => {

    const Before = types.model({
        after: types.late(() => After)
    })

    const After = types.model({
        name: types.maybe(types.string)
    })

    t.notThrows(() => Before.create({ after: { name : "Hello, it's me."}}))
})

test("late should allow circular references", t => {

    interface INode {
        childs: INode[]
    }

    // TypeScript is'nt smart enough to infer self referencing types.
    const Node = types.model({
        childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
    })

    t.notThrows(() => Node.create())
    t.notThrows(() => Node.create({ childs: [{}, { childs: []}]}))
})

test("late should describe correctly circular references", t => {

    interface INode {
        childs: INode[]
    }

    // TypeScript is'nt smart enough to infer self referencing types.
    const Node = types.model("Node", {
        childs: types.array(types.late<any, INode>(() => Node))
    })

    t.deepEqual(Node.describe(), "{ childs: Node[] }")
})