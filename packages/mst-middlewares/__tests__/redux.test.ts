import { types, flow, SnapshotOrInstance, cast, applySnapshot } from "mobx-state-tree"
import { connectReduxDevtools } from "mst-middlewares/src"

jest.useRealTimers()

const waitAsync = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const waitAsyncReject = async (ms: number) => {
    await waitAsync(ms)
    throw new Error("thrown")
}

test("waitAsync helper works", async () => {
    await waitAsync(10)
})

test("waitAsyncReject helper works", async () => {
    try {
        await waitAsyncReject(10)
        throw fail("should have failed")
    } catch {
        // do nothing
    }
})

const M2 = types
    .model("SubModel", {
        a: ""
    })
    .actions(self => ({
        setA() {
            self.a = "setA"
        }
    }))

const M = types
    .model("TestModel", {
        x: "uninitializedX",
        y: "",
        array: types.array(M2)
    })
    .actions(self => ({
        afterCreate() {
            self.x = ""
        },

        addtoArray(val: SnapshotOrInstance<typeof M2>) {
            self.array.push(cast(val))
        },
        setX() {
            self.x = "setX"
        },
        setXThrow() {
            self.x = "setXThrow"
            throw new Error("bye")
        },
        setXAsync: flow(function*() {
            self.x = "setXAsync +0"
            yield waitAsync(20)
            self.x = "setXAsync +20"
        }),
        setXAsyncWithEmptyFirstPart: flow(function*() {
            yield waitAsync(20)
            self.x = "setXAsyncWithEmptyFirstPart +20"
        }),
        setXAsyncThrowSync: flow(function*() {
            self.x = "setXAsyncThrowSync +0"
            yield waitAsync(20)
            throw new Error("setXAsyncThrowSync +20")
        }),
        setXAsyncThrowAsync: flow(function*() {
            self.x = "setXAsyncThrowAsync +0"
            yield waitAsyncReject(20)
        }),

        setY() {
            self.y = "setY"
        },
        setYThrow() {
            self.y = "setYThrow"
            throw new Error("bye2")
        },
        setYAsync: flow(function* setYAsync2() {
            self.y = "setYAsync +0"
            yield waitAsync(50)
            self.y = "setYAsync +50"
        }),
        setYAsyncThrowSync: flow(function*() {
            self.y = "setYAsyncThrowSync +0"
            yield waitAsync(50)
            throw new Error("setYAsyncThrowSync +50")
        }),
        setYAsyncThrowAsync: flow(function*() {
            self.y = "setYAsyncThrowAsync +0"
            yield waitAsyncReject(50)
        }),
        setXY() {
            this.setX()
            this.setY()
        }
    }))
    .actions(self => ({
        setXYAsync: flow(function*() {
            yield self.setXAsync()
            yield self.setYAsync()
        }),
        setXYAsyncThrowSync: flow(function*() {
            yield self.setXAsyncThrowSync()
        }),
        setXYAsyncThrowAsync: flow(function*() {
            yield self.setXAsyncThrowAsync()
        })
    }))

let m = M.create()
function mockDevTools() {
    return { init: jest.fn(), subscribe: jest.fn(), send: jest.fn() }
}
let devTools = mockDevTools()

function initTest(logIdempotentActionSteps: boolean, logChildActions: boolean) {
    devTools = mockDevTools()

    const devToolsManager = {
        connectViaExtension: () => devTools,
        extractState: jest.fn()
    }

    m = M.create()
    connectReduxDevtools(devToolsManager, m, { logIdempotentActionSteps, logChildActions })
}

