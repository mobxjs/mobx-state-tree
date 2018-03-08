import { types, getSnapshot, recordPatches, unprotect } from "../src"
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
test("Properties should be readable and writable", () => {
    const i = Todo.create()
    expect(i.state instanceof Promise).toBe(true)
    i.reload()
    expect(i.state instanceof Promise).toBe(true)
})
test("VS should not show up in snapshots", () => {
    expect(getSnapshot(Todo.create())).toEqual({ done: false })
})
test("VS should not show up in patches", () => {
    const i = Todo.create()
    const r = recordPatches(i)
    i.reload()
    i.toggle()
    r.stop()
    expect(r.patches).toEqual([{ op: "replace", path: "/done", value: true }])
})
test("VS be observable", () => {
    const promises = []
    const i = Todo.create()
    const d = reaction(() => i.state, p => promises.push(p))
    i.reload()
    i.reload()
    expect(promises.length).toBe(2)
    d()
})
test("VS should not be deeply observable", () => {
    const i = types
        .model({})
        .volatile(self => ({
            x: { a: 1 }
        }))
        .create()
    unprotect(i)
    expect(isObservable(i, "x")).toBe(true)
    expect(isObservable(i.x)).toBe(false)
    expect(isObservable(i.x, "a")).toBe(false)
    i.x = { a: 2 }
    expect(isObservable(i, "x")).toBe(true)
    expect(isObservable(i.x)).toBe(false)
    expect(isObservable(i.x, "a")).toBe(false)
})
test("VS should not be strongly typed observable", () => {
    const i = Todo.create()
    // TEST: type error i.state = 7
    i.state.then(() => {}) // it's a promise
    // TEST: not available on snapshot: getSnapshot(i).state
    expect(true).toBe(true)
})
test("VS should not be modifiable without action", () => {
    const i = Todo.create()
    expect(() => {
        i.state = Promise.resolve(4)
    }).toThrowError(/the object is protected and can only be modified by using an action/)
})
test("VS should not be modifiable when unprotected", () => {
    const i = Todo.create()
    unprotect(i)
    const p = Promise.resolve(7)
    expect(() => {
        i.state = p
    }).not.toThrow()
    expect(i.state === p).toBe(true)
})
