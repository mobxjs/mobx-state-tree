import { getSnapshot, types, unprotect } from "../../src"

describe("null as default", () => {
    describe("basic tests", () => {
        const M = types.model({
            x: types.optional(types.number, 1, [null]),
            y: types.optional(types.number, () => 2, [null])
        })

        test("with optional values, then assigned values", () => {
            const m = M.create({
                x: null,
                y: null
            })
            unprotect(m)

            expect(m.x).toBe(1)
            expect(m.y).toBe(2)

            expect(getSnapshot(m)).toEqual({
                x: 1,
                y: 2
            })

            m.x = 10
            m.y = 20
            expect(m.x).toBe(10)
            expect(m.y).toBe(20)

            expect(getSnapshot(m)).toEqual({
                x: 10,
                y: 20
            })
        })

        test("with given values, then assigned optional values", () => {
            const m = M.create({
                x: 10,
                y: 20
            })
            unprotect(m)

            expect(m.x).toBe(10)
            expect(m.y).toBe(20)

            expect(getSnapshot(m)).toEqual({
                x: 10,
                y: 20
            })

            m.x = null as any
            m.y = null as any
            expect(m.x).toBe(1)
            expect(m.y).toBe(2)

            expect(getSnapshot(m)).toEqual({
                x: 1,
                y: 2
            })
        })
    })

    test("when the underlying type accepts undefined it should be ok", () => {
        const M = types.model({
            a: types.optional(types.union(types.undefined, types.number), undefined, [null]),
            b: types.optional(types.union(types.undefined, types.number), 5, [null])
        })

        {
            const m = M.create({
                a: null,
                b: null
            })
            expect(m.a).toBe(undefined)
            expect(m.b).toBe(5)
            expect(getSnapshot(m)).toEqual({
                a: undefined,
                b: 5
            })
        }

        {
            const m = M.create({
                a: 10,
                b: 20
            })
            expect(m.a).toBe(10)
            expect(m.b).toBe(20)
            expect(getSnapshot(m)).toEqual({
                a: 10,
                b: 20
            })
        }

        {
            const m = M.create({
                a: undefined,
                b: undefined
            })
            expect(m.a).toBe(undefined)
            expect(m.b).toBe(undefined)
            expect(getSnapshot(m)).toEqual({
                a: undefined,
                b: undefined
            })
        }
    })

    test("when the underlying type does not accept undefined, then undefined should throw", () => {
        const M = types.model({
            a: types.optional(types.number, 5, [null])
        })

        {
            const m = M.create({
                a: null
            })
            expect(m.a).toBe(5)
        }

        if (process.env.NODE_ENV !== "production") {
            expect(() => {
                M.create({
                    a: undefined as any
                })
            }).toThrowError("value `undefined` is not assignable to type: `number`")
        }
    })
})

describe("'empty' or false as default", () => {
    describe("basic tests", () => {
        const M = types.model({
            x: types.optional(types.number, 1, ["empty", false]),
            y: types.optional(types.number, () => 2, ["empty", false])
        })

        test("with optional values, then assigned values", () => {
            const m = M.create({
                x: "empty",
                y: false
            })
            unprotect(m)

            expect(m.x).toBe(1)
            expect(m.y).toBe(2)

            expect(getSnapshot(m)).toEqual({
                x: 1,
                y: 2
            })

            m.x = 10
            m.y = 20
            expect(m.x).toBe(10)
            expect(m.y).toBe(20)

            expect(getSnapshot(m)).toEqual({
                x: 10,
                y: 20
            })
        })

        test("with given values, then assigned 'empty'", () => {
            const m = M.create({
                x: 10,
                y: 20
            })
            unprotect(m)

            expect(m.x).toBe(10)
            expect(m.y).toBe(20)

            expect(getSnapshot(m)).toEqual({
                x: 10,
                y: 20
            })

            m.x = "empty" as any
            m.y = false as any
            expect(m.x).toBe(1)
            expect(m.y).toBe(2)

            expect(getSnapshot(m)).toEqual({
                x: 1,
                y: 2
            })
        })
    })

    test("when the underlying type accepts undefined it should be ok", () => {
        const M = types.model({
            a: types.optional(types.union(types.undefined, types.number), undefined, [
                "empty",
                false
            ]),
            b: types.optional(types.union(types.undefined, types.number), 5, ["empty", false])
        })

        {
            const m = M.create({
                a: "empty",
                b: false
            })
            expect(m.a).toBe(undefined)
            expect(m.b).toBe(5)
            expect(getSnapshot(m)).toEqual({
                a: undefined,
                b: 5
            })
        }

        {
            const m = M.create({
                a: 10,
                b: 20
            })
            expect(m.a).toBe(10)
            expect(m.b).toBe(20)
            expect(getSnapshot(m)).toEqual({
                a: 10,
                b: 20
            })
        }

        {
            const m = M.create({
                a: undefined,
                b: undefined
            })
            expect(m.a).toBe(undefined)
            expect(m.b).toBe(undefined)
            expect(getSnapshot(m)).toEqual({
                a: undefined,
                b: undefined
            })
        }
    })

    test("when the underlying type does not accept undefined, then undefined should throw", () => {
        const M = types.model({
            a: types.optional(types.number, 5, ["empty", false]),
            b: types.optional(types.number, 6, ["empty", false])
        })

        {
            const m = M.create({
                a: "empty",
                b: false
            })
            expect(m.a).toBe(5)
            expect(m.b).toBe(6)
        }

        if (process.env.NODE_ENV !== "production") {
            expect(() => {
                M.create({
                    a: undefined as any,
                    b: undefined as any
                })
            }).toThrowError("value `undefined` is not assignable to type: `number`")
        }
    })
})
