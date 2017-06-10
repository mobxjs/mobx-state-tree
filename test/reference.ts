import { reaction, autorun } from "mobx"
import { types, getSnapshot, applySnapshot, unprotect, resolvePath, detach, resolveIdentifier } from "../src"
import { test } from "ava"

test("it should support prefixed paths in maps", t => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User),
        users: types.map(User)
    })

    const store = UserStore.create({
        user: "17",
        users: {
            "17": { id: "17", name: "Michel" },
            "18": { id: "18", name: "Veria" }
        }
    })
    unprotect(store)

    t.is(store.users.get("17")!.name as string, "Michel")
    t.is(store.users.get("18")!.name as string, "Veria")
    t.is(store.user!.name as string, "Michel")

    store.user = store.users.get("18")!
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
        user: types.reference(User),
        users: types.array(User)
    })

    const store = UserStore.create({
        user: "17",
        users: [
            { id: "17", name: "Michel" },
            { id: "18", name: "Veria" }
        ]
    })
    unprotect(store)

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

    t.throws(() => Todo.create(),
        "[mobx-state-tree] Error while converting `{}` to `AnonymousModel`:\n" +
        "at path \"/id\" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier([object Object])` instead."
    )
})

test("identifiers cannot be modified", (t) => {
    const Todo = types.model({
        id: types.identifier()
    })

    const todo = Todo.create({ id: "x" })
    unprotect(todo)

    t.throws(() => todo.id = "stuff", "[mobx-state-tree] Tried to change identifier from 'x' to 'stuff'. Changing identifiers is not allowed.")
    t.throws(() => applySnapshot(todo, {}),
        "[mobx-state-tree] Error while converting `{}` to `AnonymousModel`:\n" +
        "at path \"/id\" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier([object Object])` instead.")
})

test("it should resolve refs during creation, when using path", t => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types.model({
        book: types.reference(Book),
        get price() {
            return this.book.price * 2
        }
    })
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })

    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)

    reaction(
        () => s.entries.reduce((a, e) => a + e.price, 0),
        v => values.push(v)
    )

    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)

    const entry = BookEntry.create({ book: s.books[0] }) // N.B. ref is initially not resolvable!
    s.entries.push(entry)
    t.is(s.entries[1].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 8)

    t.deepEqual(values, [4, 8])
})

test("it should resolve refs over late types", t => {
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types.model({
        book: types.reference(types.late(() => Book)),
        get price() {
            return this.book.price * 2
        }
    })
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })

    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)

    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)
})

test("it should resolve refs during creation, when using generic reference", t => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier(),
        price: types.number
    })
    const BookEntry = types.model({
        book: types.reference(Book),
        get price() {
            return this.book.price * 2
        }
    })
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })

    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)

    reaction(
        () => s.entries.reduce((a, e) => a + e.price, 0),
        v => values.push(v)
    )

    s.entries.push({ book: s.books[0] } as any)
    t.is(s.entries[0].price, 4)
    t.is(s.entries.reduce((a, e) => a + e.price, 0), 4)

    const entry = BookEntry.create({ book: s.books[0] }) // can refer to book, even when not part of tree yet

    t.deepEqual(getSnapshot(entry), { book: "3" })
    s.entries.push(entry)

    t.deepEqual(values, [4, 8])
})

test("identifiers should only support types.string and types.number", t => {
    t.throws(
        () => types.model({
            id: types.identifier(types.model({}))
        }),
        "[mobx-state-tree] Only 'types.number' and 'types.string' are acceptable as type specification for identifiers"
    )
})

test("string identifiers should not accept numbers", t => {
    const F = types.model({
        id: types.identifier()
    })
    t.is(F.is({ id: "4" }), true)
    t.is(F.is({ id: 4 }), false)

    const F2 = types.model({
        id: types.identifier(types.string)
    })
    t.is(F2.is({ id: "4" }), true)
    t.is(F2.is({ id: 4 }), false)
})

