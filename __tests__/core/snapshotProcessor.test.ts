import { observable } from "mobx"
import {
    types,
    getSnapshot,
    unprotect,
    cast,
    applySnapshot,
    detach,
    clone,
    SnapshotIn,
    getNodeId,
    Instance,
    onSnapshot,
    destroy,
    recordActions
} from "../../src"
import { describe, expect, jest, test } from "bun:test"

describe("snapshotProcessor", () => {
    describe("over a model type", () => {
        const M = types.model({
            x: types.string
        })

        test("no processors", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const model = Model.create({ m: { x: "hi" } })
            unprotect(model)
            expect(model.m.x).toBe("hi")
            expect(getSnapshot(model).m.x).toBe("hi")
            // reconciliation
            model.m = { x: "ho" }
            expect(model.m.x).toBe("ho")
            expect(getSnapshot(model).m.x).toBe("ho")
        })

        test("pre processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    }
                })
            })
            const model = Model.create({ m: { x: 5 } })
            unprotect(model)
            expect(model.m.x).toBe("5")
            expect(getSnapshot(model).m.x).toBe("5")
            // reconciliation
            model.m = cast({ x: 6 })
            expect(model.m.x).toBe("6")
            expect(getSnapshot(model).m.x).toBe("6")
        })

        test("post processor", () => {
            let model: Instance<typeof Model>
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn, node): { x: number; val?: string } {
                        expect(node).toBeTruthy()

                        return {
                            ...sn,
                            x: Number(sn.x),
                            val: node.x
                        }
                    }
                })
            })
            model = Model.create({
                m: { x: "5" }
            })
            unprotect(model)
            expect(model.m.x).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            expect(getSnapshot(model).m.val).toBe("5")
            // reconciliation
            model.m = cast({ x: "6" })
            expect(model.m.x).toBe("6")
            expect(getSnapshot(model).m.x).toBe(6)
            expect(getSnapshot(model).m.val).toBe("6")
        })

        test("post processor that observes other observables recomputes when they change", () => {
            let model: Instance<typeof Model>
            const atom = observable.box("foo")

            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn, node): { x: number; val: string } {
                        return {
                            ...sn,
                            x: Number(sn.x),
                            val: atom.get()
                        }
                    }
                })
            })
            model = Model.create({
                m: { x: "5" }
            })
            const newSnapshot = jest.fn()
            onSnapshot(model, newSnapshot)
            expect(getSnapshot(model).m.val).toBe("foo")
            atom.set("bar")
            expect(getSnapshot(model).m.val).toBe("bar")
            expect(newSnapshot).toHaveBeenCalledTimes(1)
        })

        test("pre and post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    },
                    postProcessor(sn): { x: number } {
                        return {
                            ...sn,
                            x: Number(sn.x)
                        }
                    }
                })
            })
            const model = Model.create({
                m: { x: 5 }
            })
            unprotect(model)
            expect(model.m.x).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            // reconciliation
            model.m = cast({ x: 6 })
            expect(model.m.x).toBe("6")
            expect(getSnapshot(model).m.x).toBe(6)
            // cloning
            expect(getSnapshot(clone(model.m)).x).toBe(6)
        })
    })

    describe("over a literal type", () => {
        const M = types.string

        test("no processors", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const model = Model.create({ m: "hi" })
            unprotect(model)
            expect(model.m).toBe("hi")
            expect(getSnapshot(model).m).toBe("hi")
            // reconciliation
            model.m = "ho"
            expect(model.m).toBe("ho")
            expect(getSnapshot(model).m).toBe("ho")
        })

        test("pre processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number) {
                        return String(sn)
                    }
                })
            })
            const model = Model.create({ m: 5 })
            unprotect(model)
            expect(model.m).toBe("5")
            expect(getSnapshot(model).m).toBe("5")
            // reconciliation
            model.m = 6 as any
            expect(model.m).toBe("6")
            expect(getSnapshot(model).m).toBe("6")
        })

        test("post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn, node): number {
                        expect(node).toMatch(/5|6/)
                        return Number(sn)
                    }
                })
            })
            const model = Model.create({
                m: "5"
            })
            unprotect(model)
            expect(model.m).toBe("5")
            expect(getSnapshot(model).m).toBe(5)
            // reconciliation
            model.m = "6"
            expect(model.m).toBe("6")
            expect(getSnapshot(model).m).toBe(6)
        })

        test("pre and post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number) {
                        return String(sn)
                    },
                    postProcessor(sn): number {
                        return Number(sn)
                    }
                })
            })
            const model = Model.create({
                m: 5
            })
            unprotect(model)
            expect(model.m).toBe("5")
            expect(getSnapshot(model).m).toBe(5)
            // reconciliation
            model.m = "6"
            expect(model.m).toBe("6")
            expect(getSnapshot(model).m).toBe(6)
            // cloning
            expect(getSnapshot(clone(model)).m).toBe(6)
        })
    })

    describe("over an array type", () => {
        const M = types.array(types.string)

        test("no processors", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const model = Model.create({ m: ["hi"] })
            unprotect(model)
            expect(model.m[0]).toBe("hi")
            expect(getSnapshot(model).m[0]).toBe("hi")
            // reconciliation
            model.m = cast(["ho"])
            expect(model.m[0]).toBe("ho")
            expect(getSnapshot(model).m[0]).toBe("ho")
        })

        test("pre processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number[]) {
                        return sn.map(n => String(n))
                    }
                })
            })
            const model = Model.create({ m: [5] })
            unprotect(model)
            expect(model.m[0]).toBe("5")
            expect(getSnapshot(model).m[0]).toBe("5")
            // reconciliation
            model.m = cast([6])
            expect(model.m[0]).toBe("6")
            expect(getSnapshot(model).m[0]).toBe("6")
        })

        test("post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn, node): number[] {
                        expect(node).toBeDefined()
                        expect(node.length).toEqual(1)
                        return sn.map(n => Number(n))
                    }
                })
            })
            const model = Model.create({
                m: ["5"]
            })
            unprotect(model)
            expect(model.m[0]).toBe("5")
            expect(getSnapshot(model).m[0]).toBe(5)
            // reconciliation
            model.m = cast(["6"])
            expect(model.m[0]).toBe("6")
            expect(getSnapshot(model).m[0]).toBe(6)
        })

        test("pre and post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number[]) {
                        return sn.map(n => String(n))
                    },
                    postProcessor(sn): number[] {
                        return sn.map(n => Number(n))
                    }
                })
            })
            const model = Model.create({
                m: [5]
            })
            unprotect(model)
            expect(model.m[0]).toBe("5")
            expect(getSnapshot(model).m[0]).toBe(5)
            // reconciliation
            model.m = cast([6])
            expect(model.m[0]).toBe("6")
            expect(getSnapshot(model).m[0]).toBe(6)
            // cloning
            expect(getSnapshot(clone(model.m))[0]).toBe(6)
        })
    })

    describe("over a map type", () => {
        const M = types.map(types.string)

        test("no processors", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const model = Model.create({ m: { x: "hi" } })
            unprotect(model)
            expect(model.m.get("x")).toBe("hi")
            expect(getSnapshot(model).m.x).toBe("hi")
            // reconciliation
            model.m.set("x", "ho")
            expect(model.m.get("x")).toBe("ho")
            expect(getSnapshot(model).m.x).toBe("ho")
        })

        test("pre processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    }
                })
            })
            const model = Model.create({ m: { x: 5 } })
            unprotect(model)
            expect(model.m.get("x")).toBe("5")
            expect(getSnapshot(model).m.x).toBe("5")
            // reconciliation
            model.m = cast({ x: 6 })
            expect(model.m.get("x")).toBe("6")
            expect(getSnapshot(model).m.x).toBe("6")
        })

        test("post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn, node): { x: number } {
                        expect(node.size).toBe(1)

                        return {
                            ...sn,
                            x: Number(sn.x)
                        }
                    }
                })
            })
            const model = Model.create({
                m: { x: "5" }
            })
            unprotect(model)
            expect(model.m.get("x")).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            // reconciliation
            model.m = cast({ x: "6" })
            expect(model.m.get("x")).toBe("6")
            expect(getSnapshot(model).m.x).toBe(6)
        })

        test("pre and post processor", () => {
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    },
                    postProcessor(sn): { x: number } {
                        return {
                            ...sn,
                            x: Number(sn.x)
                        }
                    }
                })
            })
            const model = Model.create({
                m: { x: 5 }
            })
            unprotect(model)
            expect(model.m.get("x")).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            // reconciliation
            model.m = cast({ x: 6 })
            expect(model.m.get("x")).toBe("6")
            expect(getSnapshot(model).m.x).toBe(6)
            // cloning
            expect(getSnapshot(clone(model.m)).x).toBe(6)
        })
    })

    test("chained transforms", () => {
        const TL = types.snapshotProcessor(types.string, {
            preProcessor(sn: string) {
                return sn.trimLeft()
            },
            postProcessor(sn): string {
                return "_" + sn
            }
        })
        const TB = types.snapshotProcessor(TL, {
            preProcessor(sn: string) {
                return sn.trimRight()
            },
            postProcessor(sn): string {
                return sn + "_"
            }
        })
        const M = types.model({
            name: TB
        })

        const t = TB.create(" hello ")
        expect(t).toBe("hello")

        const m = M.create({
            name: " hello "
        })
        expect(m.name).toBe("hello")
        expect(getSnapshot(m).name).toBe("_hello_")
    })

    describe("moving nodes around with a pre-processor", () => {
        const Task = types.model("Task", { x: types.number })
        const Store = types.model({
            a: types.array(
                types.snapshotProcessor(
                    Task,
                    {
                        preProcessor(sn: { x: string }) {
                            return {
                                x: Number(sn.x)
                            }
                        }
                    },
                    "PTask"
                )
            ),
            b: types.array(Task)
        })

        test("moving from a to b", () => {
            const s = Store.create({
                a: [{ x: "1" }]
            })
            unprotect(s)
            const n = s.a[0]
            detach(n)
            expect(s.a.length).toBe(0)
            expect(getSnapshot(n)).toEqual({ x: 1 })

            s.b.push(n)
            expect(s.b.length).toBe(1)
            expect(getSnapshot(s.b)).toEqual([{ x: 1 }])
        })

        test("moving from b to a", () => {
            const s = Store.create({
                b: [{ x: 1 }]
            })
            unprotect(s)
            const n = s.b[0]
            detach(n)
            expect(s.b.length).toBe(0)
            expect(getSnapshot(n)).toEqual({ x: 1 })

            s.a.push(n)
            expect(s.a.length).toBe(1)
            expect(getSnapshot(s.a)).toEqual([{ x: 1 }])
        })
    })

    describe("moving nodes around with a post-processor", () => {
        const Task = types.model({ x: types.number })
        const Store = types.model({
            a: types.array(
                types.snapshotProcessor(Task, {
                    postProcessor(sn): { x: string } {
                        return {
                            x: String(sn.x)
                        }
                    }
                })
            ),
            b: types.array(Task)
        })

        test("moving from a to b", () => {
            const s = Store.create({
                a: [{ x: 1 }]
            })
            unprotect(s)
            const n = s.a[0]
            detach(n)
            expect(s.a.length).toBe(0)
            expect(getSnapshot(n)).toEqual({ x: "1" })

            s.b.push(n)
            expect(s.b.length).toBe(1)
            // @ts-expect-error - post processor gets applied here and messes up the types
            expect(getSnapshot(s.b)).toEqual([{ x: "1" }])
        })

        test("moving from b to a", () => {
            const s = Store.create({
                b: [{ x: 1 }]
            })
            unprotect(s)
            const n = s.b[0]
            detach(n)
            expect(s.b.length).toBe(0)
            expect(getSnapshot(n)).toEqual({ x: 1 })

            s.a.push(n)
            expect(s.a.length).toBe(1)
            expect(getSnapshot(s.a)).toEqual([{ x: "1" }])
        })
    })

    test("destroying a node does not post-process its snapshot again", () => {
        const postProcessor = jest.fn(snapshot => snapshot)
        const task = types.snapshotProcessor(types.model({ x: 1 }), { postProcessor }).create({})
        postProcessor.mockClear()
        destroy(task)
        expect(postProcessor).not.toHaveBeenCalled()
    })

    describe("assigning instances works", () => {
        const Todo = types.model("Todo", {
            id: types.identifier
        })

        const TodoWithProcessor = types.snapshotProcessor(Todo, {
            preProcessor(snapshot: { id: string }) {
                return snapshot
            }
        })

        const Store = types
            .model("TodoStore", {
                todos: types.map(TodoWithProcessor),
                instance: types.optional(TodoWithProcessor, { id: "new" })
            })
            .actions(self => ({
                addTodo(todo: { id: string }) {
                    self.todos.put(todo)
                },
                setInstance(next: { id: string }) {
                    self.instance = next
                }
            }))

        test("using instances in maps work", () => {
            const store = Store.create()
            const todo = TodoWithProcessor.create({ id: "map" })

            store.addTodo(todo)

            expect(store.todos.size).toBe(1)
            expect(getSnapshot(store.todos)).toEqual({ map: { id: "map" } })
        })

        test("using instances as values works", () => {
            const store = Store.create()
            const todo = TodoWithProcessor.create({ id: "map" })

            store.setInstance(todo)

            expect(store.instance).toBe(todo)
        })

        test("using the non processed type in place of the processed one works", () => {
            const store = Store.create()
            const todo = Todo.create({ id: "map" })

            store.setInstance(todo)

            expect(store.instance).toBe(todo)
        })

        test("using the processed type in place of the non processed one works", () => {
            const store = types
                .model("Store", { instance: Todo })
                .actions(self => ({
                    setInstance(next: { id: string }) {
                        self.instance = next
                    }
                }))
                .create({ instance: { id: "new" } })

            const todo = TodoWithProcessor.create({ id: "map" })

            store.setInstance(todo)

            expect(store.instance).toBe(todo)
        })
    })

    test("cached initial snapshots are ok", () => {
        const M2 = types.snapshotProcessor(types.model({ x: types.number }), {
            preProcessor(sn: { x: number }) {
                return { ...sn, x: 0 }
            }
        })
        const M1 = types.model({ m2: M2 })
        const M = types.model({ m1: M1 })

        const m = M.create({ m1: { m2: { x: 10 } } })
        expect(getSnapshot(m)).toEqual({
            m1: { m2: { x: 0 } }
        })
    })

    test("works with IType.is", () => {
        const Model = types.model({ x: types.number })
        const model = Model.create({ x: 1 })
        expect(Model.is(model)).toBe(true)
        expect(Model.is({ x: 1 })).toBe(true)

        const ProcessedModel = types.snapshotProcessor(Model, {
            preProcessor(sn: { y: number }) {
                const copy = { ...sn, x: sn.y }
                // @ts-ignore
                delete copy.y
                return copy
            },
            postProcessor(sn: { x: number }) {
                const copy = { ...sn, y: sn.x }
                // @ts-ignore
                delete copy.x
                return copy
            }
        })

        const processedModel = ProcessedModel.create({ y: 1 })
        expect(ProcessedModel.is(processedModel)).toBe(true)
        expect(ProcessedModel.is({ y: 1 })).toBe(true)
        expect(ProcessedModel.is(Model)).toBe(false)
    })

    test(".is checks instances against the underlying type", () => {
        const ModelA = types.model({ x: types.number })
        const ModelB = types.model({ x: types.number })
        const modelA = ModelA.create({ x: 1 })
        const modelB = ModelB.create({ x: 2 })

        // despite having the same snapshot type, .is is false for the instance of one against the other because they are not the same type
        expect(ModelA.is(modelA)).toBe(true)
        expect(ModelB.is(modelA)).toBe(false)
        expect(ModelA.is(modelB)).toBe(false)
        expect(ModelB.is(modelB)).toBe(true)

        const ProcessedModel = types.snapshotProcessor(ModelA, {})

        const processedModel = ProcessedModel.create({ x: 3 })
        expect(ProcessedModel.is(processedModel)).toBe(true)
        expect(ModelA.is(processedModel)).toBe(true)
        expect(ModelB.is(processedModel)).toBe(false)
        expect(ProcessedModel.is(modelA)).toBe(true)
        expect(ProcessedModel.is(modelB)).toBe(false)
    })

    describe("1776 - reconciliation in an array", () => {
        test("model with transformed property is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        if ("x" in sn) {
                            // Ensure snapshot don't run through preprocessor twice
                            throw new Error("sn has already been preprocessed")
                        }
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({ items: types.array(SP) }).actions(self => ({
                setItems(items: SnapshotIn<typeof SP>[]) {
                    self.items = cast(items)
                }
            }))
            const store = Store.create({ items: [{ id: "1", y: 0 }] })
            const oldNodeId = getNodeId(store.items[0])
            store.setItems([{ id: "1", y: 1 }])
            expect(getNodeId(store.items[0])).toBe(oldNodeId)
        })

        test("model with transformed identifier attribute is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier
                }),
                {
                    preProcessor(sn: { foo: string }) {
                        return { id: sn.foo }
                    }
                }
            )
            const Store = types.model({ items: types.array(SP) }).actions(self => ({
                setItems(items: SnapshotIn<typeof SP>[]) {
                    self.items = cast(items)
                }
            }))
            const store = Store.create({ items: [{ foo: "1" }] })
            const oldNodeId = getNodeId(store.items[0])
            store.setItems([{ foo: "1" }])
            expect(getNodeId(store.items[0])).toBe(oldNodeId)
        })

        test("applySnapshot uses the snapshot processor when reconciling", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        if ("x" in sn) {
                            throw new Error("sn has already been preprocessed")
                        }
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({ items: types.array(SP) })
            const store = Store.create({ items: [{ id: "1", y: 0 }] })
            const oldNodeId = getNodeId(store.items[0])

            applySnapshot(store, { items: [{ id: "1", y: 1 }] })

            expect(getNodeId(store.items[0])).toBe(oldNodeId)
            expect(store.items[0].x).toBe(1)
        })
    })

    describe("single node reconcilication", () => {
        test("model with transformed property is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        if ("x" in sn) {
                            // Ensure snapshot don't run through preprocessor twice
                            throw new Error("sn has already been preprocessed")
                        }
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({ item: SP }).actions(self => ({
                setItem(item: SnapshotIn<typeof SP>) {
                    self.item = cast(item)
                }
            }))
            const store = Store.create({ item: { id: "1", y: 0 } })
            const oldNodeId = getNodeId(store.item)
            store.setItem({ id: "1", y: 1 })
            expect(getNodeId(store.item)).toBe(oldNodeId)
            expect(store.item.x).toBe(1)
        })

        test("model with transformed identifier property is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier
                }),
                {
                    preProcessor(sn: { foo: string }) {
                        return { id: sn.foo }
                    }
                }
            )
            const Store = types.model({ item: SP }).actions(self => ({
                setItem(item: SnapshotIn<typeof SP>) {
                    self.item = cast(item)
                }
            }))
            const store = Store.create({ item: { foo: "1" } })
            const oldNodeId = getNodeId(store.item)
            store.setItem({ foo: "1" })
            expect(getNodeId(store.item)).toBe(oldNodeId)
            expect(store.item.id).toBe("1")
        })

        test("1791 - model wrapped with maybe is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({ item: types.maybe(SP) }).actions(self => ({
                setItem(item: SnapshotIn<typeof SP>) {
                    self.item = cast(item)
                }
            }))
            const store = Store.create({ item: { id: "1", y: 0 } })
            const oldNodeId = getNodeId(store.item!)
            store.setItem({ id: "1", y: 1 })
            expect(getNodeId(store.item!)).toBe(oldNodeId)
            expect(store.item?.x).toBe(1)
        })

        test("model wrapped with optional is reconciled", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types
                .model({ item: types.optional(SP, { id: "1", y: 0 }) })
                .actions(self => ({
                    setItem(item?: SnapshotIn<typeof SP>) {
                        self.item = cast(item)
                    }
                }))
            const store = Store.create()
            const oldNodeId = getNodeId(store.item!)
            expect(store.item?.x).toBe(0)
            store.setItem({ id: "1", y: 1 })
            expect(getNodeId(store.item!)).toBe(oldNodeId)
            expect(store.item?.x).toBe(1)
            store.setItem(undefined)
            expect(getNodeId(store.item!)).toBe(oldNodeId)
            expect(store.item?.x).toBe(0)
        })

        test("applySnapshot uses the snapshot processor for optional-wrapped properties", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        if ("x" in sn) {
                            throw new Error("sn has already been preprocessed")
                        }
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({
                item: types.optional(SP, { id: "1", y: 0 })
            })
            const store = Store.create()
            const oldNodeId = getNodeId(store.item!)

            applySnapshot(store, { item: { id: "1", y: 1 } })

            expect(getNodeId(store.item!)).toBe(oldNodeId)
            expect(store.item?.x).toBe(1)
        })

        test("applySnapshot uses the snapshot processor for maps", () => {
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                {
                    preProcessor(sn: { id: string; y: number }) {
                        if ("x" in sn) {
                            throw new Error("sn has already been preprocessed")
                        }
                        return { id: sn.id, x: sn.y }
                    }
                }
            )
            const Store = types.model({
                items: types.map(SP)
            })
            const store = Store.create({ items: { "1": { id: "1", y: 0 } } })
            const item = store.items.get("1")!
            const oldNodeId = getNodeId(item)

            applySnapshot(store, { items: { "1": { id: "1", y: 1 } } })

            expect(getNodeId(store.items.get("1")!)).toBe(oldNodeId)
            expect(store.items.get("1")?.x).toBe(1)
        })
    })

    test("1777 - preProcessor wrapped in maybe accepts undefined", () => {
        const SP = types.snapshotProcessor(
            types.model({
                id: types.identifier,
                x: types.number
            }),
            {
                preProcessor(sn: { id: string; y: number }) {
                    return { id: sn.id, x: sn.y }
                }
            }
        )
        const Store = types.model({ item: types.maybe(SP) }).actions(self => ({
            setItem(item?: SnapshotIn<typeof SP>) {
                self.item = cast(item)
            }
        }))
        const store = Store.create()
        expect(store.item).toBeUndefined()
        store.setItem({ id: "1", y: 1 })
        expect(store.item?.x).toBe(1)
        store.setItem(undefined)
        expect(store.item).toBeUndefined()
    })

    test("1849 - Wrapped unions don't cause infinite recursion", () => {
        const Store = types
            .model({
                prop: types.optional(
                    types.snapshotProcessor(
                        types.union(types.literal("a"), types.literal("b")),
                        {}
                    ),
                    "a"
                )
            })
            .actions(self => ({
                setProp(prop: typeof self.prop) {
                    self.prop = prop
                }
            }))

        const store = Store.create()
        expect(store.prop).toBe("a")
        expect(() => store.setProp("b")).not.toThrow()
        expect(store.prop).toBe("b")
    })

    describe("1317 - applySnapshot calls preProcessor", () => {
        test("top-level model with preProcessor", () => {
            const preProcessor = jest.fn((sn: { x: number }) => {
                if (typeof sn.x !== "number") {
                    throw new Error("sn has already been preprocessed")
                }
                return { x: String(sn.x) }
            })
            const SP = types.snapshotProcessor(types.model({ x: types.string }), {
                preProcessor
            })

            const m = SP.create({ x: 1 })
            expect(m.x).toBe("1")
            preProcessor.mockClear()

            applySnapshot(m, { x: 2 })
            expect(m.x).toBe("2")
            expect(getSnapshot(m)).toEqual({ x: "2" })
            expect(preProcessor).toHaveBeenCalledTimes(1)
        })

        test("top-level model with preProcessor and postProcessor", () => {
            const SP = types.snapshotProcessor(types.model({ x: types.string }), {
                preProcessor(sn: { y: number }) {
                    return { x: String(sn.y) }
                },
                postProcessor(sn): { y: number } {
                    return { y: Number(sn.x) }
                }
            })

            const m = SP.create({ y: 1 })
            expect(m.x).toBe("1")
            expect(getSnapshot(m)).toEqual({ y: 1 })

            applySnapshot(m, { y: 42 })
            expect(m.x).toBe("42")
            expect(getSnapshot(m)).toEqual({ y: 42 })
        })

        test("top-level array with preProcessor", () => {
            const SP = types.snapshotProcessor(types.array(types.string), {
                preProcessor(sn: number[]) {
                    return sn.map(n => String(n))
                },
                postProcessor(sn): number[] {
                    return sn.map(s => Number(s))
                }
            })

            const arr = SP.create([1, 2])
            expect(arr.slice()).toEqual(["1", "2"])
            expect(getSnapshot(arr)).toEqual([1, 2])

            applySnapshot(arr, [3, 4, 5])
            expect(arr.slice()).toEqual(["3", "4", "5"])
            expect(getSnapshot(arr)).toEqual([3, 4, 5])
        })

        test("top-level map with preProcessor", () => {
            const SP = types.snapshotProcessor(types.map(types.string), {
                preProcessor(sn: Record<string, number>) {
                    return Object.fromEntries(Object.entries(sn).map(([k, v]) => [k, String(v)]))
                },
                postProcessor(sn): Record<string, number> {
                    return Object.fromEntries(Object.entries(sn).map(([k, v]) => [k, Number(v)]))
                }
            })

            const map = SP.create({ a: 1 })
            expect(map.get("a")).toBe("1")
            expect(getSnapshot(map)).toEqual({ a: 1 })

            applySnapshot(map, { a: 2, b: 3 })
            expect(map.get("a")).toBe("2")
            expect(map.get("b")).toBe("3")
            expect(getSnapshot(map)).toEqual({ a: 2, b: 3 })
        })

        test("direct applySnapshot on child node", () => {
            const preProcessor = jest.fn((sn: { id: string; y: number }) => {
                if ("x" in sn) {
                    throw new Error("sn has already been preprocessed")
                }
                return { id: sn.id, x: sn.y }
            })
            const SP = types.snapshotProcessor(
                types.model({
                    id: types.identifier,
                    x: types.number
                }),
                { preProcessor }
            )
            const Store = types.model({ item: SP })
            const store = Store.create({ item: { id: "1", y: 0 } })
            const oldNodeId = getNodeId(store.item)
            preProcessor.mockClear()

            applySnapshot(store.item, { id: "1", y: 7 })
            expect(getNodeId(store.item)).toBe(oldNodeId)
            expect(store.item.x).toBe(7)
            expect(preProcessor).toHaveBeenCalledTimes(1)
        })

        test("chained snapshotProcessors run preProcessors outer-to-inner", () => {
            const order: string[] = []
            const Base = types.model({ x: types.number })
            const Inner = types.snapshotProcessor(Base, {
                preProcessor(sn: { y: number }) {
                    order.push("inner")
                    return { x: sn.y * 10 }
                }
            })
            const Outer = types.snapshotProcessor(Inner, {
                preProcessor(sn: { z: number }) {
                    order.push("outer")
                    return { y: sn.z + 1 }
                }
            })

            const m = Outer.create({ z: 2 })
            expect(m.x).toBe(30)

            order.length = 0
            applySnapshot(m, { z: 4 })
            expect(m.x).toBe(50)
            expect(order).toEqual(["outer", "inner"])
        })

        test("applySnapshot with identical snapshot reference is a no-op", () => {
            const preProcessor = jest.fn((sn: { x: number }) => ({ x: sn.x }))
            const SP = types.snapshotProcessor(types.model({ x: types.number }), {
                preProcessor
            })

            const m = SP.create({ x: 1 })
            preProcessor.mockClear()

            applySnapshot(m, getSnapshot(m))
            expect(m.x).toBe(1)
            expect(preProcessor).not.toHaveBeenCalled()
        })

        test("recordActions replays applySnapshot on snapshotProcessor", () => {
            const preProcessor = jest.fn((sn: { y: number }) => {
                if ("x" in sn) {
                    throw new Error("sn has already been preprocessed")
                }
                return { x: sn.y }
            })
            const SP = types.snapshotProcessor(types.model({ x: types.number }), {
                preProcessor
            })

            const m1 = SP.create({ y: 1 })
            const m2 = SP.create({ y: 1 })
            preProcessor.mockClear()
            const recorder = recordActions(m1)

            applySnapshot(m1, { y: 5 })
            recorder.stop()

            expect(m1.x).toBe(5)
            recorder.replay(m2)
            expect(m2.x).toBe(5)
            expect(preProcessor).toHaveBeenCalledTimes(2)
        })

        test("unprocessed sibling instance is unaffected", () => {
            const Base = types.model({ x: types.number })
            const SP = types.snapshotProcessor(Base, {
                preProcessor(sn: { y: number }) {
                    return { x: sn.y }
                }
            })

            const plain = Base.create({ x: 1 })
            const processed = SP.create({ y: 2 })

            applySnapshot(plain, { x: 10 })
            applySnapshot(processed, { y: 20 })

            expect(plain.x).toBe(10)
            expect(processed.x).toBe(20)
        })
    })

    if (process.env.NODE_ENV !== "production") {
        test("it should fail if given incorrect processor", () => {
            expect(() => {
                types.model({
                    m: types.snapshotProcessor(types.number, {
                        postProcessor: {} as any
                    })
                })
            }).toThrow("[mobx-state-tree] postSnapshotProcessor must be a function")
        })
    }
})