function addStandardTests() {
    test("m.setX()", () => {
        m.setX()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXThrow()", () => {
        expect(() => m.setXThrow()).toThrow()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXAsync()", async () => {
        await m.setXAsync()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXAsyncThrowSync()", async () => {
        try {
            await m.setXAsyncThrowSync()
            throw fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXAsyncThrowAsync()", async () => {
        try {
            await m.setXAsyncThrowAsync()
            throw fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("concurrent [m.setYAsync() / m.setXAsync()]", async () => {
        // expected order is y0, x0, x1, y1 due to timeouts
        const b = m.setYAsync()
        const a = m.setXAsync()
        await Promise.all([b, a])
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXY() -> m.setX(), m.setY()", () => {
        m.setXY()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXYAsync() -> m.setXAsync(), m.setYAsync()", async () => {
        await m.setXYAsync()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXYAsyncThrowSync() -> m.setXAsyncThrowSync()", async () => {
        try {
            await m.setXYAsyncThrowSync()
            throw fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXYAsyncThrowAsync() -> m.setXYAsyncThrowAsync()", async () => {
        try {
            await m.setXYAsyncThrowAsync()
            throw fail("should have thrown")
        } catch {}
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test("m.setXAsyncWithEmptyFirstPart()", async () => {
        await m.setXAsyncWithEmptyFirstPart()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test('m.addtoArray({ a: "otherA" }), m.array[0].setA()', () => {
        m.addtoArray({ a: "otherA" })
        m.array[0]!.setA()
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })

    test('applySnapshot(m, { x: "snapshotX" })', () => {
        applySnapshot(m, { x: "snapshotX" })
        expect(devTools.send.mock.calls).toMatchSnapshot()
    })
}

for (const logIdempotentActionSteps of [false, true]) {
    for (const logChildActions of [true, false]) {
        describe(`(logIdempotentActionSteps: ${logIdempotentActionSteps}, logChildActions: ${logChildActions})`, async () => {
            beforeEach(() => {
                initTest(logIdempotentActionSteps, logChildActions)
            })

            addStandardTests()
        })
    }
}

test("bourquep", () => {
    enum ContentState {
        Active,
        Cancelled,
        Completed
    }

    const ContentStateEnumDef = types.custom<number, ContentState>({
        name: "ContentStateEnumDef",
        fromSnapshot(value: number): ContentState {
            let cs = ContentState as any
            return cs[cs[value]]
        },
        toSnapshot(value: ContentState): number {
            return value
        },
        isTargetType(value: number): boolean {
            return value in ContentState
        },
        getValidationMessage(value: number): string {
            if (value in ContentState) {
                return ""
            }
            return value + " is not a real value of ContentState."
        }
    })

    const SchoolYearConfigurationModel = types.model("SchoolYearConfigurationModel", {
        id: types.identifier,
        contents: types.map(types.late(() => ContentDefinitionModel))
    })

    const ContentDefinitionModel = types
        .model("ContentDefinition", {
            id: types.identifier,
            state: types.optional(ContentStateEnumDef, 0)
        })

        .actions(self => {
            const _actions = {
                toggleState() {
                    if (self.state === ContentState.Cancelled) {
                        return
                    }

                    let newState =
                        self.state === ContentState.Active
                            ? ContentState.Completed
                            : ContentState.Active
                    self.state = newState
                }
            }

            return _actions
        })

    const store = SchoolYearConfigurationModel.create({
        id: "100",
        contents: { one: { id: "200" } }
    })

    devTools = mockDevTools()
    const devToolsManager = { connectViaExtension: () => devTools, extractState: jest.fn() }
    connectReduxDevtools(devToolsManager, store, {
        logIdempotentActionSteps: false,
        logChildActions: false
    })

    store.contents.get("one")!.toggleState()
    expect(devTools.send.mock.calls).toMatchSnapshot()
})

test("#1065 - flows in root afterCreate shouldn't crash", async () => {
    const SubModel = types
        .model("SubModel", {
            num: 0
        })
        .actions(self => {
            return {
                someFlow: flow(function*() {
                    yield waitAsync(50)
                    self.num++
                    yield waitAsync(50)
                    self.num++
                })
            }
        })

    const Root = types
        .model("Root", {
            sub: types.optional(SubModel, {})
        })
        .actions(self => {
            return {
                afterCreate: () => {
                    self.sub.someFlow()
                }
            }
        })

    const store = Root.create({})

    devTools = mockDevTools()
    const devToolsManager = { connectViaExtension: () => devTools, extractState: jest.fn() }
    connectReduxDevtools(devToolsManager, store, {
        logIdempotentActionSteps: false,
        logChildActions: false
    })

    expect(devTools.send.mock.calls).toMatchSnapshot()
    await waitAsync(200)
    expect(devTools.send.mock.calls).toMatchSnapshot()
})
