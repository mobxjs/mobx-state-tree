import { test } from "ava"
import atomic from "../src/atomic"
import { decorate, types, addMiddleware, onSnapshot, flow } from "mobx-state-tree"

let error: any = null

function omitNextAbort(call, next) {
    // omit next() / abort()
}
function nextAndAbort(call, next, abort) {
    abort("someValue")
    next(call)
}

function abortString(call, next, abort) {
    abort("someValue")
}
function abortNumeric(call, next, abort) {
    abort(5)
}
function abortPromise(call, next, abort) {
    abort(Promise.resolve(5))
}
function nextNoAlter(call, next) {
    next(call)
}
function nextAlter(call, next, abort) {
    next(call, value => value + 1)
}
function nextAlter2(call, next, abort) {
    next(call, value => value + 2)
}
function nextAlterAsync(call, next, abort) {
    next(call, async value => (await value) + 2)
}

function noHooksMiddleware(call, next, abort) {
    // throwing errors will lead to the aborting of further middlewares
    // => don't throw here but set a global var instead
    if (call.name === "postProcessSnapshot") error = Error("hook in middleware")
    next(call)
}
function shouldNeverBeInvoked(call, next, abort) {
    error = Error("customMiddleware called even though the queue was aborted")
    next(call)
}

function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const TestModel = types
    .model("Test1", {
        z: 1
    })
    .actions(self => {
        return {
            asyncInc: flow(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                return self.z
            }),
            asyncIncSuccess: flow(function*(x) {
                yield (self as any).asyncAbortedPromise() // will return a string instead of a promise.
                self.z += x
                return self.z
            }),
            asyncIncFailing: flow(function*(x) {
                yield (self as any).asyncAbortedString() // will return a string instead of a promise.
                self.z += x
                return self.z
            }),
            asyncAbortedString: decorate(
                abortString, // this will fail since "Only promises can be yielded" within flows.
                flow(function*(x) {
                    yield delay(2)
                    return 205
                })
            ),
            asyncAbortedPromise: decorate(
                abortPromise,
                flow(function*(x) {
                    yield delay(2)
                    return 205
                })
            ),
            inc(x) {
                self.z += x
                return self.z
            },
            postProcessSnapshot(snapshot) {
                return snapshot
            }
        }
    })

test("next() middleware queue ", t => {
    const m = TestModel.create()
    addMiddleware(m, nextNoAlter) // no alterations
    const valueFromMiddleware: any = m.inc(1)
    t.is(valueFromMiddleware, 2)
})

test("next() middleware queue and alter the action value", t => {
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation + 1
    addMiddleware(m, nextAlter2) // contains another manipulation + 2
    const valueFromMiddleware: any = m.inc(1) // value should be 2(inc) + all the maniuplations = 5
    t.is(valueFromMiddleware, 5)
})

test("next() middleware queue and alter the async action value", async t => {
    const m = TestModel.create()
    addMiddleware(m, nextAlterAsync) // contains another manipulation + 2
    const valueFromMiddleware: any = await m.asyncInc(1) // value should be 2(inc) + all the maniuplations = 5
    t.is(valueFromMiddleware, 4)
})

test("abort() middleware queue", t => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, abortString) // contains abort()
    addMiddleware(m, shouldNeverBeInvoked) // would contain next() - should never be invoked

    const valueFromMiddleware: any = m.inc(1) // the return value should be the one from the aborting middleware
    t.is(valueFromMiddleware, "someValue")
    t.is(error, null) // make sure the cutomMiddleware4 was never invoked
})

test("abort() middleware queue and alter the abort value", t => {
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation
    addMiddleware(m, abortNumeric) // does abort with numeric

    const valueFromMiddleware: any = m.inc(1)
    t.is(valueFromMiddleware, 6)
})

test("next() middleware queue and alter the async action value", async t => {
    const m = TestModel.create()
    addMiddleware(m, nextAlterAsync) // + 2
    addMiddleware(m, abortPromise) // => 5
    const valueFromMiddleware: any = await m.asyncInc(1) // => 7
    t.is(valueFromMiddleware, 7)
})

test("abort() within nested async actions with string", async t => {
    const m = TestModel.create()
    try {
        const valueFromMiddleware: any = await m.asyncIncFailing(1) // contains 2 delays
    } catch (e) {
        // TODO: once we'd change flow to be able to yield more than just a promise
        // this test must be changed.
        t.is(!!e, true)
    }
})

test("abort() within nested async actions with promise", async t => {
    const m = TestModel.create()
    const valueFromMiddleware: any = await m.asyncIncSuccess(1) // should only abort inner.
    t.is(valueFromMiddleware, 2)
})

test("middleware should be invoked on hooks", t => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, noHooksMiddleware)
    m.inc(1)
    t.is(!!error, true)
})

test("middleware should not be invoked on hooks", t => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, noHooksMiddleware, false)
    m.inc(1)
    t.is(!error, true)
})

// These tests will leave MST in a bad state since they're throwing. Leave the at the bottom.
if (process.env.NODE_ENV === "development") {
    test("next()/ abort() omitted within middleware", t => {
        const m = TestModel.create()
        addMiddleware(m, omitNextAbort)
        let thrownError: any = null
        try {
            m.inc(1)
        } catch (e) {
            thrownError = e
        }
        t.is(!!thrownError, true)
    })
}

if (process.env.NODE_ENV === "development") {
    test("abort() and next() invoked within middleware", t => {
        const m = TestModel.create()
        addMiddleware(m, nextAndAbort)
        let thrownError: any = null
        try {
            m.inc(1)
        } catch (e) {
            thrownError = e
        }
        t.is(!!thrownError, true)
    })
}
