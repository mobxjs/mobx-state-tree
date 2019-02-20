import { getSnapshot, types, unprotect } from "../../src"

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
