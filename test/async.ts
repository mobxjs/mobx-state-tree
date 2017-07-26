import {
    unprotect,
    types,
    addMiddleware
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
    const Todo = types.model(
        {
            title: "get coffee"
        },
        {
            fetchData: generator
        }
    )

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
                asyncMode: "start",
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
                asyncMode: "done",
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
                asyncMode: "start",
                name: "fetchData"
            },
            {
                args: ["black"],
                asyncId: 2,
                asyncMode: "error",
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
                asyncMode: "start",
                name: "fetchData"
            },
            {
                args: ["tea"],
                asyncId: 3,
                asyncMode: "yield",
                name: "fetchData"
            },
            {
                args: ["biscuit"],
                asyncId: 3,
                asyncMode: "done",
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
                asyncMode: "start",
                name: "fetchData"
            },
            {
                args: [undefined],
                asyncId: 4,
                asyncMode: "done",
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
                asyncMode: "start",
                name: "fetchData"
            },
            {
                args: ["x"], // note, exceptions are yielded back to the generator first
                asyncId: 5,
                asyncMode: "yield",
                name: "fetchData"
            },
            {
                args: ["x"],
                asyncId: 5,
                asyncMode: "error",
                name: "fetchData"
            }
        ]
    )
})

function filterRelevantStuff(stuff: any): any {
    return stuff.map(x => {
        delete x.object
        return x
    })
}
