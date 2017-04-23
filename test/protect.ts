import { protect, applySnapshot, types } from "../src"
import { test } from "ava"

function createTestStore() {
    const Todo = types.model("Todo", {
        title: "",
        setTitle(newTitle) {
            this.title = newTitle
        }
    })

    const Store = types.model("Store", {
        todos: types.array(Todo)
    })

    return Store.create({
        todos: [
            { title: "Get coffee" },
            { title: "Get biscuit" },
        ]
    })
}

test("it should be possible to protect an object", t => {
    const store = createTestStore()

    protect(store.todos[0])

    store.todos[1].title = "A"

    t.throws(
        () => { store.todos[0].title = "B" },
        "[mobx-state-tree] Cannot modify '/todos/0', the object is protected and can only be modified from model actions"
    )

    t.is(store.todos[1].title, "A")
    t.is(store.todos[0].title, "Get coffee")

    store.todos[0].setTitle("B")
    t.is(store.todos[0].title, "B")
})

test("protect should protect against any update", t => {
    const store = createTestStore()
    protect(store)

    t.throws(
        () => { applySnapshot(store, { todos: [ { title: "Get tea" } ]}) },
        "[mobx-state-tree] Cannot modify '', the object is protected and can only be modified from model actions"
    )

    t.throws(
        () => { store.todos.push({ title: "test" } as any) },
        "[mobx-state-tree] Cannot modify '/todos', the object is protected and can only be modified from model actions"
    )

    t.throws(
        () => { store.todos[0].title = "test" },
        "[mobx-state-tree] Cannot modify '/todos/0', the object is protected and can only be modified from model actions"
    )
})

test("protect should also protect children", t => {
    const store = createTestStore()
    protect(store)

    t.throws(
        () => { store.todos[0].title = "B" },
        "[mobx-state-tree] Cannot modify '/todos/0', the object is protected and can only be modified from model actions"
    )

    store.todos[0].setTitle("B")
    t.is(store.todos[0].title, "B")
})