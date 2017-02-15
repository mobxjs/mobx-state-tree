import {ObservableMap} from 'mobx'
import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot, IFactory, types as t} from "../"
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

    const Factory = (t.map(
        ItemFactory
    ) as any) as IFactory<{[key: string]: ITestSnapshot}, ObservableMap<ITest>>

    return {Factory, ItemFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual<any>(getSnapshot<{[key: string]: ITestSnapshot}, ObservableMap<ITest>>(Factory()), {})
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual<any>(getSnapshot(Factory({hello: {to: 'world'}})), {hello: {to: 'world'}})
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    let snapshots = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.set("hello", ItemFactory())

    t.deepEqual(snapshots, [{hello: {to: 'world'}}])
})

test("it should apply snapshots", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applySnapshot(doc, {hello: {to: 'universe'}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})

test("it should return a snapshot", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.set("hello", ItemFactory())

    t.deepEqual<any>(getSnapshot<any, any>(doc), {hello: {to: 'world'}})
})


// === PATCHES TESTS ===
test("it should emit add patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.set("hello", ItemFactory({to: "universe"}))

    t.deepEqual(patches, [
        {op: "add", path: "/hello", value: {to: "universe"}}
    ])
})

test("it should apply a add patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatch(doc, {op: "add", path: "/hello", value: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})

test("it should emit update patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.set("hello", ItemFactory())

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.set("hello", ItemFactory({to: "universe"}))

    t.deepEqual(patches, [
        {op: "replace", path: "/hello", value: {to: "universe"}}
    ])
})

test("it should apply a update patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatch(doc, {op: "replace", path: "/hello", value: {to: "universe"}})

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})


test("it should emit remove patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.set("hello", ItemFactory())

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.delete("hello")

    t.deepEqual(patches, [
        {op: "remove", path: "/hello"}
    ])
})

test("it should apply a remove patch", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    doc.set("hello", ItemFactory())

    applyPatch(doc, {op: "remove", path: "/hello"})

    t.deepEqual(getSnapshot(doc), {})
})

test("it should apply patches", (t) => {
    const {Factory, ItemFactory} = createTestFactories()
    const doc = Factory()

    applyPatches(doc, [{op: "add", path: "/hello", value: {to: "mars"}}, {op: "replace", path: "/hello", value: {to: "universe"}}])

    t.deepEqual<any>(getSnapshot(doc), {hello: {to: 'universe'}})
})


// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({hello: {to: 'mars'}}), true)
    t.deepEqual(Factory.is({hello: {wrongKey: true}}), false)
})