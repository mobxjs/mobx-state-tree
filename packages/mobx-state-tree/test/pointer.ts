import { types, unprotect } from "../src"
function Pointer(Model: any) {
    return types.model("PointerOf" + Model.name, {
        value: types.maybe(types.reference(Model))
    })
}
const Todo = types.model("Todo", {
    id: types.identifier,
    name: types.string
})
test("it should allow array of pointer objects", () => {
    const TodoPointer = Pointer(Todo)
    const AppStore = types.model("AppStore", {
        todos: types.array(Todo),
        selected: types.optional(types.array(TodoPointer), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = TodoPointer.create({ value: store.todos[0] }) // Fails because store.todos does not belongs to the same tree
    store.selected.push(ref)
    expect(store.selected[0].value).toBe(store.todos[0])
})
test("it should allow array of pointer objects - 2", () => {
    const TodoPointer = Pointer(Todo)
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(TodoPointer), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = TodoPointer.create()
    store.selected.push(ref)
    ref.value = store.todos[0]
    expect(store.selected[0].value).toBe(store.todos[0])
})
test("it should allow array of pointer objects - 3", () => {
    const TodoPointer = Pointer(Todo)
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(TodoPointer), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = TodoPointer.create({ value: store.todos[0] })
    store.selected.push(ref)
    expect(store.selected[0].value).toBe(store.todos[0])
})
test("it should allow array of pointer objects - 4", () => {
    const TodoPointer = Pointer(Todo)
    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(TodoPointer), [])
    })
    const store = AppStore.create({
        todos: [{ id: "1", name: "Hello" }, { id: "2", name: "World" }],
        selected: []
    })
    unprotect(store)
    const ref = TodoPointer.create() // Fails because ref is required
    store.selected.push(ref)
    ref.value = store.todos[0]
    expect(ref.value).toBe(store.todos[0])
})
