import {
    onSnapshot,
    onPatch,
    applyPatch,
    applySnapshot,
    getSnapshot,
    types,
    unprotect
} from "../src"
const createTestFactories = () => {
    const ItemFactory = types.model({
        to: "world"
    })
    const Factory = types.map(ItemFactory)
    const PrimitiveMapFactory = types.model({
        boolean: types.map(types.boolean),
        string: types.map(types.string),
        number: types.map(types.number)
    })
    return { Factory, ItemFactory, PrimitiveMapFactory }
}
// === FACTORY TESTS ===
test("it should create a factory", () => {
    const { Factory } = createTestFactories()
    const snapshot = getSnapshot(Factory.create())
    expect(snapshot).toEqual({})
})
test("it should succeed if not optional and no default provided", () => {
    const Factory = types.map(types.string)
    expect(Factory.create().toJSON()).toEqual({})
})
test("it should restore the state from the snapshot", () => {
    const { Factory } = createTestFactories()
    const instance = Factory.create({ hello: { to: "world" } })
    expect(getSnapshot(instance)).toEqual({ hello: { to: "world" } })
    expect("" + instance).toBe("ObservableMap@17[{ hello: AnonymousModel@/hello }]") // default toString
})
// === SNAPSHOT TESTS ===
test("it should emit snapshots", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))
    doc.set("hello", ItemFactory.create())
    expect(snapshots).toEqual([{ hello: { to: "world" } }])
})
test("it should apply snapshots", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, { hello: { to: "universe" } })
    expect(getSnapshot(doc)).toEqual({ hello: { to: "universe" } })
})
test("it should return a snapshot", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    expect(getSnapshot(doc)).toEqual({ hello: { to: "world" } })
})
test("it should be the same each time", () => {
    const { PrimitiveMapFactory } = createTestFactories()
    const data = {
        string: { a: "a", b: "" },
        boolean: { a: true, b: false },
        number: { a: 0, b: 42, c: NaN }
    }
    const doc = PrimitiveMapFactory.create(data)
    expect(getSnapshot(doc)).toEqual(data)
    applySnapshot(doc, data)
    expect(getSnapshot(doc)).toEqual(data)
    applySnapshot(doc, data)
    expect(getSnapshot(doc)).toEqual(data)
})
// === PATCHES TESTS ===
test("it should emit add patches", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.set("hello", ItemFactory.create({ to: "universe" }))
    expect(patches).toEqual([{ op: "add", path: "/hello", value: { to: "universe" } }])
})
test("it should apply an add patch", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "add", path: "/hello", value: { to: "universe" } })
    expect(getSnapshot(doc)).toEqual({ hello: { to: "universe" } })
})
test("it should emit update patches", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.set("hello", ItemFactory.create({ to: "universe" }))
    expect(patches).toEqual([{ op: "replace", path: "/hello", value: { to: "universe" } }])
})
test("it should apply an update patch", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    applyPatch(doc, { op: "replace", path: "/hello", value: { to: "universe" } })
    expect(getSnapshot(doc)).toEqual({ hello: { to: "universe" } })
})
test("it should emit remove patches", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.delete("hello")
    expect(patches).toEqual([{ op: "remove", path: "/hello" }])
})
test("it should apply a remove patch", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    applyPatch(doc, { op: "remove", path: "/hello" })
    expect(getSnapshot(doc)).toEqual({})
})
test("it should apply patches", () => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, [
        { op: "add", path: "/hello", value: { to: "mars" } },
        { op: "replace", path: "/hello", value: { to: "universe" } }
    ])
    expect(getSnapshot(doc)).toEqual({ hello: { to: "universe" } })
})
// === TYPE CHECKS ===
test("it should check the type correctly", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    expect(Factory.is(doc)).toEqual(true)
    expect(Factory.is([])).toEqual(false)
    expect(Factory.is({})).toEqual(true)
    expect(Factory.is({ hello: { to: "mars" } })).toEqual(true)
    expect(Factory.is({ hello: { wrongKey: true } })).toEqual(true)
    expect(Factory.is({ hello: { to: true } })).toEqual(false)
})
test("it should support identifiers", () => {
    const Store = types.model({
        todos: types.optional(
            types.map(
                types.model({
                    id: types.identifier()
                })
            ),
            {}
        )
    })
    const store = Store.create()
    unprotect(store)
    store.todos.set("17", { id: "17" })
    const a = store.todos.get("17")
    applySnapshot(store.todos, { "16": { id: "16" }, "17": { id: "17" } })
    expect(a === store.todos.get("17")).toBe(true) // same instance still
    expect(store.todos.get("17")!.id).toBe("17")
    store.todos.put({ id: "19" })
    expect(store.todos.get("19")!.id).toBe("19")
    expect("" + store.todos.get("19")).toBe("AnonymousModel@/todos/19(id: 19)")
    if (process.env.NODE_ENV !== "production") {
        expect(() => applySnapshot(store.todos, { "17": { id: "18" } })).toThrowError(
            "[mobx-state-tree] A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '18', but expected: '17'"
        )
    }
})
test("#184 - types.map().get(key) should not throw if key doesnt exists", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create({
        hello: {
            to: "world"
        }
    })
    expect(() => {
        doc.get("notexistingkey")
    }).not.toThrow()
})
test("#192 - put should not throw when identifier is a number", () => {
    const Todo = types.model("Todo", {
        todo_id: types.identifier(types.number),
        title: types.string
    })
    const TodoStore = types
        .model("TodoStore", {
            todos: types.optional(types.map(Todo), {})
        })
        .actions(self => {
            function addTodo(todo) {
                self.todos.put(todo)
            }
            return {
                addTodo
            }
        })
    const todoStore = TodoStore.create({})
    expect(() => {
        todoStore.addTodo({
            todo_id: 1,
            title: "Test"
        })
    }).not.toThrow()
    if (process.env.NODE_ENV !== "production") {
        expect(() => {
            todoStore.addTodo({ todo_id: "1", title: "Test" })
        }).toThrowError(
            `[mobx-state-tree] Error while converting \`{\"todo_id\":\"1\",\"title\":\"Test\"}\` to \`Todo\`:\n\n    at path \"/todo_id\" value \`\"1\"\` is not assignable to type: \`identifier(number)\` (Value is not a number), expected an instance of \`identifier(number)\` or a snapshot like \`identifier(number)\` instead.`
        )
    }
})
test("#192 - map should not mess up keys when putting twice", () => {
    const Todo = types.model("Todo", {
        todo_id: types.identifier(types.number),
        title: types.string
    })
    const TodoStore = types
        .model("TodoStore", {
            todos: types.optional(types.map(Todo), {})
        })
        .actions(self => {
            function addTodo(todo) {
                self.todos.put(todo)
            }
            return {
                addTodo
            }
        })
    const todoStore = TodoStore.create({})
    todoStore.addTodo({
        todo_id: 1,
        title: "Test"
    })
    expect(getSnapshot(todoStore.todos)).toEqual({ "1": { todo_id: 1, title: "Test" } })
    todoStore.addTodo({
        todo_id: 1,
        title: "Test Edited"
    })
    expect(getSnapshot(todoStore.todos)).toEqual({ "1": { todo_id: 1, title: "Test Edited" } })
})
test("it should not throw when removing a non existing item from a map", () => {
    expect(() => {
        const AppModel = types
            .model({
                myMap: types.optional(types.map(types.number), {})
            })
            .actions(self => {
                function something() {
                    return self.myMap.delete("1020")
                }
                return {
                    something
                }
            })
        const store = AppModel.create()
        expect(store.something()).toBe(false)
    }).not.toThrow()
})
test("it should get map keys from reversePatch when deleted an item from a nested map", () => {
    const AppModel = types
        .model({
            value: types.map(types.map(types.map(types.number)) as any) // TODO: fix typings?
        })
        .actions(self => ({
            remove(k) {
                self.value.delete(k)
            }
        }))
    const store = AppModel.create({ value: { a: { b: { c: 10 } } } })
    onPatch(store, (patch, reversePatch) => {
        expect(patch).toEqual({ op: "remove", path: "/value/a" })
        expect(reversePatch).toEqual({ op: "add", path: "/value/a", value: { b: { c: 10 } } })
    })
    store.remove("a")
})

