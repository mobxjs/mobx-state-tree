import { addDisposer, destroy, detach, types, unprotect, getSnapshot, applySnapshot } from "../src"
import { test } from "ava"
function createTestStore(listener) {
    const Todo = types
        .model("Todo", {
            title: ""
        })
        .actions(self => {
            function afterCreate() {
                listener("new todo: " + self.title)
                addDisposer(self, () => {
                    listener("custom disposer 1 for " + self.title)
                })
                addDisposer(self, () => {
                    listener("custom disposer 2 for " + self.title)
                })
            }
            function beforeDestroy() {
                listener("destroy todo: " + self.title)
            }
            function afterAttach() {
                listener("attach todo: " + self.title)
            }
            function beforeDetach() {
                listener("detach todo: " + self.title)
            }
            return {
                afterCreate,
                beforeDestroy,
                afterAttach,
                beforeDetach
            }
        })
    const Store = types
        .model("Store", {
            todos: types.array(Todo)
        })
        .actions(self => {
            function afterCreate() {
                unprotect(self)
                listener("new store: " + self.todos.length)
                addDisposer(self, () => {
                    listener("custom disposer for store")
                })
            }
            function beforeDestroy() {
                listener("destroy store: " + self.todos.length)
            }
            return {
                afterCreate,
                beforeDestroy
            }
        })
    return {
        store: Store.create({
            todos: [{ title: "Get coffee" }, { title: "Get biscuit" }, { title: "Give talk" }]
        }),
        Store,
        Todo
    }
}

test("it should trigger lifecycle hooks", t => {
    const events: string[] = []
    const { store, Todo } = createTestStore(e => events.push(e))
    const talk = detach(store.todos[2])
    events.push("-")
    store.todos.pop()
    events.push("--")
    const sugar = Todo.create({ title: "add sugar" })
    store.todos.push(sugar)
    events.push("---")
    destroy(store)
    destroy(talk)
    t.deepEqual(events, [
        "new todo: Get coffee",
        "attach todo: Get coffee",
        "new todo: Get biscuit",
        "attach todo: Get biscuit",
        "new todo: Give talk",
        "attach todo: Give talk",
        "new store: 3",
        "detach todo: Give talk",
        "-",
        "custom disposer 2 for Get biscuit",
        "custom disposer 1 for Get biscuit",
        "destroy todo: Get biscuit",
        "--",
        "new todo: add sugar",
        "attach todo: add sugar",
        "---",
        "custom disposer 2 for Get coffee",
        "custom disposer 1 for Get coffee",
        "destroy todo: Get coffee",
        "custom disposer 2 for add sugar",
        "custom disposer 1 for add sugar",
        "destroy todo: add sugar",
        "custom disposer for store",
        "destroy store: 2",
        "custom disposer 2 for Give talk",
        "custom disposer 1 for Give talk",
        "destroy todo: Give talk"
    ])
})
const Car = types
    .model({
        id: types.number
    })
    .preProcessSnapshot((snapshot: any) => ({ ...snapshot, id: parseInt(snapshot.id) * 2 }))
    .actions(self => {
        // TODO: Move to a separate type
        function postProcessSnapshot(snapshot) {
            return { ...snapshot, id: "" + snapshot.id / 2 }
        }
        return {
            postProcessSnapshot
        }
    })
const Factory = types.model({
    car: Car
})

test("it should preprocess snapshots when creating", t => {
    const car = Car.create({ id: "1" })
    t.is(car.id, 2)
})

test("it should preprocess snapshots when updating", t => {
    const car = Car.create({ id: "1" })
    t.is(car.id, 2)
    applySnapshot(car, { id: "6" })
    t.is(car.id, 12)
})

test("it should postprocess snapshots when generating snapshot", t => {
    const car = Car.create({ id: "1" })
    t.is(car.id, 2)
    t.deepEqual(getSnapshot(car), { id: "1" })
})

test("it should preprocess snapshots when creating as property type", t => {
    const f = Factory.create({
        car: { id: "1" }
    })
    t.is(f.car.id, 2)
})

test("it should preprocess snapshots when updating", t => {
    const f = Factory.create({ car: { id: "1" } })
    t.is(f.car.id, 2)
    applySnapshot(f, { car: { id: "6" } })
    t.is(f.car.id, 12)
})

test("it should postprocess snapshots when generating snapshot", t => {
    const f = Factory.create({ car: { id: "1" } })
    t.is(f.car.id, 2)
    t.deepEqual(getSnapshot(f), { car: { id: "1" } })
})

test("base hooks can be composed", t => {
    const events: string[] = []
    function listener(message) {
        events.push(message)
    }

    const Todo = types
        .model("Todo", { title: "" })
        .actions(self => {
            function afterCreate() {
                listener("aftercreate1")
            }
            function beforeDestroy() {
                listener("beforedestroy1")
            }
            function afterAttach() {
                listener("afterattach1")
            }
            function beforeDetach() {
                listener("beforedetach1")
            }
            return { afterCreate, beforeDestroy, afterAttach, beforeDetach }
        })
        .actions(self => {
            function afterCreate() {
                listener("aftercreate2")
            }
            function beforeDestroy() {
                listener("beforedestroy2")
            }
            function afterAttach() {
                listener("afterattach2")
            }
            function beforeDetach() {
                listener("beforedetach2")
            }
            return { afterCreate, beforeDestroy, afterAttach, beforeDetach }
        })

    const Store = types.model("Store", { todos: types.array(Todo) })

    const store = Store.create({ todos: [] })
    const todo = Todo.create()
    unprotect(store)
    store.todos.push(todo)
    detach(todo)
    destroy(todo)
    t.deepEqual(events, [
        "aftercreate1",
        "aftercreate2",
        "afterattach1",
        "afterattach2",
        "beforedetach1",
        "beforedetach2",
        "beforedestroy1",
        "beforedestroy2"
    ])
})

test("snapshot processors can be composed", t => {
    const X = types
        .model({
            x: 1
        })
        .actions(self => ({
            postProcessSnapshot(s) {
                s.x += 3
                return s
            }
        }))
        .preProcessSnapshot((s: any) => ({
            x: s.x - 3
        }))
        .actions(self => ({
            postProcessSnapshot(s) {
                s.x *= 5
                return s
            }
        }))
        .preProcessSnapshot((s: any) => ({
            x: s.x / 5
        }))
    const x = X.create({ x: 25 })
    t.is(x.x, 2)
    t.is(getSnapshot(x).x, 25)
})
