import * as mst from "mobx-state-tree"
import { simpleActionLogger } from "../src"

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
    mst.addMiddleware(store, simpleActionLogger)

    store.todos[0].setTitle("hello world")

    expect(log).toHaveBeenCalledTimes(1)
    expect(log.mock.calls[0][0]).toBe("[MST] /todos/0/setTitle")
})
