import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot, arrayOf, getParent, hasParent, getRoot, getPathParts, clone, getModelFactory, getChildModelFactory, isModelFactory, recordActions, recordPatches} from "../"
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

    // TOOD: re-enable
    // t.deepEqual(hasParentObject(row), true)
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

// getModelFactory
test("it should return the model factory", (t) => {
    const Document = createFactory({
        customer_id: 0
    })

    const doc = Document()

    t.deepEqual(getModelFactory(doc), Document)
})

// getChildModelFactory
test("it should return the child model factory", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const ArrayOfRow = arrayOf(Row)
    const Document = createFactory({
        rows: ArrayOfRow
    })

    const doc = Document()

    // TODO: any because of #19
    t.deepEqual<any>(getChildModelFactory(doc, 'rows'), ArrayOfRow)
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

// === RECORD PATCHES ===
test("it can record and replay patches", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        customer_id: 0,
        rows: arrayOf(Row)
    })

    const source = Document()
    const target = Document()
    const recorder = recordPatches(source)

    source.customer_id = 1
    source.rows.push(Row({article_id: 1}))

    recorder.replay(target)

    t.deepEqual(getSnapshot(source), getSnapshot(target))
})

// === RECORD ACTIONS ===
test("it can record and replay actions", (t) => {
    const Row = createFactory({
        article_id: 0,
        setArticle: action(function(article_id){
            this.article_id = article_id
        })
    })

    const Document = createFactory({
        customer_id: 0,
        setCustomer: action(function(customer_id){
            this.customer_id = customer_id
        }),
        addRow: action(function(){
            this.rows.push(Row())
        }),
        rows: arrayOf(Row)
    })

    const source = Document()
    const target = Document()
    const recorder = recordActions(source)

    source.setCustomer(1)
    source.addRow()
    source.rows[0].setArticle(1)

    recorder.replay(target)

    t.deepEqual(getSnapshot(source), getSnapshot(target))
})