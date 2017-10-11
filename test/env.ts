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

test("getEnv returns empty object without environment", t => {
    const todo = Todo.create()
    t.deepEqual(getEnv(todo), {})
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

test("it is possible to assign instance with the same environment as the parent to a tree", t => {
    const env = createEnvironment()
    const store = Store.create({ todos: [] }, env)
    const todo = Todo.create({}, env)
    unprotect(store)
    store.todos.push(todo)
    t.true(store.todos.length === 1)
    t.true(getEnv(store.todos) === getEnv(store.todos[0]))
    t.true(getEnv(todo) === getEnv(store.todos[0]))
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

test("it is possible to set a value inside a map of a map when using the same environment", t => {
    const env = createEnvironment()
    const EmptyModel = types.model({})
    const MapOfEmptyModel = types.model({
        map: types.map(EmptyModel)
    })
    const MapOfMapOfEmptyModel = types.model({
        map: types.map(MapOfEmptyModel)
    })
    const mapOfMap = MapOfMapOfEmptyModel.create(
        {
            map: {
                whatever: {
                    map: {}
                }
            }
        },
        env
    )
    unprotect(mapOfMap)
    // this should not throw
    mapOfMap.map.get("whatever")!.map.set("1234", EmptyModel.create({}, env))
    t.true(getEnv(mapOfMap) === env)
    t.true(getEnv(mapOfMap.map.get("whatever")!.map.get("1234")!) === env)
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
        t.deepEqual(getEnv(todo), {})
    }
    {
        const env2 = createEnvironment()
        const todo = clone(store.todos[0], env2)
        t.true(env2 === getEnv(todo))
    }
})
