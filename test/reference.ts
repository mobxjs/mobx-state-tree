import { createFactory, types, getSnapshot, applySnapshot } from "../"
import { test } from "ava"


test("it should support generic relative paths", t => {
    const User = createFactory({
        name: types.primitive
    })
    const UserStore = createFactory({
        user: types.reference(User),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: { $ref: "users/17"},
        users: {
            "17": { name: "Michel" },
            "18": { name: "Veria" }
        }
    } as any /* TODO: typings */)

    t.is(store.users.get("17")!.name as string, "Michel") // TODO: improve typings
    t.is(store.users.get("18")!.name as string, "Veria") // TODO: improve typings
    t.is(store.user.name as string, "Michel") // TODO: improve typings

    store.user =  store.users.get("18")!
    t.is(store.user.name as string, "Veria") // TODO: improve typings

    store.users.get("18")!.name = "Noa" as any // TODO: improve typings.
    t.is(store.user.name as string, "Noa") // TODO: improve typings

    t.deepEqual(getSnapshot(store), {user: { $ref: "users/18" }, "users": {"17": {name: "Michel"}, "18": {name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in maps", t => {
    const User = createFactory({
        id: types.identifier(),
        name: types.primitive
    })
    const UserStore = createFactory({
        user: types.reference(User, "users"),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: "17",
        users: {
            "17": { id: "17", name: "Michel" },
            "18": { id: "18", name: "Veria" }
        }
    } as any /* TODO: typings */)

    t.is(store.users.get("17")!.name as string, "Michel") // TODO: improve typings
    t.is(store.users.get("18")!.name as string, "Veria") // TODO: improve typings
    t.is(store.user.name as string, "Michel") // TODO: improve typings

    store.user =  store.users.get("18")!
    t.is(store.user.name as string, "Veria") // TODO: improve typings

    store.users.get("18")!.name = "Noa" as any // TODO: improve typings.
    t.is(store.user.name as string, "Noa") // TODO: improve typings

    t.deepEqual(getSnapshot(store), {user: "18", "users": {"17": {id: "17", name: "Michel"}, "18": {id: "18", name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in arrays", t => {
    const User = createFactory({
        id: types.identifier(),
        name: types.primitive
    })
    const UserStore = createFactory({
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

    t.is(store.users[0].name as string, "Michel") // TODO: improve typings
    t.is(store.users[1].name as string, "Veria") // TODO: improve typings
    t.is(store.user.name as string, "Michel") // TODO: improve typings

    store.user =  store.users[1]
    t.is(store.user.name as string, "Veria") // TODO: improve typings

    store.users[1].name = "Noa" as any // TODO: improve typings.
    t.is(store.user.name as string, "Noa") // TODO: improve typings

    t.deepEqual(getSnapshot(store), {user: "18", "users": [{id: "17", name: "Michel"}, {id: "18", name: "Noa"}]} as any) // TODO: better typings
})

test.skip("identifiers are required", (t) => {
    const Todo = createFactory({
        id: types.identifier()
    })

    t.is(Todo.is({}), false)
    t.is(Todo.is({ id: "x" }), true)

    t.throws(() => Todo.create(), "bla")
})

test("identifiers cannot be modified", (t) => {
    const Todo = createFactory({
        id: types.identifier()
    })

    const todo = Todo.create({ id: "x" })
    t.throws(() => todo.id = "stuff", "[mobx-state-tree] It is not allowed to change the identifier of an object, got: 'stuff'")
    t.throws(() => applySnapshot(todo, {}), "[mobx-state-tree] Snapshot {} is not assignable to type AnonymousModel. Expected { id: identifier() } instead.")
})
