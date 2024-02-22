import { types } from "../../src"
import { LateTodo1, LateStore1 } from "./circular1.test"
import { expect, test } from "bun:test"
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

test("circular test 2 should work", () => {
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
