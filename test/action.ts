import { recordActions, types, getSnapshot, onAction} from "../src"
import { test } from "ava"

declare var Buffer
/// Simple action replay and invocation

const Task = types.model({
    done: false
}, {
    toggle() {
        this.done = !this.done
        return this.done
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

// Complex actions
const Customer = types.model("Customer", {
    name: types.string
})

const Order = types.model("Order", {
    customer: types.reference(Customer)
}, {
    setCustomer(customer) {
        this.customer = customer
    }
})

const OrderStore = types.model("OrderStore", {
    customers: types.array(Customer),
    orders: types.array(Order)
})

function createTestStore() {
    const store = OrderStore.create({
        customers: [{ name: "Mattia" }],
        orders: [{
            customer: null
        }]
    })
    onAction(store, () => {})
    return store
}

// TODO: same here, customer is a reference.
test.skip("it should be possible to pass a complex object", t => {
    const store = createTestStore()
    const recorder = recordActions(store)

    t.is(store.customers[0].name, "Mattia")
    store.orders[0].setCustomer(store.customers[0])
    t.is(store.orders[0].customer!.name, "Mattia")
    t.is(store.orders[0].customer, store.customers[0])
    t.deepEqual(getSnapshot(store) as any, {
        customers: [{
            name: "Mattia"
        }],
        orders: [{
            customer: { $ref: "../../customers/0" }
        }]
    })

    t.deepEqual(
        recorder.actions,
        [{ "name": "setCustomer", "path": "/orders/0", "args": [{ "$ref": "../../customers/0" }] }]
    )

    const store2  = createTestStore()
    recorder.replay(store2)
    t.is(store2.orders[0].customer, store2.customers[0])
    t.deepEqual(getSnapshot(store2), getSnapshot(store))
})

// TODO: failing because customer is a reference
test.skip("it should not be possible to set the wrong type", t => {
    const store = createTestStore()

    t.throws(
        () => {
            store.orders[0].setCustomer(store.orders[0])
        }, // wrong type!
        `[mobx-state-tree] Error while converting <Order@/orders/0> to \`Customer\`:
value of type Order: <Order@/orders/0> is not assignable to type: \`Customer\`, expected an instance of \`Customer\` or a snapshot like \`{ name: string }\` instead.`
    )
})

test("it should not be possible to pass the element of another tree", t => {
    const store1 = createTestStore()
    const store2 = createTestStore()

    t.throws(
        () => {
            store1.orders[0].setCustomer(store2.customers[0])
        },
        "Argument 0 that was passed to action 'setCustomer' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead"
    )
})

test("it should not be possible to pass an unserializable object", t => {
    const store = createTestStore()
    const circular = { a: null as any }
    circular.a = circular

    t.throws(
        () => store.orders[0].setCustomer(circular),
        "Argument 0 that was passed to action 'setCustomer' is not serializable."
    )

    t.throws(
        () => store.orders[0].setCustomer(new Buffer("bla")),
        "Argument 0 that was passed to action 'setCustomer' should be a primitive, model object or plain object, received a Buffer"
    )
})

test("it should be possible to pass a complex plain object", t => {
    const t1 = Task.create()
    const t2 = Task.create()

    const recorder = recordActions(t1)

    ; (t1 as any).toggle({ bla : [ "nuff", ["said" ]]}) // nonsense, but serializable!

    t.deepEqual(recorder.actions, [
        { name: "toggle", path: "", args: [{ bla : [ "nuff", ["said" ]]}] }
    ])

    recorder.replay(t2)
    t.is(t2.done, true)
})

test("action should be bound", t => {
    const task = Task.create()
    const f = task.toggle
    t.is(f(), true)
})