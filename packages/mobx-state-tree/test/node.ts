import {
    getPath,
    getSnapshot,
    getParent,
    hasParent,
    getRoot,
    getIdentifier,
    getPathParts,
    isAlive,
    clone,
    getType,
    getChildType,
    recordActions,
    recordPatches,
    types,
    destroy,
    unprotect
} from "../src"
// getParent
test("it should resolve to the parent instance", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(getParent(row)).toEqual(doc.rows)
})
// hasParent
test("it should check for parent instance", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(hasParent(row)).toEqual(true)
})
test("it should check for parent instance (unbound)", () => {
    const Row = types.model({
        article_id: 0
    })
    const row = Row.create()
    expect(hasParent(row)).toEqual(false)
})
// getRoot
test("it should resolve to the root of an object", () => {
    const Row = types.model("Row", {
        article_id: 0
    })
    const Document = types.model("Document", {
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(getRoot(row)).toBe(doc)
})
// getIdentifier
test("it should resolve to the identifier of the object", () => {
    const Document = types.model("Document", {
        id: types.identifier(types.string)
    })
    const doc = Document.create({
        id: "document_1"
    })
    // get identifier of object
    expect(getIdentifier(doc)).toBe("document_1")
})
// getPath
test("it should resolve the path of an object", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(getPath(row)).toEqual("/rows/0")
})
// getPathParts
test("it should resolve the path of an object", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(getPathParts(row)).toEqual(["rows", "0"])
})
test("it should resolve parents", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(hasParent(row)).toBe(true) // array
    expect(hasParent(row, 2)).toBe(true) // row
    expect(hasParent(row, 3)).toBe(false)
    expect(getParent(row) === doc.rows).toBe(true) // array
    expect(getParent(row, 2) === doc).toBe(true) // row
    expect(() => getParent(row, 3)).toThrowError(
        "[mobx-state-tree] Failed to find the parent of AnonymousModel@/rows/0 at depth 3"
    )
})
// clone
test("it should clone a node", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    const cloned = clone(doc)
    expect(doc).toEqual(cloned)
})
test("it should be possible to clone a dead object", () => {
    const Task = types.model("Task", {
        x: types.string
    })
    const a = Task.create({ x: "a" })
    const store = types
        .model({
            todos: types.optional(types.array(Task), [])
        })
        .create({
            todos: [a]
        })
    unprotect(store)
    expect(store.todos.slice()).toEqual([a])
    expect(isAlive(a)).toBe(true)
    store.todos.splice(0, 1)
    expect(isAlive(a)).toBe(false)
    const a2 = clone(a)
    store.todos.splice(0, 0, a2)
    expect(store.todos[0].x).toBe("a")
})
// getModelFactory
test("it should return the model factory", () => {
    const Document = types.model({
        customer_id: 0
    })
    const doc = Document.create()
    expect(getType(doc)).toEqual(Document)
})
// getChildModelFactory
test("it should return the child model factory", () => {
    const Row = types.model({
        article_id: 0
    })
    const ArrayOfRow = types.optional(types.array(Row), [])
    const Document = types.model({
        rows: ArrayOfRow
    })
    const doc = Document.create()
    expect(getChildType(doc, "rows")).toEqual(ArrayOfRow)
})
test("a node can exists only once in a tree", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        rows: types.optional(types.array(Row), []),
        foos: types.optional(types.array(Row), [])
    })
    const doc = Document.create()
    unprotect(doc)
    const row = Row.create()
    doc.rows.push(row)
    expect(() => {
        doc.foos.push(row)
    }).toThrow(
        "[mobx-state-tree] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/foos/0', but it lives already at '/rows/0'"
    )
})
test("make sure array filter works properly", () => {
    const Row = types.model({
        done: false
    })
    const Document = types
        .model({
            rows: types.optional(types.array(Row), [])
        })
        .actions(self => {
            function clearDone() {
                self.rows.filter(row => row.done === true).forEach(destroy)
            }
            return {
                clearDone
            }
        })
    const doc = Document.create()
    unprotect(doc)
    const a = Row.create({ done: true })
    const b = Row.create({ done: false })
    doc.rows.push(a)
    doc.rows.push(b)
    doc.clearDone()
    expect(getSnapshot(doc)).toEqual({ rows: [{ done: false }] })
})
// === RECORD PATCHES ===
test("it can record and replay patches", () => {
    const Row = types.model({
        article_id: 0
    })
    const Document = types.model({
        customer_id: 0,
        rows: types.optional(types.array(Row), [])
    })
    const source = Document.create()
    unprotect(source)
    const target = Document.create()
    const recorder = recordPatches(source)
    source.customer_id = 1
    source.rows.push(Row.create({ article_id: 1 }))
    recorder.replay(target)
    expect(getSnapshot(source)).toEqual(getSnapshot(target))
})
// === RECORD ACTIONS ===
test("it can record and replay actions", () => {
    const Row = types
        .model({
            article_id: 0
        })
        .actions(self => {
            function setArticle(article_id) {
                self.article_id = article_id
            }
            return {
                setArticle
            }
        })
    const Document = types
        .model({
            customer_id: 0,
            rows: types.optional(types.array(Row), [])
        })
        .actions(self => {
            function setCustomer(customer_id) {
                self.customer_id = customer_id
            }
            function addRow() {
                self.rows.push(Row.create())
            }
            return {
                setCustomer,
                addRow
            }
        })
    const source = Document.create()
    const target = Document.create()
    const recorder = recordActions(source)
    source.setCustomer(1)
    source.addRow()
    source.rows[0].setArticle(1)
    recorder.replay(target)
    expect(getSnapshot(source)).toEqual(getSnapshot(target))
})

test("Livelyness issue #683", () => {
    const User = types.model({
        id: types.identifier(types.number),
        name: types.string
    })

    const Users = types
        .model({
            list: types.map(User)
        })
        .actions(self => ({
            put(user) {
                // if (self.has(user.id)) detach(self.get(user.id));
                self.list.put(user)
            },
            get(id) {
                return self.list.get(id)
            },
            has(id) {
                return self.list.has(id)
            }
        }))

    const users = Users.create({
        list: {
            1: { name: "Name", id: 1 }
        }
    })
    const user = users.get("1")
    expect(user!.name).toBe("Name")

    users.put({ id: 1, name: "NameX" })
    expect(user!.name).toBe("NameX")
    expect(users.get("1")!.name).toBe("NameX")
})
