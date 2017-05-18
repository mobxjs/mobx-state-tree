import { unprotect } from '../src/core/mst-operations';
import {onSnapshot, onPatch, onAction, applyPatch, applyPatches, applyAction, applyActions, getPath, IJsonPatch, applySnapshot, getSnapshot, types} from "../src"
import {test} from "ava"
import {autorun} from "mobx"

interface ITestSnapshot{
    to: string
}

interface ITest{
    to: string
    setTo: (to: string) => void
}

const createTestFactories = () => {
    const Factory = types.model({
        to: 'world'
    }, {
        setTo(to) {
            this.to = to
        }
    })

    const ComputedFactory = types.model({
        width: 100,
        height: 200,
        get area(){
            return this.width * this.height
        }
    })

    const BoxFactory = types.model({
        width: 0,
        height: 0
    })

    const ColorFactory = types.model({
        color: "#FFFFFF"
    })

    return {Factory, ComputedFactory, BoxFactory, ColorFactory}
}

// === FACTORY TESTS ===
test("it should create a factory", (t) => {
    const {Factory} = createTestFactories()
    const snapshot = getSnapshot(Factory.create())
    t.deepEqual(snapshot, {to: 'world'})
    t.deepEqual((Factory.create() as any).toJSON(), {to: 'world'}) // toJSON is there as shortcut for getSnapshot(), primarily for debugging convenience
    t.deepEqual(Factory.create().toString(), "AnonymousModel@<root>")
})

test("it should restore the state from the snapshot", (t) => {
    const {Factory} = createTestFactories()

    t.deepEqual(getSnapshot(Factory.create({to: 'universe'})), { to: 'universe' })
})

// === SNAPSHOT TESTS ===
test("it should emit snapshots", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))

    doc.to = 'universe'

    t.deepEqual(snapshots, [{to: 'universe'}])
})

test("it should apply snapshots", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, {to: 'universe'})

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})

test("it should return a snapshot", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    t.deepEqual(getSnapshot(doc), {to: 'world'})
})

// === PATCHES TESTS ===
test("it should emit patches", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)

    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))

    doc.to = "universe"

    t.deepEqual(patches, [
        {op: "replace", path: "/to", value: "universe"}
    ])
})

test("it should apply a patch", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    applyPatch(doc, {op: "replace", path: "/to", value: "universe"})

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})

test("it should apply patches", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    applyPatches(doc, [{op: "replace", path: "/to", value: "mars"}, {op: "replace", path: "/to", value: "universe"}])

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})

// === ACTIONS TESTS ===
test("it should call actions correctly", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    doc.setTo('universe')

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})

test("it should emit action calls", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    let actions: any[] = []
    onAction(doc, action => actions.push(action))

    doc.setTo('universe')

  t.deepEqual(actions, [{name: "setTo", path: "", args: { to: "universe" }}])
})

test("it should apply action call", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    applyAction(doc, {name: "setTo", path: "", args: ["universe"]})

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})


test("it should apply actions calls", (t) => {
    const {Factory} = createTestFactories()
    const doc = Factory.create()

    applyActions(doc, [{name: "setTo", path: "", args: ["mars"]}, {name: "setTo", path: "", args: ["universe"]}])

    t.deepEqual(getSnapshot(doc), {to: 'universe'})
})


// === COMPUTED VALUES ===
test("it should have computed properties", (t) => {
    const {ComputedFactory} = createTestFactories()
    const doc = ComputedFactory.create()
    unprotect(doc)

    doc.width = 3
    doc.height = 2

    t.deepEqual(doc.area, 6)
})

test("it should throw if snapshot has computed properties", (t) => {
    const {ComputedFactory} = createTestFactories()

    const error = t.throws(() => {
        const doc = ComputedFactory.create({area: 3})
    }, `[mobx-state-tree] Error while converting \`{"area":3}\` to \`AnonymousModel\`:
at path "/area" value \`3\` is not assignable  (Computed properties should not be provided in the snapshot).`)
})

test("it should throw if a replaced object is read or written to", (t) => {
    const Todo = types.model({
        title: "test"
    }, {
        fn() {

        }
    })
    const Store = types.model({
        todo: Todo
    })

    const s = Store.create({
        todo: { title: "3" }
    })
    unprotect(s)

    const todo = s.todo
    s.todo = Todo.create({ title: "4"})

    t.is(s.todo.title, "4")

    const err = "[mobx-state-tree] This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type 'AnonymousModel') used to live at '/todo'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead."

    t.throws(
        () => { todo.fn() },
        "[mobx-state-tree] AnonymousModel@<root>[dead] cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value"
    )

    t.throws(
        () => {
            todo.title
        },
        err
    )

    t.throws(
        () => { todo.title = "5"},
        err
    )
})

// === COMPOSE FACTORY ===
test("it should compose factories", (t) => {
    const {BoxFactory, ColorFactory} = createTestFactories()
    const ComposedFactory = types.extend(BoxFactory, ColorFactory)

    t.deepEqual(getSnapshot(ComposedFactory.create()), {width: 0, height: 0, color: "#FFFFFF"})
})


// === TYPE CHECKS ===
test("it should check the type correctly", (t) => {
    const {Factory} = createTestFactories()

    const doc = Factory.create()

    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({to: 'mars'}), true)
    t.deepEqual(Factory.is({wrongKey: true}), true)
    t.deepEqual(Factory.is({to: 3 }), false)
})

test("it should require complex fields to be present", (t) => {
    t.is(types.model({ todo: types.model({}) }).is({}), false)
    t.throws(
        () => types.model({ todo: types.model({}) }).create(),
        /is not assignable to type/
    )

    t.is(types.model({ todo: types.array(types.string) }).is({}), false) // TBD: or true?
    t.throws(
        () => types.model({ todo: types.array(types.string) }).create(),
        /is not assignable to type/
    )

    t.is(types.model({ todo: types.map(types.string) }).is({}), false)
    t.throws(
        () => types.model({ todo: types.map(types.string) }).create(),
        /is not assignable to type/
    )
})

// === VIEW FUNCTIONS ===

test("view functions should be tracked", (t) => {
    const model = types.model({
        x: 3,
        doubler() {
            return this.x * 2
        }
    }).create()
    unprotect(model)

    const values: number[] = []
    const d = autorun(() => {
        values.push(model.doubler())
    })

    model.x = 7
    t.deepEqual(values, [6, 14])
})

test("view functions should not be allowed to change state", (t) => {
    const model = types.model({
        x: 3,
        doubler() {
            this.x *= 2
        }
    }, {
        anotherDoubler() {
            this.x *= 2
        }
    }).create()

    t.throws(
        () => model.doubler(),
        /Cannot modify 'AnonymousModel@<root>', the object is protected and can only be modified by using an action./
    )

    model.anotherDoubler()
    t.is(model.x, 6)
})
