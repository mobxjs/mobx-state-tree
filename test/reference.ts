import { reaction } from "mobx"
import { test } from "ava"
import { types, getSnapshot, applySnapshot } from "../"


test("it should support generic relative paths", t => {
    const User = types.model({
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: { $ref: "/users/17"},
        users: {
            "17": { name: "Michel" },
            "18": { name: "Veria" }
        }
    })

    t.is(store.users.get("17")!.name, "Michel")
    t.is(store.users.get("18")!.name, "Veria")
    t.is(store.user!.name, "Michel")

    store.user =  store.users.get("18")!
    t.is(store.user.name, "Veria")

    store.users.get("18")!.name = "Noa"
    t.is(store.user.name, "Noa")

    t.deepEqual(getSnapshot(store), {user: { $ref: "/users/18" }, "users": {"17": {name: "Michel"}, "18": {name: "Noa"}}} as any) // TODO: better typings
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
    t.is(store.user!.name as string, "Michel")

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
        user: types.reference(User, "/users"),
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
    t.is(store.user!.name, "Michel")

    store.user =  store.users[1]
    t.is(store.user.name, "Veria")

    store.users[1].name = "Noa"
    t.is(store.user.name, "Noa")

    t.deepEqual(getSnapshot(store), {user: "18", "users": [{id: "17", name: "Michel"}, {id: "18", name: "Noa"}]} as any) // TODO: better typings
})

test("identifiers are required", (t) => {
    const Todo = types.model({
        id: types.identifier()
    })

    t.is(Todo.is({}), false)
    t.is(Todo.is({ id: "x" }), true)

    t.throws(() => Todo.create(), "[mobx-state-tree] Value '{}' is not assignable to type: AnonymousModel, expected an instance of AnonymousModel or a snapshot like '{ id: identifier }' instead.")
})

test("identifiers cannot be modified", (t) => {
    const Todo = types.model({
        id: types.identifier()
    })

    const todo = Todo.create({ id: "x" })
    t.throws(() => todo.id = "stuff", "[mobx-state-tree] It is not allowed to change the identifier of an object, got: 'stuff'")
    t.throws(() => applySnapshot(todo, {}), "[mobx-state-tree] Value '{}' is not assignable to type: AnonymousModel, expected an instance of AnonymousModel or a snapshot like '{ id: identifier }' instead.")
})

// TODO: duplicate test for ref without path
test("it should resolve refs during creation", t => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types.model({
        book: types.reference(Book, "../../books"),
        get price() {
            return this.book.price * 2
        }
    })
    const Store = types.model({
        books: types.array(Book),
        entries: types.array(BookEntry)
    })

    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    reaction(
        () => s.entries.reduce((a, e) => a + e.price, 0),
        v => values.push(v)
    )

    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)

    t.deepEqual(values, [4])
})