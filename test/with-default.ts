import {test} from "ava"
import {createFactory, getSnapshot, types} from "../"

test("it should provide a default value, if no snapshot is provided", t => {
    const Row = createFactory({
        name: '',
        quantity: 0
    })

    const Factory = createFactory({
        // TODO: as any due to #19
        rows: types.withDefault(types.array(Row) as any, [{name: 'test'}])
    })

    const doc = Factory.create()
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'test', quantity: 0}]})
})


test("it should use the snapshot if provided", t => {
    const Row = createFactory({
        name: '',
        quantity: 0
    })

    const Factory = createFactory({
        // TODO: as any due to #19
        rows: types.withDefault(types.array(Row), [{name: 'test'}])
    })

    const doc = Factory.create({rows: [{name: 'snapshot', quantity: 0}]})
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'snapshot', quantity: 0}]})
})


test("it should throw if default value is invalid snapshot", t => {
    const Row = createFactory({
        name: '',
        quantity: 0
    })

    const error = t.throws(() => {
        const Factory = createFactory({
            // TODO: as any due to #19
            rows: types.withDefault(types.array(Row) as any, [{wrongProp: true}])
        })
    })

    t.is(error.message, '[mobx-state-tree] Default value [{"wrongProp":true}] is not assignable to type AnonymousModel[]. Expected "{ name: primitive; quantity: primitive }[]"')
})