import { reaction, autorun, isObservable } from "mobx"
import {
    types,
    getSnapshot,
    applySnapshot,
    onPatch,
    applyPatch,
    unprotect,
    detach,
    resolveIdentifier,
    getRoot,
    cast,
    SnapshotOut,
    IAnyModelType,
    Instance,
    SnapshotOrInstance,
    isAlive
} from "../../src"

test("it should support prefixed paths in maps", () => {
    const User = types.model({
        id: types.identifier,
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
    expect(store.users.get("17")!.name).toBe("Michel")
    expect(store.users.get("18")!.name).toBe("Veria")
    expect(store.user.name).toBe("Michel")
    store.user = store.users.get("18")!
    expect(store.user.name).toBe("Veria")
    store.users.get("18")!.name = "Noa"
    expect(store.user.name).toBe("Noa")
    expect(getSnapshot(store)).toEqual({
        user: "18",
        users: { "17": { id: "17", name: "Michel" }, "18": { id: "18", name: "Noa" } }
    }) // TODO: better typings
})
test("it should support prefixed paths in arrays", () => {
    const User = types.model({
        id: types.identifier,
        name: types.string
    })
    const UserStore = types.model({
        user: types.reference(User),
        users: types.array(User)
    })
    const store = UserStore.create({
        user: "17",
        users: [{ id: "17", name: "Michel" }, { id: "18", name: "Veria" }]
    })
    unprotect(store)
    expect(store.users[0].name).toBe("Michel")
    expect(store.users[1].name).toBe("Veria")
    expect(store.user.name).toBe("Michel")
    store.user = store.users[1]
    expect(store.user.name).toBe("Veria")
    store.users[1].name = "Noa"
    expect(store.user.name).toBe("Noa")
    expect(getSnapshot(store)).toEqual({
        user: "18",
        users: [{ id: "17", name: "Michel" }, { id: "18", name: "Noa" }]
    } as SnapshotOut<typeof store>)
})
if (process.env.NODE_ENV !== "production") {
    test("identifiers are required", () => {
        const Todo = types.model({
            id: types.identifier
        })
        expect(Todo.is({})).toBe(false)
        expect(Todo.is({ id: "x" })).toBe(true)
        expect(() => (Todo.create as any)()).toThrowError(
            " `undefined` is not assignable to type: `identifier` (Value is not a valid identifier, expected a string)"
        )
    })
    test("identifiers cannot be modified", () => {
        const Todo = types.model({
            id: types.identifier
        })
        const todo = Todo.create({ id: "x" })
        unprotect(todo)
        expect(() => (todo.id = "stuff")).toThrowError(
            "[mobx-state-tree] Tried to change identifier from 'x' to 'stuff'. Changing identifiers is not allowed."
        )
        expect(() => applySnapshot(todo, { id: "stuff" })).toThrowError(
            "[mobx-state-tree] Tried to change identifier from 'x' to 'stuff'. Changing identifiers is not allowed."
        )
    })
}
test("it should resolve refs during creation, when using path", () => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier,
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(Book)
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    reaction(() => s.entries.reduce((a, e) => a + e.price, 0), v => values.push(v))
    s.entries.push(cast({ book: s.books[0] }))
    expect(s.entries[0].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(4)
    const entry = BookEntry.create({ book: s.books[0] }) // N.B. ref is initially not resolvable!
    s.entries.push(entry)
    expect(s.entries[1].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(8)
    expect(values).toEqual([4, 8])
})
test("it should resolve refs over late types", () => {
    const Book = types.model({
        id: types.identifier,
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(types.late(() => Book))
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.array(BookEntry)
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    s.entries.push(cast({ book: s.books[0] }))
    expect(s.entries[0].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(4)
})
test("it should resolve refs during creation, when using generic reference", () => {
    const values: number[] = []
    const Book = types.model({
        id: types.identifier,
        price: types.number
    })
    const BookEntry = types
        .model({
            book: types.reference(Book)
        })
        .views(self => ({
            get price() {
                return self.book.price * 2
            }
        }))
    const Store = types.model({
        books: types.array(Book),
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    reaction(() => s.entries.reduce((a, e) => a + e.price, 0), v => values.push(v))
    s.entries.push(cast({ book: s.books[0] }))
    expect(s.entries[0].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(4)
    const entry = BookEntry.create({ book: s.books[0] }) // can refer to book, even when not part of tree yet
    expect(getSnapshot(entry)).toEqual({ book: "3" })
    s.entries.push(entry)
    expect(values).toEqual([4, 8])
})

test("identifiers should support subtypes of types.string and types.number", () => {
    const M = types.model({
        id: types.refinement(types.identifierNumber, n => n > 5)
    })
    expect(M.is({})).toBe(false)
    expect(M.is({ id: "test" })).toBe(false)
    expect(M.is({ id: "6" })).toBe(false)
    expect(M.is({ id: "4" })).toBe(false)
    expect(M.is({ id: 6 })).toBe(true)
    expect(M.is({ id: 4 })).toBe(false)

    const S = types.model({
        mies: types.map(M),
        ref: types.reference(M)
    })
    const s = S.create({ mies: { "7": { id: 7 } }, ref: "7" })
    expect(s.mies.get("7")).toBeTruthy()
    expect(s.ref).toBe(s.mies.get("7"))
})

test("string identifiers should not accept numbers", () => {
    const F = types.model({
        id: types.identifier
    })
    expect(F.is({ id: "4" })).toBe(true)
    expect(F.is({ id: 4 })).toBe(false)
    const F2 = types.model({
        id: types.identifier
    })
    expect(F2.is({ id: "4" })).toBe(true)
    expect(F2.is({ id: 4 })).toBe(false)
})
test("122 - identifiers should support numbers as well", () => {
    const F = types.model({
        id: types.identifierNumber
    })
    expect(
        F.create({
            id: 3
        }).id
    ).toBe(3)

    expect(F.is({ id: 4 })).toBe(true)
    expect(F.is({ id: "4" })).toBe(false)
    expect(F.is({ id: "bla" })).toBe(false)
})
test("self reference with a late type", () => {
    const Book = types.model("Book", {
        id: types.identifier,
        genre: types.string,
        reference: types.reference(types.late((): IAnyModelType => Book))
    })
    const Store = types
        .model("Store", {
            books: types.array(Book)
        })
        .actions(self => {
            function addBook(book: typeof Book.Type | typeof Book.CreationType) {
                self.books.push(book)
            }
            return {
                addBook
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
    expect((s.books[1].reference as Instance<typeof Book>).genre).toBe("thriller")
})
test("when applying a snapshot, reference should resolve correctly if value added after", () => {
    const Box = types.model({
        id: types.identifierNumber,
        name: types.string
    })
    const Factory = types.model({
        selected: types.reference(Box),
        boxes: types.array(Box)
    })
    expect(() =>
        Factory.create({
            selected: 1,
            boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
        })
    ).not.toThrow()
})
test("it should fail when reference snapshot is ambiguous", () => {
    const Box = types.model("Box", {
        id: types.identifierNumber,
        name: types.string
    })
    const Arrow = types.model("Arrow", {
        id: types.identifierNumber,
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
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }],
        arrows: [{ id: 2, name: "arrow" }]
    })
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        store.selected // store.boxes[1] // throws because it can't know if you mean a box or an arrow!
    }).toThrowError(
        "[mobx-state-tree] Cannot resolve a reference to type '(Box | Arrow)' with id: '2' unambigously, there are multiple candidates: /boxes/1, /arrows/0"
    )
    unprotect(store)
    // first update the reference, than create a new matching item! Ref becomes ambigous now...
    store.selected = cast(1) // valid assignment
    expect(store.selected).toBe(store.boxes[0]) // unambigous identifier
    let err!: Error
    autorun(() => store.selected, {
        onError(e) {
            err = e
        }
    })
    expect(store.selected).toBe(store.boxes[0]) // unambigous identifier
    store.arrows.push(cast({ id: 1, name: "oops" }))
    expect(err.message).toBe(
        "[mobx-state-tree] Cannot resolve a reference to type '(Box | Arrow)' with id: '1' unambigously, there are multiple candidates: /boxes/0, /arrows/1"
    )
})
test("it should support array of references", () => {
    const Box = types.model({
        id: types.identifierNumber,
        name: types.string
    })
    const Factory = types.model({
        selected: types.array(types.reference(Box)),
        boxes: types.array(Box)
    })
    const store = Factory.create({
        selected: [],
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    })
    unprotect(store)
    expect(() => {
        store.selected.push(store.boxes[0])
    }).not.toThrow()
    expect(getSnapshot(store.selected)).toEqual([1])
    expect(() => {
        store.selected.push(store.boxes[1])
    }).not.toThrow()
    expect(getSnapshot(store.selected)).toEqual([1, 2])
})
test("it should restore array of references from snapshot", () => {
    const Box = types.model({
        id: types.identifierNumber,
        name: types.string
    })
    const Factory = types.model({
        selected: types.array(types.reference(Box)),
        boxes: types.array(Box)
    })
    const store = Factory.create({
        selected: [1, 2],
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    })
    unprotect(store)
    expect(store.selected[0] === store.boxes[0]).toEqual(true)
    expect(store.selected[1] === store.boxes[1]).toEqual(true)
})
test("it should support map of references", () => {
    const Box = types.model({
        id: types.identifierNumber,
        name: types.string
    })
    const Factory = types.model({
        selected: types.map(types.reference(Box)),
        boxes: types.array(Box)
    })
    const store = Factory.create({
        selected: {},
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    })
    unprotect(store)
    expect(() => {
        store.selected.set("from", store.boxes[0])
    }).not.toThrow()
    expect(getSnapshot(store.selected)).toEqual({ from: 1 })
    expect(() => {
        store.selected.set("to", store.boxes[1])
    }).not.toThrow()
    expect(getSnapshot(store.selected)).toEqual({ from: 1, to: 2 })
})
test("it should restore map of references from snapshot", () => {
    const Box = types.model({
        id: types.identifierNumber,
        name: types.string
    })
    const Factory = types.model({
        selected: types.map(types.reference(Box)),
        boxes: types.array(Box)
    })
    const store = Factory.create({
        selected: { from: 1, to: 2 },
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }]
    })
    unprotect(store)
    expect(store.selected.get("from") === store.boxes[0]).toEqual(true)
    expect(store.selected.get("to") === store.boxes[1]).toEqual(true)
})
test("it should support relative lookups", () => {
    const Node = types.model({
        id: types.identifierNumber,
        children: types.optional(types.array(types.late((): IAnyModelType => Node)), [])
    })
    const root = Node.create({
        id: 1,
        children: [
            {
                id: 2,
                children: [
                    {
                        id: 4
                    }
                ]
            },
            {
                id: 3
            }
        ]
    })
    unprotect(root)
    expect(getSnapshot(root)).toEqual({
        id: 1,
        children: [{ id: 2, children: [{ id: 4, children: [] }] }, { id: 3, children: [] }]
    })
    expect(resolveIdentifier(Node, root, 1)).toBe(root)
    expect(resolveIdentifier(Node, root, 4)).toBe(root.children[0].children[0])
    expect(resolveIdentifier(Node, root.children[0].children[0], 3)).toBe(root.children[1])
    const n2 = detach(root.children[0])
    unprotect(n2)
    expect(resolveIdentifier(Node, n2, 2)).toBe(n2)
    expect(resolveIdentifier(Node, root, 2)).toBe(undefined)
    expect(resolveIdentifier(Node, root, 4)).toBe(undefined)
    expect(resolveIdentifier(Node, n2, 3)).toBe(undefined)
    expect(resolveIdentifier(Node, n2, 4)).toBe(n2.children[0])
    expect(resolveIdentifier(Node, n2.children[0], 2)).toBe(n2)
    const n5 = Node.create({ id: 5 })
    expect(resolveIdentifier(Node, n5, 4)).toBe(undefined)
    n2.children.push(n5)
    expect(resolveIdentifier(Node, n5, 4)).toBe(n2.children[0])
    expect(resolveIdentifier(Node, n2.children[0], 5)).toBe(n5)
})
test("References are non-nullable by default", () => {
    const Todo = types.model({
        id: types.identifierNumber
    })
    const Store = types.model({
        todo: types.maybe(Todo),
        ref: types.reference(Todo),
        maybeRef: types.maybe(types.reference(Todo))
    })
    expect(Store.is({})).toBe(false)
    expect(Store.is({ ref: 3 })).toBe(true)
    expect(Store.is({ ref: null })).toBe(false)
    expect(Store.is({ ref: undefined })).toBe(false)
    expect(Store.is({ ref: 3, maybeRef: 3 })).toBe(true)
    expect(Store.is({ ref: 3, maybeRef: undefined })).toBe(true)
    let store = Store.create({
        todo: { id: 3 },
        ref: 3
    })
    expect(store.ref).toBe(store.todo)
    expect(store.maybeRef).toBe(undefined)
    store = Store.create({
        todo: { id: 3 },
        ref: 4
    })
    unprotect(store)
    if (process.env.NODE_ENV !== "production") {
        expect(store.maybeRef).toBe(undefined)
        expect(() => store.ref).toThrow(
            "[mobx-state-tree] Failed to resolve reference '4' to type 'AnonymousModel' (from node: /ref)"
        )
        store.maybeRef = cast(3) // valid assignment
        expect(store.maybeRef).toBe(store.todo)
        store.maybeRef = cast(4) // valid assignment
        expect(() => store.maybeRef).toThrow(
            "[mobx-state-tree] Failed to resolve reference '4' to type 'AnonymousModel' (from node: /maybeRef)"
        )
        store.maybeRef = undefined
        expect(store.maybeRef).toBe(undefined)
        expect(() => ((store as any).ref = undefined)).toThrow(/Error while converting/)
    }
})
test("References are described properly", () => {
    const Todo = types.model({
        id: types.identifierNumber
    })
    const Store = types.model({
        todo: types.maybe(Todo),
        ref: types.reference(Todo),
        maybeRef: types.maybe(types.reference(Todo))
    })
    expect(Store.describe()).toBe(
        "{ todo: ({ id: identifierNumber } | undefined?); ref: reference(AnonymousModel); maybeRef: (reference(AnonymousModel) | undefined?) }"
    )
})
test("References in recursive structures", () => {
    const Folder = types.model("Folder", {
        id: types.identifierNumber,
        name: types.string,
        files: types.array(types.string)
    })
    const Tree = types
        .model("Tree", {
            // sadly, this becomes any, and further untypeable...
            children: types.array(types.late((): IAnyModelType => Tree)),
            data: types.maybeNull(types.reference(Folder))
        })
        .actions(self => {
            function addFolder(data: SnapshotOrInstance<typeof Folder>) {
                const folder3 = Folder.create(data)
                getRoot<typeof Storage>(self).putFolderHelper(folder3)
                self.children.push(Tree.create({ data: folder3, children: [] }))
            }
            return { addFolder }
        })

    const Storage = types
        .model("Storage", {
            objects: types.map(Folder),
            tree: Tree
        })
        .actions(self => ({
            putFolderHelper(aFolder: SnapshotOrInstance<typeof Folder>) {
                self.objects.put(aFolder)
            }
        }))
    const store = Storage.create({ objects: {}, tree: { children: [], data: null } })
    const folder = { id: 1, name: "Folder 1", files: ["a.jpg", "b.jpg"] }
    store.tree.addFolder(folder)
    expect(getSnapshot(store)).toEqual({
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: 1,
                name: "Folder 1"
            }
        },
        tree: {
            children: [
                {
                    children: [],
                    data: 1
                }
            ],
            data: null
        }
    })
    expect(store.objects.get("1")).toBe(store.tree.children[0].data)
    const folder2 = { id: 2, name: "Folder 2", files: ["c.jpg", "d.jpg"] }
    store.tree.children[0].addFolder(folder2)
    expect(getSnapshot(store)).toEqual({
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: 1,
                name: "Folder 1"
            },
            "2": {
                files: ["c.jpg", "d.jpg"],
                id: 2,
                name: "Folder 2"
            }
        },
        tree: {
            children: [
                {
                    children: [
                        {
                            children: [],
                            data: 2
                        }
                    ],
                    data: 1
                }
            ],
            data: null
        }
    })
    expect(store.objects.get("1")).toBe(store.tree.children[0].data)
    expect(store.objects.get("2")).toBe(store.tree.children[0].children[0].data)
})
test("it should applyPatch references in array", () => {
    const Item = types.model("Item", {
        id: types.identifier,
        name: types.string
    })
    const Folder = types
        .model("Folder", {
            id: types.identifier,
            objects: types.map(Item),
            hovers: types.array(types.reference(Item))
        })
        .actions(self => {
            function addObject(anItem: typeof Item.Type) {
                self.objects.put(anItem)
            }
            function addHover(anItem: typeof Item.Type) {
                self.hovers.push(anItem)
            }
            function removeHover(anItem: typeof Item.Type) {
                self.hovers.remove(anItem)
            }
            return {
                addObject,
                addHover,
                removeHover
            }
        })
    const folder = Folder.create({ id: "folder 1", objects: {}, hovers: [] })
    folder.addObject({ id: "item 1", name: "item name 1" })
    const item = folder.objects.get("item 1")!
    const snapshot = getSnapshot(folder)
    const newStore = Folder.create(snapshot)
    onPatch(folder, data => {
        applyPatch(newStore, data)
    })
    folder.addHover(item)
    expect(getSnapshot(newStore)).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["item 1"]
    })
    folder.removeHover(item)
    expect(getSnapshot(newStore)).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: []
    })
})
test("it should applySnapshot references in array", () => {
    const Item = types.model("Item", {
        id: types.identifier,
        name: types.string
    })
    const Folder = types.model("Folder", {
        id: types.identifier,
        objects: types.map(Item),
        hovers: types.array(types.reference(Item))
    })
    const folder = Folder.create({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["item 1"]
    })
    const snapshot = JSON.parse(JSON.stringify(getSnapshot(folder)))
    expect(snapshot).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["item 1"]
    })
    snapshot.hovers = []
    applySnapshot(folder, snapshot)
    expect(getSnapshot(folder)).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: []
    })
    snapshot.hovers = ["item 1"]
    applySnapshot(folder, snapshot)
    expect(getSnapshot(folder)).toEqual({
        id: "folder 1",
        objects: {
            "item 1": {
                id: "item 1",
                name: "item name 1"
            }
        },
        hovers: ["item 1"]
    })
})

