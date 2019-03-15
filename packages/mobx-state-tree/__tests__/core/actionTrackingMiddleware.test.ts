import { addMiddleware, createActionTrackingMiddleware, types } from "../../src"

function syncTest(mode: "success" | "fail") {
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

    const ctx = {}
    let startedCall: any
    const calls: string[] = []

    const middlewareX = createActionTrackingMiddleware<typeof ctx>({
        filter(call) {
            calls.push("filter " + call.name)
            return call.name === "setX"
        },
        onStart(call) {
            calls.push("onStart")
            expect(startedCall).toBeUndefined()
            startedCall = call

            const id = call.id
            expect(id).toBeGreaterThan(0)
            expect(call.allParentIds).toEqual([id - 2, id - 1])
            expect(call.rootId).toBe(id - 2)
            expect(call.parentId).toBe(id - 1)

            expect(call.name).toBe("setX")
            expect(call.args).toEqual([10])
            expect(call.context).toBe(m)
            expect(call.type).toBe("action")

            return ctx
        },
        onResume(call, context) {
            calls.push("onResume")
            expect(call).toBe(startedCall)
            expect(context).toBe(ctx)
        },
        onSuspend(call, context) {
            calls.push("onSuspend")
            expect(call).toBe(startedCall)
            expect(context).toBe(ctx)
        },
        onSuccess(call, context, result) {
            calls.push("onSuccess")
            expect(call).toBe(startedCall)
            expect(context).toBe(ctx)
            expect(result).toBe(undefined)
        },
        onFail(call, context, error) {
            calls.push("onFail")
            expect(call).toBe(startedCall)
            expect(context).toBe(ctx)
            expect(error).toBe("error")
        }
    })

    addMiddleware(m, middlewareX, false)

    try {
        m.setZ(8) // -> setY(9) -> setX(10)
        if (mode === "fail") {
            fail("should have failed")
        }
    } catch (e) {
        if (mode === "fail") {
            expect(e).toBe("error")
        } else {
            fail("should have succeeded")
        }
    }

    expect(calls).toEqual([
        "filter setZ",
        "filter setY",
        "filter setX",
        "onStart",
        "onResume",
        "onSuspend",
        mode === "success" ? "onSuccess" : "onFail"
    ])
}

test("sync action", () => {
    syncTest("success")
    syncTest("fail")
})
