import * as mst from "mobx-state-tree"
import { test } from "ava"
import * as sinon from "sinon"
import { simpleActionLogger } from "../src"

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
                ;(self as any).helper() // should not be logged
                self.title = newTitle
            }
        }))

    const Store = mst.types.model({
        todos: mst.types.array(Todo)
    })

    const store = Store.create({
        todos: [{ title: "test " }]
    })
    mst.addMiddleware(store, simpleActionLogger)

    store.todos[0].setTitle("hello world")

    t.deepEqual((console.log as any).args, [["[MST action call] /todos/0/setTitle"]])
})
