import { unprotect } from "../src/core/mst-operations"
import {
    destroy,
    detach,
    onSnapshot,
    onPatch,
    onAction,
    applyPatch,
    applyAction,
    applySnapshot,
    getSnapshot,
    types
} from "../src"
import { test } from "ava"
import { autorun, observable, reaction } from "mobx"
interface ITestSnapshot {
    to: string
}
interface ITest {
    to: string
    setTo: (to: string) => void
}
const createTestFactories = () => {
    const Factory = types
        .model({
            to: "world"
        })
        .actions(self => {
            function setTo(to) {
                self.to = to
            }
            return {
                setTo
            }
        })
    const ComputedFactory = types
        .model({
            width: 100,
            height: 200
        })
        .views(self => ({
            get area() {
                return self.width * self.height
            }
        }))
    const ComputedFactory2 = types
        .model({
            props: types.map(types.number)
        })
        .views(self => ({
            get area() {
                return self.props.get("width")! * self.props.get("height")!
            }
        }))
        .actions(self => {
            function setWidth(value) {
                self.props.set("width", value)
            }
            function setHeight(value) {
                self.props.set("height", value)
            }
            return {
                setWidth,
                setHeight
            }
        })
    const BoxFactory = types.model({
        width: 0,
        height: 0
    })
    const ColorFactory = types.model({
        color: "#FFFFFF"
    })
    return { Factory, ComputedFactory, ComputedFactory2, BoxFactory, ColorFactory }
}
// === FACTORY TESTS ===

test("it should create a factory", t => {
    const { Factory } = createTestFactories()
    const instance = Factory.create()
    const snapshot = getSnapshot(instance)
    t.deepEqual(snapshot, { to: "world" })
    t.deepEqual((Factory.create() as any).toJSON(), { to: "world" }) // toJSON is there as shortcut for getSnapshot(), primarily for debugging convenience
    t.deepEqual(Factory.create().toString(), "AnonymousModel@<root>")
})

test("it should restore the state from the snapshot", t => {
    const { Factory } = createTestFactories()
    t.deepEqual(getSnapshot(Factory.create({ to: "universe" })), { to: "universe" })
})
// === SNAPSHOT TESTS ===

test("it should emit snapshots", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let snapshots: any[] = []
    onSnapshot(doc, snapshot => snapshots.push(snapshot))
    doc.to = "universe"
    t.deepEqual(snapshots, [{ to: "universe" }])
})

test("it should apply snapshots", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, { to: "universe" })
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})

test("it should apply and accept null value for types.maybe(complexType)", t => {
    const Item = types.model({
        value: types.string
    })
    const Model = types.model({
        item: types.maybe(Item)
    })
    const myModel = Model.create()
    applySnapshot(myModel, { item: { value: "something" } })
    applySnapshot(myModel, { item: null })
    t.deepEqual(getSnapshot(myModel), { item: null })
})

test("it should return a snapshot", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    t.deepEqual(getSnapshot(doc), { to: "world" })
})
// === PATCHES TESTS ===

test("it should emit patches", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: any[] = []
    onPatch(doc, patch => patches.push(patch))
    doc.to = "universe"
    t.deepEqual(patches, [{ op: "replace", path: "/to", value: "universe" }])
})

test("it should apply a patch", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "replace", path: "/to", value: "universe" })
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})

test("it should apply patches", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, [
        { op: "replace", path: "/to", value: "mars" },
        { op: "replace", path: "/to", value: "universe" }
    ])
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})

test("it should stop listening to patches patches", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: any[] = []
    let disposer = onPatch(doc, patch => patches.push(patch))
    doc.to = "universe"
    disposer()
    doc.to = "mweststrate"
    t.deepEqual(patches, [{ op: "replace", path: "/to", value: "universe" }])
})
// === ACTIONS TESTS ===

test("it should call actions correctly", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    doc.setTo("universe")
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})

test("it should emit action calls", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    let actions: any[] = []
    onAction(doc, action => actions.push(action))
    doc.setTo("universe")
    t.deepEqual(actions, [{ name: "setTo", path: "", args: ["universe"] }])
})

