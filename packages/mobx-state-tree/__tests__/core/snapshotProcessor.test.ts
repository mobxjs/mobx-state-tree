import { types, getSnapshot, unprotect, cast, detach, clone } from "../../src"

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
            const Model = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn): { x: number } {
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
            expect(model.m.x).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            // reconciliation
            model.m = cast({ x: "6" })
            expect(model.m.x).toBe("6")
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
            expect(model.m.x).toBe("5")
            expect(getSnapshot(model).m.x).toBe(5)
            // reconciliation
            model.m = cast({ x: "6" })
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
                    postProcessor(sn): number {
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
                    postProcessor(sn): number[] {
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
                    postProcessor(sn): { x: number } {
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
            if (process.env.NODE_ENV !== "production") {
                expect(() => s.b.push(n)).toThrow("Error while converting")
            }
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
            if (process.env.NODE_ENV !== "production") {
                expect(() => s.a.push(n)).toThrow("Error while converting")
            }
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
            if (process.env.NODE_ENV !== "production") {
                expect(() => s.b.push(n)).toThrow("Error while converting")
            }
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
            if (process.env.NODE_ENV !== "production") {
                expect(() => s.a.push(n)).toThrow("Error while converting")
            }
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
})
