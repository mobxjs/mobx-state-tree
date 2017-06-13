import { protect, unprotect, applySnapshot, types } from "../src"
import { test } from "ava"

function createTestStore() {
    const Todo = types.model(
        "Todo",
        {
            title: ""
        },
        {
            setTitle(newTitle) {
                this.title = newTitle
            }
        }
    )

    const Store = types.model("Store", {
        todos: types.array(Todo)
    })

    return Store.create({
        todos: [{ title: "Get coffee" }, { title: "Get biscuit" }]
    })
}

test("it should be possible to protect an object", t => {
    const store = createTestStore()

    protect(store.todos[0])
    unprotect(store.todos[1])

    store.todos[1].title = "A"

    t.throws(() => {
        store.todos[0].title = "B"
    }, "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action.")

    t.is(store.todos[1].title, "A")
    t.is(store.todos[0].title, "Get coffee")

    store.todos[0].setTitle("B")
    t.is(store.todos[0].title, "B")
})

test("protect should protect against any update", t => {
    const store = createTestStore()

    t.notThrows(
        // apply Snapshot / patch are currently allowed, even outside protected mode
        () => {
            applySnapshot(store, { todos: [{ title: "Get tea" }] })
        },
        "[mobx-state-tree] Cannot modify 'Todo@<root>', the object is protected and can only be modified by using an action."
    )

    t.throws(() => {
        store.todos.push({ title: "test" } as any)
    }, "[mobx-state-tree] Cannot modify 'Todo[]@/todos', the object is protected and can only be modified by using an action.")

    t.throws(() => {
        store.todos[0].title = "test"
    }, "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action.")
})

test("protect should also protect children", t => {
    const store = createTestStore()

    t.throws(() => {
        store.todos[0].title = "B"
    }, "[mobx-state-tree] Cannot modify 'Todo@/todos/0', the object is protected and can only be modified by using an action.")

    store.todos[0].setTitle("B")
    t.is(store.todos[0].title, "B")
})
