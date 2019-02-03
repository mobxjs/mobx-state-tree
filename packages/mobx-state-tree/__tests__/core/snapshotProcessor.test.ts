import { types, getSnapshot, unprotect, cast } from "../../src"

describe("snapshotProcessor", () => {
    describe("over a model type", () => {
        const M = types.model({
            x: types.string
        })

        test("no processors", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const m = P.create({ m: { x: "hi" } })
            unprotect(m)
            expect(m.m.x).toBe("hi")
            expect(getSnapshot(m).m.x).toBe("hi")
            // reconciliation
            m.m = { x: "ho" }
            expect(m.m.x).toBe("ho")
            expect(getSnapshot(m).m.x).toBe("ho")
        })

        test("pre processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    }
                })
            })
            const m = P.create({ m: { x: 5 } })
            unprotect(m)
            expect(m.m.x).toBe("5")
            expect(getSnapshot(m).m.x).toBe("5")
            // reconciliation
            m.m = cast({ x: 6 })
            expect(m.m.x).toBe("6")
            expect(getSnapshot(m).m.x).toBe("6")
        })

        test("post processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn): { x: number } {
                        return {
                            ...sn,
                            x: Number(sn.x)
                        }
                    }
                })
            })
            const m = P.create({
                m: { x: "5" }
            })
            unprotect(m)
            expect(m.m.x).toBe("5")
            expect(getSnapshot(m).m.x).toBe(5)
            // reconciliation
            m.m = cast({ x: "6" })
            expect(m.m.x).toBe("6")
            expect(getSnapshot(m).m.x).toBe(6)
        })
    })

    describe("over a literal type", () => {
        const M = types.string

        test("no processors", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const m = P.create({ m: "hi" })
            unprotect(m)
            expect(m.m).toBe("hi")
            expect(getSnapshot(m).m).toBe("hi")
            // reconciliation
            m.m = "ho"
            expect(m.m).toBe("ho")
            expect(getSnapshot(m).m).toBe("ho")
        })

        test("pre processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number) {
                        return String(sn)
                    }
                })
            })
            const m = P.create({ m: 5 })
            unprotect(m)
            expect(m.m).toBe("5")
            expect(getSnapshot(m).m).toBe("5")
            // reconciliation
            m.m = 6 as any
            expect(m.m).toBe("6")
            expect(getSnapshot(m).m).toBe("6")
        })

        test("post processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn): number {
                        return Number(sn)
                    }
                })
            })
            const m = P.create({
                m: "5"
            })
            unprotect(m)
            expect(m.m).toBe("5")
            expect(getSnapshot(m).m).toBe(5)
            // reconciliation
            m.m = "6"
            expect(m.m).toBe("6")
            expect(getSnapshot(m).m).toBe(6)
        })
    })

    describe("over an array type", () => {
        const M = types.array(types.string)

        test("no processors", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const m = P.create({ m: ["hi"] })
            unprotect(m)
            expect(m.m[0]).toBe("hi")
            expect(getSnapshot(m).m[0]).toBe("hi")
            // reconciliation
            m.m = cast(["ho"])
            expect(m.m[0]).toBe("ho")
            expect(getSnapshot(m).m[0]).toBe("ho")
        })

        test("pre processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: number[]) {
                        return sn.map(n => String(n))
                    }
                })
            })
            const m = P.create({ m: [5] })
            unprotect(m)
            expect(m.m[0]).toBe("5")
            expect(getSnapshot(m).m[0]).toBe("5")
            // reconciliation
            m.m = cast([6])
            expect(m.m[0]).toBe("6")
            expect(getSnapshot(m).m[0]).toBe("6")
        })

        test("post processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn): number[] {
                        return sn.map(n => Number(n))
                    }
                })
            })
            const m = P.create({
                m: ["5"]
            })
            unprotect(m)
            expect(m.m[0]).toBe("5")
            expect(getSnapshot(m).m[0]).toBe(5)
            // reconciliation
            m.m = cast(["6"])
            expect(m.m[0]).toBe("6")
            expect(getSnapshot(m).m[0]).toBe(6)
        })
    })

    describe("over a map type", () => {
        const M = types.map(types.string)

        test("no processors", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {})
            })
            const m = P.create({ m: { x: "hi" } })
            unprotect(m)
            expect(m.m.get("x")).toBe("hi")
            expect(getSnapshot(m).m.x).toBe("hi")
            // reconciliation
            m.m.set("x", "ho")
            expect(m.m.get("x")).toBe("ho")
            expect(getSnapshot(m).m.x).toBe("ho")
        })

        test("pre processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    preProcessor(sn: { x: number }) {
                        return {
                            ...sn,
                            x: String(sn.x)
                        }
                    }
                })
            })
            const m = P.create({ m: { x: 5 } })
            unprotect(m)
            expect(m.m.get("x")).toBe("5")
            expect(getSnapshot(m).m.x).toBe("5")
            // reconciliation
            m.m = cast({ x: 6 })
            expect(m.m.get("x")).toBe("6")
            expect(getSnapshot(m).m.x).toBe("6")
        })

        test("post processor", () => {
            const P = types.model({
                m: types.snapshotProcessor(M, {
                    postProcessor(sn): { x: number } {
                        return {
                            ...sn,
                            x: Number(sn.x)
                        }
                    }
                })
            })
            const m = P.create({
                m: { x: "5" }
            })
            unprotect(m)
            expect(m.m.get("x")).toBe("5")
            expect(getSnapshot(m).m.x).toBe(5)
            // reconciliation
            m.m = cast({ x: "6" })
            expect(m.m.get("x")).toBe("6")
            expect(getSnapshot(m).m.x).toBe(6)
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
})
