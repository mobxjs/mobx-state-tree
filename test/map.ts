import {
    onSnapshot,
    onPatch,
    applyPatch,
    applySnapshot,
    getSnapshot,
    types,
    unprotect
} from "../src"
import { test } from "ava"
interface ITestSnapshot {
    to: string
}
interface ITest {
    to: string
}
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

test("it should create a factory", t => {
    const { Factory } = createTestFactories()
    const snapshot = getSnapshot(Factory.create())
    t.deepEqual(snapshot, {})
})

test("it should succeed if not optional and no default provided", t => {
    const Factory = types.map(types.string)
    t.deepEqual(Factory.create().toJSON(), {})
})

test("it should restore the state from the snapshot", t => {
    const { Factory } = createTestFactories()
    const instance = Factory.create({ hello: { to: "world" } })
    t.deepEqual<any>(getSnapshot(instance), { hello: { to: "world" } })
    t.is("" + instance, "map<string, AnonymousModel>@<root>(1 items)")
})
// === SNAPSHOT TESTS ===

test("it should emit snapshots", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))
    doc.set("hello", ItemFactory.create())
    t.deepEqual(snapshots, [{ hello: { to: "world" } }])
})

test("it should apply snapshots", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, { hello: { to: "universe" } })
    t.deepEqual<any>(getSnapshot(doc), { hello: { to: "universe" } })
})

test("it should return a snapshot", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    t.deepEqual<any>(getSnapshot(doc), { hello: { to: "world" } })
})

test("it should be the same each time", t => {
    const { PrimitiveMapFactory } = createTestFactories()
    const data = {
        string: { a: "a", b: "" },
        boolean: { a: true, b: false },
        number: { a: 0, b: 42, c: NaN }
    }
    const doc = PrimitiveMapFactory.create(data)
    t.deepEqual<any>(getSnapshot(doc), data)
    applySnapshot(doc, data)
    t.deepEqual<any>(getSnapshot(doc), data)
    applySnapshot(doc, data)
    t.deepEqual<any>(getSnapshot(doc), data)
})
// === PATCHES TESTS ===

test("it should emit add patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.set("hello", ItemFactory.create({ to: "universe" }))
    t.deepEqual(patches, [{ op: "add", path: "/hello", value: { to: "universe" } }])
})

test("it should apply an add patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "add", path: "/hello", value: { to: "universe" } })
    t.deepEqual<any>(getSnapshot(doc), { hello: { to: "universe" } })
})

test("it should emit update patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.set("hello", ItemFactory.create({ to: "universe" }))
    t.deepEqual(patches, [{ op: "replace", path: "/hello", value: { to: "universe" } }])
})

test("it should apply an update patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    applyPatch(doc, { op: "replace", path: "/hello", value: { to: "universe" } })
    t.deepEqual<any>(getSnapshot(doc), { hello: { to: "universe" } })
})

test("it should emit remove patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.delete("hello")
    t.deepEqual(patches, [{ op: "remove", path: "/hello" }])
})

test("it should apply a remove patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.set("hello", ItemFactory.create())
    applyPatch(doc, { op: "remove", path: "/hello" })
    t.deepEqual(getSnapshot(doc), {})
})

test("it should apply patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, [
        { op: "add", path: "/hello", value: { to: "mars" } },
        { op: "replace", path: "/hello", value: { to: "universe" } }
    ])
    t.deepEqual<any>(getSnapshot(doc), { hello: { to: "universe" } })
})
// === TYPE CHECKS ===

test("it should check the type correctly", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({ hello: { to: "mars" } }), true)
    t.deepEqual(Factory.is({ hello: { wrongKey: true } }), true)
    t.deepEqual(Factory.is({ hello: { to: true } }), false)
})

test("it should support identifiers", t => {
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
    store.todos.set("17", { id: "17" } as any)
    const a = store.todos.get("17")
    applySnapshot(store.todos, { "16": { id: "16" }, "17": { id: "17" } })
    t.is(a === store.todos.get("17"), true) // same instance still
    t.is(store.todos.get("17")!.id, "17")
    store.todos.put({ id: "19" })
    t.is(store.todos.get("19")!.id, "19")
    t.is("" + store.todos.get("19"), "AnonymousModel@/todos/19(id: 19)")
    t.throws(
        () => applySnapshot(store.todos, { "17": { id: "18" } }),
        "[mobx-state-tree] A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '18', but expected: '17'"
    )
})

test("#184 - types.map().get(key) should not throw if key doesnt exists", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create({
        hello: {
            to: "world"
        }
    })
    t.notThrows(() => {
        doc.get("notexistingkey")
    })
})

test("#192 - put should not throw when identifier is a number", t => {
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
    t.notThrows(() => {
        todoStore.addTodo({
            todo_id: 1,
            title: "Test"
        })
    })
    t.throws(() => {
        todoStore.addTodo({ todo_id: "1", title: "Test" })
    }, `[mobx-state-tree] Error while converting \`{\"todo_id\":\"1\",\"title\":\"Test\"}\` to \`Todo\`:\nat path \"/todo_id\" value \`\"1\"\` is not assignable to type: \`identifier(number)\` (Value is not a number), expected an instance of \`identifier(number)\` or a snapshot like \`identifier(number)\` instead.`)
})

test("#192 - map should not mess up keys when putting twice", t => {
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
    t.deepEqual(getSnapshot(todoStore.todos), { "1": { todo_id: 1, title: "Test" } })
    todoStore.addTodo({
        todo_id: 1,
        title: "Test Edited"
    })
    t.deepEqual(getSnapshot(todoStore.todos), { "1": { todo_id: 1, title: "Test Edited" } })
})

test("it should not throw when removing a non existing item from a map", t => {
    t.notThrows(() => {
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
        t.is(store.something(), false)
    })
})

test("it should get map keys from reversePatch when deleted an item from a nested map", t => {
    const AppModel = types
        .model({
            value: types.map(types.map(types.map(types.number)))
        })
        .actions(self => ({
            remove(k) {
                self.value.delete(k)
            }
        }))
    const store = AppModel.create({ value: { a: { b: { c: 10 } } } })
    onPatch(store, (patch, reversePatch) => {
        t.deepEqual(patch, { op: "remove", path: "/value/a" })
        t.deepEqual(reversePatch, { op: "add", path: "/value/a", value: { b: { c: 10 } } })
    })
    store.remove("a")
})
