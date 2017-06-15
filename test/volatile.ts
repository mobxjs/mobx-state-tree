import { types, getSnapshot, applySnapshot, unprotect } from "../src"
import { test } from "ava"

test("it should support volatiles", t => {
    const Todo = types.model({
        x: 3,
        y: types.volatile(7)
    })

    t.is(Todo.create().y, 7)
    // t.is(Todo.is({ x: 3, y: 2 }), false)
    t.throws(() => Todo.create({ y: 2 }), /volatile values cannot be provided from snapshots/)

    const x = Todo.create()
    t.throws(
        () =>
            applySnapshot(x, {
                y: 3
            }),
        /volatile values cannot be provided from snapshots/
    )
    unprotect(x)
    x.y = 7
    t.is(x.y, 7)
    applySnapshot(x, { x: 2 })
    t.is(x.y, 7)
    t.deepEqual(getSnapshot(x), { x: 2 })
})

test.only("volatiles should survive reconciliation", t => {
    const a = new ArrayBuffer(10)

    const Todo = types.model(
        {
            id: types.identifier(),
            buf: types.volatile<ArrayBuffer>()
        },
        {
            afterCreate() {
                this.buf = new ArrayBuffer(7)
            },
            setBuffer(buf: ArrayBuffer) {
                this.buf = buf
            }
        }
    )

    const Store = types.model({
        todos: types.array(Todo)
    })

    const s = Store.create({ todos: [{ id: "1" }, { id: "2" }] })
    t.is(s.todos[0].buf instanceof ArrayBuffer, true)

    s.todos[0].setBuffer(a)
    t.is(s.todos[0].buf, a)

    applySnapshot(s, { todos: [{ id: "2" }, { id: "3" }, { id: "1 " }] })
    t.is(s.todos[2].buf, a)
})