test("array of references should work fine", () => {
    const B = types.model("Block", { id: types.identifier })
    const S = types
        .model("Store", {
            blocks: types.array(B),
            blockRefs: types.array(types.reference(B))
        })
        .actions(self => {
            return {
                order() {
                    const res = self.blockRefs.slice()
                    self.blockRefs.replace([res[1], res[0]])
                }
            }
        })
    const a = S.create({ blocks: [{ id: "1" }, { id: "2" }], blockRefs: ["1", "2"] })
    a.order()
    expect(a.blocks[0].id).toBe("1")
    expect(a.blockRefs[0].id).toBe("2")
})

test("should serialize references correctly", () => {
    const M = types.model({
        id: types.identifierNumber
    })
    const S = types.model({
        mies: types.map(M),
        ref: types.maybe(types.reference(M))
    })

    const s = S.create({
        mies: {
            7: {
                id: 7
            }
        }
    })
    unprotect(s)

    expect(Array.from(s.mies.keys())).toEqual(["7"])
    expect(s.mies.get("7")!.id).toBe(7)
    expect(s.mies.get(7 as any)).toBe(s.mies.get("7")) // maps automatically normalizes the key

    s.mies.put({
        id: 8
    })
    expect(Array.from(s.mies.keys())).toEqual(["7", "8"])

    s.ref = cast(8)
    expect(s.ref!.id).toBe(8) // resolved from number
    expect(getSnapshot(s).ref).toBe(8) // ref serialized as number

    s.ref = cast("7") // resolved from string
    expect(s.ref!.id).toBe(7) // resolved from string
    expect(getSnapshot(s).ref).toBe("7") // ref serialized as string (number would be ok as well)

    s.ref = s.mies.get("8")!
    expect(s.ref.id).toBe(8) // resolved from instance
    expect(getSnapshot(s).ref).toBe(8) // ref serialized as number

    s.ref = cast("9") // unresolvable
    expect(getSnapshot(s).ref).toBe("9") // snapshot preserved as it was unresolvable

    s.mies.set(9 as any, {
        id: 9
    })
    expect(Array.from(s.mies.keys())).toEqual(["7", "8", "9"])
    expect(s.mies.get("9")!.id).toBe(9)
    expect(getSnapshot(s).ref).toBe("9") // ref serialized as string (number would be ok as well)
})

