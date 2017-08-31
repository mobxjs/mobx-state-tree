import {
    recordActions,
    types,
    getSnapshot,
    onAction,
    applyPatch,
    applySnapshot,
    addMiddleware
} from "../src"
import { test } from "ava"

declare var Buffer

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

test("it should be possible to invoke a simple action", t => {
    const t1 = Task.create()
    t.is(t1.done, false)
    t.is(t1.toggle(), true)
    t.is(t1.done, true)
})

test("it should be possible to record & replay a simple action", t => {
    const t1 = Task.create()
    const t2 = Task.create()
    t.is(t1.done, false)
    t.is(t2.done, false)
    const recorder = recordActions(t1)
    t1.toggle()
    t1.toggle()
    t1.toggle()
    t.deepEqual(recorder.actions, [
        { name: "toggle", path: "", args: [] },
        { name: "toggle", path: "", args: [] },
        { name: "toggle", path: "", args: [] }
    ])
    recorder.replay(t2)
    t.is(t2.done, true)
})

test("applying patches should be recordable and replayable", t => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    t.is(t1.done, false)
    applyPatch(t1, { op: "replace", path: "done", value: true })
    t.is(t1.done, true)
    t.deepEqual(recorder.actions, [
        {
            name: "@APPLY_PATCHES",
            path: "",
            args: [[{ op: "replace", path: "done", value: true }]]
        }
    ])
    recorder.replay(t2)
    t.is(t2.done, true)
})

test("applying snapshots should be recordable and replayable", t => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    t.is(t1.done, false)
    applySnapshot(t1, { done: true })
    t.is(t1.done, true)
    t.deepEqual(recorder.actions, [
        {
            name: "@APPLY_SNAPSHOT",
            path: "",
            args: [{ done: true }]
        }
    ])
    recorder.replay(t2)
    t.is(t2.done, true)
})

// Complex actions
const Customer = types.model("Customer", {
    id: types.identifier(types.number),
    name: types.string
})

const Order = types
    .model("Order", {
        customer: types.maybe(types.reference(Customer))
    })
    .actions(self => {
        function setCustomer(customer) {
            self.customer = customer
        }

        function noopSetCustomer(customer) {
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

test("it should not be possible to pass a complex object", t => {
    const store = createTestStore()
    const recorder = recordActions(store)
    t.is(store.customers[0].name, "Mattia")
    store.orders[0].setCustomer(store.customers[0])
    t.is(store.orders[0].customer!.name, "Mattia")
    t.is(store.orders[0].customer, store.customers[0])
    t.deepEqual(getSnapshot(store) as any, {
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
    t.deepEqual(recorder.actions, [
        {
            name: "setCustomer",
            path: "/orders/0",
            args: [{ $MST_UNSERIALIZABLE: true, type: "[MSTNode: Customer]" }]
        }
    ])
})

test("it should not be possible to set the wrong type", t => {
    const store = createTestStore()
    t.throws(
        () => {
            store.orders[0].setCustomer(store.orders[0])
        }, // wrong type!
        "[mobx-state-tree] Error while converting <Order@/orders/0> to `(reference(Customer) | null)`:\n" +
            "value of type Order: <Order@/orders/0> is not assignable to type: `(reference(Customer) | null)`, expected an instance of `(reference(Customer) | null)` or a snapshot like `(reference(Customer) | null?)` instead."
    )
})

test("it should not be possible to pass the element of another tree", t => {
    const store1 = createTestStore()
    const store2 = createTestStore()
    const recorder = recordActions(store2)
    store2.orders[0].setCustomer(store1.customers[0])
    t.deepEqual(recorder.actions, [
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

test("it should not be possible to pass an unserializable object", t => {
    const store = createTestStore()
    const circular = { a: null as any }
    circular.a = circular
    const recorder = recordActions(store)

    store.orders[0].noopSetCustomer(circular)
    store.orders[0].noopSetCustomer(new Buffer("bla"))

    t.deepEqual(recorder.actions, [
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

test("it should be possible to pass a complex plain object", t => {
    const t1 = Task.create()
    const t2 = Task.create()
    const recorder = recordActions(t1)
    ;(t1 as any).toggle({ bla: ["nuff", ["said"]] }) // nonsense, but serializable!
    t.deepEqual(recorder.actions, [
        { name: "toggle", path: "", args: [{ bla: ["nuff", ["said"]] }] }
    ])
    recorder.replay(t2)
    t.is(t2.done, true)
})

test("action should be bound", t => {
    const task = Task.create()
    const f = task.toggle
    t.is(f(), true)
    t.is(task.done, true)
})

test("snapshot should be available and updated during an action", t => {
    const Model = types
        .model({
            x: types.number
        })
        .actions(self => {
            function inc() {
                self.x += 1
                const res = getSnapshot(self as any).x
                self.x += 1
                return res
            }
            return {
                inc
            }
        })
    const a = Model.create({ x: 2 })
    t.is(a.inc(), 3)
    t.is(a.x, 4)
    t.is(getSnapshot(a).x, 4)
})

test("indirectly called private functions should be able to modify state", t => {
    const Model = types
        .model({
            x: 3
        })
        .actions(self => {
            function incrementBy(delta) {
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
    t.is(cnt.x, 3)
    cnt.dec()
    t.is(cnt.x, 2)
    t.is((cnt as any).incrementBy, undefined)
})

test("volatile state survives reonciliation", t => {
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
    t.is(store.cnt.x, 4)
    store.cnt.setIncrementor(3)
    store.cnt.inc()
    t.is(store.cnt.x, 7)

    applySnapshot(store, { cnt: { x: 2 } })
    t.is(store.cnt.x, 2)
    store.cnt.inc()
    t.is(store.cnt.x, 5) // incrementor was not lost
})

test("middleware events are correct", t => {
    const A = types.model({}).actions(self => ({
        a(x) {
            return (self as any).b(x * 2)
        },
        b(y) {
            return y + 1
        }
    }))

    const a = A.create()
    const events: any[] = []
    addMiddleware(a, function(call, next) {
        events.push(call)
        return next(call)
    })
    a.a(7)
    t.deepEqual(events, [
        {
            args: [7],
            context: {},
            id: 38,
            name: "a",
            parentId: 0,
            rootId: 38,
            tree: {},
            type: "action"
        },
        {
            args: [14],
            context: {},
            id: 39,
            name: "b",
            parentId: 38,
            rootId: 38,
            tree: {},
            type: "action"
        }
    ])
})
