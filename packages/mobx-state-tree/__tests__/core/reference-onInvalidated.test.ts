import {
    types,
    OnReferenceInvalidated,
    Instance,
    ReferenceIdentifier,
    IAnyStateTreeNode,
    unprotect,
    OnReferenceInvalidatedEvent,
    getSnapshot,
    applySnapshot,
    clone
} from "../../src"

const Todo = types.model({ id: types.identifier })

const createSnapshot = (partialSnapshot: any) => ({
    todos: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
    ...partialSnapshot
})

const createStore = (
    partialSnapshot: any,
    onInvalidated?: OnReferenceInvalidated<Instance<typeof Todo>>,
    customRef = false
) => {
    const refOptions = {
        onInvalidated,
        get(identifier: ReferenceIdentifier, parent: IAnyStateTreeNode | null) {
            return (parent as Instance<typeof Store>).todos.find(t => t.id === identifier)
        },
        set(value: Instance<typeof Todo>): ReferenceIdentifier {
            return value.id
        }
    }

    if (!customRef) {
        delete refOptions.get
        delete refOptions.set
    }

    const Store = types.model({
        todos: types.array(Todo),
        onInv: types.maybe(types.reference(Todo, refOptions as any)),
        single: types.weakReference(Todo),
        deep: types.optional(
            types.model({
                single: types.weakReference(Todo)
            }),
            {}
        ),
        arr: types.array(types.weakReference(Todo)),
        map: types.map(types.weakReference(Todo))
    })

    const s = Store.create(createSnapshot(partialSnapshot))
    unprotect(s)
    return s
}

for (const customRef of [false, true]) {
    describe(`onInvalidated - customRef: ${customRef}`, () => {
        test("from snapshot without accessing the referenced node", () => {
            let ev: OnReferenceInvalidatedEvent<Instance<typeof Todo>> | undefined
            let oldRefId!: string
            let calls = 0
            const onInv: OnReferenceInvalidated<Instance<typeof Todo>> = ev1 => {
                calls++
                oldRefId = ev1.oldRef!.id
                ev = ev1
                ev1.removeRef()
            }
            const store = createStore({ onInv: "1" }, onInv)

            expect(calls).toBe(0)
            store.todos.splice(0, 1)
            expect(calls).toBe(1)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("1")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()

            store.onInv = store.todos[0]
            expect(calls).toBe(1)
            store.todos.splice(0, 1)
            expect(calls).toBe(2)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("2")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()
        })

        test("applying snapshot without accesing the referenced node", () => {
            let ev: OnReferenceInvalidatedEvent<Instance<typeof Todo>> | undefined
            let oldRefId!: string
            let calls = 0
            const onInv: OnReferenceInvalidated<Instance<typeof Todo>> = ev1 => {
                calls++
                oldRefId = ev1.oldRef!.id
                ev = ev1
                ev1.removeRef()
            }
            const store = createStore({}, onInv)
            expect(calls).toBe(0)
            applySnapshot(store, createSnapshot({ onInv: "1" }))
            expect(calls).toBe(0)
            store.todos.splice(0, 1)
            expect(calls).toBe(1)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("1")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()

            store.onInv = store.todos[0]
            expect(calls).toBe(1)
            store.todos.splice(0, 1)
            expect(calls).toBe(2)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("2")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()
        })

        test("runtime change", () => {
            let ev: OnReferenceInvalidatedEvent<Instance<typeof Todo>> | undefined
            let oldRefId!: string
            let calls = 0
            const onInv: OnReferenceInvalidated<Instance<typeof Todo>> = ev1 => {
                calls++
                oldRefId = ev1.oldRef!.id
                ev = ev1
                ev1.removeRef()
            }
            const store = createStore({}, onInv)

            expect(calls).toBe(0)
            store.onInv = store.todos[1]
            expect(calls).toBe(0)
            store.onInv = store.todos[0]
            expect(calls).toBe(0)
            store.todos.remove(store.todos[0])
            expect(calls).toBe(1)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("1")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()

            store.onInv = store.todos[0]
            expect(calls).toBe(1)
            store.todos.remove(store.todos[0])
            expect(calls).toBe(2)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("2")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()
        })

        test("replacing ref", () => {
            let ev: OnReferenceInvalidatedEvent<Instance<typeof Todo>> | undefined
            let oldRefId!: string
            let calls = 0
            const onInv: OnReferenceInvalidated<Instance<typeof Todo>> = ev1 => {
                calls++
                oldRefId = ev1.oldRef!.id
                ev = ev1
                ev1.replaceRef(store.todos[1])
            }
            const store = createStore({}, onInv)

            expect(calls).toBe(0)
            store.onInv = store.todos[0]
            expect(calls).toBe(0)
            store.todos.remove(store.todos[0])
            expect(calls).toBe(1)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("1")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv!.id).toBe("2")
            expect(getSnapshot(store).onInv).toBe("2")
        })

        test("cloning works", () => {
            let ev: OnReferenceInvalidatedEvent<Instance<typeof Todo>> | undefined
            let oldRefId!: string
            let calls = 0
            const onInv: OnReferenceInvalidated<Instance<typeof Todo>> = ev1 => {
                calls++
                oldRefId = ev1.oldRef!.id
                ev = ev1
                ev1.removeRef()
            }
            const store1 = createStore({}, onInv)

            expect(calls).toBe(0)
            store1.onInv = store1.todos[0]
            expect(calls).toBe(0)

            const store = clone(store1)
            unprotect(store)
            expect(calls).toBe(0)
            store.onInv = store.todos[0]
            expect(calls).toBe(0)
            store.todos.remove(store.todos[0])
            expect(calls).toBe(1)
            expect(ev!.parent).toBe(store)
            expect(oldRefId).toBe("1")
            expect(ev!.removeRef).toBeTruthy()
            expect(ev!.replaceRef).toBeTruthy()
            expect(store.onInv).toBe(undefined)
            expect(getSnapshot(store).onInv).toBeUndefined()
            // make sure other ref stil points to the right one
            expect(store1.onInv).toBe(store1.todos[0])
        })
    })
}

