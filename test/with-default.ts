import {test} from "ava"
import {getSnapshot, types} from "../src"

test("it should provide a default value, if no snapshot is provided", t => {
    const Row = types.model({
        name: '',
        quantity: 0
    })

    const Factory = types.model({
        rows: types.withDefault(types.array(Row), [{name: 'test'}])
    })

    const doc = Factory.create()
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'test', quantity: 0}]})
})


test("it should use the snapshot if provided", t => {
    const Row = types.model({
        name: '',
        quantity: 0
    })

    const Factory = types.model({
        rows: types.withDefault(types.array(Row), [{name: 'test'}])
    })

    const doc = Factory.create({rows: [{name: 'snapshot', quantity: 0}]})
    t.deepEqual<any>(getSnapshot(doc), {rows: [{name: 'snapshot', quantity: 0}]})
})


test("it should throw if default value is invalid snapshot", t => {
    const Row = types.model({
        name: types.string,
        quantity: types.number
    })

    const error = t.throws(() => {
        const Factory = types.model({
            rows: types.withDefault(types.array(Row), [{}])
        })
    })

    t.is(error.message, "[mobx-state-tree] Value \'[{}]\' is not assignable to type: AnonymousModel[], expected an instance of AnonymousModel[] or a snapshot like \'{ name: string; quantity: number }[]\' instead.")
})

test("it should accept a function to provide dynamic values", t => {
    let defaultValue: any = 1
    const Factory = types.model({
        a: types.withDefault(types.number, () => defaultValue)
    })

    t.deepEqual(getSnapshot(Factory.create()), {a: 1})

    defaultValue = 2
    t.deepEqual(getSnapshot(Factory.create()), {a: 2})

    defaultValue = "hello world!"
    const ex = t.throws(() => Factory.create())
    t.deepEqual(ex.message, "[mobx-state-tree] Value is not assignable to \'number\'")
})
