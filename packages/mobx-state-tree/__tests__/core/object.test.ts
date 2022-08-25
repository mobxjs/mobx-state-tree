import {
    destroy,
    detach,
    onSnapshot,
    onPatch,
    onAction,
    applyPatch,
    applyAction,
    applySnapshot,
    getSnapshot,
    unprotect,
    types,
    setLivelinessChecking,
    getParent,
    SnapshotOut,
    IJsonPatch,
    ISerializedActionCall,
    isAlive,
    cast,
    resolveIdentifier
} from "../../src"

import { autorun, reaction, observable, configure } from "mobx"

const createTestFactories = () => {
    const Factory = types
        .model({
            to: "world"
        })
        .actions((self) => {
            function setTo(to: string) {
                self.to = to
            }
            return {
                setTo
            }
        })
    const ComputedFactory = types
        .model({
            width: 100,
            height: 200
        })
        .views((self) => ({
            get area() {
                return self.width * self.height
            }
        }))
    const ComputedFactory2 = types
        .model({
            props: types.map(types.number)
        })
        .views((self) => ({
            get area() {
                return self.props.get("width")! * self.props.get("height")!
            }
        }))
        .actions((self) => {
            function setWidth(value: number) {
                self.props.set("width", value)
            }
            function setHeight(value: number) {
                self.props.set("height", value)
            }
            return {
                setWidth,
                setHeight
            }
        })
    const BoxFactory = types.model({
        width: 0,
        height: 0
    })
    const ColorFactory = types.model({
        color: "#FFFFFF"
    })
    return { Factory, ComputedFactory, ComputedFactory2, BoxFactory, ColorFactory }
}

const createFactoryWithChildren = () => {
    const File = types
        .model("File", {
            name: types.string
        })
        .actions((self) => ({
            rename(value: string) {
                self.name = value
            }
        }))

    const Folder = types
        .model("Folder", {
            name: types.string,
            files: types.array(File)
        })
        .actions((self) => ({
            rename(value: string) {
                self.name = value
            }
        }))
    return Folder
}
// === FACTORY TESTS ===
test("it should create a factory", () => {
    const { Factory } = createTestFactories()
    const instance = Factory.create()
    const snapshot = getSnapshot(instance)
    expect(snapshot).toEqual({ to: "world" })
    expect(getSnapshot(Factory.create())).toEqual({ to: "world" }) // toJSON is there as shortcut for getSnapshot(), primarily for debugging convenience
    expect(Factory.create().toString()).toEqual("AnonymousModel@<root>")
})
test("it should restore the state from the snapshot", () => {
    const { Factory } = createTestFactories()
    expect(getSnapshot(Factory.create({ to: "universe" }))).toEqual({ to: "universe" })
})
// === SNAPSHOT TESTS ===
test("it should emit snapshots", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let snapshots: SnapshotOut<typeof doc>[] = []
    onSnapshot(doc, (snapshot) => snapshots.push(snapshot))
    doc.to = "universe"
    expect(snapshots).toEqual([{ to: "universe" }])
})

test("it should emit snapshots for children", () => {
    const Factory = createFactoryWithChildren()
    const folder = Factory.create({
        name: "Photos to sort",
        files: [
            {
                name: "Photo1"
            },
            {
                name: "Photo2"
            }
        ]
    })
    let snapshotsP: SnapshotOut<typeof folder>[] = []
    let snapshotsC: SnapshotOut<typeof folder.files[0]>[] = []
    onSnapshot(folder, (snapshot) => snapshotsP.push(snapshot))
    folder.rename("Vacation photos")
    expect(snapshotsP[0]).toEqual({
        name: "Vacation photos",
        files: [{ name: "Photo1" }, { name: "Photo2" }]
    })

    onSnapshot(folder.files[0], (snapshot) => snapshotsC.push(snapshot))
    folder.files[0].rename("01-arrival")
    expect(snapshotsP[1]).toEqual({
        name: "Vacation photos",
        files: [{ name: "01-arrival" }, { name: "Photo2" }]
    })
    expect(snapshotsC[0]).toEqual({ name: "01-arrival" })

    folder.files[1].rename("02-hotel")
    expect(snapshotsP[2]).toEqual({
        name: "Vacation photos",
        files: [{ name: "01-arrival" }, { name: "02-hotel" }]
    })
    expect(snapshotsP.length).toBe(3)
    expect(snapshotsC.length).toBe(1)
})

