import { types, flow } from "mobx-state-tree"
import { connectReduxDevtools } from "mst-middlewares/src"
import { inherits } from "util"

const waitAsync = (ms: number) => new Promise(r => setTimeout(r, ms))
const waitAsyncReject = (ms: number) =>
    new Promise((_, rej) => setTimeout(rej(new Error("thrown")), ms))

describe("redux devtools middleware", async () => {
    const M = types
        .model({
            x: 10,
            y: 20
        })
        .actions(self => ({
            afterCreate() {
                self.x = 30
            },

            setX(val: number) {
                self.x = val
            },
            setXThrow(val: number) {
                self.x = val
                throw new Error("bye")
            },
            setXAsync: flow(function*(val1: number, val2: number) {
                self.x = val1
                yield waitAsync(20)
                self.x = val2
            }),
            setXAsyncWithEmptyFirstPart: flow(function*(val1: number) {
                yield waitAsync(20)
                self.x = val1
            }),
            setXAsyncThrowSync: flow(function*(val1: number, val2: number) {
                self.x = val1
                yield waitAsync(20)
                throw new Error("bye")
                self.x = val2
            }),
            setXAsyncThrowAsync: flow(function*(val1: number, val2: number) {
                self.x = val1
                yield waitAsyncReject(20)
                self.x = val2
            }),

            setY(val: number) {
                self.y = val
            },
            setYThrow(val: number) {
                self.y = val
                throw new Error("bye2")
            },
            setYAsync: flow(function* setYAsync2(val1: number, val2: number) {
                self.y = val1
                yield waitAsync(50)
                self.y = val2
            }),
            setYAsyncThrowSync: flow(function*(val1: number, val2: number) {
                self.y = val1
                yield waitAsync(50)
                throw new Error("bye")
                self.y = val2
            }),
            setYAsyncThrowAsync: flow(function*(val1: number, val2: number) {
                self.y = val1
                yield waitAsyncReject(50)
                self.y = val2
            }),
            setXY(x: number, y: number) {
                this.setX(x)
                this.setY(y)
            }
        }))
        .actions(self => ({
            setXYAsync: flow(function*(x: number, y: number) {
                yield self.setXAsync(x / 2, x)
                yield self.setYAsync(y / 2, y)
            }),
            setXYAsyncThrowSync: flow(function*(x: number, y: number) {
                yield self.setXAsyncThrowSync(x / 2, x)
                yield self.setYAsync(y / 2, y)
            }),
            setXYAsyncThrowAsync: flow(function*(x: number, y: number) {
                yield self.setXAsyncThrowAsync(x / 2, x)
                yield self.setYAsync(y / 2, y)
            })
        }))

    let m = M.create()
    function mockDevTools() {
        return { init: jest.fn(), subscribe: jest.fn(), send: jest.fn() }
    }
    let devTools = mockDevTools()

    function initTest(skipIdempotentActionSteps: boolean) {
        devTools = mockDevTools()

        const devToolsManager = {
            connectViaExtension: () => devTools,
            extractState: jest.fn()
        }

        m = M.create()
        connectReduxDevtools(devToolsManager, m, { skipIdempotentActionSteps })
    }

    beforeEach(() => {
        initTest(true)
    })

    test("sync action", () => {
        m.setX(50)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 50,
      "type": "setX",
    },
    Object {
      "x": 50,
      "y": 20,
    },
  ],
]
`)
    })

    test("sync action - sync throw", () => {
        expect(() => m.setXThrow(70)).toThrow()
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 70,
      "type": "setXThrow (error thrown)",
    },
    Object {
      "x": 70,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action", async () => {
        await m.setXAsync(100, 200)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsync [0]",
    },
    Object {
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsync [1]",
    },
    Object {
      "x": 200,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action - sync throw", async () => {
        try {
            await m.setXAsyncThrowSync(100, 200)
            fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsyncThrowSync [0]",
    },
    Object {
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsyncThrowSync [1] (error thrown)",
    },
    Object {
      "x": 100,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action - async throw", async () => {
        try {
            await m.setXAsyncThrowAsync(100, 200)
            fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsyncThrowAsync [0]",
    },
    Object {
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsyncThrowAsync [1] (error thrown)",
    },
    Object {
      "x": 100,
      "y": 20,
    },
  ],
]
`)
    })

    test("concurrent async actions", async () => {
        // expected order is y0, x0, x1, y1 due to timeouts
        const b = m.setYAsync(1000, 2000)
        const a = m.setXAsync(100, 200)
        await Promise.all([b, a])
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 1000,
      "1": 2000,
      "type": "setYAsync [0]",
    },
    Object {
      "x": 30,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsync [0]",
    },
    Object {
      "x": 100,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "0": 100,
      "1": 200,
      "type": "setXAsync [1]",
    },
    Object {
      "x": 200,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "0": 1000,
      "1": 2000,
      "type": "setYAsync [1]",
    },
    Object {
      "x": 200,
      "y": 2000,
    },
  ],
]
`)
    })

    test("sync action with subactions", () => {
        m.setXY(500, 600)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 500,
      "type": "setXY > setX",
    },
    Object {
      "x": 500,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 600,
      "type": "setXY > setY",
    },
    Object {
      "x": 500,
      "y": 600,
    },
  ],
]
`)
    })

    test("async action with subactions", async () => {
        await m.setXYAsync(500, 600)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsync [0] > setXAsync [0]",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsync [2] > setXAsync [1]",
    },
    Object {
      "x": 500,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 300,
      "1": 600,
      "type": "setXYAsync [3] > setYAsync [0]",
    },
    Object {
      "x": 500,
      "y": 300,
    },
  ],
  Array [
    Object {
      "0": 300,
      "1": 600,
      "type": "setXYAsync [5] > setYAsync [1]",
    },
    Object {
      "x": 500,
      "y": 600,
    },
  ],
]
`)
    })

    test("async action with subactions that throw sync", async () => {
        try {
            await m.setXYAsyncThrowSync(500, 600)
            fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsyncThrowSync [0] > setXAsyncThrowSync [0]",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsyncThrowSync [2] > setXAsyncThrowSync [1] (error thrown)",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 500,
      "1": 600,
      "type": "setXYAsyncThrowSync [3] (error thrown)",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action with subactions that throw async", async () => {
        try {
            await m.setXYAsyncThrowAsync(500, 600)
            fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsyncThrowAsync [0] > setXAsyncThrowAsync [0]",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 250,
      "1": 500,
      "type": "setXYAsyncThrowAsync [2] > setXAsyncThrowAsync [1] (error thrown)",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 500,
      "1": 600,
      "type": "setXYAsyncThrowAsync [3] (error thrown)",
    },
    Object {
      "x": 250,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action should not show empty first yields", async () => {
        await m.setXAsyncWithEmptyFirstPart(500)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 500,
      "type": "setXAsyncWithEmptyFirstPart [1]",
    },
    Object {
      "x": 500,
      "y": 20,
    },
  ],
]
`)
    })

    test("async action should show empty first yields when the option is set", async () => {
        initTest(false)

        await m.setXAsyncWithEmptyFirstPart(500)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "0": 500,
      "type": "setXAsyncWithEmptyFirstPart [0]",
    },
    Object {
      "x": 30,
      "y": 20,
    },
  ],
  Array [
    Object {
      "0": 500,
      "type": "setXAsyncWithEmptyFirstPart [1]",
    },
    Object {
      "x": 500,
      "y": 20,
    },
  ],
]
`)
    })
})
