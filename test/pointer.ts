import { test } from "ava"
import { IType, getSnapshot, types, unprotect } from "../src"

test.skip("it should allow array of pointer objects", t => {
    function Pointer<S, T>(Model: IType<S, T>) {
        return types.model({
            value: types.reference(Model)
        })
    }

    const Todo = types.model({
        id: types.identifier(),
        name: types.string
    })

    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })


    const store = AppStore.create({
        todos: [
            { id: "1", name: "Hello"},
            { id: "2", name: "World"}
        ],
        selected: []
    })

    const ref = Pointer(Todo).create({ value: store.todos[0]}) // Fails because store.todos does not belongs to the same tree
    store.selected.push(ref)
})

test.skip("it should allow array of pointer objects - 2", t => {
    function Pointer<S, T>(Model: IType<S, T>) {
        return types.model({
            value: types.reference(Model)
        })
    }

    const Todo = types.model({
        id: types.identifier(),
        name: types.string
    })

    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo)), [])
    })


    const store = AppStore.create({
        todos: [
            { id: "1", name: "Hello"},
            { id: "2", name: "World"}
        ],
        selected: []
    })

    const ref = Pointer(Todo).create() // Fails because ref is required
    store.selected.push(ref)
    ref.value = store.todos[0] as any 
})

test.skip("it should allow array of pointer objects - 3", t => {
    function Pointer<S, T>(Model: IType<S, T>, path: string) {
        return types.model({
            value: types.reference(Model, path)
        })
    }

    const Todo = types.model({
        id: types.identifier(),
        name: types.string
    })

    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo, "/todos")), [])
    })


    const store = AppStore.create({
        todos: [
            { id: "1", name: "Hello"},
            { id: "2", name: "World"}
        ],
        selected: []
    })

    const ref = Pointer(Todo, "/todos").create({ value: store.todos[0]}) // Fails because store.todos does not belongs to the same tree
    store.selected.push(ref)
})

test.skip("it should allow array of pointer objects - 4", t => {
    function Pointer<S, T>(Model: IType<S, T>, path: string) {
        return types.model({
            value: types.reference(Model, path)
        })
    }

    const Todo = types.model({
        id: types.identifier(),
        name: types.string
    })

    const AppStore = types.model({
        todos: types.array(Todo),
        selected: types.optional(types.array(Pointer(Todo, "/todos")), [])
    })


    const store = AppStore.create({
        todos: [
            { id: "1", name: "Hello"},
            { id: "2", name: "World"}
        ],
        selected: []
    })

    const ref = Pointer(Todo, "/todos").create() // Fails because ref is required
    store.selected.push(ref)
    ref.value = store.todos[0] as any 
})