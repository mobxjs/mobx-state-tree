import { types, getEnv, clone, detach, unprotect } from "../src"
import { test } from "ava"
const Todo = types
    .model({
        title: "test"
    })
    .views(self => ({
        get description() {
            return getEnv(self).useUppercase ? self.title.toUpperCase() : self.title
        }
    }))
const Store = types.model({
    todos: types.array(Todo)
})
function createEnvironment() {
    return {
        useUppercase: true
    }
}

test("it should be possible to use environments", t => {
    const env = createEnvironment()
    const todo = Todo.create({}, env)
    t.is(todo.description, "TEST")
    env.useUppercase = false
    t.is(todo.description, "test")
})

test("it should be possible to inherit environments", t => {
    const env = createEnvironment()
    const store = Store.create({ todos: [{}] }, env)
    t.is(store.todos[0].description, "TEST")
    env.useUppercase = false
    t.is(store.todos[0].description, "test")
})

test("getEnv throws in absence of env", t => {
    const todo = Todo.create()
    t.throws(
        () => todo.description,
        "[mobx-state-tree] Node 'AnonymousModel@<root>' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()"
    )
})

test("detach should preserve environment", t => {
    const env = createEnvironment()
    const store = Store.create({ todos: [{}] }, env)
    unprotect(store)
    const todo = detach(store.todos[0])
    t.is(todo.description, "TEST")
    env.useUppercase = false
    t.is(todo.description, "test")
})

test("it possible to assign instance with the same environment as the parent to a tree", t => {
    const env = createEnvironment()
    const store = Store.create({ todos: [] }, env)
    const todo = Todo.create({}, env)
    unprotect(store)
    store.todos.push(todo)
    t.true(store.todos.length === 1)
    t.true(getEnv(store.todos) === getEnv(store.todos[0])
    t.true(getEnv(todo) === getEnv(store.todos[0])
})

test("it is not possible to assign instance with a different environment than the parent to a tree", t => {
    const env1 = createEnvironment()
    const env2 = createEnvironment()
    const store = Store.create({ todos: [] }, env1)
    const todo = Todo.create({}, env2)
    unprotect(store)
    t.throws(
        () => store.todos.push(todo),
        "[mobx-state-tree] A state tree cannot be made part of another state tree as long as their environments are different."
    )
})

test("clone preserves environnment", t => {
    const env = createEnvironment()
    const store = Store.create({ todos: [{}] }, env)
    {
        const todo = clone(store.todos[0])
        t.true(getEnv(todo) === env)
    }
    {
        const todo = clone(store.todos[0], true)
        t.true(getEnv(todo) === env)
    }
    {
        const todo = clone(store.todos[0], false)
        t.throws(
            () => getEnv(todo),
            "[mobx-state-tree] Node 'AnonymousModel@<root>' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()"
        )
    }
    {
        const env2 = createEnvironment()
        const todo = clone(store.todos[0], env2)
        t.true(env2 === getEnv(todo))
    }
})
