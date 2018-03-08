import { getSnapshot, types, unprotect } from "../src"
test("it should accept any serializable value", () => {
    const Factory = types.model({
        value: types.frozen
    })
    const doc = Factory.create()
    unprotect(doc)
    doc.value = { a: 1, b: 2 }
    expect(getSnapshot(doc)).toEqual({ value: { a: 1, b: 2 } })
})
if (process.env.NODE_ENV === "development") {
    test("it should throw if value is not serializable", () => {
        const Factory = types.model({
            value: types.frozen
        })
        const doc = Factory.create()
        unprotect(doc)
        expect(() => {
            doc.value = function IAmUnserializable() {}
        }).toThrowError(/Error while converting <function IAmUnserializable> to `frozen`/)
    })
}
