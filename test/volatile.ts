import { types, getSnapshot, applySnapshot, unprotect } from "../src"
import { test } from "ava"

test("it should support volatiles", t => {
    const Todo = types.model(
        {
            x: 3
        },
        {
            y: 7
        },
        {}
    )
    t.is(Todo.create().y, 7)
    t.is(Todo.is({ x: 3, y: 2 }), false)
    t.throws(
        () => Todo.create({ y: 2 } as any),
        /volatile state should not be provided in the snapshot/i
    )
    const x = Todo.create()
    t.throws(
        () =>
            applySnapshot(x, {
                y: 3
            }),
        /volatile state should not be provided in the snapshot/i
    )
    unprotect(x)
    x.y = 7
    t.is(x.y, 7)
    applySnapshot(x, { x: 2 })
    t.is(x.y, 7)
    t.deepEqual(getSnapshot(x), { x: 2 })
})

test("should warn about non primitive props should survive reconciliation", t => {
    t.throws(
        () => types.model({ id: types.identifier() }, { buf: {} }, {}),
        /Please provide an initializer/
    )
})

test("volatiles should survive reconciliation", t => {
    const a = new ArrayBuffer(10)

    const Todo = types.model(
        {
            id: types.identifier(),
            x: 3
        },
        {
            buf: function() {
                t.is(this.x, 3)
                return new ArrayBuffer(7)
            }
        },
        {
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

    t.throws(() => (s.todos[0].buf = a), /Cannot modify/)

    s.todos[0].setBuffer(a)
    t.is(s.todos[0].buf, a)

    applySnapshot(s, { todos: [{ id: "2" }, { id: "3" }, { id: "1" }] })
    t.is(s.todos[2].buf, a)
})