test("it should apply snapshots", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applySnapshot(doc, { to: "universe" })
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
test("it should apply and accept null value for types.maybe(complexType)", () => {
    const Item = types.model("Item", {
        value: types.string
    })
    const Model = types.model("Model", {
        item: types.maybe(Item)
    })
    const myModel = Model.create()
    applySnapshot(myModel, { item: { value: "something" } })
    applySnapshot(myModel, { item: undefined })
    expect(getSnapshot(myModel)).toEqual({ item: undefined })
})
test("it should apply and accept null value for types.maybeNull(complexType)", () => {
    const Item = types.model("Item", {
        value: types.string
    })
    const Model = types.model("Model", {
        item: types.maybeNull(Item)
    })
    const myModel = Model.create()
    applySnapshot(myModel, { item: { value: "something" } })
    applySnapshot(myModel, { item: null })
    expect(getSnapshot(myModel)).toEqual({ item: null })
})
test("it should return a snapshot", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    expect(getSnapshot(doc)).toEqual({ to: "world" })
})
// === PATCHES TESTS ===
test("it should emit patches", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: IJsonPatch[] = []
    onPatch(doc, (patch) => patches.push(patch))
    doc.to = "universe"
    expect(patches).toEqual([{ op: "replace", path: "/to", value: "universe" }])
})
test("it should apply a patch", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, { op: "replace", path: "/to", value: "universe" })
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
test("it should apply patches", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyPatch(doc, [
        { op: "replace", path: "/to", value: "mars" },
        { op: "replace", path: "/to", value: "universe" }
    ])
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
test("it should stop listening to patches patches", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    unprotect(doc)
    let patches: IJsonPatch[] = []
    let disposer = onPatch(doc, (patch) => patches.push(patch))
    doc.to = "universe"
    disposer()
    doc.to = "mweststrate"
    expect(patches).toEqual([{ op: "replace", path: "/to", value: "universe" }])
})
// === ACTIONS TESTS ===
test("it should call actions correctly", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    doc.setTo("universe")
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
test("it should emit action calls", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    let actions: ISerializedActionCall[] = []
    onAction(doc, (action) => actions.push(action))
    doc.setTo("universe")
    expect(actions).toEqual([{ name: "setTo", path: "", args: ["universe"] }])
})
test("it should apply action call", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyAction(doc, { name: "setTo", path: "", args: ["universe"] })
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
test("it should apply actions calls", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    applyAction(doc, [
        { name: "setTo", path: "", args: ["mars"] },
        { name: "setTo", path: "", args: ["universe"] }
    ])
    expect(getSnapshot(doc)).toEqual({ to: "universe" })
})
// === COMPUTED VALUES ===
test("it should have computed properties", () => {
    const { ComputedFactory } = createTestFactories()
    const doc = ComputedFactory.create()
    unprotect(doc)
    doc.width = 3
    doc.height = 2
    expect(doc.area).toEqual(6)
})

