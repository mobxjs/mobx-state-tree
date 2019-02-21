import { getSnapshot, types, unprotect } from "../../src"

describe("basic tests", () => {
    const M = types.model({
        x: types.optionalNull(types.number, 1),
        y: types.optionalNull(types.number, () => 2)
    })

    test("with null values, then assigned values", () => {
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

    test("with given values, then assigned null", () => {
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
        a: types.optionalNull(types.union(types.undefined, types.number), undefined),
        b: types.optionalNull(types.union(types.undefined, types.number), 5)
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
        a: types.optionalNull(types.number, 5)
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
