import { test } from "ava"
import atomic from "../src/atomic"
import { types, addMiddleware, getSnapshot } from "mobx-state-tree"

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
function nextNoAlter(call, next) {
    next(call)
}
function nextAlter(call, next, abort) {
    next(call, value => value + 1)
}
function nextAlter2(call, next, abort) {
    next(call, value => value + 2)
}

function noHooksMiddleware(call, next, abort) {
    // thowing errors will lead to the aborting of further middlewares
    // => don't throw here but set a global var instead
    if (call.name === "postProcessSnapshot") error = Error("hook in middleware")
    next(call)
}
function shouldNeverBeInvoked(call, next, abort) {
    error = Error("customMiddleware called even though the queue was aborted")
    next(call)
}

const TestModel = types
    .model("Test1", {
        z: 1
    })
    .actions(self => {
        return {
            inc(x) {
                self.z += x
                return self.z
            },
            postProcessSnapshot(snapshot) {
                return snapshot
            }
        }
    })

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
    test.only("abort() and next() invoked within middleware", t => {
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

test("next() middleware queue ", t => {
    const m = TestModel.create()
    addMiddleware(m, nextNoAlter) // no alterations
    const valueFromMiddleware: any = m.inc(1)
    t.is(valueFromMiddleware, 2)
})

test("next() middleware queue and alter the action value", t => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation + 1
    addMiddleware(m, nextAlter2) // contains another manipulation + 2
    const valueFromMiddleware: any = m.inc(1) // value should be 2(inc) + all the maniuplations = 5
    t.is(valueFromMiddleware, 5)
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
    error = null
    const m = TestModel.create()
    addMiddleware(m, nextAlter) // contains the manipulation
    addMiddleware(m, abortNumeric) // does abort with numeric

    const valueFromMiddleware: any = m.inc(1)
    t.is(valueFromMiddleware, 6)
})

test("middleware should be invoked on hooks", t => {
    error = null
    const m = TestModel.create()
    addMiddleware(m, noHooksMiddleware, true)
    m.inc(1)
    t.is(!!error, true)
})

test("middleware should not be invoked on hooks", t => {
    const m = TestModel.create()
    error = null
    addMiddleware(m, noHooksMiddleware, false)
    m.inc(1)
    t.is(!error, true)
})
