import {onSnapshot, onPatch, onAction, createFactory, applyPatch, applyPatches, applyAction, applyActions, _getNode, getPath, IJsonPatch, applySnapshot, action, getSnapshot, getParent, hasParent, getRoot, getPathParts, clone, getFactory, getChildFactory, isFactory, recordActions, recordPatches, types} from "../"
import {test} from "ava"

// getParent
test("it should resolve to the parent instance", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    debugger;
    const Document = createFactory({
        rows: types.array(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    t.deepEqual<any>(getParent(row), doc.rows)
})

// hasParent
test("it should check for parent instance", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: types.array(Row)
    })

    const doc = Document()
    const row = Row()

    doc.rows.push(row)
    t.deepEqual(hasParent(row), true)
})


test("it should check for parent instance (unbound)", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: types.array(Row)
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
        rows: types.array(Row)
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
        rows: types.array(Row)
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
        rows: types.array(Row)
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
        rows: types.array(Row)
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
        rows: types.array(Row)
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

    t.deepEqual(getFactory(doc), Document)
})

// getChildModelFactory
test("it should return the child model factory", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const ArrayOfRow = types.array(Row)
    const Document = createFactory({
        rows: ArrayOfRow
    })

    const doc = Document()

    // TODO: any because of #19
    t.deepEqual<any>(getChildFactory(doc, 'rows'), ArrayOfRow)
})

test("a node can exists only once in a tree", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        rows: types.array(Row),
        foos: types.array(Row)
    })

    const doc = Document()
    const row = Row()
    doc.rows.push(row)

    const error = t.throws(() => {
        doc.foos.push(row)
    })
    t.is(error.message, "[mobx-state-tree] Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '/foos/0', but it lives already at '/rows/0'")
})

// TODO
// test("make sure array filter works properly", (t) => {
//     const Row = createFactory({
//         done: false
//     })

//     const Document = createFactory({
//         rows: arrayOf(Row),
//         clearDone: action(function(){
//             this.rows =  doc.rows.filter(row => row.done === true)
//         })
//     })

//     const doc = Document()
//     const a = Row({ done: true })
//     const b = Row({ done: false })

//     doc.rows.push(a)
//     doc.rows.push(b)

//     doc.clearDone()

//     t.deepEqual<any>(getSnapshot(doc), {rows: [{done: false}]})
// })

// === RECORD PATCHES ===
test("it can record and replay patches", (t) => {
    const Row = createFactory({
        article_id: 0
    })

    const Document = createFactory({
        customer_id: 0,
        rows: types.array(Row)
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
        rows: types.array(Row)
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