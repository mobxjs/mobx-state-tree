const mst = require("..")
const test = require("ava").test
const sinon = require("sinon")

const logger = require("./simple-action-logger").default

test.beforeEach(t => {
    t.context.log = console.log

    console.log = sinon.spy()
})

test.afterEach(t => {
    console.log = t.context.log
})

test("it logs", t => {
    const Todo = mst.types
        .model({
            title: ""
        })
        .actions(self => ({
            helper() {},
            setTitle(newTitle) {
                self.helper() // should not be logged
                self.title = newTitle
            }
        }))

    const Store = mst.types.model({
        todos: mst.types.array(Todo)
    })

    const store = Store.create({
        todos: [{ title: "test " }]
    })
    mst.addMiddleware(store, logger)

    store.todos[0].setTitle("hello world")

    t.deepEqual(console.log.args, [["[MST action call] /todos/0/setTitle"]])
})
