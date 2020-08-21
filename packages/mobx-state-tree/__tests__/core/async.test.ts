import {
    types,
    addMiddleware,
    recordActions,
    flow,
    decorate,
    destroy,
    IMiddlewareHandler,
    IMiddlewareEvent,
    IMiddlewareEventType,
    toGeneratorFunction,
    toGenerator
    // TODO: export IRawActionCall
} from "../../src"
import { reaction, configure } from "mobx"

function delay<TV>(time: number, value: TV, shouldThrow = false): Promise<TV> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldThrow) reject(value)
            else resolve(value)
        }, time)
    })
}

function testCoffeeTodo(
    done: () => void,
    generator: (
        self: any
    ) => (str: string) => Generator<Promise<any>, string | void | undefined, undefined>,
    shouldError: boolean,
    resultValue: string | undefined,
    producedCoffees: any[]
) {
    configure({ enforceActions: "observed" })
    const Todo = types
        .model({
            title: "get coffee"
        })
        .actions((self) => ({
            startFetch: flow(generator(self))
        }))
    const events: IMiddlewareEvent[] = []
    const coffees: any[] = []
    const t1 = Todo.create({})
    addMiddleware(t1, (c, next) => {
        events.push(c)
        return next(c)
    })
    reaction(
        () => t1.title,
        (coffee) => coffees.push(coffee)
    )
    function handleResult(res: string | undefined | void) {
        expect(res).toBe(resultValue)
        expect(coffees).toEqual(producedCoffees)
        const filtered = filterRelevantStuff(events)
        expect(filtered).toMatchSnapshot()
        configure({ enforceActions: "never" })
        done()
    }
    t1.startFetch("black").then(
        (r) => {
            expect(shouldError).toBe(false)
            handleResult(r)
        },
        (r) => {
            expect(shouldError).toBe(true)
            handleResult(r)
        }
    )
}
test("flow happens in single ticks", (done) => {
    const X = types
        .model({
            y: 1
        })
        .actions((self) => ({
            p: flow(function* () {
                self.y++
                self.y++
                yield delay(1, true, false)
                self.y++
                self.y++
            })
        }))
    const x = X.create()
    const values: number[] = []
    reaction(
        () => x.y,
        (v) => values.push(v)
    )
    x.p().then(() => {
        expect(x.y).toBe(5)
        expect(values).toEqual([3, 5])
        done()
    })
})
test("can handle async actions", (done) => {
    testCoffeeTodo(
        done,
        (self) =>
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
test("can handle erroring actions", (done) => {
    testCoffeeTodo(
        done,
        (self) =>
            function* fetchData(kind: string) {
                throw kind
            },
        true,
        "black",
        []
    )
})
test("can handle try catch", (t) => {
    testCoffeeTodo(
        t,
        (self) =>
            function* fetchData(kind: string) {
                try {
                    yield delay(10, "tea", true)
                    return undefined
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
test("empty sequence works", (t) => {
    testCoffeeTodo(t, () => function* fetchData(kind: string) {}, false, undefined, [])
})
test("can handle throw from yielded promise works", (t) => {
    testCoffeeTodo(
        t,
        () =>
            function* fetchData(kind: string) {
                yield delay(10, "x", true)
            },
        true,
        "x",
        []
    )
})
test("typings", (done) => {
    const M = types.model({ title: types.string }).actions((self) => {
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
    const resA = m1.a("z")
    const resB = m1.b("z")
    Promise.all([resA, resB]).then(([x1, x2]) => {
        expect(x1).toBe(23)
        expect(x2).toBe(24)
        done()
    })
})
test("typings", (done) => {
    const M = types.model({ title: types.string }).actions((self) => {
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
    const resA = m1.a("z")
    const resB = m1.b("z")
    Promise.all([resA, resB]).then(([x1, x2]) => {
        expect(x1).toBe(23)
        expect(x2).toBe(24)
        done()
    })
})
test("recordActions should only emit invocation", (done) => {
    let calls = 0
    const M = types
        .model({
            title: types.string
        })
        .actions((self) => {
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
test("can handle nested async actions", (t) => {
    // tslint:disable-next-line:no-shadowed-variable
    const uppercase = flow(function* uppercase(value: string) {
        const res = yield delay(20, value.toUpperCase())
        return res
    })
    testCoffeeTodo(
        t,
        (self) =>
            function* fetchData(kind: string) {
                self.title = yield uppercase("drinking " + kind)
                return self.title
            },
        false,
        "DRINKING BLACK",
        ["DRINKING BLACK"]
    )
})
test("can handle nested async actions when using decorate", (done) => {
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
    const Todo = types.model({}).actions((self) => {
        // tslint:disable-next-line:no-shadowed-variable
        const act = flow(function* act(value: string) {
            return yield uppercase(value)
        })
        return { act: decorate(middleware, act) }
    })
    Todo.create()
        .act("x")
        .then((res) => {
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
                return flow(function* () {
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

function filterRelevantStuff(stuff: IMiddlewareEvent[]) {
    return stuff.map((x: any) => {
        delete x.context
        delete x.tree
        return x
    })
}

test("flow typings", async () => {
    const promise = Promise.resolve()

    const M = types.model({ x: 5 }).actions((self) => ({
        // should be () => Promise<void>
        voidToVoid: flow(function* () {
            yield promise
        }), // should be (val: number) => Promise<number>
        numberToNumber: flow(function* (val: number) {
            yield promise
            return val
        }), // should be () => Promise<number>
        voidToNumber: flow(function* () {
            yield promise
            return Promise.resolve(2)
        })
    }))

    const m = M.create()

    // these should compile
    const a: void = await m.voidToVoid()
    expect(a).toBe(undefined)
    const b: number = await m.numberToNumber(4)
    expect(b).toBe(4)
    const c: number = await m.voidToNumber()
    expect(c).toBe(2)
    await m.voidToNumber().then((d) => {
        const _d: number = d
        expect(_d).toBe(2)
    })
})

/**
 * Detect explicit `any` type.
 * https://stackoverflow.com/a/55541672/4289902
 */
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

/**
 * Ensure that the type of the passed value is of the expected type, and is NOT the TypeScript `any` type
 */
function ensureNotAnyType<TExpected, TActual>(value: IfAny<TActual, never, TExpected>) {}

test("yield* typings for toGeneratorFunction", async () => {
    const voidPromise = () => Promise.resolve()
    const numberPromise = () => Promise.resolve(7)
    const stringWithArgsPromise = (input1: string, input2: boolean) =>
        Promise.resolve("test-result")

    const voidGen = toGeneratorFunction(voidPromise)
    const numberGen = toGeneratorFunction(numberPromise)
    const stringWithArgsGen = toGeneratorFunction(stringWithArgsPromise)

    const M = types.model({ x: 5 }).actions((self) => {
        function* testAction() {
            const voidResult = yield* voidGen()
            ensureNotAnyType<void, typeof voidResult>(voidResult)

            const numberResult = yield* numberGen()
            ensureNotAnyType<number, typeof numberResult>(numberResult)

            const stringResult = yield* stringWithArgsGen("input", true)
            ensureNotAnyType<string, typeof stringResult>(stringResult)

            return stringResult
        }

        return {
            testAction: flow(testAction)
        }
    })

    const m = M.create()

    const result = await m.testAction()
    ensureNotAnyType<string, typeof result>(result)
    expect(result).toBe("test-result")
})

test("yield* typings for toGenerator", async () => {
    const voidPromise = () => Promise.resolve()
    const numberPromise = () => Promise.resolve(7)
    const stringWithArgsPromise = (input1: string, input2: boolean) =>
        Promise.resolve("test-result")

    const M = types.model({ x: 5 }).actions((self) => {
        function* testAction() {
            const voidResult = yield* toGenerator(voidPromise())
            ensureNotAnyType<void, typeof voidResult>(voidResult)

            const numberResult = yield* toGenerator(numberPromise())
            ensureNotAnyType<number, typeof numberResult>(numberResult)

            const stringResult = yield* toGenerator(stringWithArgsPromise("input", true))
            ensureNotAnyType<string, typeof stringResult>(stringResult)

            return stringResult
        }

        return {
            testAction: flow(testAction)
        }
    })

    const m = M.create()

    const result = await m.testAction()
    ensureNotAnyType<string, typeof result>(result)
    expect(result).toBe("test-result")
})
