import { test } from "ava"
import { getSnapshot, types, unprotect } from "../src"

test("it should accept any serializable value", t => {
    const Factory = types.model({
        value: types.frozen
    })

    const doc = Factory.create()
    unprotect(doc)

    doc.value = { a: 1, b: 2 }
    t.deepEqual<any>(getSnapshot(doc), { value: { a: 1, b: 2 } })
})

test("it should throw if value is not serializable", t => {
    const Factory = types.model({
        value: types.frozen
    })

    const doc: any = Factory.create()
    unprotect(doc)

    t.throws(() => {
        doc.value = function IAmUnserializable() {}
    }, /Error while converting <function IAmUnserializable> to `frozen`/)
})
