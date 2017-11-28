import { types, getSnapshot, recordPatches, unprotect } from "../src"
import { test } from "ava"
import { reaction, isObservable } from "mobx"

const Todo = types
    .model({
        done: false
    })
    .volatile(self => ({
        state: Promise.resolve(1)
    }))
    .actions(self => ({
        toggle() {
            self.done = !self.done
        },
        reload() {
            self.state = Promise.resolve(2)
        }
    }))

test("Properties should be readable and writable", t => {
    const i = Todo.create()
    t.true(i.state instanceof Promise)
    i.reload()
    t.true(i.state instanceof Promise)
})

test("VS should not show up in snapshots", t => {
    t.deepEqual(getSnapshot(Todo.create()), { done: false })
})

test("VS should not show up in patches", t => {
    const i = Todo.create()
    const r = recordPatches(i)

    i.reload()
    i.toggle()
    r.stop()
    t.deepEqual(r.patches, [{ op: "replace", path: "/done", value: true }])
})

test("VS be observable", t => {
    const promises: Promise<any>[] = []
    const i = Todo.create()
    const d = reaction(() => i.state, p => promises.push(p))

    i.reload()
    i.reload()

    t.is(promises.length, 2)

    d()
})

test("VS should not be deeply observable", t => {
    const i = types
        .model({})
        .volatile(self => ({
            x: { a: 1 }
        }))
        .create()
    unprotect(i)

    t.true(isObservable(i, "x"))
    t.false(isObservable(i.x))
    t.false(isObservable(i.x, "a"))

    i.x = { a: 2 }
    t.true(isObservable(i, "x"))
    t.false(isObservable(i.x))
    t.false(isObservable(i.x, "a"))
})

test("VS should not be strongly typed observable", t => {
    const i = Todo.create()
    // TEST: type error i.state = 7

    i.state.then(() => {}) // it's a promise

    // TEST: not available on snapshot: getSnapshot(i).state
    t.true(true)
})

test("VS should not be modifiable without action", t => {
    const i = Todo.create()
    t.throws(() => {
        i.state = Promise.resolve(4)
    }, /the object is protected and can only be modified by using an action/)
})

test("VS should not be modifiable when unprotected", t => {
    const i = Todo.create()
    unprotect(i)

    const p = Promise.resolve(7)
    t.notThrows(() => {
        i.state = p
    })

    t.true(i.state === p)
})
