import { addDisposer, destroy, detach, types, unprotect, getSnapshot, applySnapshot } from "../src"
import { test } from "ava"

function createTestStore(listener) {
    const Todo = types.model(
        "Todo",
        {
            title: ""
        },
        {
            afterCreate() {
                listener("new todo: " + this.title)
                addDisposer(this, () => {
                    listener("custom disposer 1 for " + this.title)
                })
                addDisposer(this, () => {
                    listener("custom disposer 2 for " + this.title)
                })
            },
            beforeDestroy() {
                listener("destroy todo: " + this.title)
            },
            afterAttach() {
                listener("attach todo: " + this.title)
            },
            beforeDetach() {
                listener("detach todo: " + this.title)
            }
        }
    )

    const Store = types.model(
        "Store",
        {
            todos: types.array(Todo)
        },
        {
            afterCreate() {
                unprotect(this)
                listener("new store: " + this.todos.length)
                addDisposer(this, () => {
                    listener("custom disposer for store")
                })
            },
            beforeDestroy() {
                listener("destroy store: " + this.todos.length)
            }
            /* TODO: Useless, store has no parent :/
            afterAttach() {
                listener("attach store: " + this.todos.length)
            },
            beforeDetach() {
                listener("detach store: " + this.todos.length)
            }
            */
        }
    )

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

const Car = types.model(
    {
        id: types.number
    },
    {
        preProcessSnapshot(snapshot) {
            return { ...snapshot, id: parseInt(snapshot.id) * 2 }
        },
        postProcessSnapshot(snapshot) {
            return { ...snapshot, id: "" + snapshot.id / 2 }
        }
    }
)

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
