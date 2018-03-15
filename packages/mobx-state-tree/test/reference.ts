import { reaction, autorun } from "mobx"
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
    IType
} from "../src"
test("it should support prefixed paths in maps", () => {
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
        id: types.identifier(),
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
    }) // TODO: better typings
})
if (process.env.NODE_ENV !== "production") {
    test("identifiers are required", () => {
        const Todo = types.model({
            id: types.identifier()
        })
        expect(Todo.is({})).toBe(false)
        expect(Todo.is({ id: "x" })).toBe(true)
        expect(() => Todo.create()).toThrowError(
            "[mobx-state-tree] Error while converting `{}` to `AnonymousModel`:\n\n" +
                '    at path "/id" value `undefined` is not assignable to type: `identifier(string)` (Value is not a string), expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.'
        )
    })
    test("identifiers cannot be modified", () => {
        const Todo = types.model({
            id: types.identifier()
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
    const values: any = []
    const Book = types.model({
        id: types.identifier(),
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
    s.entries.push({ book: s.books[0] } as any)
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
        id: types.identifier(),
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
        entries: types.optional(types.array(BookEntry), [])
    })
    const s = Store.create({
        books: [{ id: "3", price: 2 }]
    })
    unprotect(s)
    s.entries.push({ book: s.books[0] } as any)
    expect(s.entries[0].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(4)
})
test("it should resolve refs during creation, when using generic reference", () => {
    const values: any[] = []
    const Book = types.model({
        id: types.identifier(),
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
    s.entries.push({ book: s.books[0] } as any)
    expect(s.entries[0].price).toBe(4)
    expect(s.entries.reduce((a, e) => a + e.price, 0)).toBe(4)
    const entry = BookEntry.create({ book: s.books[0] }) // can refer to book, even when not part of tree yet
    expect(getSnapshot(entry)).toEqual({ book: "3" })
    s.entries.push(entry)
    expect(values).toEqual([4, 8])
})
if (process.env.NODE_ENV !== "production")
    test("identifiers should only support types.string and types.number", () => {
        expect(() =>
            types
                .model({
                    id: types.identifier(types.model({ x: 1 }))
                })
                .create({ id: {} })
        ).toThrow()
    })
test("identifiers should support subtypes of types.string and types.number", () => {
    const M = types.model({
        id: types.identifier(types.refinement("Number greater then 5", types.number, n => n > 5))
    })
    expect(M.is({})).toBe(false)
    expect(M.is({ id: "test" })).toBe(false)
    expect(M.is({ id: 6 })).toBe(true)
    expect(M.is({ id: 4 })).toBe(false)
})
test("string identifiers should not accept numbers", () => {
    const F = types.model({
        id: types.identifier()
    })
    expect(F.is({ id: "4" })).toBe(true)
    expect(F.is({ id: 4 })).toBe(false)
    const F2 = types.model({
        id: types.identifier(types.string)
    })
    expect(F2.is({ id: "4" })).toBe(true)
    expect(F2.is({ id: 4 })).toBe(false)
})
test("122 - identifiers should support numbers as well", () => {
    const F = types.model({
        id: types.identifier(types.number)
    })
    expect(
        F.create({
            id: 3
        }).id
    ).toBe(3)
    expect(F.is({ id: 4 })).toBe(true)
    expect(F.is({ id: "4" })).toBe(false)
})
test("self reference with a late type", () => {
    const Book = types.model("Book", {
        id: types.identifier(),
        genre: types.string,
        reference: types.reference(types.late(() => Book) as IType<any, any>)
    })
    const Store = types
        .model("Store", {
            books: types.array(Book)
        })
        .actions(self => {
            function addBook(book) {
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
    expect((s.books[1] as any).reference.genre).toBe("thriller") // TODO: `.reference` should be typed here...
})
test("when applying a snapshot, reference should resolve correctly if value added after", () => {
    const Box = types.model({
        id: types.identifier(types.number),
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
        boxes: [{ id: 1, name: "hello" }, { id: 2, name: "world" }],
        arrows: [{ id: 2, name: "arrow" }]
    })
    expect(() => {
        store.selected // store.boxes[1] // throws because it can't know if you mean a box or an arrow!
    }).toThrowError(
        "[mobx-state-tree] Cannot resolve a reference to type '(Arrow | Box)' with id: '2' unambigously, there are multiple candidates: /boxes/1, /arrows/0"
    )
    unprotect(store)
    // first update the reference, than create a new matching item! Ref becomes ambigous now...
    store.selected = 1 as any // valid assignment
    expect(store.selected).toBe(store.boxes[0]) // unambigous identifier
    let err
    autorun(() => store.selected, {
        onError(e) {
            err = e
        }
    })
    expect(store.selected).toBe(store.boxes[0]) // unambigous identifier
    store.arrows.push({ id: 1, name: "oops" })
    expect(err.message).toBe(
        "[mobx-state-tree] Cannot resolve a reference to type '(Arrow | Box)' with id: '1' unambigously, there are multiple candidates: /boxes/0, /arrows/1"
    )
})
test("it should support array of references", () => {
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
        id: types.identifier(types.number),
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
        id: types.identifier(types.number),
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
        id: types.identifier(types.number),
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
        id: types.identifier(types.number),
        children: types.optional(types.array(types.late(() => Node)), [])
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
        id: types.identifier(types.number)
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
    expect(Store.is({ ref: 3, maybeRef: null })).toBe(true)
    expect(Store.is({ ref: 3, maybeRef: undefined })).toBe(true)
    let store = Store.create({
        todo: { id: 3 },
        ref: 3
    })
    expect(store.ref).toBe(store.todo)
    expect(store.maybeRef).toBe(null)
    store = Store.create({
        todo: { id: 3 },
        ref: 4
    })
    unprotect(store)
    if (process.env.NODE_ENV !== "production") {
        expect(store.maybeRef).toBe(null)
        expect(() => store.ref).toThrow(
            "[mobx-state-tree] Failed to resolve reference '4' to type 'AnonymousModel' (from node: /ref)"
        )
        store.maybeRef = 3 as any // valid assignment
        expect(store.maybeRef).toBe(store.todo)
        store.maybeRef = 4 as any // valid assignment
        expect(() => store.maybeRef).toThrow(
            "[mobx-state-tree] Failed to resolve reference '4' to type 'AnonymousModel' (from node: /maybeRef)"
        )
        store.maybeRef = null
        expect(store.maybeRef).toBe(null)
        expect(() => ((store as any).ref = null)).toThrow(/Error while converting/)
    }
})
test("References are described properly", () => {
    const Todo = types.model({
        id: types.identifier(types.number)
    })
    const Store = types.model({
        todo: types.maybe(Todo),
        ref: types.reference(Todo),
        maybeRef: types.maybe(types.reference(Todo))
    })
    expect(Store.describe()).toBe(
        "{ todo: ({ id: identifier(number) } | null?); ref: reference(AnonymousModel); maybeRef: (reference(AnonymousModel) | null?) }"
    )
})
test("References in recursive structures", () => {
    const Folder = types.model("Folder", {
        id: types.identifier(),
        name: types.string,
        files: types.array(types.string)
    })
    const Tree = types
        .model("Tree", {
            children: types.array(types.late(() => Tree)),
            data: types.maybe(types.reference(Folder))
        })
        .actions(self => {
            function addFolder(data) {
                const folder = Folder.create(data)
                getRoot(self).putFolderHelper(folder)
                self.children.push(Tree.create({ data: folder, children: [] }))
            }
            return {
                addFolder
            }
        })
    const Storage = types
        .model("Storage", {
            objects: types.map(Folder),
            tree: Tree
        })
        .actions(self => ({
            putFolderHelper(folder) {
                self.objects.put(folder)
            }
        }))
    const store = Storage.create({ objects: {}, tree: { children: [], data: null } })
    const folder = { id: "1", name: "Folder 1", files: ["a.jpg", "b.jpg"] }
    store.tree.addFolder(folder)
    expect(getSnapshot(store)).toEqual({
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: "1",
                name: "Folder 1"
            }
        },
        tree: {
            children: [
                {
                    children: [],
                    data: "1"
                }
            ],
            data: null
        }
    })
    expect(store.objects.get("1")).toBe(store.tree.children[0].data)
    const folder2 = { id: "2", name: "Folder 2", files: ["c.jpg", "d.jpg"] }
    store.tree.children[0].addFolder(folder2)
    expect(getSnapshot(store)).toEqual({
        objects: {
            "1": {
                files: ["a.jpg", "b.jpg"],
                id: "1",
                name: "Folder 1"
            },
            "2": {
                files: ["c.jpg", "d.jpg"],
                id: "2",
                name: "Folder 2"
            }
        },
        tree: {
            children: [
                {
                    children: [
                        {
                            children: [],
                            data: "2"
                        }
                    ],
                    data: "1"
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
        id: types.identifier(),
        name: types.string
    })
    const Folder = types
        .model("Folder", {
            id: types.identifier(),
            objects: types.map(Item),
            hovers: types.array(types.reference(Item))
        })
        .actions(self => {
            function addObject(item) {
                self.objects.put(item)
            }
            function addHover(item) {
                self.hovers.push(item)
            }
            function removeHover(item) {
                self.hovers.remove(item)
            }
            return {
                addObject,
                addHover,
                removeHover
            }
        })
    const folder = Folder.create({ id: "folder 1", objects: {}, hovers: [] })
    folder.addObject({ id: "item 1", name: "item name 1" })
    const item = folder.objects.get("item 1")
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
        id: types.identifier(),
        name: types.string
    })
    const Folder = types.model("Folder", {
        id: types.identifier(),
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

test.skip("array of references should work fine", () => {
    // This test breaks because `.move` doesn't dehence values in mobx...
    // Since move functionality is about to be killed, we won't be fixing this
    const B = types.model("Block", { id: types.identifier(types.string) })
    const S = types
        .model("Store", {
            blocks: types.array(B),
            blockRefs: types.array(types.reference(B))
        })
        .actions(self => {
            return {
                order() {
                    self.blockRefs.move(0, 1)
                }
            }
        })
    const a = S.create({ blocks: [{ id: "1" }, { id: "2" }], blockRefs: ["1", "2"] })
    a.order()
    expect(a.blocks[0].id).toBe("1")
    expect(a.blockRefs[0].id).toBe("2")
})

test("array of references should work fine", () => {
    const B = types.model("Block", { id: types.identifier(types.string) })
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