describe("weakReference", () => {
    test("model property", () => {
        const store = createStore({})
        expect(store.single).toBeUndefined()
        store.single = store.todos[0]
        expect(store.single).toBe(store.todos[0])
        store.todos.remove(store.todos[0])
        expect(store.single).toBeUndefined()
    })

    test("deep model property", () => {
        const store = createStore({})
        expect(store.deep.single).toBeUndefined()
        store.deep.single = store.todos[0]
        expect(store.deep.single).toBe(store.todos[0])
        store.todos.remove(store.todos[0])
        expect(store.deep.single).toBeUndefined()
    })

    test("array child", () => {
        const store = createStore({})
        expect(store.arr.length).toBe(0)

        store.arr.push(store.todos[0])
        store.arr.push(store.todos[2])
        expect(store.arr.length).toBe(2)
        expect(store.arr[0]!.id).toBe("1")
        expect(store.arr[1]!.id).toBe("3")

        store.todos.splice(0, 1)
        expect(store.arr.length).toBe(1)
        expect(store.arr[0]!.id).toBe("3")
    })

    test("map child", () => {
        const store = createStore({})
        expect(store.map.size).toBe(0)

        store.map.set("a", store.todos[0])
        store.map.set("c", store.todos[2])
        expect(store.map.size).toBe(2)
        expect(store.map.get("a")!.id).toBe("1")
        expect(store.map.get("c")!.id).toBe("3")

        store.todos.splice(0, 1)
        expect(store.map.size).toBe(1)
        expect(store.map.get("c")!.id).toBe("3")
    })

    test("snapshot with invalid reference should be set to undefined", () => {
        const store = createStore({ single: "100" })
        expect(store.single).toBeUndefined()

        // check reassignation still works
        store.single = store.todos[0]
        expect(store.single).toBe(store.todos[0])
        store.todos.remove(store.todos[0])
        expect(store.single).toBeUndefined()
    })

    test("setting it to an invalid id and then accessing it should still result in undefined", () => {
        const store = createStore({})
        store.single = "100" as any
        expect(() => {
            const s = store.single
        }).toThrow("Failed to resolve reference")
    })
})
