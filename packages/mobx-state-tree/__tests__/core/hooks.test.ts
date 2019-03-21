import {
    addDisposer,
    destroy,
    detach,
    types,
    unprotect,
    getSnapshot,
    applySnapshot,
    onSnapshot,
    isAlive,
    hasParent
} from "../../src"

function createTestStore(listener: (s: string) => void) {
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

// NOTE: as we defer creation (and thus, hooks) till first real access,
// some of original hooks do not fire at all
test("it should trigger lifecycle hooks", () => {
    const events: string[] = []
    // new store: 3
    const { store, Todo } = createTestStore(e => events.push(e))

    events.push("-")
    // access (new, attach), then detach "Give Talk"
    const talk = detach(store.todos[2])
    expect(isAlive(talk)).toBe(true)
    expect(hasParent(talk)).toBe(false)

    events.push("--")

    // access (new, attach), then destroy biscuit
    const oldBiscuit = store.todos.pop()!
    expect(isAlive(oldBiscuit)).toBe(false)

    events.push("---")
    // new and then attach "add sugar"
    const sugar = Todo.create({
        title: "add sugar"
    })
    store.todos.push(sugar)

    events.push("----")
    // destroy elements in the array ("add sugar"), then store
    destroy(store)
    expect(isAlive(store)).toBe(false)

    events.push("-----")
    // destroy "Give talk"
    destroy(talk)
    expect(isAlive(talk)).toBe(false)

    expect(events).toEqual([
        "new store: 3",
        "-",
        "new todo: Give talk",
        "attach todo: Give talk",
        "detach todo: Give talk",
        "--",
        "new todo: Get biscuit",
        "attach todo: Get biscuit",
        "destroy todo: Get biscuit",
        "custom disposer 2 for Get biscuit",
        "custom disposer 1 for Get biscuit",
        "---",
        "new todo: add sugar",
        "attach todo: add sugar",
        "----",
        "destroy todo: add sugar",
        "custom disposer 2 for add sugar",
        "custom disposer 1 for add sugar",
        "destroy store: 2",
        "custom disposer for store",
        "-----",
        "destroy todo: Give talk",
        "custom disposer 2 for Give talk",
        "custom disposer 1 for Give talk"
    ])
})

type CarSnapshot = { id: string }
const Car = types
    .model("Car", {
        id: types.number
    })
    .preProcessSnapshot<CarSnapshot>(snapshot =>
        Object.assign({}, snapshot, { id: Number(snapshot.id) * 2 })
    )
    .postProcessSnapshot<CarSnapshot>(snapshot =>
        Object.assign({}, snapshot, { id: "" + snapshot.id / 2 })
    )

const Factory = types.model("Factory", {
    car: Car
})

const Motorcycle = types
    .model("Motorcycle", {
        id: types.string
    })
    .preProcessSnapshot<CarSnapshot>(snapshot =>
        Object.assign({}, snapshot, { id: snapshot.id.toLowerCase() })
    )
    .postProcessSnapshot<CarSnapshot>(snapshot =>
        Object.assign({}, snapshot, { id: snapshot.id.toUpperCase() })
    )
const MotorcycleFactory = types.model("MotorcycleFactory", {
    motorcycles: types.array(Motorcycle)
})

test("it should preprocess snapshots when creating", () => {
    const car = Car.create({ id: "1" })
    expect(car.id).toBe(2)
})
test("it should preprocess snapshots when updating", () => {
    const car = Car.create({ id: "1" })
    expect(car.id).toBe(2)
    applySnapshot(car, { id: "6" })
    expect(car.id).toBe(12)
})
test("it should postprocess snapshots when generating snapshot - 1", () => {
    const car = Car.create({ id: "1" })
    expect(car.id).toBe(2)
    expect(getSnapshot(car)).toEqual({ id: "1" })
})
test("it should not apply postprocessor to snapshot on getSnapshot", () => {
    const car = Car.create({ id: "1" })
    let error = false
    onSnapshot(car, snapshot => {
        error = true
    })
    expect(getSnapshot(car)).toEqual({ id: "1" })
    expect(getSnapshot(car, false)).toEqual({ id: 2 })
    expect(error).toBeFalsy()
})
test("it should preprocess snapshots when creating as property type", () => {
    const f = Factory.create({ car: { id: "1" } })
    expect(f.car.id).toBe(2)
})
test("it should preprocess snapshots when updating", () => {
    const f = Factory.create({ car: { id: "1" } })
    expect(f.car.id).toBe(2)
    applySnapshot(f, { car: { id: "6" } })
    expect(f.car.id).toBe(12)
})
test("it should postprocess snapshots when generating snapshot - 2", () => {
    const f = Factory.create({ car: { id: "1" } })
    expect(f.car.id).toBe(2)
    expect(getSnapshot(f)).toEqual({ car: { id: "1" } })
})

test("it should postprocess non-initialized children", () => {
    const f = MotorcycleFactory.create({ motorcycles: [{ id: "a" }, { id: "b" }] })
    expect(getSnapshot(f)).toEqual({ motorcycles: [{ id: "A" }, { id: "B" }] })
})

test("base hooks can be composed", () => {
    const events: string[] = []
    function listener(message: string) {
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
    expect(events).toEqual([
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
test("snapshot processors can be composed", () => {
    const X = types
        .model({
            x: 1
        })
        .preProcessSnapshot(s => ({
            x: s.x! - 3
        }))
        .preProcessSnapshot(s => ({
            x: s.x! / 5
        }))
        .postProcessSnapshot(s => {
            return { x: s.x + 3 }
        })
        .postProcessSnapshot(s => {
            return { x: s.x * 5 }
        })

    const x = X.create({ x: 25 })
    expect(x.x).toBe(2)
    expect(getSnapshot(x).x).toBe(25)
})

test("addDisposer must return the passed disposer", () => {
    const listener = jest.fn()
    const M = types.model({}).actions(self => {
        expect(addDisposer(self, listener)).toBe(listener)
        return {}
    })
    M.create()
})