test("it should throw if a replaced object is read or written to", () => {
    const Todo = types
        .model("Todo", {
            title: "test",
            arr: types.array(types.string),
            map: types.map(types.string),
            sub: types.optional(
                types
                    .model("Sub", {
                        title: "test2"
                    })
                    .actions((self) => ({
                        fn2() {}
                    })),
                {}
            )
        })
        .actions((self) => ({
            fn() {
                self.sub.fn2()
            }
        }))
    const Store = types.model("Store", {
        todo: Todo
    })
    const data = {
        title: "alive",
        arr: ["arr0"],
        map: { mapkey0: "mapval0" },
        sub: { title: "title" }
    }
    const s = Store.create({ todo: { ...data, title: "dead" } })
    unprotect(s)

    const deadArr = s.todo.arr
    s.todo.arr = cast(data.arr)

    const deadMap = s.todo.map
    s.todo.map = cast(data.map)

    const deadSub = s.todo.sub
    s.todo.sub = cast(data.sub)

    const deadTodo = s.todo
    s.todo = Todo.create(data)

    expect(s.todo.title).toBe("alive")

    setLivelinessChecking("error")

    function getError(objType: string, path: string, subpath: string, action: string) {
        return `You are trying to read or write to an object that is no longer part of a state tree. (Object type: '${objType}', Path upon death: '${path}', Subpath: '${subpath}', Action: '${action}'). Either detach nodes first, or don't use objects after removing / replacing them in the tree.`
    }

    // dead todo
    expect(() => {
        deadTodo.fn()
    }).toThrow(getError("Todo", "/todo", "", "/todo.fn()"))
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        deadTodo.title
    }).toThrow(getError("Todo", "/todo", "title", ""))
    expect(() => {
        deadTodo.title = "5"
    }).toThrow(getError("Todo", "/todo", "title", ""))

    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        deadTodo.arr[0]
    }).toThrow(getError("Todo", "/todo", "arr", ""))
    expect(() => {
        deadTodo.arr.push("arr1")
    }).toThrow(getError("Todo", "/todo", "arr", ""))

    expect(() => {
        deadTodo.map.get("mapkey0")
    }).toThrow(getError("Todo", "/todo", "map", ""))
    expect(() => {
        deadTodo.map.set("mapkey1", "val")
    }).toThrow(getError("Todo", "/todo", "map", ""))

    expect(() => {
        deadTodo.sub.fn2()
    }).toThrow(getError("Todo", "/todo", "sub", ""))
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        deadTodo.sub.title
    }).toThrow(getError("Todo", "/todo", "sub", ""))
    expect(() => {
        deadTodo.sub.title = "hi"
    }).toThrow(getError("Todo", "/todo", "sub", ""))

    // dead array
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        deadArr[0]
    }).toThrow(getError("string[]", "/todo/arr", "0", ""))
    expect(() => {
        deadArr[0] = "hi"
    }).toThrow(getError("string[]", "/todo/arr", "0", ""))
    expect(() => {
        deadArr.push("hi")
    }).toThrow(getError("string[]", "/todo/arr", "1", ""))

    // dead map
    expect(() => {
        deadMap.get("mapkey0")
    }).toThrow(getError("map<string, string>", "/todo/map", "mapkey0", ""))
    expect(() => {
        deadMap.set("mapkey0", "val")
    }).toThrow(getError("map<string, string>", "/todo/map", "mapkey0", ""))

    // dead subobj
    expect(() => {
        deadSub.fn2()
    }).toThrow(getError("Sub", "/todo/sub", "", "/todo/sub.fn2()"))
    expect(() => {
        // tslint:disable-next-line:no-unused-expression
        deadSub.title
    }).toThrow(getError("Sub", "/todo/sub", "title", ""))
    expect(() => {
        deadSub.title = "ho"
    }).toThrow(getError("Sub", "/todo/sub", "title", ""))
})

