import {
    unprotect,
    onSnapshot,
    onPatch,
    clone,
    isAlive,
    applyPatch,
    getPath,
    applySnapshot,
    getSnapshot,
    types
} from "../src"
import { test } from "ava"
import { observable } from "mobx"
interface ITestSnapshot {
    to: string
}
interface ITest {
    to: string
}
const createTestFactories = () => {
    const ItemFactory = types.optional(
        types.model({
            to: "world"
        }),
        {}
    )
    const Factory = types.array(ItemFactory)
    return { Factory, ItemFactory }
}
// === FACTORY TESTS ===

test("it should create a factory", t => {
    const { Factory } = createTestFactories()
    t.deepEqual(getSnapshot(Factory.create()), [])
})

test("it should succeed if not optional and no default provided", t => {
    const Factory = types.array(types.string)
    t.deepEqual((Factory.create() as any).toJSON(), [])
})

test("it should restore the state from the snapshot", t => {
    const { Factory } = createTestFactories()
    const instance = Factory.create([{ to: "universe" }])
    t.deepEqual(getSnapshot(instance), [{ to: "universe" }])
    t.is("" + instance, "AnonymousModel[]@<root>(1 items)")
})
// === SNAPSHOT TESTS ===

test("it should emit snapshots", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))
    doc.push(ItemFactory.create())
    t.deepEqual(snapshots, [[{ to: "world" }]])
})

test("it should apply snapshots", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, [{ to: "universe" }])
    t.deepEqual(getSnapshot(doc), [{ to: "universe" }])
})

test("it should return a snapshot", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.push(ItemFactory.create())
    t.deepEqual(getSnapshot(doc), [{ to: "world" }])
})
// === PATCHES TESTS ===

test("it should emit add patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.push(ItemFactory.create({ to: "universe" }))
    t.deepEqual(patches, [{ op: "add", path: "/0", value: { to: "universe" } }])
})

test("it should apply an add patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "add", path: "/0", value: { to: "universe" } })
    t.deepEqual(getSnapshot(doc), [{ to: "universe" }])
})

test("it should emit update patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.push(ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc[0] = ItemFactory.create({ to: "universe" })
    t.deepEqual(patches, [{ op: "replace", path: "/0", value: { to: "universe" } }])
})

test("it should apply an update patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "replace", path: "/0", value: { to: "universe" } })
    t.deepEqual(getSnapshot(doc), [{ to: "universe" }])
})

test("it should emit remove patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.push(ItemFactory.create())
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.splice(0)
    t.deepEqual(patches, [{ op: "remove", path: "/0" }])
})

test("it should apply a remove patch", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    doc.push(ItemFactory.create())
    doc.push(ItemFactory.create({ to: "universe" }))
    applyPatch(doc, { op: "remove", path: "/0" })
    t.deepEqual(getSnapshot(doc), [{ to: "universe" }])
})

test("it should apply patches", t => {
    const { Factory, ItemFactory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, [
        { op: "add", path: "/0", value: { to: "mars" } },
        { op: "replace", path: "/0", value: { to: "universe" } }
    ])
    t.deepEqual(getSnapshot(doc), [{ to: "universe" }])
})
// === TYPE CHECKS ===

test("it should check the type correctly", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), true)
    t.deepEqual(Factory.is({}), false)
    t.deepEqual(Factory.is([{ to: "mars" }]), true)
    t.deepEqual(Factory.is([{ wrongKey: true }]), true)
    t.deepEqual(Factory.is([{ to: true }]), false)
})

test("paths shoud remain correct when splicing", t => {
    const store = types
        .model({
            todos: types.array(
                types.model("Task", {
                    done: false
                })
            )
        })
        .create({
            todos: [{}]
        })
    unprotect(store)
    t.deepEqual(store.todos.map(getPath), ["/todos/0"])
    store.todos.push({} as any)
    t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1"])
    store.todos.unshift({} as any)
    t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
    store.todos.splice(0, 2)
    t.deepEqual(store.todos.map(getPath), ["/todos/0"])
    store.todos.splice(0, 1, {} as any, {} as any, {} as any)
    t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
    store.todos.remove(store.todos[1])
    t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1"])
})

test("items should be reconciled correctly when splicing - 1", t => {
    const Task = types.model("Task", {
        x: types.string
    })
    const a = Task.create({ x: "a" }),
        b = Task.create({ x: "b" }),
        c = Task.create({ x: "c" }),
        d = Task.create({ x: "d" })
    const store = types
        .model({
            todos: types.optional(types.array(Task), [])
        })
        .create({
            todos: [a]
        })
    unprotect(store)
    t.deepEqual(store.todos.slice(), [a])
    t.is(isAlive(a), true)
    store.todos.push(b)
    t.deepEqual(store.todos.slice(), [a, b])
    store.todos.unshift(c)
    t.deepEqual(store.todos.slice(), [c, a, b])
    store.todos.splice(0, 2)
    t.deepEqual(store.todos.slice(), [b])
    t.is(isAlive(a), false)
    t.is(isAlive(b), true)
    t.is(isAlive(c), false)
    t.throws(
        () => store.todos.splice(0, 1, a, c, d),
        "[mobx-state-tree] Task@<root>[dead] cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value"
    )
    store.todos.splice(0, 1, clone(a), clone(c), clone(d))
    t.deepEqual(store.todos.map(_ => _.x), ["a", "c", "d"])
})

