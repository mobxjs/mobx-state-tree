// https://github.com/mobxjs/mobx-state-tree/issues/1433
import { describe, expect, test } from "bun:test"
import { types, walk, getPath } from "../../src/index"

describe("1433 - walk is not walking the tree", () => {
    test("walk visits every node in the tree without accessing children first", () => {
        const Todo = types.model("Todo", {
            title: types.string,
            done: types.boolean
        })
        const Store = types.model("Store", {
            todos: types.array(Todo),
            nested: types.model("Nested", {
                deep: types.model("Deep", { val: types.number })
            })
        })
        const store = Store.create({
            todos: [
                { title: "a", done: false },
                { title: "b", done: true }
            ],
            nested: { deep: { val: 42 } }
        })

        const visited: string[] = []
        walk(store, item => visited.push(getPath(item)))

        expect(visited).toEqual(["/todos/0", "/todos/1", "/todos", "/nested/deep", "/nested", ""])
    })

    test("walk visits nodes inside maps without accessing children first", () => {
        const Todo = types.model("Todo", { title: types.string })
        const Store = types.model("Store", {
            todos: types.map(Todo)
        })
        const store = Store.create({
            todos: { one: { title: "a" }, two: { title: "b" } }
        })

        const visited: string[] = []
        walk(store, item => visited.push(getPath(item)))

        expect(visited).toEqual(["/todos/one", "/todos/two", "/todos", ""])
    })

    test("walk does not follow references", () => {
        const User = types.model("User", { id: types.identifier, name: types.string })
        const Todo = types.model("Todo", {
            id: types.identifier,
            assignee: types.maybe(types.reference(User))
        })
        const Store = types.model("Store", {
            users: types.array(User),
            todos: types.array(Todo)
        })
        const store = Store.create({
            users: [{ id: "u1", name: "Ann" }],
            todos: [{ id: "t1", assignee: "u1" }]
        })

        const visited: string[] = []
        walk(store, item => visited.push(getPath(item)))

        // the reference target is only visited once, at its own location in the tree
        expect(visited).toEqual(["/users/0", "/users", "/todos/0", "/todos", ""])
    })
})
