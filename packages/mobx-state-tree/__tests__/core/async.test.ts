import {
    types,
    addMiddleware,
    recordActions,
    flow,
    decorate,
    destroy,
    IMiddlewareHandler,
    IMiddlewareEvent,
    IMiddlewareEventType
    // TODO: export IRawActionCall
} from "../../src"
import { reaction, configure } from "mobx"

function delay(time: number, value: any, shouldThrow = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldThrow) reject(value)
            else resolve(value)
        }, time)
    })
}

function testCoffeeTodo(
    done: () => void,
    generator: any,
    shouldError: boolean,
    resultValue: any,
    producedCoffees: any[]
) {
    configure({ enforceActions: true })
    const Todo = types
        .model({
            title: "get coffee"
        })
        .actions(self => ({
            startFetch: flow(generator(self)) as (str: string) => Promise<string>
        }))
    const events: IMiddlewareEvent[] = []
    const coffees: any[] = []
    const t1 = Todo.create({})
    addMiddleware(t1, (c, next) => {
        events.push(c)
        return next(c)
    })
    reaction(() => t1.title, coffee => coffees.push(coffee))
    function handleResult(res: any) {
        expect(res).toBe(resultValue)
        expect(coffees).toEqual(producedCoffees)
        const filtered = filterRelevantStuff(events)
        expect(filtered).toMatchSnapshot()
        configure({ enforceActions: false })
        done()
    }
    t1.startFetch("black").then(
        r => {
            expect(shouldError).toBe(false)
            handleResult(r)
        },
        r => {
            expect(shouldError).toBe(true)
            handleResult(r)
        }
    )
}
test("flow happens in single ticks", done => {
    const X = types
        .model({
            y: 1
        })
        .actions(self => ({
            p: flow(function*() {
                self.y++
                self.y++
                yield delay(1, true, false)
                self.y++
                self.y++
            })
        }))
    const x = X.create()
    const values: number[] = []
    reaction(() => x.y, v => values.push(v))
    x.p().then(() => {
        expect(x.y).toBe(5)
        expect(values).toEqual([3, 5])
        done()
    })
})
test("can handle async actions", done => {
    testCoffeeTodo(
        done,
        (self: any) =>
            function* fetchData(kind: string) {
                self.title = "getting coffee " + kind
                self.title = yield delay(100, "drinking coffee")
                return "awake"
            },
        false,
        "awake",
        ["getting coffee black", "drinking coffee"]
    )
})
test("can handle erroring actions", done => {
    testCoffeeTodo(
        done,
        (self: any) =>
            function* fetchData(kind: string): IterableIterator<any> {
                throw kind
            },
        true,
        "black",
        []
    )
})
test("can handle try catch", t => {
    testCoffeeTodo(
        t,
        (self: any) =>
            function* fetchData(kind: string): IterableIterator<any> {
                try {
                    yield delay(10, "tea", true)
                } catch (e) {
                    self.title = e
                    return "biscuit"
                }
            },
        false,
        "biscuit",
        ["tea"]
    )
})
test("empty sequence works", t => {
    testCoffeeTodo(
        t,
        (self: any) => function* fetchData(kind: string): IterableIterator<any> {},
        false,
        undefined,
        []
    )
})
test("can handle throw from yielded promise works", t => {
    testCoffeeTodo(
        t,
        (self: any) =>
            function* fetchData(kind: string): IterableIterator<any> {
                yield delay(10, "x", true)
            },
        true,
        "x",
        []
    )
})
test("typings", done => {
    const M = types.model({ title: types.string }).actions(self => {
        function* a(x: string) {
            yield delay(10, "x", false)
            self.title = "7"
            return 23
        }
        // tslint:disable-next-line:no-shadowed-variable
        const b = flow(function* b(x: string) {
            yield delay(10, "x", false)
            self.title = "7"
            return 24
        })
        return { a: flow(a), b }
    })
    const m1 = M.create({ title: "test " })
    const resA = m1.a("z") // Arg typings are correct. TODO: Result is correctly promise, but incorrect generic arg
    const resB = m1.b("z") // Arg typings are correct, TODO: Result is correctly promise, but incorrect generic arg
    Promise.all([resA, resB]).then(([x1, x2]) => {
        expect(x1).toBe(23)
        expect(x2).toBe(24)
        done()
    })
})
test("typings", done => {
    const M = types.model({ title: types.string }).actions(self => {
        function* a(x: string) {
            yield delay(10, "x", false)
            self.title = "7"
            return 23
        }
        // tslint:disable-next-line:no-shadowed-variable
        const b = flow(function* b(x: string) {
            yield delay(10, "x", false)
            self.title = "7"
            return 24
        })
        return { a: flow(a), b }
    })
    const m1 = M.create({ title: "test " })
    const resA = m1.a("z") // Arg typings are correct. TODO: Result is correctly promise, but incorrect generic arg
    const resB = m1.b("z") // Arg typings are correct, TODO: Result is correctly promise, but incorrect generic arg
    Promise.all([resA, resB]).then(([x1, x2]) => {
        expect(x1).toBe(23)
        expect(x2).toBe(24)
        done()
    })
})
test("recordActions should only emit invocation", done => {
    let calls = 0
    const M = types
        .model({
            title: types.string
        })
        .actions(self => {
            function* a(x: string) {
                yield delay(10, "x", false)
                calls++
                return 23
            }
            return {
                a: flow(a)
            }
        })
    const m1 = M.create({ title: "test " })
    const recorder = recordActions(m1)
    m1.a("x").then(() => {
        recorder.stop()
        expect(recorder.actions).toEqual([
            {
                args: ["x"],
                name: "a",
                path: ""
            }
        ])
        expect(calls).toBe(1)
        recorder.replay(m1)
        setTimeout(() => {
            expect(calls).toBe(2)
            done()
        }, 50)
    })
})
test("can handle nested async actions", t => {
    // tslint:disable-next-line:no-shadowed-variable
    const uppercase = flow(function* uppercase(value: string) {
        const res = yield delay(20, value.toUpperCase())
        return res
    })
    testCoffeeTodo(
        t,
        (self: any) =>
            function* fetchData(kind: string) {
                self.title = yield uppercase("drinking " + kind)
                return self.title
            },
        false,
        "DRINKING BLACK",
        ["DRINKING BLACK"]
    )
})
test("can handle nested async actions when using decorate", done => {
    const events: [IMiddlewareEventType, string][] = []
    const middleware: IMiddlewareHandler = (call, next) => {
        events.push([call.type, call.name])
        return next(call)
    }
    // tslint:disable-next-line:no-shadowed-variable
    const uppercase = flow(function* uppercase(value: string) {
        const res = yield delay(20, value.toUpperCase())
        return res
    })
    const Todo = types.model({}).actions(self => {
        // tslint:disable-next-line:no-shadowed-variable
        const act = flow(function* act(value: string) {
            return yield uppercase(value)
        })
        return { act: decorate(middleware, act) }
    })
    Todo.create()
        .act("x")
        .then(res => {
            expect(res).toBe("X")
            expect(events).toEqual([
                ["action", "act"],
                ["flow_spawn", "act"],
                ["flow_resume", "act"],
                ["flow_resume", "act"],
                ["flow_return", "act"]
            ])
            done()
        })
})

test("flow gain back control when node become not alive during yield", async () => {
    expect.assertions(2)
    const rejectError = new Error("Reject Error")
    const MyModel = types.model({}).actions(() => {
        return {
            doAction() {
                return flow<void>(function*() {
                    try {
                        yield delay(20, "").then(() => Promise.reject(rejectError))
                    } catch (e) {
                        expect(e).toEqual(rejectError)
                        throw e
                    }
                })()
            }
        }
    })

    const m = MyModel.create({})
    const p = m.doAction()
    destroy(m)
    try {
        await p
    } catch (e) {
        expect(e).toEqual(rejectError)
    }
})

function filterRelevantStuff(stuff: any) {
    return stuff.map((x: any) => {
        delete x.context
        delete x.tree
        return x
    })
}
