import {ObservableMap} from 'mobx'
import {onSnapshot, onPatch, onAction, applyPatch, applyPatches, applyAction, applyActions, getPath, IJsonPatch, applySnapshot, getSnapshot, types} from "../src"
import {test} from "ava"

interface ITestSnapshot{
    to: string
}

interface ITest{
    to: string
}

const createTestFactories = () => {
    const ItemFactory = types.model({
            to: 'world'
        })

    const Factory = (types.map(
        ItemFactory
    ))

    return {Factory, ItemFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()
    const snapshot = getSnapshot(Factory.create())
    t.deepEqual(snapshot, {})
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual<any>(getSnapshot(Factory.create({hello: {to: 'world'}})), {hello: {to: 'world'}})
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.set("hello", ItemFactory.create())

    t.deepEqual(snapshots, [{hello: {to: 'world'}}])
})

test("it should apply snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applySnapshot(doc, {hello: {to: 'universe'}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})

test("it should return a snapshot", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    doc.set("hello", ItemFactory.create())

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'world'}})
})


// === PATCHES TESTS ===
test("it should emit add patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

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

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})

test("it should emit update patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

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

    applyPatch(doc, {op: "replace", path: "/hello", value: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})


test("it should emit remove patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

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

    doc.set("hello", ItemFactory.create())

    applyPatch(doc, {op: "remove", path: "/hello"})

    t.deepEqual(getSnapshot(doc), {})
})

test("it should apply patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatches(doc, [{op: "add", path: "/hello", value: {to: "mars"}}, {op: "replace", path: "/hello", value: {to: "universe"}}])

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})


// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory.create()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({hello: {to: 'mars'}}), true)
    t.deepEqual(Factory.is({hello: {wrongKey: true}}), true)
    t.deepEqual(Factory.is({hello: {to: true}}), false)
})

test("it should support identifiers", (t) => {
    const Store = types.model({
        todos: types.map(types.model({
            id: types.identifier()
        }))
    })

    const store = Store.create()
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
})
