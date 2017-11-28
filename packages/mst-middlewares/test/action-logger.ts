import * as mst from "mobx-state-tree"
import { flow } from "mobx-state-tree"
import { test } from "ava"
import * as sinon from "sinon"
import { actionLogger } from "../src"

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
    mst.addMiddleware(store, actionLogger)

    store.todos[0].setTitle("hello world")

    t.deepEqual((console.log as any).args, [["[MST] #2 action - /todos/0/setTitle"]])
})

test("it logs flows", async t => {
    const Todo = mst.types
        .model({
            title: ""
        })
        .actions(self => ({
            helper() {},
            helper2: flow(function* helper2() {
                return Promise.resolve(3)
            })
        }))
        .actions(self => ({
            setTitle: flow(function* setTitle(newTitle) {
                self.helper() // should not be logged
                yield self.helper2() // should be logged
                self.title = newTitle
                return
            })
        }))

    const Store = mst.types.model({
        todos: mst.types.array(Todo)
    })

    const store = Store.create({
        todos: [{ title: "test " }]
    })
    mst.addMiddleware(store, actionLogger)

    await store.todos[0].setTitle("hello world")
    t.deepEqual((console.log as any).args.map(([x]) => x), [
        "[MST] #5 action - /todos/0/setTitle",
        "[MST] #5 flow_spawn - /todos/0/setTitle",
        "[MST] #5 flow_spawn - /todos/0/helper2",
        "[MST] #5 flow_return - /todos/0/helper2",
        "[MST] #5 flow_return - /todos/0/setTitle"
    ])
})
