import {
    unprotect,
    types,
    addMiddleware,
    recordActions,
    process
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
    producedCoffees: string[],
    expectedEvents: any[]
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
        t.deepEqual(
            filtered,
            expectedEvents,
            "Wrong events, expected\n" + JSON.stringify(filtered, null, 2)
        )
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
        ["getting coffee black", "drinking coffee"],
        [
            { args: ["black"], id: 1, rootId: 1, type: "action", name: "startFetch" },
            { args: ["black"], id: 2, rootId: 1, type: "process_spawn", name: "fetchData" },
            {
                args: ["drinking coffee"],
                id: 2,
                rootId: 1,
                type: "process_yield",
                name: "fetchData"
            },
            { args: ["awake"], id: 2, rootId: 1, type: "process_return", name: "fetchData" }
        ]
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
        [],
        [
            { type: "action", name: "startFetch", id: 3, args: ["black"], rootId: 3 },
            { name: "fetchData", type: "process_spawn", id: 4, args: ["black"], rootId: 3 },
            { name: "fetchData", type: "process_throw", id: 4, args: ["black"], rootId: 3 }
        ]
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
        ["tea"],
        [
            { type: "action", name: "startFetch", id: 5, args: ["black"], rootId: 5 },
            { name: "fetchData", type: "process_spawn", id: 6, args: ["black"], rootId: 5 },
            { name: "fetchData", type: "process_yield_error", id: 6, args: ["tea"], rootId: 5 },
            { name: "fetchData", type: "process_return", id: 6, args: ["biscuit"], rootId: 5 }
        ]
    )
})

test.cb("empty sequence works", t => {
    testCoffeeTodo(
        t,
        self => function* fetchData(this: any, kind: string) {},
        false,
        undefined,
        [],
        [
            { type: "action", name: "startFetch", id: 7, args: ["black"], rootId: 7 },
            { name: "fetchData", type: "process_spawn", id: 8, args: ["black"], rootId: 7 },
            { name: "fetchData", type: "process_return", id: 8, args: [undefined], rootId: 7 }
        ]
    )
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
        [],
        [
            { type: "action", name: "startFetch", id: 9, args: ["black"], rootId: 9 },
            { name: "fetchData", type: "process_spawn", id: 10, args: ["black"], rootId: 9 },
            { name: "fetchData", type: "process_yield_error", id: 10, args: ["x"], rootId: 9 },
            { name: "fetchData", type: "process_throw", id: 10, args: ["x"], rootId: 9 }
        ]
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
        ["DRINKING BLACK"],
        [
            { type: "action", name: "startFetch", id: 21, args: ["black"], rootId: 21 },
            { name: "fetchData", type: "process_spawn", id: 22, args: ["black"], rootId: 21 },
            {
                name: "uppercase",
                type: "process_spawn",
                id: 23,
                args: ["drinking black"],
                rootId: 21
            },
            {
                name: "uppercase",
                type: "process_yield",
                id: 23,
                args: ["DRINKING BLACK"],
                rootId: 21
            },
            {
                name: "uppercase",
                type: "process_return",
                id: 23,
                args: ["DRINKING BLACK"],
                rootId: 21
            },
            {
                name: "fetchData",
                type: "process_yield",
                id: 22,
                args: ["DRINKING BLACK"],
                rootId: 21
            },
            {
                name: "fetchData",
                type: "process_return",
                id: 22,
                args: ["DRINKING BLACK"],
                rootId: 21
            }
        ]
    )
})

function filterRelevantStuff(stuff: any): any {
    return stuff.map(x => {
        delete x.context
        return x
    })
}
