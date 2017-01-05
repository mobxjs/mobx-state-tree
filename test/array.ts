import {IObservableArray} from 'mobx'
import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot, arrayOf, IModelFactory} from "../"
import {test} from "ava"

interface ITestSnapshot{
    to: string
}

interface ITest{
    to: string
}

const createTestFactories = () => {
    const ItemFactory = createFactory({
            to: 'world'
        })

    const Factory = (arrayOf(
        ItemFactory
    ) as any) as IModelFactory<ITestSnapshot[], IObservableArray<ITest>>

    return {Factory, ItemFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual<ITestSnapshot[]>(getSnapshot<ITestSnapshot[], IObservableArray<ITest>>(Factory()), [])
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual(getSnapshot(Factory([{to: 'universe'}])), [{ to: 'universe' }])
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    let snapshots = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.push(ItemFactory())

    t.deepEqual(snapshots, [[{to: 'world'}]])
})

test("it should apply snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applySnapshot(doc, [{to: 'universe'}])

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

test("it should return a snapshot", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.push(ItemFactory())

    t.deepEqual(getSnapshot<ITestSnapshot[], IObservableArray<ITest>>(doc), [{to: 'world'}])
})

// === PATCHES TESTS ===
test("it should emit add patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.push(ItemFactory({to: "universe"}))

    t.deepEqual(patches, [
        {op: "add", path: "/0", value: {to: "universe"}}
    ])
})

test("it should apply a add patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatch(doc, {op: "add", path: "/0", value: {to: "universe"}})

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

test("it should emit update patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.push(ItemFactory())

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc[0] = ItemFactory({to: "universe"})

    t.deepEqual(patches, [
        {op: "replace", path: "/0", value: {to: "universe"}}
    ])
})

test("it should apply a update patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatch(doc, {op: "replace", path: "/0", value: {to: "universe"}})

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})


test("it should emit remove patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.push(ItemFactory())

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.splice(0)

    t.deepEqual(patches, [
        {op: "remove", path: "/0"}
    ])
})

test("it should apply a remove patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()
    
    doc.push(ItemFactory())
    doc.push(ItemFactory({to: "universe"}))

    applyPatch(doc, {op: "remove", path: "/0"})

    t.deepEqual(getSnapshot(doc), [{to: "universe"}])
})

test("it should apply patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatches(doc, [{op: "add", path: "/0", value: {to: "mars"}}, {op: "replace", path: "/0", value: {to: "universe"}}])

    t.deepEqual(getSnapshot(doc), [{to: 'universe'}])
})

// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), true)
    t.deepEqual(Factory.is({}), false)
    t.deepEqual(Factory.is([{to: 'mars'}]), true)
    t.deepEqual(Factory.is([{wrongKey: true}]), false)
})

test("it should dispatch the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory()

    t.deepEqual(Factory.dispatch(doc) === Factory, true)
})