import {
    recordActions,
    types,
    getSnapshot,
    onAction,
    applyPatch,
    applySnapshot,
    addMiddleware,
    getRoot,
    cast,
    IMiddlewareEvent,
    ISerializedActionCall,
    Instance
} from "../../src"

/// Simple action replay and invocation
const Task = types
    .model({
        done: false
    })
    .actions(self => {
        function toggle() {
            self.done = !self.done
            return self.done
        }
        return {
            toggle
        }
    })
test("it should be possible to invoke a simple action", () => {
    const t1 = Task.create()
    expect(t1.done).toBe(false)
    expect(t1.toggle()).toBe(true)
    expect(t1.done).toBe(true)
})
test("it should be possible to record & replay a simple action", () => {
    const t1 = Task.create()
    const t2 = Task.create()
    expect(t1.done).toBe(false)
    expect(t2.done).toBe(false)
    const recorder = recordActions(t1)
    t1.toggle()
    t1.toggle()
    t1.toggle()
    expect(recorder.actions).toEqual([
        { name: "toggle", path: "", args: [] },
        { name: "toggle", path: "", args: [] },
        { name: "toggle", path: "", args: [] }
    ])
    recorder.replay(t2)
    expect(t2.done).toBe(true)
})
test("applying patches should be recordable and replayable", () => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    expect(t1.done).toBe(false)
    applyPatch(t1, { op: "replace", path: "/done", value: true })
    expect(t1.done).toBe(true)
    expect(recorder.actions).toEqual([
        {
            name: "@APPLY_PATCHES",
            path: "",
            args: [[{ op: "replace", path: "/done", value: true }]]
        }
    ])
    recorder.replay(t2)
    expect(t2.done).toBe(true)
})
test("applying snapshots should be recordable and replayable", () => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    expect(t1.done).toBe(false)
    applySnapshot(t1, { done: true })
    expect(t1.done).toBe(true)
    expect(recorder.actions).toEqual([
        {
            name: "@APPLY_SNAPSHOT",
            path: "",
            args: [{ done: true }]
        }
    ])
    recorder.replay(t2)
    expect(t2.done).toBe(true)
})
// Complex actions
const Customer = types.model("Customer", {
    id: types.identifierNumber,
    name: types.string
})
const Order = types
    .model("Order", {
        customer: types.maybeNull(types.reference(Customer))
    })
    .actions(self => {
        function setCustomer(customer: Instance<typeof Customer>) {
            self.customer = customer
        }
        function noopSetCustomer(_: Instance<typeof Customer>) {
            // noop
        }
        return {
            setCustomer,
            noopSetCustomer
        }
    })
const OrderStore = types.model("OrderStore", {
    customers: types.array(Customer),
    orders: types.array(Order)
})
function createTestStore() {
    const store = OrderStore.create({
        customers: [{ id: 1, name: "Mattia" }],
        orders: [
            {
                customer: null
            }
        ]
    })
    onAction(store, () => {})
    return store
}
test("it should not be possible to pass a complex object", () => {
    const store = createTestStore()
    const recorder = recordActions(store)
    expect(store.customers[0].name).toBe("Mattia")
    store.orders[0].setCustomer(store.customers[0])
    expect(store.orders[0].customer!.name).toBe("Mattia")
    expect(store.orders[0].customer).toBe(store.customers[0])
    expect(getSnapshot(store)).toEqual({
        customers: [
            {
                id: 1,
                name: "Mattia"
            }
        ],
        orders: [
            {
                customer: 1
            }
        ]
    })
    expect(recorder.actions).toEqual([
        {
            name: "setCustomer",
            path: "/orders/0",
            args: [{ $MST_UNSERIALIZABLE: true, type: "[MSTNode: Customer]" }]
        }
    ])
})
if (process.env.NODE_ENV !== "production") {
    test("it should not be possible to set the wrong type", () => {
        const store = createTestStore()
        expect(() => {
            store.orders[0].setCustomer(store.orders[0] as any)
        }).toThrowError(
            "Error while converting <Order@/orders/0> to `(reference(Customer) | null)`:\n\n    " +
                "value of type Order: <Order@/orders/0> is not assignable to type: `(reference(Customer) | null)`, expected an instance of `(reference(Customer) | null)` or a snapshot like `(reference(Customer) | null?)` instead."
        ) // wrong type!
    })
}
test("it should not be possible to pass the element of another tree", () => {
    const store1 = createTestStore()
    const store2 = createTestStore()
    const recorder = recordActions(store2)
    store2.orders[0].setCustomer(store1.customers[0])
    expect(recorder.actions).toEqual([
        {
            name: "setCustomer",
            path: "/orders/0",
            args: [
                {
                    $MST_UNSERIALIZABLE: true,
                    type: "[MSTNode: Customer]"
                }
            ]
        }
    ])
})
test("it should not be possible to pass an unserializable object", () => {
    const store = createTestStore()
    const circular = { a: null as any }
    circular.a = circular
    const recorder = recordActions(store)
    store.orders[0].noopSetCustomer(circular as any)
    store.orders[0].noopSetCustomer(Buffer.from("bla") as any)

    // fix for newer node versions, which include extra data on dev mode
    if (
        recorder.actions[0].args![0].type.startsWith(
            "TypeError: Converting circular structure to JSON"
        )
    ) {
        recorder.actions[0].args![0].type = "TypeError: Converting circular structure to JSON"
    }

    expect(recorder.actions).toEqual([
        {
            args: [
                {
                    $MST_UNSERIALIZABLE: true,
                    type: "TypeError: Converting circular structure to JSON"
                }
            ],
            name: "noopSetCustomer",
            path: "/orders/0"
        },
        {
            args: [
                {
                    $MST_UNSERIALIZABLE: true,
                    type: "[object Buffer]"
                }
            ],
            name: "noopSetCustomer",
            path: "/orders/0"
        }
    ])
})
test("it should be possible to pass a complex plain object", () => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    ;(t1 as any).toggle({ bla: ["nuff", ["said"]] }) // nonsense, but serializable!
    expect(recorder.actions).toEqual([
        { name: "toggle", path: "", args: [{ bla: ["nuff", ["said"]] }] }
    ])
    recorder.replay(t2)
    expect(t2.done).toBe(true)
})
test("action should be bound", () => {
    const task = Task.create()
    const f = task.toggle
    expect(f()).toBe(true)
    expect(task.done).toBe(true)
})
test("snapshot should be available and updated during an action", () => {
    const Model = types
        .model({
            x: types.number
        })
        .actions(self => {
            function inc() {
                self.x += 1
                const res = getSnapshot(self).x
                self.x += 1
                return res
            }
            return {
                inc
            }
        })
    const a = Model.create({ x: 2 })
    expect(a.inc()).toBe(3)
    expect(a.x).toBe(4)
    expect(getSnapshot(a).x).toBe(4)
})

