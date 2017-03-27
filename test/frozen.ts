import {test} from "ava"
import {createFactory, getSnapshot, types, IType} from "../"

test("it should accept any serializable value", t => {
    const Factory = createFactory({
        value: types.frozen
    })

    const doc = Factory.create()

    doc.value = {a: 1, b: 2}
    t.deepEqual<any>(getSnapshot(doc), {value: {a: 1, b: 2}})
})


test("it should throw if value is not serializable", t => {
    const Factory = createFactory({
        value: types.frozen
    })

    const doc: any = Factory.create()

    const error = t.throws(() => {
        doc.value = function IAmUnserializable(){}
    })

    t.is(error.message, '[mobx-state-tree] Given value should be serializable')
})