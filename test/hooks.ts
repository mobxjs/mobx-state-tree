import { detach, types, destroy } from "../"
import { test } from "ava"

function createTestStore(listener) {
    const Todo = types.model("Todo", {
        title: "",
        setTitle(newTitle) {
            this.title = newTitle
        },
        afterCreate() {
            listener("new todo: " + this.title)
        },
        beforeDestroy() {
            listener("destroy todo: " + this.title)
        },
        afterAttach() {
            listener("attach todo: " + this.title)
        },
        beforeDetach() {
            listener("detach todo: " + this.title)
        }
    })

    const Store = types.model("Store", {
        todos: types.array(Todo),
        afterCreate() {
            listener("new store: " + this.todos.length)
        },
        beforeDestroy() {
            listener("destroy store: " + this.todos.length)
        },
        afterAttach() {
            listener("attach store: " + this.todos.length)
        },
        beforeDetach() {
            listener("detach store: " + this.todos.length)
        }
    })

    return {
        store: Store.create({
            todos: [
                { title: "Get coffee" },
                { title: "Get biscuit" },
                { title: "Give talk" }
            ]
        }),
        Store,
        Todo
    }
}

test("it should trigger lifecycle hooks", t => {
    const events: string[] = []
    const {store, Todo} = createTestStore(e => events.push(e))

    const talk = detach(store.todos[2])
    events.push("-")
    store.todos.pop()
    events.push("--")
    const sugar = Todo.create({ title: "add sugar" })
    store.todos.push(sugar)
    events.push("---")
    destroy(store)
    destroy(talk)

    t.deepEqual(events, [
        "new todo: Get coffee",
        "attach todo: Get coffee",
        "new todo: Get biscuit",
        "attach todo: Get biscuit",
        "new todo: Give talk",
        "attach todo: Give talk",
        "new store: 3",
        "detach todo: Give talk",
        "-",
        "destroy todo: Get biscuit",
        "--",
        "new todo: add sugar",
        "attach todo: add sugar",
        "---",
        "destroy todo: Get coffee",
        "destroy todo: add sugar",
        "destroy store: 2",
        "destroy todo: Give talk"
    ])
})