test("indirectly called private functions should be able to modify state", () => {
    const Model = types
        .model({
            x: 3
        })
        .actions(self => {
            function incrementBy(delta: number) {
                self.x += delta
            }
            return {
                inc() {
                    incrementBy(1)
                },
                dec() {
                    incrementBy(-1)
                }
            }
        })
    const cnt = Model.create()
    expect(cnt.x).toBe(3)
    cnt.dec()
    expect(cnt.x).toBe(2)
    expect((cnt as any).incrementBy).toBe(undefined)
})
test("volatile state survives reonciliation", () => {
    const Model = types.model({ x: 3 }).actions(self => {
        let incrementor = 1
        return {
            setIncrementor(value: number) {
                incrementor = value
            },
            inc() {
                self.x += incrementor
            }
        }
    })
    const Store = types.model({
        cnt: types.optional(Model, {})
    })
    const store = Store.create()
    store.cnt.inc()
    expect(store.cnt.x).toBe(4)
    store.cnt.setIncrementor(3)
    store.cnt.inc()
    expect(store.cnt.x).toBe(7)
    applySnapshot(store, { cnt: { x: 2 } })
    expect(store.cnt.x).toBe(2)
    store.cnt.inc()
    expect(store.cnt.x).toBe(5) // incrementor was not lost
})
test("middleware events are correct", () => {
    const A = types.model({}).actions(self => ({
        a(x: number) {
            return this.b(x * 2)
        },
        b(y: number) {
            return y + 1
        }
    }))
    const a = A.create()
    const events: IMiddlewareEvent[] = []
    addMiddleware(a, function(call, next) {
        events.push(call)
        return next(call)
    })
    a.a(7)
    const event1 = {
        args: [7],
        context: {},
        id: process.env.NODE_ENV !== "production" ? 28 : 27,
        name: "a",
        parentId: 0,
        rootId: process.env.NODE_ENV !== "production" ? 28 : 27,
        allParentIds: [],
        tree: {},
        type: "action",
        parentEvent: undefined,
        parentActionEvent: undefined
    }
    const event2 = {
        args: [14],
        context: {},
        id: process.env.NODE_ENV !== "production" ? 29 : 28,
        name: "b",
        parentId: process.env.NODE_ENV !== "production" ? 28 : 27,
        rootId: process.env.NODE_ENV !== "production" ? 28 : 27,
        allParentIds: [process.env.NODE_ENV !== "production" ? 28 : 27],
        tree: {},
        type: "action",
        parentEvent: event1,
        parentActionEvent: event1
    }
    expect(events).toEqual([event1, event2])
})

test("actions are mockable", () => {
    const M = types
        .model()
        .actions(self => ({
            method(): number {
                return 3
            }
        }))
        .views(self => ({
            view(): number {
                return 3
            }
        }))
    const m = M.create()
    if (process.env.NODE_ENV === "production") {
        expect(() => {
            m.method = function() {
                return 3
            }
        }).toThrowError(TypeError)
        expect(() => {
            m.view = function() {
                return 3
            }
        }).toThrowError(TypeError)
    } else {
        m.method = function() {
            return 4
        }
        expect(m.method()).toBe(4)
        m.view = function() {
            return 4
        }
        expect(m.view()).toBe(4)
    }
})

test("after attach action should work correctly", () => {
    const Todo = types
        .model({
            title: "test"
        })
        .actions(self => ({
            remove() {
                getRoot<typeof S>(self).remove(cast(self))
            }
        }))
    const S = types
        .model({
            todos: types.array(Todo)
        })
        .actions(self => ({
            remove(todo: Instance<typeof Todo>) {
                self.todos.remove(todo)
            }
        }))

    const s = S.create({
        todos: [{ title: "todo" }]
    })
    const events: ISerializedActionCall[] = []
    onAction(
        s,
        call => {
            events.push(call)
        },
        true
    )

    s.todos[0].remove()

    expect(events).toEqual([
        {
            args: [],
            name: "remove",
            path: "/todos/0"
        }
    ])
})
