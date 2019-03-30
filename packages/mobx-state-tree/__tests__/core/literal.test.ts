import { types } from "../../src"

if (process.env.NODE_ENV !== "production") {
    test("it should allow only primitives", () => {
        const error = expect(() => {
            types.model({
                complexArg: types.literal({ a: 1 } as any)
            })
        }).toThrowError("expected primitive as argument")
    })
    test("it should fail if not optional and no default provided", () => {
        const Factory = types.literal("hello")
        expect(() => {
            ;(Factory.create as any)()
        }).toThrow(/is not assignable to type/)
    })
    test("it should throw if a different type is given", () => {
        const Factory = types.model("TestFactory", {
            shouldBeOne: types.literal(1)
        })
        expect(() => {
            Factory.create({ shouldBeOne: 2 as any })
        }).toThrow(/is not assignable to type/)
    })
}
test("it should support null type", () => {
    const M = types.model({
        nullish: types.null
    })
    expect(
        M.is({
            nullish: null
        })
    ).toBe(true)
    expect(M.is({ nullish: undefined })).toBe(false)
    expect(M.is({ nullish: 17 })).toBe(false)
})
test("it should support undefined type", () => {
    const M = types.model({
        undefinedish: types.undefined
    })
    expect(
        M.is({
            undefinedish: undefined
        })
    ).toBe(true)
    expect(M.is({})).toBe(true) // MWE: disputable, should be false?
    expect(M.is({ undefinedish: null })).toBe(false)
    expect(M.is({ undefinedish: 17 })).toBe(false)
})