test("it should warn if a replaced object is read or written to", () => {
    const Todo = types
        .model("Todo", {
            title: "test"
        })
        .actions((self) => {
            function fn() {}
            return {
                fn
            }
        })
    const Store = types.model("Store", {
        todo: Todo
    })
    const s = Store.create({
        todo: { title: "3" }
    })
    unprotect(s)
    const todo = s.todo
    s.todo = Todo.create({ title: "4" })
    expect(s.todo.title).toBe("4")

    // try reading old todo
    setLivelinessChecking("error")
    const error =
        "You are trying to read or write to an object that is no longer part of a state tree"
    expect(() => todo.fn()).toThrow(error)
    expect(() => todo.title).toThrow(error)
    unprotect(todo)
    expect(() => {
        todo.title = "5"
    }).toThrow(error)
})

// === COMPOSE FACTORY ===
test("it should compose factories", () => {
    const { BoxFactory, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(BoxFactory, ColorFactory)
    expect(getSnapshot(ComposedFactory.create())).toEqual({ width: 0, height: 0, color: "#FFFFFF" })
})
test("it should compose factories with computed properties", () => {
    const { ComputedFactory2, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(ColorFactory, ComputedFactory2)
    const store = ComposedFactory.create({ props: { width: 100, height: 200 } })
    expect(getSnapshot(store)).toEqual({ props: { width: 100, height: 200 }, color: "#FFFFFF" })
    expect(store.area).toBe(20000)
    expect(typeof store.setWidth).toBe("function")
    expect(typeof store.setHeight).toBe("function")
})
test("it should compose multiple types with computed properties", () => {
    const { ComputedFactory2, ColorFactory } = createTestFactories()
    const ComposedFactory = types.compose(ColorFactory, ComputedFactory2)
    const store = ComposedFactory.create({ props: { width: 100, height: 200 } })
    expect(getSnapshot(store)).toEqual({ props: { width: 100, height: 200 }, color: "#FFFFFF" })
    expect(store.area).toBe(20000)
    expect(typeof store.setWidth).toBe("function")
    expect(typeof store.setHeight).toBe("function")
})
test("methods get overridden by compose", () => {
    const A = types
        .model({
            count: types.optional(types.number, 0)
        })
        .actions((self) => {
            function increment() {
                self.count += 1
            }
            return {
                increment
            }
        })
    const B = A.actions((self) => ({
        increment() {
            self.count += 10
        }
    }))
    const store = B.create()
    expect(getSnapshot(store)).toEqual({ count: 0 })
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(10)
})
test("compose should add new props", () => {
    const A = types.model({
        count: types.optional(types.number, 0)
    })
    const B = A.props({
        called: types.optional(types.number, 0)
    })
    const store = B.create()
    expect(getSnapshot(store)).toEqual({ count: 0, called: 0 })
    expect(store.count).toBe(0)
})
test("models should expose their actions to be used in a composable way", () => {
    const A = types
        .model({
            count: types.optional(types.number, 0)
        })
        .actions((self) => {
            function increment() {
                self.count += 1
            }
            return {
                increment
            }
        })
    const B = A.props({
        called: types.optional(types.number, 0)
    }).actions((self) => {
        const baseIncrement = self.increment
        return {
            increment() {
                baseIncrement()
                self.called += 1
            }
        }
    })
    const store = B.create()
    expect(getSnapshot(store)).toEqual({ count: 0, called: 0 })
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(1)
    expect(store.called).toBe(1)
})
test("compose should be overwrite", () => {
    const A = types
        .model({
            name: "",
            alias: ""
        })
        .views((self) => ({
            get displayName() {
                return self.alias || self.name
            }
        }))
    const B = A.props({
        type: ""
    }).views((self) => ({
        get displayName() {
            return self.alias || self.name + self.type
        }
    }))
    const storeA = A.create({ name: "nameA", alias: "aliasA" })
    const storeB = B.create({ name: "nameB", alias: "aliasB", type: "typeB" })
    const storeC = B.create({ name: "nameC", type: "typeC" })
    expect(storeA.displayName).toBe("aliasA")
    expect(storeB.displayName).toBe("aliasB")
    expect(storeC.displayName).toBe("nameCtypeC")
})
// === TYPE CHECKS ===
test("it should check the type correctly", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    expect(Factory.is(doc)).toEqual(true)
    expect(Factory.is([])).toEqual(false)
    expect(Factory.is({})).toEqual(true)
    expect(Factory.is({ to: "mars" })).toEqual(true)
    expect(Factory.is({ wrongKey: true })).toEqual(true)
    expect(Factory.is({ to: 3 })).toEqual(false)
})

if (process.env.NODE_ENV !== "production") {
    test("complex map / array values are optional by default", () => {
        expect(
            types
                .model({
                    todo: types.model({})
                })
                .is({})
        ).toBe(false)
        expect(() =>
            types
                .model({
                    todo: types.model({})
                })
                .create({} as any)
        ).toThrow()
        expect(
            types
                .model({
                    todo: types.array(types.string)
                })
                .is({})
        ).toBe(true) // TBD: or true?
        expect(
            getSnapshot(
                types
                    .model({
                        todo: types.array(types.string)
                    })
                    .create({})
            )
        ).toEqual({ todo: [] })
        expect(
            types
                .model({
                    todo: types.map(types.string)
                })
                .is({})
        ).toBe(true)
        expect(
            getSnapshot(
                types
                    .model({
                        todo: types.map(types.string)
                    })
                    .create({})
            )
        ).toEqual({ todo: {} })
    })
}
// === VIEW FUNCTIONS ===
test("view functions should be tracked", () => {
    const model = types
        .model({
            x: 3
        })
        .views((self) => ({
            doubler() {
                return self.x * 2
            }
        }))
        .create()
    unprotect(model)
    const values: number[] = []
    const d = autorun(() => {
        values.push(model.doubler())
    })
    model.x = 7
    expect(values).toEqual([6, 14])
})
test("view functions should not be allowed to change state", () => {
    const model = types
        .model({
            x: 3
        })
        .views((self) => ({
            doubler() {
                self.x *= 2
            }
        }))
        .actions((self) => {
            function anotherDoubler() {
                self.x *= 2
            }
            return {
                anotherDoubler
            }
        })
        .create()
    expect(() => model.doubler()).toThrow()
    model.anotherDoubler()
    expect(model.x).toBe(6)
})
test("it should consider primitives as proposed defaults", () => {
    const now = new Date()
    const Todo = types.model({
        id: 0,
        name: "Hello world",
        done: false,
        createdAt: now
    })
    const doc = Todo.create()
    expect(getSnapshot(doc)).toEqual({
        id: 0,
        name: "Hello world",
        done: false,
        createdAt: now.getTime()
    })
})
test("it should throw if a non-primitive value is provided and no default can be created", () => {
    expect(() => {
        types.model({
            complex: {
                a: 1,
                b: 2
            } as any
        })
    }).toThrow()
})
if (process.env.NODE_ENV !== "production") {
    test("it should not be possible to remove a node from a parent if it is required, see ", () => {
        const A = types.model("A", { x: 3 })
        const B = types.model("B", { a: A })
        const b = B.create({ a: { x: 7 } })
        unprotect(b)
        expect(() => {
            detach(b.a)
        }).toThrowError(/Error while converting `undefined` to `A`/)
        expect(() => {
            destroy(b.a)
        }).toThrowError(/Error while converting `undefined` to `A`/)
    })
    test("it should be possible to remove a node from a parent if it is defined as type maybe ", () => {
        const A = types.model("A", { x: 3 })
        const B = types.model("B", { a: types.maybe(A) })
        const b = B.create({ a: { x: 7 } })
        unprotect(b)
        expect(() => {
            const a = b.a!
            detach(a)
            destroy(a)
        }).not.toThrow()
        expect(b.a).toBe(undefined)
        expect(getSnapshot(b).a).toBe(undefined)
    })
    test("it should be possible to remove a node from a parent if it is defined as type maybeNull ", () => {
        const A = types.model("A", { x: 3 })
        const B = types.model("B", { a: types.maybeNull(A) })
        const b = B.create({ a: { x: 7 } })
        unprotect(b)
        expect(() => {
            const a = b.a!
            detach(a)
            destroy(a)
        }).not.toThrow()
        expect(b.a).toBe(null)
        expect(getSnapshot(b).a).toBe(null)
    })
}
test("it should be possible to share states between views and actions using enhance", () => {
    const A = types.model({}).extend((self) => {
        const localState = observable.box(3)
        return {
            views: {
                get x() {
                    return localState.get()
                }
            },
            actions: {
                setX(value: number) {
                    localState.set(value)
                }
            }
        }
    })
    let x = 0
    let a = A.create()
    const d = reaction(
        () => a.x,
        (v) => {
            x = v
        }
    )
    a.setX(7)
    expect(a.x).toBe(7)
    expect(x).toBe(7)
    d()
})
test("It should throw if any other key is returned from extend", () => {
    const A = types.model({}).extend(() => ({ stuff() {} } as any))
    expect(() => A.create()).toThrowError(/stuff/)
})

test("782, TS + compose", () => {
    const User = types.model("User", {
        id: types.identifier,
        name: types.maybe(types.string),
        avatar: types.maybe(types.string)
    })

    const user = User.create({ id: "someId" })
})

test("961 - model creating should not change snapshot", () => {
    const M = types.model({ foo: 1 })
    const o = {}

    const m = M.create(o)
    expect(o).toEqual({})
    expect(getSnapshot(m)).toEqual({ foo: 1 })
})

if (process.env.NODE_ENV === "development")
    test("beautiful errors", () => {
        expect(() => {
            types.model("User", { x: (types.identifier as any)() })
        }).toThrow("types.identifier is not a function")
        expect(() => {
            types.model("User", { x: { bla: true } as any })
        }).toThrow(
            "Invalid type definition for property 'x', it looks like you passed an object. Try passing another model type or a types.frozen"
        )
        expect(() => {
            types.model("User", { x: function () {} as any })
        }).toThrow(
            "Invalid type definition for property 'x', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?"
        )
    })

test("#967 - changing values in afterCreate/afterAttach when node is instantiated from view", () => {
    const Answer = types
        .model("Answer", {
            title: types.string,
            selected: false
        })
        .actions((self) => ({
            toggle() {
                self.selected = !self.selected
            }
        }))
    const Question = types
        .model("Question", { title: types.string, answers: types.array(Answer) })
        .views((self) => ({
            get brokenView() {
                // this should not be allowed
                // MWE: disabled, MobX 6 no longer forbids this
                // expect(() => {
                //     self.answers[0].toggle()
                // }).toThrow()
                return 0
            }
        }))
        .actions((self) => ({
            afterCreate() {
                // we should allow changes even when inside a computed property when done inside afterCreate/afterAttach
                self.answers[0].toggle()
                // but not further computed changes
                expect(self.brokenView).toBe(0)
            },
            afterAttach() {
                // we should allow changes even when inside a computed property when done inside afterCreate/afterAttach
                self.answers[0].toggle()
                expect(self.brokenView).toBe(0)
            }
        }))

    const Product = types
        .model("Product", {
            questions: types.array(Question)
        })
        .views((self) => ({
            get selectedAnswers() {
                const result = []
                for (const question of self.questions) {
                    result.push(question.answers.find((a) => a.selected))
                }
                return result
            }
        }))

    const product = Product.create({
        questions: [
            { title: "Q 0", answers: [{ title: "A 0.0" }, { title: "A 0.1" }] },
            { title: "Q 1", answers: [{ title: "A 1.0" }, { title: "A 1.1" }] }
        ]
    })

    // tslint:disable-next-line:no-unused-expression
    product.selectedAnswers
})

test("#993-1 - after attach should have a parent when accesing a reference directly", () => {
    const L4 = types
        .model("Todo", {
            id: types.identifier,
            finished: false
        })
        .actions((self) => ({
            afterAttach() {
                expect(getParent(self)).toBeTruthy()
            }
        }))

    const L3 = types.model({ l4: L4 }).actions((self) => ({
        afterAttach() {
            expect(getParent(self)).toBeTruthy()
        }
    }))

    const L2 = types
        .model({
            l3: L3
        })
        .actions((self) => ({
            afterAttach() {
                expect(getParent(self)).toBeTruthy()
            }
        }))

    const L1 = types
        .model({
            l2: L2,
            selected: types.reference(L4)
        })
        .actions((self) => ({
            afterAttach() {
                throw fail("should never be called")
            }
        }))

    const createL1 = () =>
        L1.create({
            l2: {
                l3: {
                    l4: {
                        id: "11124091-11c1-4dda-b2ed-7dd6323491a5"
                    }
                }
            },
            selected: "11124091-11c1-4dda-b2ed-7dd6323491a5"
        })

    // test 1, real child first
    {
        const l1 = createL1()

        const a = l1.l2.l3.l4
        const b = l1.selected
    }

    // test 2, reference first
    {
        const l1 = createL1()

        const a = l1.selected
        const b = l1.l2.l3.l4
    }
})

test("#993-2 - references should have a parent even when the parent has not been accessed before", () => {
    const events: string[] = []

    const L4 = types
        .model("Todo", {
            id: types.identifier,
            finished: false
        })
        .actions((self) => ({
            toggle() {
                self.finished = !self.finished
            },
            afterCreate() {
                events.push("l4-ac")
            },
            afterAttach() {
                events.push("l4-at")
            }
        }))

    const L3 = types.model({ l4: L4 }).actions((self) => ({
        afterCreate() {
            events.push("l3-ac")
        },
        afterAttach() {
            events.push("l3-at")
        }
    }))

    const L2 = types
        .model({
            l3: L3
        })
        .actions((self) => ({
            afterCreate() {
                events.push("l2-ac")
            },
            afterAttach() {
                events.push("l2-at")
            }
        }))

    const L1 = types
        .model({
            l2: L2,
            selected: types.reference(L4)
        })
        .actions((self) => ({
            afterCreate() {
                events.push("l1-ac")
            },
            afterAttach() {
                events.push("l1-at")
            }
        }))

    const createL1 = () =>
        L1.create({
            l2: {
                l3: {
                    l4: {
                        id: "11124091-11c1-4dda-b2ed-7dd6323491a5"
                    }
                }
            },
            selected: "11124091-11c1-4dda-b2ed-7dd6323491a5"
        })

    const expectedEvents = [
        "l1-ac",
        "l2-ac",
        "l2-at",
        "l3-ac",
        "l3-at",
        "l4-ac",
        "l4-at",
        "onSnapshot",
        "-",
        "onSnapshot"
    ]

    // test 1, real child first
    {
        const l1 = createL1()
        onSnapshot(l1, () => {
            events.push("onSnapshot")
        })

        l1.l2.l3.l4.toggle()
        events.push("-")
        l1.selected.toggle()
        expect(events).toEqual(expectedEvents)
    }

    const expectedEvents2 = [
        "l1-ac",
        "l4-ac",
        "l3-ac",
        "l2-ac",
        "l2-at",
        "l3-at",
        "l4-at",
        "onSnapshot",
        "-",
        "onSnapshot"
    ]

    // test 2, reference first
    // the order of hooks is different but they are all called
    events.length = 0
    {
        const l1 = createL1()
        onSnapshot(l1, () => {
            events.push("onSnapshot")
        })

        l1.selected.toggle()
        events.push("-")
        l1.l2.l3.l4.toggle()
        expect(events).toEqual(expectedEvents2)
    }

    // test 3, reference get parent should be available from the beginning and all the way to the root
    {
        const rootL1 = createL1()
        const l4 = rootL1.selected
        const l3 = getParent(l4)
        expect(l3).toBeTruthy()
        const l2 = getParent(l3)
        expect(l2).toBeTruthy()
        const l1 = getParent(l2)
        expect(l1).toBeTruthy()

        expect(l1).toBe(rootL1)
        expect(l2).toBe(rootL1.l2)
        expect(l3).toBe(rootL1.l2.l3)
        expect(l4).toBe(rootL1.l2.l3.l4)
    }
})

test("it should emit patches when applySnapshot is used", () => {
    const { Factory } = createTestFactories()
    const doc = Factory.create()
    let patches: IJsonPatch[] = []
    onPatch(doc, (patch) => patches.push(patch))
    applySnapshot(doc, { ...getSnapshot(doc), to: "universe" })
    expect(patches).toEqual([{ op: "replace", path: "/to", value: "universe" }])
})

test("isAlive must be reactive", () => {
    const Todo = types.model({ text: types.string })
    const TodoStore = types.model({
        todos: types.array(Todo),
        todo: types.maybe(Todo)
    })

    const store = TodoStore.create({
        todos: [{ text: "1" }, { text: "2" }],
        todo: { text: "3" }
    })
    unprotect(store)

    const t1 = store.todos[0]!
    const t2 = store.todos[1]!
    const t3 = store.todo!

    let calls = 0
    const r1 = reaction(
        () => isAlive(t1),
        (v) => {
            expect(v).toBe(false)
            calls++
        }
    )
    const r2 = reaction(
        () => isAlive(t2),
        (v) => {
            expect(v).toBe(false)
            calls++
        }
    )
    const r3 = reaction(
        () => isAlive(t3),
        (v) => {
            expect(v).toBe(false)
            calls++
        }
    )

    try {
        store.todos = cast([])
        store.todo = undefined

        expect(calls).toBe(3)
    } finally {
        r1()
        r2()
        r3()
    }
})

test("#1112 - identifier cache should be cleared for unaccessed wrapped objects", () => {
    const mock1 = [
        { id: "1", name: "Kate" },
        { id: "2", name: "John" }
    ]
    const mock2 = [
        { id: "3", name: "Andrew" },
        { id: "2", name: "John" }
    ]

    const mock1_2 = mock1.map((i, index) => ({ text: `Text${index}`, entity: i }))
    const mock2_2 = mock2.map((i, index) => ({ text: `Text${index}`, entity: i }))

    const Entity = types.model({
        id: types.identifier,
        name: types.string
    })

    const Wrapper = types.model({
        text: types.string,
        entity: Entity
    })

    const Store = types
        .model({
            list: types.optional(types.array(Wrapper), []),
            selectedId: 2
        })
        .views((self) => ({
            get selectedEntity() {
                return resolveIdentifier(Entity, self, self.selectedId)
            }
        }))

    const store = Store.create()
    unprotect(store)

    store.list.replace(mock1_2)
    store.list.replace(mock2_2)

    expect(store.selectedEntity!.id).toBe("2")
})

test("#1173 - detaching a model should not screw it", () => {
    const AM = types.model({ x: 5 })
    const Store = types.model({ item: types.maybe(AM) })
    const s = Store.create({ item: { x: 6 } })
    const n0 = s.item

    unprotect(s)

    const detachedItem = detach(s.item!)
    expect(s.item).not.toBe(detachedItem)
    expect(s.item).toBe(undefined)
    expect(detachedItem.x).toBe(6)
    expect(detachedItem).toBe(n0)
})

test("#1702 - should not throw with useProxies: 'ifavailable'", () => {
    configure({
        useProxies: "ifavailable"
    })

    const M = types.model({ x: 5 }).views((self) => ({
        get y() {
            return self.x
        }
    }))

    expect(() => {
        M.create({})
    }).not.toThrow()
})