test("122 - identifiers should support numbers as well", t => {
    const F = types.model({
        id: types.identifier(types.number)
    })
    t.is(F.create({
        id: 3
    }).id, 3)

    t.is(F.is({ id: 4 }), true)
    t.is(F.is({ id: "4" }), false)
})

test("self reference with a late type", t => {
    interface IBook {
        id: string,
        genre: string,
        reference: IBook
    }

    const Book = types.model("Book", {
      id: types.identifier(),
      genre: types.string ,
      reference: types.reference(types.late<any, IBook>(() => Book))
    })

    const Store = types.model("Store", {
        books: types.array(Book)
      },
      {
        addBook(book) {
          this.books.push(book)
        }
    })

    const s = Store.create({
        books: [{ id: "1", genre: "thriller", reference: "" }]
    })

    const book2 = Book.create({
        id: "2",
        genre: "romance",
        reference: s.books[0]
    })

    s.addBook(book2)

    t.is((s as any).books[1].reference.genre, "thriller")
})

test("when applying a snapshot, reference should resolve correctly if value added after", t => {

    const Box = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Factory = types.model({
        selected: types.reference(Box),
        boxes: types.array(Box)
    })

    t.notThrows(() => Factory.create({
        selected: 1,
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}]
    }))
})

test("it should fail when reference snapshot is ambiguous", t => {
    const Box = types.model("Box", {
        id: types.identifier(types.number),
        name: types.string
    })

    const Arrow = types.model("Arrow", {
        id: types.identifier(types.number),
        name: types.string
    })

    const BoxOrArrow = types.union(Box, Arrow)

    const Factory = types.model({
        selected: types.reference(BoxOrArrow),
        boxes: types.array(Box),
        arrows: types.array(Arrow)
    })

    const store = Factory.create({
        selected: 2,
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}],
        arrows: [{id: 2, name: "arrow"}]
    })

    t.throws(() => {
        store.selected // store.boxes[1] // throws because it can't know if you mean a box or an arrow!
    }, "[mobx-state-tree] Cannot resolve a reference to type 'Arrow | Box' with id: '2' unambigously, there are multiple candidates: /boxes/1, /arrows/0")

    unprotect(store)

    // first update the reference, than create a new matching item! Ref becomes ambigous now...
    store.selected = 1 as any
    t.is(store.selected, store.boxes[0]) // unambigous identifier

    let err
    autorun(() => store.selected).onError(e => err = e)

    t.is(store.selected, store.boxes[0]) // unambigous identifier
    store.arrows.push({ id: 1, name: "oops" })
    t.is(err.message, "[mobx-state-tree] Cannot resolve a reference to type \'Arrow | Box\' with id: \'1\' unambigously, there are multiple candidates: /boxes/0, /arrows/1")
})

test("it should support array of references", t => {
    const Box = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Factory = types.model({
        selected: types.array(types.reference(Box)),
        boxes: types.array(Box)
    })

    const store = Factory.create({
        selected: [],
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}]
    })
    unprotect(store)

    t.notThrows(() => {
        store.selected.push(store.boxes[0])
    })

    t.deepEqual<any>(getSnapshot(store.selected), [1])

    t.notThrows(() => {
        store.selected.push(store.boxes[1])
    })

    t.deepEqual<any>(getSnapshot(store.selected), [1, 2])
})

test("it should restore array of references from snapshot", t => {
    const Box = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Factory = types.model({
        selected: types.array(types.reference(Box)),
        boxes: types.array(Box)
    })

    const store = Factory.create({
        selected: [1, 2],
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}]
    })
    unprotect(store)

    t.deepEqual<any>(store.selected[0] === store.boxes[0], true)
    t.deepEqual<any>(store.selected[1] === store.boxes[1], true)
})

test("it should support map of references", t => {
    const Box = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Factory = types.model({
        selected: types.map(types.reference(Box)),
        boxes: types.array(Box)
    })

    const store = Factory.create({
        selected: {},
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}]
    })
    unprotect(store)

    t.notThrows(() => {
        store.selected.set("from", store.boxes[0])
    })

    t.deepEqual<any>(getSnapshot(store.selected), { from: 1 })

    t.notThrows(() => {
        store.selected.set("to", store.boxes[1])
    })

    t.deepEqual<any>(getSnapshot(store.selected), { from: 1, to: 2 })
})

