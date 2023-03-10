import { types, getSnapshot, recordPatches, unprotect } from "../../src"
import { reaction, isObservableProp, isObservable, autorun, observable } from "mobx"

const Todo = types
    .model({
        done: false
    })
    .volatile((self) => ({
        state: Promise.resolve(1)
    }))
    .actions((self) => ({
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
    const promises: Promise<number>[] = []
    const i = Todo.create()
    const d = reaction(
        () => i.state,
        (p) => promises.push(p)
    )
    i.reload()
    i.reload()
    expect(promises.length).toBe(2)
    d()
})

test("VS should not be deeply observable", () => {
    const i = types
        .model({})
        .volatile((self) => ({
            x: { a: 1 }
        }))
        .create()
    unprotect(i)
    expect(isObservableProp(i, "x")).toBe(true)
    expect(isObservable(i.x)).toBe(false)
    expect(isObservableProp(i.x, "a")).toBe(false)
    i.x = { a: 2 }
    expect(isObservableProp(i, "x")).toBe(true)
    expect(isObservable(i.x)).toBe(false)
    expect(isObservableProp(i.x, "a")).toBe(false)
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

test("VS should expect a function as an argument", () => {
    expect(() => {
        const t = types
            .model({})
            // @ts-ignore
            .volatile({ state: 1 })
            .create()
    }).toThrowError(
        `You passed an object to volatile state as an argument, when function is expected`
    )
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

test("VS sample from the docs should work (1)", () => {
    const T = types.model({}).extend((self) => {
        const localState = observable.box(3)

        return {
            views: {
                get x() {
                    return localState.get()
                }
            },
            actions: {
                setX(value: number) {
                    localState.set(value)
                }
            }
        }
    })

    const t = T.create()
    expect(t.x).toBe(3)
    t.setX(5)
    expect(t.x).toBe(5)

    // now observe it
    const observed: number[] = []
    const dispose = autorun(() => {
        observed.push(t.x)
    })

    t.setX(7)
    expect(t.x).toBe(7)
    expect(observed).toEqual([5, 7])
    dispose()
})

test("VS sample from the docs should work (2)", () => {
    const T = types.model({}).extend((self) => {
        let localState = 3

        return {
            views: {
                getX() {
                    return localState
                }
            },
            actions: {
                setX(value: number) {
                    localState = value
                }
            }
        }
    })

    const t = T.create()
    expect(t.getX()).toBe(3)
    t.setX(5)
    expect(t.getX()).toBe(5)

    // now observe it (should not be observable)
    const observed: number[] = []
    const dispose = autorun(() => {
        observed.push(t.getX())
    })

    t.setX(7)
    expect(t.getX()).toBe(7)
    expect(observed).toEqual([5])
    dispose()
})
