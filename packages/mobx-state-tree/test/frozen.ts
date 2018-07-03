import { getSnapshot, types, unprotect } from "../src"

test("it should accept any serializable value", () => {
    const Factory = types.model({
        value: types.frozen()
    })
    const doc = Factory.create()
    unprotect(doc)
    doc.value = { a: 1, b: 2 }
    expect(getSnapshot(doc)).toEqual({ value: { a: 1, b: 2 } })
})

if (process.env.NODE_ENV !== "production") {
    test("it should throw if value is not serializable", () => {
        const Factory = types.model({
            value: types.frozen()
        })
        const doc = Factory.create()
        unprotect(doc)
        expect(() => {
            doc.value = function IAmUnserializable() {}
        }).toThrowError(/Error while converting <function IAmUnserializable> to `frozen`/)
    })
}

test("it should accept any default value value", () => {
    const Factory = types.model({
        value: types.frozen(3)
    })
    const doc = Factory.create()
    expect(Factory.is({})).toBeTruthy()
    expect(getSnapshot(doc)).toEqual({ value: 3 })
})

test("it should type strongly", () => {
    type Point = { x: number; y: number }
    const Mouse = types
        .model({
            loc: types.frozen<Point>()
        })
        .actions(self => ({
            moveABit() {
                // self.loc.x += 1; // compile error, x is readonly!
                ;(self.loc as any).x += 1 // throws, frozen!
            }
        }))

    expect(Mouse.is({})).toBeTruthy() // any value is acceptable to frozen, even undefined...

    const m = Mouse.create({
        //loc: 3 // type error!
        loc: { x: 2, y: 3 }
    })

    if (process.env.NODE_ENV !== "production") {
        expect(() => {
            m.moveABit()
        }).toThrow("Cannot assign to read only property 'x'")
    }
})
