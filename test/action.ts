import { createFactory, action, recordActions, types, getSnapshot } from "../"
import { test } from "ava"

/// Simple action replay and invocation

const Task = createFactory({
    done: false,
    toggle: action(function () {
        this.done = !this.done
        return this.done
    })
})

test("it should be possible to invoke a simple action", t => {
    const t1 = Task()
    t.is(t1.done, false)

    t.is(t1.toggle(), true)
    t.is(t1.done, true)
})

test("it should be possible to record & replay a simple action", t => {
    const t1 = Task()
    const t2 = Task()
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

test.skip("it should not be possible to change state without action", t => {
    const t1 = Task()
    t.throws(
        () => {
            t1.done = !t1.done
        },
        "bla"
    )
})

// Complex actions
const Customer = createFactory({
    name: ""
})

const Order = createFactory({
    customer: types.referenceTo(Customer),
    setCustomer: action(function (customer) {
        this.customer = customer
    })
})

const OrderStore = createFactory({
    customers: types.array(Customer),
    orders: types.array(Order)
})

function createTestStore() {
    return OrderStore({
        customers: [{ name: "Mattia" }],
        orders: [{}]
    })
}

test("it should be possible to pass a complex object", t => {
    const store = createTestStore()
    const recorder = recordActions(store)

    t.is(store.customers[0].name, "Mattia")
    store.orders[0].setCustomer(store.customers[0])
    t.is(store.orders[0].customer.name, "Mattia")
    t.is(store.orders[0].customer, store.customers[0])
    t.deepEqual(getSnapshot(store) as any, {
        customers: [{
            name: "Mattia"
        }],
        orders: [{
            customer: "../../customers/0"
        }]
    })

    console.log(JSON.stringify(recorder.actions))

    t.deepEqual(
        recorder.actions,
        [{ "name": "setCustomer", "path": "/orders/0", "args": [{ "$path": "/../../customers/0" }] }]
    )

    const store2  = createTestStore()
    recorder.replay(store2)
    t.is(store2.orders[0].customer, store2.customers[0])
    t.deepEqual(getSnapshot(store2), getSnapshot(store))
})