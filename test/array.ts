import {IObservableArray} from 'mobx'
import {onSnapshot, onPatch, onAction, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, getSnapshot, IType, types} from "../"
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

    const Factory = (types.array(
        ItemFactory
    ) as any) as IType<ITestSnapshot[], IObservableArray<ITest>>

    return {Factory, ItemFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual<ITestSnapshot[]>(getSnapshot<ITestSnapshot[], IObservableArray<ITest>>(Factory.create()), [])
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual(getSnapshot(Factory.create([{to: 'universe'}])), [{ to: 'universe' }])
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.push(ItemFactory.create())

    t.deepEqual(snapshots, [[{to: 'world'}]])
})

test("it should apply snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applySnapshot(doc, [{to: 'universe'}])

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

test("it should return a snapshot", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    doc.push(ItemFactory.create())

    t.deepEqual(getSnapshot<ITestSnapshot[], IObservableArray<ITest>>(doc), [{to: 'world'}])
})

// === PATCHES TESTS ===
test("it should emit add patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.push(ItemFactory.create({to: "universe"}))

    t.deepEqual(patches, [
        {op: "add", path: "/0", value: {to: "universe"}}
    ])
})

test("it should apply a add patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatch(doc, {op: "add", path: "/0", value: {to: "universe"}})

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

test("it should emit update patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    doc.push(ItemFactory.create())

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc[0] = ItemFactory.create({to: "universe"})

    t.deepEqual(patches, [
        {op: "replace", path: "/0", value: {to: "universe"}}
    ])
})

test("it should apply a update patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatch(doc, {op: "replace", path: "/0", value: {to: "universe"}})

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})


test("it should emit remove patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    doc.push(ItemFactory.create())

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.splice(0)

    t.deepEqual(patches, [
        {op: "remove", path: "/0"}
    ])
})

test("it should apply a remove patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    doc.push(ItemFactory.create())
    doc.push(ItemFactory.create({to: "universe"}))

    applyPatch(doc, {op: "remove", path: "/0"})

    t.deepEqual(getSnapshot(doc), [{to: "universe"}])
})

test("it should apply patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory.create()

    applyPatches(doc, [{op: "add", path: "/0", value: {to: "mars"}}, {op: "replace", path: "/0", value: {to: "universe"}}])

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory.create()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), true)
    t.deepEqual(Factory.is({}), false)
    t.deepEqual(Factory.is([{to: 'mars'}]), true)
    t.deepEqual(Factory.is([{wrongKey: true}]), true)
    t.deepEqual(Factory.is([{to: true}]), false)
})

test("it should reconciliate instances correctly", (t) => {
    const Store = types.model({
        todos: types.array(types.model("Task", {
            id: types.identifier(),
            task: "",
            done: false
        }))
    })

    const store = Store.create({
        todos: [
            { id: "1", task: "coffee", done: false},
            { id: "2", task: "tea", done: false},
            { id: "3", task: "biscuit", done: false}
        ]
    })

    t.deepEqual(store.todos.map(todo => todo.task), ["coffee", "tea", "biscuit"])
    t.deepEqual(store.todos.map(todo => todo.done), [false, false, false])
    t.deepEqual(store.todos.map(todo => todo.id), ["1", "2", "3"])

    const a = store.todos[0]
    const b = store.todos[1]
    const c = store.todos[2]

    applySnapshot(store, {
        todos: [
            { id: "2", task: "Tee", done: true},
            { id: "1", task: "coffee", done: true},
            { id: "4", task: "biscuit", done: false},
            { id: "5", task: "stuffz", done: false}
        ]
    })

    t.deepEqual(store.todos.map(todo => todo.task), ["Tee", "coffee", "biscuit", "stuffz"])
    t.deepEqual(store.todos.map(todo => todo.done), [true, true, false, false])
    t.deepEqual(store.todos.map(todo => todo.id), ["2", "1", "4", "5"])

    t.is(store.todos[0] === b, true)
    t.is(store.todos[1] === a, true)
    t.is(store.todos[2] === c, false)
})

// TODO: in future, support identifier in unions etc
// test("it should reconciliate instances correctly", (t) => {
//     const Store = types.model.create({
//         todos: types.array(types.union(
//             types.model.create("completedTask", {
//                 id: types.identifier(),
//                 task: "",
//                 done: types.literal(true)
//             }),
//             types.model.create("uncompletedTask", {
//                 id: types.identifier()
//                 task: "",
//                 done: types.literal(true)
//             })
//         ))
//     })
// })