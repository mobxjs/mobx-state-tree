import { types, getSnapshot, applySnapshot } from "../"
import { test } from "ava"


test("it should support generic relative paths", t => {
    const User = types.model({
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: { $ref: "users/17"},
        users: {
            "17": { name: "Michel" },
            "18": { name: "Veria" }
        }
    })

    t.is(store.users.get("17")!.name, "Michel")
    t.is(store.users.get("18")!.name, "Veria")
    t.is(store.user.name, "Michel")

    store.user =  store.users.get("18")!
    t.is(store.user.name, "Veria")

    store.users.get("18")!.name = "Noa"
    t.is(store.user.name, "Noa")

    t.deepEqual(getSnapshot(store), {user: { $ref: "users/18" }, "users": {"17": {name: "Michel"}, "18": {name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in maps", t => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User, "users"),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: "17",
        users: {
            "17": { id: "17", name: "Michel" },
            "18": { id: "18", name: "Veria" }
        }
    })

    t.is(store.users.get("17")!.name as string, "Michel")
    t.is(store.users.get("18")!.name as string, "Veria")
    t.is(store.user.name as string, "Michel")

    store.user =  store.users.get("18")!
    t.is(store.user.name as string, "Veria")

    store.users.get("18")!.name = "Noa"
    t.is(store.user.name as string, "Noa")

    t.deepEqual(getSnapshot(store), {user: "18", "users": {"17": {id: "17", name: "Michel"}, "18": {id: "18", name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in arrays", t => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User, "/users/"),
        users: types.array(User)
    })

    const store = UserStore.create({
        user: "17",
        users: [
            { id: "17", name: "Michel" },
            { id: "18", name: "Veria" }
        ]
    })

    t.is(store.users[0].name, "Michel")
    t.is(store.users[1].name, "Veria")
    t.is(store.user.name, "Michel")

    store.user =  store.users[1]
    t.is(store.user.name, "Veria")

    store.users[1].name = "Noa"
    t.is(store.user.name, "Noa")

    t.deepEqual(getSnapshot(store), {user: "18", "users": [{id: "17", name: "Michel"}, {id: "18", name: "Noa"}]} as any) // TODO: better typings
})

test.skip("identifiers are required", (t) => {
    const Todo = types.model({
        id: types.identifier()
    })

    t.is(Todo.is({}), false)
    t.is(Todo.is({ id: "x" }), true)

    t.throws(() => Todo.create(), "bla")
})

test("identifiers cannot be modified", (t) => {
    const Todo = types.model({
        id: types.identifier()
    })

    const todo = Todo.create({ id: "x" })
    t.throws(() => todo.id = "stuff", "[mobx-state-tree] It is not allowed to change the identifier of an object, got: 'stuff'")
    t.throws(() => applySnapshot(todo, {}), "[mobx-state-tree] Snapshot {} is not assignable to type AnonymousModel. Expected { id: identifier() } instead.")
})
