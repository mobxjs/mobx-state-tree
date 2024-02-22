import {
  addMiddleware,
  createActionTrackingMiddleware2,
  types,
  flow,
  IActionTrackingMiddleware2Call
} from "../../src"

import { expect, it, test } from "bun:test"

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
    .actions((self) => ({
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

/**
 * This test checks that the middleware is called and
 */
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
    .actions((self) => ({
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

test("#1250", async () => {
  const M = types
    .model({
      x: 0,
      y: 0
    })
    .actions((self) => ({
      setX: flow(function* () {
        self.x = 10
        yield new Promise((resolve) => setTimeout(resolve, 10))
      }),
      setY() {
        self.y = 10
      }
    }))

  const calls: string[] = []
  const mware = createActionTrackingMiddleware2({
    filter(call) {
      calls.push(`${call.name} (${call.id}) <- (${call.parentCall && call.parentCall.id}) - filter`)
      return true
    },
    onStart(call) {
      calls.push(
        `${call.name} (${call.id}) <- (${call.parentCall && call.parentCall.id}) - onStart`
      )
    },
    onFinish(call, error) {
      calls.push(
        `${call.name} (${call.id}) <- (${
          call.parentCall && call.parentCall.id
        }) - onFinish (error: ${!!error})`
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
  expect(calls).toEqual(["setX (21) <- (undefined) - filter", "setX (21) <- (undefined) - onStart"])
  calls.length = 0

  await new Promise<void>((r) =>
    setTimeout(() => {
      model.setY()
      r()
    }, 5)
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

/**
 * Test that when createActionTrackingMiddleware2 is called with valid hooks and a synchronous action, it runs onStart and onFinish hooks.
 */
test("successful execution", () => {
  const M = types.model({}).actions((self) => ({
    test() {}
  }))

  const calls: string[] = []

  const mware = createActionTrackingMiddleware2({
    filter(call) {
      calls.push(`${call.name} - filter`)
      return true
    },
    onStart(call) {
      calls.push(`${call.name} - onStart`)
    },
    onFinish(call, error) {
      calls.push(`${call.name} - onFinish (error: ${!!error})`)
    }
  })

  const model = M.create({})
  addMiddleware(model, mware, false)

  model.test()

  expect(calls).toEqual(["test - filter", "test - onStart", "test - onFinish (error: false)"])
})

/**
 * Test that when createActionTrackingMiddleware2 is called with valid hooks and an asynchronous action, it runs onStart and onFinish hooks.
 */
test("successful execution with async action", async () => {
  const M = types.model({}).actions((self) => ({
    async test() {}
  }))

  const calls: string[] = []

  const mware = createActionTrackingMiddleware2({
    filter(call) {
      calls.push(`${call.name} - filter`)
      return true
    },
    onStart(call) {
      calls.push(`${call.name} - onStart`)
    },
    onFinish(call, error) {
      calls.push(`${call.name} - onFinish (error: ${!!error})`)
    }
  })

  const model = M.create({})
  addMiddleware(model, mware, false)

  await model.test()

  expect(calls).toEqual(["test - filter", "test - onStart", "test - onFinish (error: false)"])
})

/**
 * Test that when the filter returns true, the action is tracked. We check
 * this by checking that the onStart and onFinish hooks are called for `runThisOne`,
 * which is the name provided to the `filter` function.
 */
it("calls onStart and onFinish hooks for actions that pass the filter", () => {
  const M2 = types.model({}).actions((self) => ({
    trackThisOne() {},
    doNotTrackThisOne() {}
  }))

  const calls: string[] = []

  const mware2 = createActionTrackingMiddleware2({
    filter(call) {
      return call.name === "trackThisOne"
    },
    onStart(call) {
      calls.push(`${call.name} - onStart`)
    },
    onFinish(call, error) {
      calls.push(`${call.name} - onFinish (error: ${!!error})`)
    }
  })

  const model2 = M2.create({})
  addMiddleware(model2, mware2, false)

  model2.trackThisOne()
  // We call this action to prove that it is not tracked since it fails - there's also a test for this below.
  model2.doNotTrackThisOne()

  expect(calls).toEqual(["trackThisOne - onStart", "trackThisOne - onFinish (error: false)"])
})
/**
 * Test that when the filter returns false, the action is not tracked. We check
 * this by checking that the onStart and onFinish hooks are not called for `doNotTrackThisOne`,
 */
it("does not call onStart and onFinish hooks for actions that do not pass the filter", () => {
  const M = types.model({}).actions((self) => ({
    trackThisOne() {},
    doNotTrackThisOne() {}
  }))

  const calls: string[] = []

  const mware = createActionTrackingMiddleware2({
    filter(call) {
      return call.name === "trackThisOne"
    },
    onStart(call) {
      calls.push(`${call.name} - onStart`)
    },
    onFinish(call, error) {
      calls.push(`${call.name} - onFinish (error: ${!!error})`)
    }
  })

  const model = M.create({})
  addMiddleware(model, mware, false)

  model.doNotTrackThisOne()

  expect(calls).toEqual([])
})

/**
 * Test that parent actions and child actions have the expected order of operations -
 * if we had an action `a` that called an action `b1`, then `b2` inside `a`, the flow would be:
 *
 * - `filter(a)`
 * - `onStart(a)`
 *  - `filter(b1)`
 *  - `onStart(b1)`
 *  - `onFinish(b1)`
 *  - `filter(b2)`
 *  - `onStart(b2)`
 *  - `onFinish(b2)`
 * - `onFinish(a)`
 *
 * See https://mobx-state-tree.js.org/API/#createactiontrackingmiddleware2
 */
test("complete in the expected recursive order", () => {
  const M = types
    .model({})
    .actions((self) => ({
      childAction1() {},
      childAction2() {}
    }))
    .actions((self) => ({
      parentAction() {
        self.childAction1()
        self.childAction2()
      }
    }))

  const calls: string[] = []

  const mware = createActionTrackingMiddleware2({
    filter(call) {
      calls.push(`${call.name} - filter`)
      return true
    },
    onStart(call) {
      calls.push(`${call.name} - onStart`)
    },
    onFinish(call, error) {
      calls.push(`${call.name} - onFinish (error: ${!!error})`)
    }
  })

  const model = M.create({})
  addMiddleware(model, mware, false)

  model.parentAction()

  expect(calls).toEqual([
    "parentAction - filter",
    "parentAction - onStart",
    "childAction1 - filter",
    "childAction1 - onStart",
    "childAction1 - onFinish (error: false)",
    "childAction2 - filter",
    "childAction2 - onStart",
    "childAction2 - onFinish (error: false)",
    "parentAction - onFinish (error: false)"
  ])
})
