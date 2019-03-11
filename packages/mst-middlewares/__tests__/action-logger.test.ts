import * as mst from "mobx-state-tree"
import { flow } from "mobx-state-tree"
import { actionLogger } from "../src"

let log: jest.Mock
beforeAll(() => {
    log = console.log = jest.fn()
})

beforeEach(() => {
    log.mockClear()
})

test("it logs", () => {
    const Todo = mst.types
        .model({
            title: ""
        })
        .actions(self => ({
            helper() {},
            setTitle(newTitle: string) {
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

    expect(log).toHaveBeenCalledTimes(0)
    expect(log.mock.calls[0][0]).toBe("[MST] #1 action - /todos/0/setTitle")
})

test("it logs flows", async () => {
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
            setTitle: flow(function* setTitle(newTitle: string) {
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
    const expectedLog = [
        "[MST] #3 action - /todos/0/setTitle",
        "[MST] #3 flow_spawn - /todos/0/setTitle",
        "[MST] #3 flow_spawn - /todos/0/helper2",
        "[MST] #3 flow_return - /todos/0/helper2",
        "[MST] #3 flow_return - /todos/0/setTitle"
    ]
    expect(log).toHaveBeenCalledTimes(expectedLog.length)
    log.mock.calls.forEach((c, idx) => {
        expect(c[0]).toBe(expectedLog[idx])
    })
})
