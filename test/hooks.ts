import { detach, types, destroy, addDisposer, unprotect } from "../src"
import { test } from "ava"

function createTestStore(listener) {
    const Todo = types.model("Todo", {
        title: ""
    }, {
        setTitle(newTitle) {
            this.title = newTitle
        },
        afterCreate() {
            listener("new todo: " + this.title)
            addDisposer(this, () => {
                listener("custom disposer 1 for " + this.title)
            })
            addDisposer(this, () => {
                listener("custom disposer 2 for " + this.title)
            })
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
        todos: types.array(Todo)
    }, {
        afterCreate() {
            unprotect(this)
            listener("new store: " + this.todos.length)
            addDisposer(this, () => {
                listener("custom disposer for store")
            })
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
        "custom disposer 2 for Get biscuit",
        "custom disposer 1 for Get biscuit",
        "--",
        "new todo: add sugar",
        "attach todo: add sugar",
        "---",
        "destroy todo: Get coffee",
        "custom disposer 2 for Get coffee",
        "custom disposer 1 for Get coffee",
        "destroy todo: add sugar",
        "custom disposer 2 for add sugar",
        "custom disposer 1 for add sugar",
        "destroy store: 2",
        "custom disposer for store",
        "destroy todo: Give talk",
        "custom disposer 2 for Give talk",
        "custom disposer 1 for Give talk"
    ])
})