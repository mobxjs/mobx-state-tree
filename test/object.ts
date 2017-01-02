import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot} from "../"
import {test} from "ava"

interface ITestSnapshot{
    to: string
}

interface ITest{
    to: string
    setTo: (to: string) => void
}

const createTestFactory = () =>
    createFactory({
        to: 'world',
        setTo: action(function(to){
            this.to = to
        })
    })

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const factory = createTestFactory()

    t.deepEqual(factory(), {to: 'world'})
})

test("it should restore the state from the snapshot", (t) => {
    const factory = createTestFactory()

    t.deepEqual(factory({to: 'universe'}), { to: 'universe' })
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    let snapshots = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.to = 'universe'

    t.deepEqual(snapshots, [{to: 'universe'}])
})

test("it should apply snapshots", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    applySnapshot(doc, {to: 'universe'})

    t.deepEqual(doc, {to: 'universe'})
})

test("it should return a snapshot", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    t.deepEqual(getSnapshot<ITestSnapshot, ITest>(doc), {to: 'world'})
})

// === PATCHES TESTS ===
test("it should emit patches", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    let patches = []
    onPatch(doc, patch => patches.push(patch))

    doc.to = "universe"

    t.deepEqual(patches, [
        {op: "replace", path: "/to", value: "universe"}
    ])
})

test("it should apply a patch", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    applyPatch(doc, {op: "replace", path: "/to", value: "universe"})

    t.deepEqual(doc, {to: 'universe'})
})

test("it should apply patches", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    applyPatches(doc, [{op: "replace", path: "/to", value: "mars"}, {op: "replace", path: "/to", value: "universe"}])

    t.deepEqual(doc, {to: 'universe'})
})

// === ACTIONS TESTS ===
test("it should call actions correctly", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    doc.setTo('universe')

    t.deepEqual(doc, {to: 'universe'})
})

test("it should emit action calls", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    let actions = []
    onAction(doc, action => actions.push(action))

    doc.setTo('universe')

    t.deepEqual(actions, [{name: "setTo", path: "", args: ["universe"]}])
})

test("it should apply action call", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    applyAction(doc, {name: "setTo", path: "", args: ["universe"]})

    t.deepEqual(doc, {to: 'universe'})
})


test("it should apply actions calls", (t) => {
    const factory = createTestFactory()
    const doc = factory()

    applyActions(doc, [{name: "setTo", path: "", args: ["mars"]}, {name: "setTo", path: "", args: ["universe"]}])

    t.deepEqual(doc, {to: 'universe'})
})