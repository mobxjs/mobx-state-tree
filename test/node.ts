import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot, arrayOf, getParent, hasParent, hasParentObject, getRoot, getPathParts, clone} from "../"
import {test} from "ava"

// getParent
test("it should resolve to the parent instance", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual(getParent(row), doc)
})

// hasParent
test("it should resolve to the parent instance", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()

    doc.rows.push(row)
    t.deepEqual(hasParent(row), true)
})


test("it should resolve to the parent instance (unbound)", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()

    t.deepEqual(hasParent(row), false)
})

// hasParentObject
test("it should resolve to the parent object instance", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual(hasParentObject(row), true)
})

// getRoot
test("it should resolve to the root of an object", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual(getRoot(row), doc)
})

// getPath
test("it should resolve the path of an object", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual(getPath(row), "/rows/0")
})

// getPathParts
test("it should resolve the path of an object", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual(getPathParts(row), ["rows", "0"])
})

// clone
test("it should clone a node", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    const cloned = clone(doc)

    t.deepEqual(doc, cloned)
})

// test tree unique
test("a node can exists only once in a tree", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: arrayOf(Row),
        foos: arrayOf(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    const error = t.throws(() => {
        doc.foos.push(row)
    })
    t.is(error.message, "[mobx-state-tree] A node cannot exists twice in the state tree. Failed to add object to path '/foos/0', it exists already at '/rows/0'")
})