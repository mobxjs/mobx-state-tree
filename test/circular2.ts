import { types } from "../src"
import { test } from "ava"
import { LateTodo1, LateStore1 } from "./circular1"
// combine function hosting with types.late to support circular refs between files!
export function LateTodo2() {
    return types.model({
        done: types.boolean
    })
}
export function LateStore2() {
    return types.model({
        todo: types.late(LateTodo1)
    })
}

test("circular test 2 should work", t => {
    const Store1 = types.late(LateStore1)
    const Store2 = types.late(LateStore2)
    t.is(Store1.is({}), false)
    t.is(Store1.is({ todo: { done: true } }), true)
    const s1 = Store1.create({ todo: { done: true } })
    t.is(s1.todo.done, true)
    t.is(Store2.is({}), false)
    t.is(Store2.is({ todo: { done: true } }), true)
    const s2 = Store2.create({ todo: { done: true } })
    t.is(s2.todo.done, true)
})
