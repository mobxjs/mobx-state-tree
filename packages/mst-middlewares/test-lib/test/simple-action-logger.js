"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const mst = require("mobx-state-tree")
const ava_1 = require("ava")
const sinon = require("sinon")
const src_1 = require("../src")
ava_1.test.beforeEach(t => {
    t.context.log = console.log
    console.log = sinon.spy()
})
ava_1.test.afterEach(t => {
    console.log = t.context.log
})
ava_1.test("it logs", t => {
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
    mst.addMiddleware(store, src_1.simpleActionLogger)
    store.todos[0].setTitle("hello world")
    t.deepEqual(console.log.args, [["[MST action call] /todos/0/setTitle"]])
})
