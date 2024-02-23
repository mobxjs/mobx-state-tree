import { types, getEnv, getParent, getPath, Instance } from "../../src"
import { expect, test } from "bun:test"

const ChildModel = types
  .model("Child", {
    parentPropertyIsNullAfterCreate: false,
    parentEnvIsNullAfterCreate: false,
    parentPropertyIsNullAfterAttach: false
  })
  .views((self) => {
    return {
      get parent(): IParentModelInstance {
        return getParent<typeof ParentModel>(self)
      }
    }
  })
  .actions((self) => ({
    afterCreate() {
      self.parentPropertyIsNullAfterCreate = typeof self.parent.fetch === "undefined"
      self.parentEnvIsNullAfterCreate = typeof getEnv(self.parent).fetch === "undefined"
    },
    afterAttach() {
      self.parentPropertyIsNullAfterAttach = typeof self.parent.fetch === "undefined"
    }
  }))

const ParentModel = types
  .model("Parent", {
    child: types.optional(ChildModel, {})
  })
  .views((self) => ({
    get fetch() {
      return getEnv(self).fetch
    }
  }))

interface IParentModelInstance extends Instance<typeof ParentModel> {}

// NOTE: parents are now always created before children;
// moreover, we do not actually have actions hash during object-node creation
test("Parent property have value during child's afterCreate() event", () => {
  const mockFetcher = () => Promise.resolve(true)
  const parent = ParentModel.create({}, { fetch: mockFetcher })
  // Because the child is created before the parent creation is finished, this one will yield `true` (the .fetch view is still undefined)
  expect(parent.child.parentPropertyIsNullAfterCreate).toBe(false)
  // ... but, the env is available
  expect(parent.child.parentEnvIsNullAfterCreate).toBe(false)
})
test("Parent property has value during child's afterAttach() event", () => {
  const mockFetcher = () => Promise.resolve(true)
  const parent = ParentModel.create({}, { fetch: mockFetcher })
  expect(parent.child.parentPropertyIsNullAfterAttach).toBe(false)
})

test("#917", () => {
  const SubTodo = types
    .model("SubTodo", {
      id: types.optional(types.number, () => Math.random()),
      title: types.string,
      finished: false
    })
    .views((self) => ({
      get path() {
        return getPath(self)
      }
    }))
    .actions((self) => ({
      toggle() {
        self.finished = !self.finished
      }
    }))

  const Todo = types
    .model("Todo", {
      id: types.optional(types.number, () => Math.random()),
      title: types.string,
      finished: false,
      subTodos: types.array(SubTodo)
    })
    .views((self) => ({
      get path() {
        return getPath(self)
      }
    }))
    .actions((self) => ({
      toggle() {
        self.finished = !self.finished
      }
    }))

  const TodoStore = types
    .model("TodoStore", {
      todos: types.array(Todo)
    })
    .views((self) => ({
      get unfinishedTodoCount() {
        return self.todos.filter((todo) => !todo.finished).length
      }
    }))
    .actions((self) => ({
      addTodo(title: string) {
        self.todos.push({
          title,
          subTodos: [
            {
              title
            }
          ]
        })
      }
    }))

  const store2 = TodoStore.create({
    todos: [
      Todo.create({
        title: "get Coffee",
        subTodos: [
          SubTodo.create({
            title: "test"
          })
        ]
      })
    ]
  })

  expect(store2.todos[0].path).toBe("/todos/0")
  expect(store2.todos[0].subTodos[0].path).toBe("/todos/0/subTodos/0")
})
