import { types, getEnv, getParent, getPath, cast, Instance } from "../../src"

const ChildModel = types
    .model("Child", {
        parentPropertyIsNullAfterCreate: false,
        parentEnvIsNullAfterCreate: false,
        parentPropertyIsNullAfterAttach: false
    })
    .views({
        get parent(): IParentModelInstance {
            return getParent<typeof ParentModel>(this)
        }
    })
    .actions({
        afterCreate() {
            // @ts-ignore
            this.parentPropertyIsNullAfterCreate = typeof this.parent.fetch === "undefined"
            this.parentEnvIsNullAfterCreate = typeof getEnv(this.parent).fetch === "undefined"
        },
        afterAttach() {
            // @ts-ignore
            this.parentPropertyIsNullAfterAttach = typeof this.parent.fetch === "undefined"
        }
    })

const ParentModel = types
    .model("Parent", {
        child: types.optional(ChildModel, {})
    })
    .views({
        get fetch() {
            return getEnv(this).fetch
        }
    })

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
        .views({
            get path() {
                return getPath(this)
            }
        })
        .actions({
            toggle() {
                this.finished = !this.finished
            }
        })

    const Todo = types
        .model("Todo", {
            id: types.optional(types.number, () => Math.random()),
            title: types.string,
            finished: false,
            subTodos: types.array(SubTodo)
        })
        .views({
            get path() {
                return getPath(this)
            }
        })
        .actions({
            toggle() {
                this.finished = !this.finished
            }
        })

    const TodoStore = types
        .model("TodoStore", {
            todos: types.array(Todo)
        })
        .views({
            get unfinishedTodoCount() {
                return this.todos.filter((todo) => !todo.finished).length
            }
        })
        .actions({
            addTodo(title: string) {
                this.todos.push({
                    title,
                    subTodos: [
                        {
                            title
                        }
                    ]
                })
            }
        })

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
