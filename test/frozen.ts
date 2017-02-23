import {test} from "ava"
import {createFactory, getSnapshot, types, IFactory} from "../"

test("it should accept any serializable value", t => {
    const Factory = createFactory({
        value: types.frozen
    })

    // TODO: waiting for conditional types in TypeScript :(
    const doc: any = Factory()

    doc.value = {a: 1, b: 2}
    t.deepEqual<any>(getSnapshot(doc), {value: {a: 1, b: 2}})
})


test("it should throw if value is not serializable", t => {
    const Factory = createFactory({
        value: types.frozen
    })

    // TODO: waiting for conditional types in TypeScript :(
    const doc: any = Factory()

    const error = t.throws(() => {
        doc.value = function IAmUnserializable(){}
    })

    t.is(error.message, '[mobx-state-tree] Given value should be serializable')
})