test("map expects regular identifiers", () => {
    const A = types.model("A", { a: types.identifier() })
    const B = types.model("B", { b: types.identifier() })

    const M = types.map(types.union(A, B))
    const m = M.create()
    unprotect(m)
    m.put({ a: "3" }) // ok
    m.put({ a: "4" }) // ok

    expect(() => {
        m.put({ b: "5" })
    }).toThrow(
        "[mobx-state-tree] The objects in a map should all have the same identifier attribute, expected 'a', but child of type 'B' declared attribute 'b' as identifier"
    )
})

test("issue #876 - map.put works fine for models with preProcessSnapshot", () => {
    const Note = types.model("Item", {
        text: types.string
    })
    const Item = types
        .model("Item", {
            id: types.identifier(),
            title: types.string,
            notes: types.array(Note)
        })
        .preProcessSnapshot(snapshot => {
            const result = Object.assign({}, snapshot)
            if (typeof result.title !== "string") result.title = ""
            return result
        })

    const Store = types
        .model("Store", {
            items: types.optional(types.map(Item), {})
        })
        .actions(self => ({
            afterCreate() {
                self.items.put({
                    id: "1",
                    notes: [{ text: "first note" }, { text: "second note" }]
                })
            }
        }))

    let store
    expect(() => {
        store = Store.create({})
    }).not.toThrow()
    expect(getSnapshot(store)).toEqual({
        items: {
            "1": {
                id: "1",
                notes: [{ text: "first note" }, { text: "second note" }],
                title: ""
            }
        }
    })
})
