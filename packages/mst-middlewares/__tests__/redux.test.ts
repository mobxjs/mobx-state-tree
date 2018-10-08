import { types, flow, SnapshotOrInstance, cast } from "mobx-state-tree"
import { connectReduxDevtools } from "mst-middlewares/src"

jest.useRealTimers()

const waitAsync = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const waitAsyncReject = async (ms: number) => {
    await waitAsync(ms)
    throw new Error("thrown")
}

describe("redux devtools middleware", async () => {
    test("waitAsync helper works", async () => {
        await waitAsync(10)
    })

    test("waitAsyncReject helper works", async () => {
        try {
            await waitAsyncReject(10)
            fail("should have failed")
        } catch {
            // do nothing
        }
    })

    const M2 = types
        .model("SubModel", {
            a: 10
        })
        .actions(self => ({
            setA(val: number) {
                self.a = val
            }
        }))

    const M = types
        .model("TestModel", {
            x: 10,
            y: 20,
            array: types.array(M2)
        })
        .actions(self => ({
            afterCreate() {
                self.x = 30
            },

            addtoArray(val: SnapshotOrInstance<typeof M2>) {
                self.array.push(cast(val))
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
      "args": Object {
        "0": 50,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setX",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 70,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXThrow -error thrown-",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsync (1)",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncThrowSync (0)",
    },
    Object {
      "array": Array [],
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncThrowSync (1) -error thrown-",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncThrowAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 100,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncThrowAsync (1) -error thrown-",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 1000,
        "1": 2000,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setYAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 30,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 100,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
        "1": 200,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsync (1)",
    },
    Object {
      "array": Array [],
      "x": 200,
      "y": 1000,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 1000,
        "1": 2000,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setYAsync (1)",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXY >>> [root].setX",
    },
    Object {
      "array": Array [],
      "x": 500,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 600,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXY >>> [root].setY",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsync (0) >>> [root].setXAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsync (2) >>> [root].setXAsync (1)",
    },
    Object {
      "array": Array [],
      "x": 500,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 300,
        "1": 600,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsync (3) >>> [root].setYAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 500,
      "y": 300,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 300,
        "1": 600,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsync (5) >>> [root].setYAsync (1)",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsyncThrowSync (0) >>> [root].setXAsyncThrowSync (0)",
    },
    Object {
      "array": Array [],
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsyncThrowSync (2) >>> [root].setXAsyncThrowSync (1) -error thrown-",
    },
    Object {
      "array": Array [],
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 500,
        "1": 600,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXYAsyncThrowSync (3) -error thrown-",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsyncThrowAsync (0) >>> [root].setXAsyncThrowAsync (0)",
    },
    Object {
      "array": Array [],
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 250,
        "1": 500,
      },
      "targetTypePath": "TestModel >>> TestModel",
      "type": "[root].setXYAsyncThrowAsync (2) >>> [root].setXAsyncThrowAsync (1) -error thrown-",
    },
    Object {
      "array": Array [],
      "x": 250,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 500,
        "1": 600,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXYAsyncThrowAsync (3) -error thrown-",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 500,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncWithEmptyFirstPart (1)",
    },
    Object {
      "array": Array [],
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
      "args": Object {
        "0": 500,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncWithEmptyFirstPart (0)",
    },
    Object {
      "array": Array [],
      "x": 30,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 500,
      },
      "targetTypePath": "TestModel",
      "type": "[root].setXAsyncWithEmptyFirstPart (1)",
    },
    Object {
      "array": Array [],
      "x": 500,
      "y": 20,
    },
  ],
]
`)
    })

    test("sync action that adds to an array", () => {
        m.addtoArray({ a: 50 })
        m.array[0]!.setA(100)
        expect(devTools.send.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    Object {
      "args": Object {
        "0": Object {
          "a": 50,
        },
      },
      "targetTypePath": "TestModel",
      "type": "[root].addtoArray",
    },
    Object {
      "array": Array [
        Object {
          "a": 50,
        },
      ],
      "x": 30,
      "y": 20,
    },
  ],
  Array [
    Object {
      "args": Object {
        "0": 100,
      },
      "targetTypePath": "TestModel/SubModel[]/SubModel",
      "type": "[root/array/0].setA",
    },
    Object {
      "array": Array [
        Object {
          "a": 100,
        },
      ],
      "x": 30,
      "y": 20,
    },
  ],
]
`)
    })
})
