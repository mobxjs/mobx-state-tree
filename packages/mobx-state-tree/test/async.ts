import {
    unprotect,
    types,
    addMiddleware,
    recordActions,
    process,
    decorate
    // TODO: export IRawActionCall
} from "../src"
import { test, CallbackTestContext, Context } from "ava"
import { reaction } from "mobx"

function delay<T>(time: number, value: T, shouldThrow = false): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldThrow) reject(value)
            else resolve(value)
        }, time)
    })
}

function testCoffeeTodo(
    t: CallbackTestContext & Context<any>,
    generator: (self: any) => (x: string) => IterableIterator<any>,
    shouldError: boolean,
    resultValue: any,
    producedCoffees: string[]
) {
    const Todo = types
        .model({
            title: "get coffee"
        })
        .actions(self => ({
            startFetch: process(generator(self))
        }))
    const events: any[] = []
    const coffees: string[] = []
    const t1 = Todo.create({})
    unprotect(t1)
    addMiddleware(t1, (c, next) => {
        events.push(c)
        return next(c)
    })
    reaction(() => t1.title, coffee => coffees.push(coffee))

    function handleResult(res) {
        t.is(res, resultValue)
        t.deepEqual(coffees, producedCoffees)
        const filtered = filterRelevantStuff(events)
        t.snapshot(filtered, "Wrong events, expected\n" + JSON.stringify(filtered, null, 2))
        t.end()
    }

    t1.startFetch("black").then(
        r => {
            t.is(shouldError, false, "Ended up in OK handler")
            handleResult(r)
        },
        r => {
            t.is(shouldError, true, "Ended up in ERROR handler")
            console.error(r)
            handleResult(r)
        }
    )
}

test.cb("can handle async actions", t => {
    testCoffeeTodo(
        t,
        self =>
            function* fetchData(this: any, kind: string) {
                self.title = "getting coffee " + kind
                self.title = yield delay(100, "drinking coffee")
                return "awake"
            },
        false,
        "awake",
        ["getting coffee black", "drinking coffee"]
    )
})

test.cb("can handle erroring actions", t => {
    testCoffeeTodo(
        t,
        self =>
            function* fetchData(this: any, kind: string) {
                throw kind
            },
        true,
        "black",
        []
    )
})

test.cb("can handle try catch", t => {
    testCoffeeTodo(
        t,
        self =>
            function* fetchData(this: any, kind: string) {
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

test.cb("empty sequence works", t => {
    testCoffeeTodo(t, self => function* fetchData(this: any, kind: string) {}, false, undefined, [])
})

test.cb("can handle throw from yielded promise works", t => {
    testCoffeeTodo(
        t,
        self =>
            function* fetchData(this: any, kind: string) {
                yield delay(10, "x", true)
            },
        true,
        "x",
        []
    )
})

test.cb("typings", t => {
    const M = types
        .model({
            title: types.string
        })
        .actions(self => {
            function* a(x: string) {
                yield delay(10, "x", false)
                self.title = "7"
                return 23
            }

            const b = process(function* b(x: string) {
                yield delay(10, "x", false)
                self.title = "7"
                return 24
            })

            return { a: process(a), b }
        })
    const m1 = M.create({ title: "test " })
    const resA = m1.a("z") // Arg typings are correct. TODO: Result type is incorrect; any
    const resB = m1.b("z") // Arg typings are correct, TODO: Result is correctly promise, but incorrect generic arg
    Promise.all([resA, resB]).then(([x1, x2]) => {
        t.is(x1, 23)
        t.is(x2, 24)
        t.end()
    })
})

test.cb("typings", t => {
    const M = types
        .model({
            title: types.string
        })
        .actions(self => {
            function* a(x: string) {
                yield delay(10, "x", false)
                self.title = "7"
                return 23
            }

            const b = process(function* b(x: string) {
                yield delay(10, "x", false)
                self.title = "7"
                return 24
            })

            return {
                a: process(a),
                b
            }
        })
    const m1 = M.create({ title: "test " })
    const resA = m1.a("z") // Arg typings are correct. TODO: Result type is incorrect; any
    const resB = m1.b("z") // Arg typings are correct, TODO: Result is correctly promise, but incorrect generic arg
    Promise.all([resA, resB]).then(([x1, x2]) => {
        t.is(x1, 23)
        t.is(x2, 24)
        t.end()
    })
})

test.cb("recordActions should only emit invocation", t => {
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
                a: process(a)
            }
        })
    const m1 = M.create({ title: "test " })
    const recorder = recordActions(m1)
    m1.a("x").then(() => {
        recorder.stop()
        t.deepEqual(recorder.actions, [
            {
                args: ["x"],
                name: "a",
                path: ""
            }
        ])
        t.is(calls, 1)
        recorder.replay(m1)
        setTimeout(() => {
            t.is(calls, 2)
            t.end()
        }, 50)
    })
})

test.cb("can handle nested async actions", t => {
    const uppercase = process(function* uppercase(value) {
        const res = yield delay(20, value.toUpperCase())
        return res
    })

    testCoffeeTodo(
        t,
        self =>
            function* fetchData(this: any, kind: string) {
                self.title = yield uppercase("drinking " + kind)
                return self.title
            },
        false,
        "DRINKING BLACK",
        ["DRINKING BLACK"]
    )
})

test.cb("can handle nested async actions when using decorate", t => {
    const events: [string, string][] = []

    function middleware(call, next) {
        events.push([call.type, call.name])
        return next(call)
    }

    const uppercase = process(function* uppercase(value) {
        const res = yield delay(20, value.toUpperCase())
        return res
    })

    const Todo = types.model({}).actions(self => {
        const act = process(function* act(value) {
            return yield uppercase(value)
        })

        return {
            act: decorate(middleware, act)
        }
    })

    Todo.create()
        .act("x")
        .then(res => {
            t.is(res, "X")
            t.deepEqual(events, [
                ["action", "act"],
                ["process_spawn", "act"],
                ["process_resume", "act"],
                ["process_resume", "act"],
                ["process_return", "act"]
            ])
            t.end()
        })
})

function filterRelevantStuff(stuff: any): any {
    return stuff.map(x => {
        delete x.context
        delete x.tree
        return x
    })
}
