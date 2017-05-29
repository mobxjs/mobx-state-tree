import {onSnapshot, onPatch, applyPatch, applyPatches, applySnapshot, getSnapshot, types, unprotect} from "../src"
import {test} from "ava"

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

    const Factory = types.optional(
        types.map(
            ItemFactory
        ), {})

    const PrimitiveMapFactory = types.model({
            boolean: types.map(types.boolean),
            string: types.map(types.string),
            number: types.map(types.number)
        }, {})

    return {Factory, ItemFactory, PrimitiveMapFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()
    const snapshot = getSnapshot(Factory.create())
    t.deepEqual(snapshot, {})
})

test("it should succeed if not optional and no default provided", (t) => {
    const Factory = types.map(types.string)
    t.deepEqual(Factory.create().toJSON(), {})
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    const instance = Factory.create({hello: {to: "world"}})
    t.deepEqual<any>(getSnapshot(instance), {hello: {to: "world"}})
    t.is("" + instance, "map<string, AnonymousModel>@<root>(1 items)")
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.set("hello", ItemFactory.create())

    t.deepEqual(snapshots, [{hello: {to: "world"}}])
})

test("it should apply snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applySnapshot(doc, {hello: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: "universe"}})
})

test("it should return a snapshot", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    doc.set("hello", ItemFactory.create())

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: "world"}})
})

test("it should be the same each time", (t) => {
    const {PrimitiveMapFactory} = createTestFactories()
    const data = {
        string: {a: "a", b: ""},
        boolean: {a: true, b: false},
        number: {a: 0, b: 42, c: NaN}
    }
    const doc = PrimitiveMapFactory.create(data)
    t.deepEqual<any>(getSnapshot(doc), data)
    applySnapshot(doc, data)
    t.deepEqual<any>(getSnapshot(doc), data)
    applySnapshot(doc, data)
    t.deepEqual<any>(getSnapshot(doc), data)
})

// === PATCHES TESTS ===
test("it should emit add patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.set("hello", ItemFactory.create({to: "universe"}))

    t.deepEqual(patches, [
        {op: "add", path: "/hello", value: {to: "universe"}}
    ])
})

test("it should apply a add patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatch(doc, {op: "add", path: "/hello", value: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: "universe"}})
})

test("it should emit update patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    doc.set("hello", ItemFactory.create())

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.set("hello", ItemFactory.create({to: "universe"}))

    t.deepEqual(patches, [
        {op: "replace", path: "/hello", value: {to: "universe"}}
    ])
})

test("it should apply a update patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    applyPatch(doc, {op: "replace", path: "/hello", value: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: "universe"}})
})

test("it should emit remove patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    doc.set("hello", ItemFactory.create())

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.delete("hello")

    t.deepEqual(patches, [
        {op: "remove", path: "/hello"}
    ])
})

test("it should apply a remove patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    doc.set("hello", ItemFactory.create())

    applyPatch(doc, {op: "remove", path: "/hello"})

    t.deepEqual(getSnapshot(doc), {})
})

test("it should apply patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatches(doc, [{op: "add", path: "/hello", value: {to: "mars"}}, {op: "replace", path: "/hello", value: {to: "universe"}}])

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: "universe"}})
})

// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory.create()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({hello: {to: "mars"}}), true)
    t.deepEqual(Factory.is({hello: {wrongKey: true}}), true)
    t.deepEqual(Factory.is({hello: {to: true}}), false)
})

test("it should support identifiers", (t) => {
    const Store = types.model({
        todos: types.optional(types.map(types.model({
            id: types.identifier()
        })), {})
    })

    const store = Store.create()
    unprotect(store)

    store.todos.set("17", { id: "17"} as any)

    const a = store.todos.get("17")

    t.throws(
        () => applySnapshot(store.todos, { "17": { id: "18"} }),
        "[mobx-state-tree] A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '17', but expected: '18'"
    )

    applySnapshot(store.todos, { "16" : { id: "16"}, "17": { id: "17"}})
    t.is(a === store.todos.get("17"), true) // same instance still

    t.is(store.todos.get("17")!.id, "17")

    store.todos.put({ id: "19"})
    t.is(store.todos.get("19")!.id, "19")

    t.is("" + store.todos.get("19"), "AnonymousModel@/todos/19(id: 19)")
})