test("it should restore map of references from snapshot", t => {

    const Box = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Factory = types.model({
        selected: types.map(types.reference(Box)),
        boxes: types.array(Box)
    })

    const store = Factory.create({
        selected: { from: 1, to: 2 },
        boxes: [{id: 1, name: "hello"}, {id: 2, name: "world"}]
    })
    unprotect(store)

    t.deepEqual<any>(store.selected.get("from") === store.boxes[0], true)
    t.deepEqual<any>(store.selected.get("to") === store.boxes[1], true)
})

test("it should support relative lookups", t => {
    const Node = types.model({
        id: types.identifier(types.number),
        children: types.optional(types.array(types.late(() => Node)), [])
    })

    const root = Node.create({
        id: 1,
        children: [{
            id: 2,
            children: [{
                id: 4
            }]
        }, {
            id: 3
        }]
    })
    unprotect(root)

    t.deepEqual(getSnapshot(root), {"id":1,"children":[{"id":2,"children":[{"id":4,"children":[]}]},{"id":3,"children":[]}]})

    t.is(resolveIdentifier(Node, root, 1), root)
    t.is(resolveIdentifier(Node, root, 4), root.children[0].children[0])
    t.is(resolveIdentifier(Node, root.children[0].children[0], 3), root.children[1])

    const n2 = detach(root.children[0])
    unprotect(n2)
    t.is(resolveIdentifier(Node, n2, 2), n2)
    t.is(resolveIdentifier(Node, root, 2), undefined)
    t.is(resolveIdentifier(Node, root, 4), undefined)
    t.is(resolveIdentifier(Node, n2, 3), undefined)
    t.is(resolveIdentifier(Node, n2, 4), n2.children[0])
    t.is(resolveIdentifier(Node, n2.children[0], 2), n2)

    const n5 = Node.create({ id: 5 })
    t.is(resolveIdentifier(Node, n5, 4), undefined)
    n2.children.push(n5)
    t.is(resolveIdentifier(Node, n5, 4), n2.children[0])
    t.is(resolveIdentifier(Node, n2.children[0], 5), n5)
})

test("References are non-nullable by default", t => {
    const Todo = types.model({
        id: types.identifier(types.number)
    })
    const Store = types.model({
        todo: types.maybe(Todo),
        ref: types.reference(Todo),
        maybeRef: types.maybe(types.reference(Todo))
    })

    t.is(Store.is({}), false)
    t.is(Store.is({ ref: 3 }), true)
    t.is(Store.is({ ref: null }), false)
    t.is(Store.is({ ref: undefined }), false)
    t.is(Store.is({ ref: 3, maybeRef: 3 }), true)
    t.is(Store.is({ ref: 3, maybeRef: null }), true)
    t.is(Store.is({ ref: 3, maybeRef: undefined }), true)

    let store = Store.create({
        todo: { id: 3 },
        ref: 3
    })
    t.is(store.ref, store.todo)
    t.is(store.maybeRef, null)

    store = Store.create({
        todo: { id: 3 },
        ref: 4
    })
    unprotect(store)
    t.is(store.maybeRef, null)
    t.throws(() => store.ref, "[mobx-state-tree] Failed to resolve reference of type AnonymousModel: '4' (in: /ref)")
    store.maybeRef = 3 as any
    t.is(store.maybeRef, store.todo)
    store.maybeRef = 4 as any
    t.throws(() => store.maybeRef, "[mobx-state-tree] Failed to resolve reference of type AnonymousModel: '4' (in: /maybeRef)")
    store.maybeRef = null
    t.is(store.maybeRef, null)
    t.throws(
        () => store.ref = null,
        "[mobx-state-tree] Error while converting `null` to `reference(AnonymousModel)`:\nvalue `null` is not assignable to type: `reference(AnonymousModel)` (Value '`null`' is not a valid reference. Expected a string or number.), expected an instance of `reference(AnonymousModel)` or a snapshot like `reference(AnonymousModel)` instead."
    )
})