test("it should apply action call", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyAction(doc, { name: "setTo", path: "", args: ["universe"] })
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})

test("it should apply actions calls", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyAction(doc, [
        { name: "setTo", path: "", args: ["mars"] },
        { name: "setTo", path: "", args: ["universe"] }
    ])
    t.deepEqual(getSnapshot(doc), { to: "universe" })
})
// === COMPUTED VALUES ===

test("it should have computed properties", t => {
    const { ComputedFactory } = createTestFactories()
    const doc = ComputedFactory.create()
    unprotect(doc)
    doc.width = 3
    doc.height = 2
    t.deepEqual(doc.area, 6)
})

test("it should throw if a replaced object is read or written to", t => {
    const Todo = types
        .model({
            title: "test"
        })
        .actions(self => {
            function fn() {}
            return {
                fn
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
    s.todo = Todo.create({ title: "4" })
    t.is(s.todo.title, "4")
    const err =
        "[mobx-state-tree] This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type 'AnonymousModel') used to live at '/todo'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead."
    t.throws(() => {
        todo.fn()
    }, "[mobx-state-tree] AnonymousModel@<root>[dead] cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value")
    t.throws(() => {
        todo.title
    }, err)
    t.throws(() => {
        todo.title = "5"
    }, err)
})
// === COMPOSE FACTORY ===

test("it should compose factories", t => {
    const { BoxFactory, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(BoxFactory, ColorFactory)
    t.deepEqual(getSnapshot(ComposedFactory.create()), { width: 0, height: 0, color: "#FFFFFF" })
})

test("it should compose factories with computed properties", t => {
    const { ComputedFactory2, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(ColorFactory, ComputedFactory2)
    const store = ComposedFactory.create({ props: { width: 100, height: 200 } })
    t.deepEqual(getSnapshot(store), { props: { width: 100, height: 200 }, color: "#FFFFFF" })
    t.is(store.area, 20000)
    t.is(typeof store.setWidth, "function")
    t.is(typeof store.setHeight, "function")
})

test("it should compose multiple types with computed properties", t => {
    const { ComputedFactory2, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(ColorFactory, ComputedFactory2)
    const store = ComposedFactory.create({ props: { width: 100, height: 200 } })
    t.deepEqual(getSnapshot(store), { props: { width: 100, height: 200 }, color: "#FFFFFF" })
    t.is(store.area, 20000)
    t.is(typeof store.setWidth, "function")
    t.is(typeof store.setHeight, "function")
})

test("methods get overridden by compose", t => {
    const A = types
        .model({
            count: types.optional(types.number, 0)
        })
        .actions(self => {
            function increment() {
                self.count += 1
            }
            return {
                increment
            }
        })
    const B = A.actions(self => ({
        increment() {
            self.count += 10
        }
    }))
    const store = B.create()
    t.deepEqual(getSnapshot(store), { count: 0 })
    t.is(store.count, 0)
    store.increment()
    t.is(store.count, 10)
})

test("compose should add new props", t => {
    const A = types.model({
        count: types.optional(types.number, 0)
    })
    const B = A.props({
        called: types.optional(types.number, 0)
    })
    const store = B.create()
    t.deepEqual(getSnapshot(store), { count: 0, called: 0 })
    t.is(store.count, 0)
})

test("models should expose their actions to be used in a composable way", t => {
    const A = types
        .model({
            count: types.optional(types.number, 0)
        })
        .actions(self => {
            function increment() {
                self.count += 1
            }
            return {
                increment
            }
        })
    const B = A.props({
        called: types.optional(types.number, 0)
    }).actions(self => {
        const baseIncrement = self.increment
        return {
            increment() {
                baseIncrement()
                self.called += 1
            }
        }
    })
    const store = B.create()
    t.deepEqual(getSnapshot(store), { count: 0, called: 0 })
    t.is(store.count, 0)
    store.increment()
    t.is(store.count, 1)
    t.is(store.called, 1)
})

test("compose should be overwrite", t => {
    const A = types
        .model({
            name: "",
            alias: ""
        })
        .views(self => ({
            get displayName() {
                return self.alias || self.name
            }
        }))
    const B = A.props({
        type: ""
    }).views(self => ({
        get displayName() {
            return self.alias || self.name + self.type
        }
    }))
    const storeA = A.create({ name: "nameA", alias: "aliasA" })
    const storeB = B.create({ name: "nameB", alias: "aliasB", type: "typeB" })
    const storeC = B.create({ name: "nameC", type: "typeC" })
    t.is(storeA.displayName, "aliasA")
    t.is(storeB.displayName, "aliasB")
    t.is(storeC.displayName, "nameCtypeC")
})
// === TYPE CHECKS ===

test("it should check the type correctly", t => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    t.deepEqual(Factory.is(doc), true)
    t.deepEqual(Factory.is([]), false)
    t.deepEqual(Factory.is({}), true)
    t.deepEqual(Factory.is({ to: "mars" }), true)
    t.deepEqual(Factory.is({ wrongKey: true }), true)
    t.deepEqual(Factory.is({ to: 3 }), false)
})

test("it should require complex fields to be present", t => {
    t.is(
        types
            .model({
                todo: types.model({})
            })
            .is({}),
        false
    )
    t.throws(() =>
        types
            .model({
                todo: types.model({})
            })
            .create()
    )
    t.is(
        types
            .model({
                todo: types.array(types.string)
            })
            .is({}),
        false
    ) // TBD: or true?
    t.throws(() =>
        types
            .model({
                todo: types.array(types.string)
            })
            .create()
    )
    t.is(
        types
            .model({
                todo: types.map(types.string)
            })
            .is({}),
        false
    )
    t.throws(() =>
        types
            .model({
                todo: types.map(types.string)
            })
            .create()
    )
})
// === VIEW FUNCTIONS ===

test("view functions should be tracked", t => {
    const model = types
        .model({
            x: 3
        })
        .views(self => ({
            doubler() {
                return self.x * 2
            }
        }))
        .create()
    unprotect(model)
    const values: number[] = []
    const d = autorun(() => {
        values.push(model.doubler())
    })
    model.x = 7
    t.deepEqual(values, [6, 14])
})

test("view functions should not be allowed to change state", t => {
    const model = types
        .model({
            x: 3
        })
        .views(self => ({
            doubler() {
                self.x *= 2
            }
        }))
        .actions(self => {
            function anotherDoubler() {
                self.x *= 2
            }
            return {
                anotherDoubler
            }
        })
        .create()
    t.throws(() => model.doubler())
    model.anotherDoubler()
    t.is(model.x, 6)
})

test("it should consider primitives as proposed defaults", t => {
    const now = new Date()
    const Todo = types.model({
        id: 0,
        name: "Hello world",
        done: false,
        createdAt: now
    })
    const doc = Todo.create()
    t.deepEqual(getSnapshot(doc), {
        id: 0,
        name: "Hello world",
        done: false,
        createdAt: now.getTime()
    })
})

test("it should throw if a non-primitive value is provided and no default can be created", t => {
    t.throws(() => {
        const Todo = types.model({
            complex: {
                a: 1,
                b: 2
            }
        })
    })
})

test("it should not be possible to remove a node from a parent if it is required, see ", t => {
    const A = types.model("A", { x: 3 })
    const B = types.model("B", { a: A })

    const b = B.create({ a: { x: 7 } })
    unprotect(b)

    t.throws(() => {
        detach(b.a)
    }, /Error while converting `null` to `A`/)

    t.throws(() => {
        destroy(b.a)
    }, /Error while converting `null` to `A`/)
})

test("it should be possible to share states between views and actions using enhance", t => {
    const A = types.model({}).extend(self => {
        const localState = observable(3)
        return {
            views: {
                get x() {
                    return localState.get()
                }
            },
            actions: {
                setX(value) {
                    localState.set(value)
                }
            }
        }
    })

    let x = 0
    let a = A.create()
    const d = reaction(
        () => a.x,
        v => {
            x = v
        }
    )
    a.setX(7)
    t.is(a.x, 7)
    t.is(x, 7)
    d()
})

test("It should throw if any other key is returned from extend", t => {
    const A = types.model({}).extend(() => ({ stuff() {} } as any))
    t.throws(() => A.create(), /stuff/)
})