test("#1052 - Reference returns destroyed model after subtree replacing", () => {
    const Todo = types.model("Todo", {
        id: types.identifierNumber,
        title: types.string
    })

    const Todos = types.model("Todos", {
        items: types.array(Todo)
    })

    const Store = types
        .model("Store", {
            todos: Todos,
            last: types.maybe(types.reference(Todo)),
            counter: -1
        })
        .actions(self => ({
            load() {
                self.counter++
                self.todos = Todos.create({
                    items: [
                        { id: 1, title: "Get Coffee " + self.counter },
                        { id: 2, title: "Write simpler code " + self.counter }
                    ]
                })
            },
            select(todo: Instance<typeof Todo>) {
                self.last = todo
            }
        }))

    const store = Store.create({ todos: {} })
    store.load()

    expect(store.last).toBe(undefined)
    let reactions = 0
    let reactionDisposer = reaction(
        () => store.last,
        () => {
            reactions++
        }
    )

    store.select(store.todos.items[0])
    expect(isAlive(store.last!)).toBe(true)
    expect(isObservable(store.last)).toBe(true)
    expect(reactions).toBe(1)
    expect(store.last!.title).toBe("Get Coffee 0")

    store.load()
    expect(isAlive(store.last!)).toBe(true)
    expect(isObservable(store.last)).toBe(true)
    expect(reactions).toBe(2)
    expect(store.last!.title).toBe("Get Coffee 1")

    reactionDisposer()
})
