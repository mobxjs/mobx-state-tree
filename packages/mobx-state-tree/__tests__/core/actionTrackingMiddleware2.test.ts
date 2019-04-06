import {
    addMiddleware,
    createActionTrackingMiddleware2,
    types,
    flow,
    IActionTrackingMiddleware2Call
} from "../../src"

function createTestMiddleware(m: any, actionName: string, value: number, calls: string[]) {
    function checkCall(call: IActionTrackingMiddleware2Call<any>) {
        expect(call.name).toBe(actionName)
        expect(call.args).toEqual([value])
        expect(call.context).toBe(m)
        expect(call.env).toBe(call.id)
    }

    const mware = createActionTrackingMiddleware2({
        filter(call) {
            return call.name === actionName
        },
        onStart(call) {
            call.env = call.id // just to check env is copied properly down
            calls.push(`${call.name} (${call.id}) - onStart`)
            checkCall(call)
        },
        onFinish(call, error) {
            calls.push(`${call.name} (${call.id}) - onFinish (error: ${!!error})`)
            checkCall(call)
        }
    })

    addMiddleware(m, mware, false)
}

async function doTest(m: any, mode: "success" | "fail") {
    const calls: string[] = []

    createTestMiddleware(m, "setX", 10, calls)
    createTestMiddleware(m, "setY", 9, calls)

    try {
        await m.setZ(8) // -> setY(9) -> setX(10)
        if (mode === "fail") {
            fail("should have failed")
        }
    } catch (e) {
        if (mode === "fail") {
            expect(e).toBe("error")
        } else {
            throw e
            // fail("should have succeeded")
        }
    }

    return calls
}

async function syncTest(mode: "success" | "fail") {
    const M = types
        .model({
            x: 1,
            y: 2,
            z: 3
        })
        .actions(self => ({
            setX(v: number) {
                self.x = v
                if (mode === "fail") {
                    throw "error"
                }
            },
            setY(v: number) {
                self.y = v
                this.setX(v + 1)
            },
            setZ(v: number) {
                self.z = v
                this.setY(v + 1)
            }
        }))

    const m = M.create()

    const calls = await doTest(m, mode)

    if (mode === "success") {
        expect(calls).toEqual([
            "setY (2) - onStart",
            "setX (3) - onStart",
            "setX (3) - onFinish (error: false)",
            "setY (2) - onFinish (error: false)"
        ])
    } else {
        expect(calls).toEqual([
            "setY (5) - onStart",
            "setX (6) - onStart",
            "setX (6) - onFinish (error: true)",
            "setY (5) - onFinish (error: true)"
        ])
    }
}

test("sync action", async () => {
    await syncTest("success")
    await syncTest("fail")
})

async function flowTest(mode: "success" | "fail") {
    const _subFlow = flow(function* subFlow() {
        yield Promise.resolve()
    })

    const M = types
        .model({
            x: 1,
            y: 2,
            z: 3
        })
        .actions(self => ({
            setX: flow(function* flowSetX(v: number) {
                yield Promise.resolve()
                yield _subFlow()
                self.x = v
                if (mode === "fail") {
                    throw "error"
                }
            }),
            setY: flow(function* flowSetY(v: number) {
                self.y = v
                yield (self as any).setX(v + 1)
            }),
            setZ: flow(function* flowSetZ(v: number) {
                self.z = v
                yield (self as any).setY(v + 1)
            })
        }))

    const m = M.create()

    const calls = await doTest(m, mode)

    if (mode === "success") {
        expect(calls).toEqual([
            "setY (9) - onStart",
            "setX (11) - onStart",
            "setX (11) - onFinish (error: false)",
            "setY (9) - onFinish (error: false)"
        ])
    } else {
        expect(calls).toEqual([
            "setY (16) - onStart",
            "setX (18) - onStart",
            "setX (18) - onFinish (error: true)",
            "setY (16) - onFinish (error: true)"
        ])
    }
}

test("flow action", async () => {
    await flowTest("success")
    await flowTest("fail")
})

test("#1250 - without decorate", async () => {
    const M = types
        .model({
            x: 0,
            y: 0
        })
        .actions(self => ({
            setX: flow(function*() {
                self.x = 10
                yield new Promise(resolve => setTimeout(resolve, 1000))
            }),
            setY() {
                self.y = 10
            }
        }))

    const calls: string[] = []
    const mware = createActionTrackingMiddleware2({
        filter(call) {
            calls.push(
                `${call.name} (${call.id}) <- (${call.parentCall && call.parentCall.id}) - filter`
            )
            return true
        },
        onStart(call) {
            calls.push(
                `${call.name} (${call.id}) <- (${call.parentCall && call.parentCall.id}) - onStart`
            )
        },
        onFinish(call, error) {
            calls.push(
                `${call.name} (${call.id}) <- (${call.parentCall &&
                    call.parentCall.id}) - onFinish (error: ${!!error})`
            )
        }
    })

    const model = M.create({})

    addMiddleware(model, mware, false)

    expect(model.x).toBe(0)
    expect(model.y).toBe(0)
    expect(calls).toEqual([])

    const p = model.setX()
    expect(model.x).toBe(10)
    expect(model.y).toBe(0)
    expect(calls).toEqual([
        "setX (21) <- (undefined) - filter",
        "setX (21) <- (undefined) - onStart"
    ])
    calls.length = 0

    await new Promise(r =>
        setTimeout(() => {
            model.setY()
            r()
        }, 500)
    )
    expect(model.x).toBe(10)
    expect(model.y).toBe(10)
    expect(calls).toEqual([
        "setY (23) <- (undefined) - filter",
        "setY (23) <- (undefined) - onStart",
        "setY (23) <- (undefined) - onFinish (error: false)"
    ])
    calls.length = 0

    await p
    expect(model.x).toBe(10)
    expect(model.y).toBe(10)
    expect(calls).toEqual(["setX (21) <- (undefined) - onFinish (error: false)"])
    calls.length = 0
})
