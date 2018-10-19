import { decorate, types, addMiddleware, flow, destroy, IMiddlewareHandler } from "mobx-state-tree"

let error: any = null

const omitNextAbort: IMiddlewareHandler = (call, next) => {
    // omit next() / abort()
}
const nextAndAbort: IMiddlewareHandler = (call, next, abort) => {
    abort("someValue")
    next(call)
}

const abortString: IMiddlewareHandler = (call, next, abort) => {
    abort("someValue")
}
const abortNumeric: IMiddlewareHandler = (call, next, abort) => {
    abort(5)
}
const abortPromise: IMiddlewareHandler = (call, next, abort) => {
    abort(Promise.resolve(5))
}
const nextNoAlter: IMiddlewareHandler = (call, next, abort) => {
    next(call)
}
const nextAlter: IMiddlewareHandler = (call, next, abort) => {
    next(call, value => value + 1)
}
const nextAlter2: IMiddlewareHandler = (call, next, abort) => {
    next(call, value => value + 2)
}
const alterArguments: IMiddlewareHandler = (call, next, abort) => {
    next({ ...call, args: [call.args[0].toUpperCase()] })
}
const alterArguments2: IMiddlewareHandler = (call, next, abort) => {
    // cut last char
    next({ ...call, args: [call.args[0].slice(0, -1)] })
}
const nextAlterAsync: IMiddlewareHandler = (call, next, abort) => {
    next(call, async value => (await value) + 2)
}

const noHooksMiddleware: IMiddlewareHandler = (call, next, abort) => {
    // throwing errors will lead to the aborting of further middlewares
    // => don't throw here but set a global var instead
    if (call.name === "beforeDestroy") error = Error("hook in middleware")
    next(call)
}
const shouldNeverBeInvoked: IMiddlewareHandler = (call, next, abort) => {
    error = Error("customMiddleware called even though the queue was aborted")
    next(call)
}

function delay(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const TestModel = types
    .model("Test1", {
        z: 1
    })
    .postProcessSnapshot(snapshot => {
        return snapshot
    })
    .actions(self => {
        return {
            asyncInc: flow(function*(x: number) {
                yield delay(2)
                self.z += x
                yield delay(2)
                return self.z
            }),
            asyncIncSuccess: flow(function*(x: number) {
                yield (self as any).asyncAbortedPromise() // will return a string instead of a promise.
                self.z += x
                return self.z
            }),
            asyncIncFailing: flow(function*(x: number) {
                yield (self as any).asyncAbortedString() // will return a string instead of a promise.
                self.z += x
                return self.z
            }),
            asyncAbortedString: decorate(
                abortString,
                flow(function*(x: number) {
                    // this will fail since "Only promises can be yielded" within flows.
                    yield delay(2)
                    return 205
                })
            ),
            asyncAbortedPromise: decorate(
                abortPromise,
                flow(function*(x: number) {
                    yield delay(2)
                    return 205
                })
            ),
            inc(x: number) {
                self.z += x
                return self.z
            },
            addName(name: string) {
                return name
            },
            beforeDestroy() {}
        }
    })

test("next() middleware queue ", () => {
    const m = TestModel.create()
    addMiddleware(m, nextNoAlter) // no alterations
    const valueFromMiddleware: any = m.inc(1)
    expect(valueFromMiddleware).toBe(2)
})

test("next() middleware queue and alter the call arguments", () => {
    const m = TestModel.create()
    addMiddleware(m, alterArguments)
    addMiddleware(m, alterArguments2)
    const valueFromMiddleware: any = m.addName("Freddy")
    expect(valueFromMiddleware).toBe("FREDD")
})

test("next() middleware queue and alter the action value", () => {
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation + 1
    addMiddleware(m, nextAlter2) // contains another manipulation + 2
    const valueFromMiddleware: any = m.inc(1) // value should be 2(inc) + all the maniuplations = 5
    expect(valueFromMiddleware).toBe(5)
})

test("next() middleware queue and alter the async action value", async () => {
    const m = TestModel.create()
    addMiddleware(m, nextAlterAsync) // contains another manipulation + 2
    const valueFromMiddleware: any = await m.asyncInc(1) // value should be 2(inc) + all the maniuplations = 5
    expect(valueFromMiddleware).toBe(4)
})

test("abort() middleware queue", () => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, abortString) // contains abort()
    addMiddleware(m, shouldNeverBeInvoked) // would contain next() - should never be invoked

    const valueFromMiddleware: any = m.inc(1) // the return value should be the one from the aborting middleware
    expect(valueFromMiddleware).toBe("someValue")
    expect(error).toBe(null) // make sure the cutomMiddleware4 was never invoked
})

test("abort() middleware queue and alter the abort value", () => {
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation
    addMiddleware(m, abortNumeric) // does abort with numeric

    const valueFromMiddleware: any = m.inc(1)
    expect(valueFromMiddleware).toBe(6)
})

test("next() middleware queue and alter the async action value", async () => {
    const m = TestModel.create()
    addMiddleware(m, nextAlterAsync) // + 2
    addMiddleware(m, abortPromise) // => 5
    const valueFromMiddleware: any = await m.asyncInc(1) // => 7
    expect(valueFromMiddleware).toBe(7)
})

test("abort() within nested async actions with string", async () => {
    const m = TestModel.create()
    try {
        const valueFromMiddleware: any = await m.asyncIncFailing(1) // contains 2 delays
    } catch (e) {
        // TODO: once we'd change flow to be able to yield more than just a promise
        // this test must be changed.
        expect(e).toBeTruthy()
    }
})

test("abort() within nested async actions with promise", async () => {
    const m = TestModel.create()
    const valueFromMiddleware: any = await m.asyncIncSuccess(1) // should only abort inner.
    expect(valueFromMiddleware).toBe(2)
})

test("middleware should be invoked on hooks", () => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, noHooksMiddleware)
    m.inc(1)
    destroy(m)
    expect(error).toBeTruthy()
})

test("middleware should not be invoked on hooks", () => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, noHooksMiddleware, false)
    m.inc(1)
    destroy(m)
    expect(error).toBeFalsy()
})

// These tests will leave MST in a bad state since they're throwing. Leave the at the bottom.
if (process.env.NODE_ENV === "development") {
    test("next()/ abort() omitted within middleware", () => {
        const m = TestModel.create()
        addMiddleware(m, omitNextAbort)
        let thrownError: any = null
        try {
            m.inc(1)
        } catch (e) {
            thrownError = e
        }
        expect(thrownError).toBeTruthy()
    })
}

if (process.env.NODE_ENV === "development") {
    test("abort() and next() invoked within middleware", () => {
        const m = TestModel.create()
        addMiddleware(m, nextAndAbort)
        let thrownError: any = null
        try {
            m.inc(1)
        } catch (e) {
            thrownError = e
        }
        expect(thrownError).toBeTruthy()
    })
}
