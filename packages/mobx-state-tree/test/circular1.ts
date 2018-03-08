import { types } from "../src"
import { LateTodo2, LateStore2 } from "./circular2"
// combine function hosting with types.late to support circular refs between files!
export function LateStore1() {
    return types.model({
        todo: types.late(LateTodo2)
    })
}
export function LateTodo1() {
    return types.model({
        done: types.boolean
    })
}
test("circular test 1 should work", () => {
    const Store1 = types.late(LateStore1)
    const Store2 = types.late(LateStore2)
    expect(Store1.is({})).toBe(false)
    expect(Store1.is({ todo: { done: true } })).toBe(true)
    const s1 = Store1.create({ todo: { done: true } })
    expect(s1.todo.done).toBe(true)
    expect(Store2.is({})).toBe(false)
    expect(Store2.is({ todo: { done: true } })).toBe(true)
    const s2 = Store2.create({ todo: { done: true } })
    expect(s2.todo.done).toBe(true)
})