test("items should be reconciled correctly when splicing - 2", t => {
    const Task = types.model("Task", {
        x: types.string
    })
    const a = Task.create({ x: "a" }),
        b = Task.create({ x: "b" }),
        c = Task.create({ x: "c" }),
        d = Task.create({ x: "d" })
    const store = types
        .model({
            todos: types.array(Task)
        })
        .create({
            todos: [a, b, c, d]
        })
    unprotect(store)
    store.todos.splice(2, 1, { x: "e" }, { x: "f" })
    // becomes, a, b, e, f, d
    t.is(store.todos.length, 5)
    t.true(store.todos[0] === a)
    t.true(store.todos[1] === b)
    t.true(store.todos[2] !== c)
    t.is(store.todos[2].x, "e")
    t.true(store.todos[3] !== d)
    t.is(store.todos[3].x, "f")
    t.true(store.todos[4] === d) // preserved and moved
    t.is(store.todos[4].x, "d")
    t.deepEqual(store.todos.map(getPath), [
        "/todos/0",
        "/todos/1",
        "/todos/2",
        "/todos/3",
        "/todos/4"
    ])
    store.todos.splice(1, 3, { x: "g" })
    // becomes a, g, d
    t.is(store.todos.length, 3)
    t.true(store.todos[0] === a)
    t.is(store.todos[1].x, "g")
    t.is(store.todos[2].x, "d")
    t.true(store.todos[1] !== b)
    t.true(store.todos[2] === d) // still original d
    t.deepEqual(store.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
})

test("it should reconciliate keyed instances correctly", t => {
    const Store = types.model({
        todos: types.optional(
            types.array(
                types.model("Task", {
                    id: types.identifier(),
                    task: "",
                    done: false
                })
            ),
            []
        )
    })
    const store = Store.create({
        todos: [
            { id: "1", task: "coffee", done: false },
            { id: "2", task: "tea", done: false },
            { id: "3", task: "biscuit", done: false }
        ]
    })
    t.deepEqual(store.todos.map(todo => todo.task), ["coffee", "tea", "biscuit"])
    t.deepEqual(store.todos.map(todo => todo.done), [false, false, false])
    t.deepEqual(store.todos.map(todo => todo.id), ["1", "2", "3"])
    const coffee = store.todos[0]
    const tea = store.todos[1]
    const biscuit = store.todos[2]
    applySnapshot(store, {
        todos: [
            { id: "2", task: "Tee", done: true },
            { id: "1", task: "coffee", done: true },
            { id: "4", task: "biscuit", done: false },
            { id: "5", task: "stuffz", done: false }
        ]
    })
    t.deepEqual(store.todos.map(todo => todo.task), ["Tee", "coffee", "biscuit", "stuffz"])
    t.deepEqual(store.todos.map(todo => todo.done), [true, true, false, false])
    t.deepEqual(store.todos.map(todo => todo.id), ["2", "1", "4", "5"])
    t.is(store.todos[0] === tea, true)
    t.is(store.todos[1] === coffee, true)
    t.is(store.todos[2] === biscuit, false)
})

test("it correctly reconciliate when swapping", t => {
    const Task = types.model("Task", {})
    const Store = types.model({
        todos: types.optional(types.array(Task), [])
    })
    const s = Store.create()
    unprotect(s)
    const a = Task.create()
    const b = Task.create()
    s.todos.push(a, b)
    s.todos.replace([b, a])
    t.true(s.todos[0] === b)
    t.true(s.todos[1] === a)
    t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1"])
})

test("it correctly reconciliate when swapping using snapshots", t => {
    const Task = types.model("Task", {})
    const Store = types.model({
        todos: types.optional(types.array(Task), [])
    })
    const s = Store.create()
    unprotect(s)
    const a = Task.create()
    const b = Task.create()
    s.todos.push(a, b)
    s.todos.replace([getSnapshot(b), getSnapshot(a)])
    t.true(s.todos[0] === b)
    t.true(s.todos[1] === a)
    t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1"])
    s.todos.push({})
    t.true(s.todos[0] === b)
    t.true(s.todos[1] === a)
    t.deepEqual(s.todos.map(getPath), ["/todos/0", "/todos/1", "/todos/2"])
})

test("it should not be allowed to add the same item twice to the same store", t => {
    const Task = types.model("Task", {})
    const Store = types.model({
        todos: types.optional(types.array(Task), [])
    })
    const s = Store.create()
    unprotect(s)
    const a = Task.create()
    s.todos.push(a)
    t.throws(() => {
        s.todos.push(a)
    }, "[mobx-state-tree] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/todos/1', but it lives already at '/todos/0'")
    const b = Task.create()
    t.throws(() => {
        s.todos.push(b, b)
    }, "[mobx-state-tree] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/todos/2', but it lives already at '/todos/1'")
})

test("it should support observable arrays", t => {
    const TestArray = types.array(types.number)
    const testArray = TestArray.create(observable([1, 2]))
    t.true(testArray[0] === 1)
    t.true(testArray.length === 2)
    t.true(Array.isArray(testArray.slice()))
})
