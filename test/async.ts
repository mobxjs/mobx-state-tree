import {
    unprotect,
    types,
    addMiddleware,
    recordActions
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
    generator,
    shouldError: boolean,
    resultValue: any,
    producedCoffees: string[],
    expectedEvents: any[]
) {
    const Todo = types.model({
        title: "get coffee"
    })
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
        t.deepEqual(filterRelevantStuff(events), expectedEvents)
        t.end()
    }
    t1.fetchData("black").then(
        r => {
            t.is(shouldError, false, "Ended up in OK handler")
            handleResult(r)
        },
        r => {
            t.is(shouldError, true, "Ended up in ERROR handler")
            handleResult(r)
        }
    )
}
test.cb("can handle async actions", t => {
    testCoffeeTodo(
        t,
        function* fetchData(this: any, kind: string) {
            this.title = "getting coffee " + kind
            this.title = yield delay(100, "drinking coffee")
            return "awake"
        },
        false,
        "awake",
        ["getting coffee black", "drinking coffee"],
        [
            {
                args: ["black"],
                asyncId: 1,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: ["drinking coffee"],
                asyncId: 1,
                asyncMode: "yield",
                name: "fetchData"
            },
            {
                args: ["awake"],
                asyncId: 1,
                asyncMode: "return",
                name: "fetchData"
            }
        ]
    )
})
test.cb("can handle erroring actions", t => {
    testCoffeeTodo(
        t,
        function* fetchData(this: any, kind: string) {
            throw kind
        },
        true,
        "black",
        [],
        [
            {
                args: ["black"],
                asyncId: 2,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: ["black"],
                asyncId: 2,
                asyncMode: "throw",
                name: "fetchData"
            }
        ]
    )
})
test.cb("can handle try catch", t => {
    testCoffeeTodo(
        t,
        function* fetchData(this: any, kind: string) {
            try {
                yield delay(10, "tea", true)
            } catch (e) {
                this.title = e
                return "biscuit"
            }
        },
        false,
        "biscuit",
        ["tea"],
        [
            {
                args: ["black"],
                asyncId: 3,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: ["tea"],
                asyncId: 3,
                asyncMode: "yieldError",
                name: "fetchData"
            },
            {
                args: ["biscuit"],
                asyncId: 3,
                asyncMode: "return",
                name: "fetchData"
            }
        ]
    )
})
test.cb("empty sequence works", t => {
    testCoffeeTodo(
        t,
        function* fetchData(this: any, kind: string) {},
        false,
        undefined,
        [],
        [
            {
                args: ["black"],
                asyncId: 4,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: [undefined],
                asyncId: 4,
                asyncMode: "return",
                name: "fetchData"
            }
        ]
    )
})
test.cb("can handle throw from yielded promise works", t => {
    testCoffeeTodo(
        t,
        function* fetchData(this: any, kind: string) {
            yield delay(10, "x", true)
        },
        true,
        "x",
        [],
        [
            {
                args: ["black"],
                asyncId: 5,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: ["x"],
                asyncId: 5,
                asyncMode: "yieldError",
                name: "fetchData"
            },
            {
                args: ["x"],
                asyncId: 5,
                asyncMode: "throw",
                name: "fetchData"
            }
        ]
    )
})
test.cb.skip("'async' works", t => {
    testCoffeeTodo(
        t,
        /* TODO: see #273 async*/ function* fetchData(this: any, kind: string) {
            return (this.title = yield delay(10, "test", false))
        },
        false,
        "test",
        ["test"],
        [
            {
                args: ["black"],
                asyncId: 6,
                asyncMode: "invoke",
                name: "fetchData"
            },
            {
                args: ["test"],
                asyncId: 6,
                asyncMode: "yield",
                name: "fetchData"
            },
            {
                args: ["test"],
                asyncId: 6,
                asyncMode: "return",
                name: "fetchData"
            }
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
            return {
                a
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
            return {
                a
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
                a
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
function filterRelevantStuff(stuff: any): any {
    return stuff.map(x => {
        delete x.object
        return x
    })
}
