import { protect, applySnapshot, types, destroy } from "../"
import { test } from "ava"

function createTestStore(afterCreate, beforeDestroy) {
    const Todo = types.model("Todo", {
        title: "",
        setTitle(newTitle) {
            this.title = newTitle
        },
        afterCreate() {
            afterCreate("new todo: " + this.title)
        },
        beforeDestroy() {
            beforeDestroy("destroy todo: " + this.title)
        }
    })

    const Store = types.model("Store", {
        todos: types.array(Todo),
        afterCreate() {
            afterCreate("new store: " + this.todos.length)
        },
        beforeDestroy() {
            beforeDestroy("destroy store: " + this.todos.length)
        }
    })

    return Store.create({
        todos: [
            { title: "Get coffee" },
            { title: "Get biscuit" }
        ]
    })
}

test("it should trigger lifecycle hooks", t => {
    const events: string[] = []
    const store = createTestStore(e => events.push(e), e => events.push(e))

    store.todos.pop()
    events.push("-")

    destroy(store)

    t.deepEqual(events, [
        "new todo: Get coffee",
        "new todo: Get biscuit",
        "new store: 2",
        "destroy todo: Get biscuit",
        "-",
        "destroy todo: Get coffee",
        "destroy store: 1"
    ])
})