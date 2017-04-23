import {types, getEnv, clone, detach} from "../src"
import {test} from "ava"

const Todo = types.model({
    title: "test",
    get description() {
        return getEnv(this).useUppercase ? this.title.toUpperCase() : this.title
    }
})

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

    const todo = Todo.create(
        {},
        env
    )

    t.is(todo.description, "TEST")
    env.useUppercase = false
    t.is(todo.description, "test")
})

test("it should be possible to inherit environments", t => {
    const env = createEnvironment()

    const store = Store.create(
        { todos: [{}] },
        env
    )

    t.is(store.todos[0].description, "TEST")
    env.useUppercase = false
    t.is(store.todos[0].description, "test")
})

test("getEnv throws in absence of env", t => {
    const todo = Todo.create()
    t.throws(() => todo.description, "[mobx-state-tree] Node '' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()")
})

test("detach should preserve environment environments", t => {
    const env = createEnvironment()

    const store = Store.create(
        { todos: [{}] },
        env
    )

    const todo = detach(store.todos[0])

    t.is(todo.description, "TEST")
    env.useUppercase = false
    t.is(todo.description, "test")
})

test("it is not possible to assign instance with environment to a tree", t => {
    const env = createEnvironment()
    const store = Store.create(
        { todos: [] },
        env
    )
    const todo = Todo.create({}, env)
    t.throws(() => store.todos.push(todo), "[mobx-state-tree] A state tree that has been initialized with an environment cannot be made part of another state tree.")
})

test("clone preserves environnment", t => {
    const env = createEnvironment()

    const store = Store.create(
        { todos: [{}] },
        env
    )

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
        t.throws(() => getEnv(todo), "[mobx-state-tree] Node '' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()")
    }
    {
        const env2 = createEnvironment()
        const todo = clone(store.todos[0], env2)
        t.true(env2 === getEnv(todo))
    }
})