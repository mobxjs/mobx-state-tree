import { test } from "ava"
import { IType, getSnapshot, types, unprotect } from "../src"
function Pointer<S, T>(Model: IType<S, T>) {
    return types.model({
        value: types.maybe(types.reference(Model))
    })
}
const Todo = types.model({
    id: types.identifier(),
    name: types.string
})
test("it should allow array of pointer objects", t => {
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = Pointer(Todo).create({ value: store.todos[0] }) // Fails because store.todos does not belongs to the same tree
    store.selected.push(ref)
    t.is<any>(store.selected[0].value, store.todos[0])
})
test("it should allow array of pointer objects - 2", t => {
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = Pointer(Todo).create()
    store.selected.push(ref)
    ref.value = store.todos[0] as any
    t.is<any>(store.selected[0].value, store.todos[0])
})
test("it should allow array of pointer objects - 3", t => {
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = Pointer(Todo).create({ value: store.todos[0] })
    store.selected.push(ref)
    t.is<any>(store.selected[0].value, store.todos[0])
})
test("it should allow array of pointer objects - 4", t => {
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = Pointer(Todo).create() // Fails because ref is required
    store.selected.push(ref)
    ref.value = store.todos[0] as any
    t.is<any>(ref.value, store.todos[0])
})
