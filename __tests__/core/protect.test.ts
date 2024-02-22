import { protect, unprotect, applySnapshot, types, isProtected, getParent, cast } from "../../src"
import { expect, test } from "bun:test"

const Todo = types
  .model("Todo", {
    title: ""
  })
  .actions((self) => {
    function setTitle(newTitle: string) {
      self.title = newTitle
    }
    return {
      setTitle
    }
  })
const Store = types.model("Store", {
  todos: types.array(Todo)
})
function createTestStore() {
  return Store.create({
    todos: [{ title: "Get coffee" }, { title: "Get biscuit" }]
  })
}
test("it should be possible to protect an object", () => {
  const store = createTestStore()
  unprotect(store)
  store.todos[1].title = "A"
  protect(store)
  expect(() => {
    store.todos[0].title = "B"
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action."
  )
  expect(store.todos[1].title).toBe("A")
  expect(store.todos[0].title).toBe("Get coffee")
  store.todos[0].setTitle("B")
  expect(store.todos[0].title).toBe("B")
})
test("protect should protect against any update", () => {
  const store = createTestStore()
  expect(
    // apply Snapshot / patch are currently allowed, even outside protected mode
    () => {
      applySnapshot(store, { todos: [{ title: "Get tea" }] })
    }
  ).not.toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@<root>', the object is protected and can only be modified by using an action."
  )
  expect(() => {
    store.todos.push({ title: "test" })
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo[]@/todos', the object is protected and can only be modified by using an action."
  )
  expect(() => {
    store.todos[0].title = "test"
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action."
  )
})
test("protect should also protect children", () => {
  const store = createTestStore()
  expect(() => {
    store.todos[0].title = "B"
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action."
  )
  store.todos[0].setTitle("B")
  expect(store.todos[0].title).toBe("B")
})
test("unprotected mode should be lost when attaching children", () => {
  const store = Store.create({ todos: [] })
  const t1 = Todo.create({ title: "hello" })
  unprotect(t1)
  expect(isProtected(t1)).toBe(false)
  expect(isProtected(store)).toBe(true)
  t1.title = "world" // ok
  unprotect(store)
  store.todos.push(t1)
  protect(store)
  expect(isProtected(t1)).toBe(true)
  expect(isProtected(store)).toBe(true)
  expect(() => {
    t1.title = "B"
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action."
  )
  store.todos[0].setTitle("C")
  expect(store.todos[0].title).toBe("C")
})
test("protected mode should be inherited when attaching children", () => {
  const store = Store.create({ todos: [] })
  unprotect(store)
  const t1 = Todo.create({ title: "hello" })
  expect(isProtected(t1)).toBe(true)
  expect(isProtected(store)).toBe(false)
  expect(() => {
    t1.title = "B"
  }).toThrow(
    "[mobx-state-tree] Cannot modify 'Todo@<root>', the object is protected and can only be modified by using an action."
  )
  store.todos.push(t1)
  t1.title = "world" // ok, now unprotected
  expect(isProtected(t1)).toBe(false)
  expect(isProtected(store)).toBe(false)
  expect(store.todos[0].title).toBe("world")
})
test("action cannot modify parent", () => {
  const Child = types
    .model("Child", {
      x: 2
    })
    .actions((self) => ({
      setParentX() {
        getParent<typeof self>(self).x += 1
      }
    }))
  const Parent = types.model("Parent", {
    x: 3,
    child: Child
  })
  const p = Parent.create({ child: {} })
  expect(() => p.child.setParentX()).toThrow(
    "[mobx-state-tree] Cannot modify 'Parent@<root>', the object is protected and can only be modified by using an action."
  )
})
