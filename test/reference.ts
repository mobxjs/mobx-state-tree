import { createFactory, types, getSnapshot } from "../"
import { test } from "ava"


test("it should support generic relative paths", t => {
    const User = createFactory({
        name: types.primitive()
    })
    const UserStore = createFactory({
        user: types.reference(User),
        users: types.map(User)
    })

    const store = UserStore({
        user: { $ref: "users/17" },
        users: {
            "17": { name: "Michel" },
            "18": { name: "Veria" }
        }
    })

    t.is(store.users.get("17").name as string, "Michel") // TODO: improve typings
    t.is(store.users.get("18").name as string, "Veria") // TODO: improve typings
    t.is(store.user.name as string, "Michel") // TODO: improve typings

    store.user =  store.users.get("18")
    t.is(store.user.name as string, "Veria") // TODO: improve typings

    store.users.get("18").name = "Noa" as any // TODO: improve typings.
    t.is(store.user.name as string, "Noa") // TODO: improve typings

    t.deepEqual(getSnapshot(store), {user: { $ref: "users/18" }, "users": {"17": {name: "Michel"}, "18": {name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in maps", t => {
    const User = createFactory({
        id: types.primitive(),
        name: types.primitive()
    })
    const UserStore = createFactory({
        user: types.reference(User, "users/id"),
        users: types.map(User)
    })

    const store = UserStore({
        user: "17",
        users: {
            "17": { id: "17", name: "Michel" },
            "18": { id: "18", name: "Veria" }
        }
    })

    t.is(store.users.get("17").name as string, "Michel") // TODO: improve typings
    t.is(store.users.get("18").name as string, "Veria") // TODO: improve typings
    t.is(store.user.name as string, "Michel") // TODO: improve typings

    store.user =  store.users.get("18")
    t.is(store.user.name as string, "Veria") // TODO: improve typings

    store.users.get("18").name = "Noa" as any // TODO: improve typings.
    t.is(store.user.name as string, "Noa") // TODO: improve typings

    t.deepEqual(getSnapshot(store), {user: "18", "users": {"17": {id: "17", name: "Michel"}, "18": {id: "18", name: "Noa"}}} as any) // TODO: better typings
})

test("it should support prefixed paths in arrays", t => {
    const User = createFactory({
        id: types.primitive(),
        name: types.primitive()
    })
    const UserStore = createFactory({
        user: types.reference(User, "/users/id"),
        users: types.array(User)
    })

    const store = UserStore({
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
