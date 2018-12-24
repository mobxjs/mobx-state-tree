import {
    types,
    getSnapshot,
    unprotect,
    getRoot,
    getParent,
    SnapshotOrInstance,
    cast,
    SnapshotIn,
    Instance,
    castToSnapshot,
    IType,
    isStateTreeNode,
    isFrozenType
} from "../../src"

const createTestFactories = () => {
    const Box = types.model({
        width: 0,
        height: 0
    })
    const Square = types.model({
        width: 0,
        height: 0
    })
    const Cube = types.model({
        width: 0,
        height: 0,
        depth: 0
    })
    return { Box, Square, Cube }
}
test("it should recognize a valid snapshot", () => {
    const { Box } = createTestFactories()
    expect(Box.is({ width: 1, height: 2 })).toEqual(true)
    expect(Box.is({ width: 1, height: 2, depth: 3 })).toEqual(true)
})
test("it should recognize an invalid snapshot", () => {
    const { Box } = createTestFactories()
    expect(Box.is({ width: "1", height: "2" })).toEqual(false)
})
test("it should check valid nodes as well", () => {
    const { Box } = createTestFactories()
    const doc = Box.create()
    expect(Box.is(doc)).toEqual(true)
})
test("it should check invalid nodes as well", () => {
    const { Box } = createTestFactories()
    const doc = Box.create()
    expect(
        types
            .model({
                anotherAttr: types.number
            })
            .is(doc)
    ).toEqual(false)
})
test("it should do typescript type inference correctly", () => {
    const A = types
        .model({
            x: types.number,
            y: types.maybeNull(types.string)
        })
        .views(self => ({
            get z(): string {
                return "hi"
            }
        }))
        .actions(self => {
            function method() {
                const x: string = self.z + self.x + self.y
                anotherMethod(x)
            }
            function anotherMethod(x: string) {}
            return {
                method,
                anotherMethod
            }
        })
    // factory is invokable
    const a = A.create({ x: 2, y: "7" })
    unprotect(a)
    // property can be used as proper type
    const z: number = a.x
    // property can be assigned to crrectly
    a.x = 7
    // wrong type cannot be assigned
    // MANUAL TEST: not ok: a.x = "stuff"
    // sub factories work
    const B = types.model({
        sub: types.maybe(A)
    })
    const b = B.create()
    unprotect(b)
    // sub fields can be reassigned
    b.sub = A.create({
        // MANUAL TEST not ok: z: 4,
        x: 3
    })
    // sub fields have proper type
    b.sub.x = 4
    const d: string | null = b.sub.y
    a.y = null
    const zz: string = a.z
    // Manual test not assignable:
    // a.z = "test"
    b.sub.method()
    expect(true).toBe(true) // supress no asserts warning
    // snapshots are of the proper type
    const snapshot = getSnapshot(a)
    const sx: number = snapshot.x
    const sy: string | null = snapshot.y
    expect(sx).toBe(7)
    expect(sy).toBe(null)
})
test("#66 - it should accept superfluous fields", () => {
    const Item = types.model({
        id: types.number,
        name: types.string
    })
    expect(Item.is({})).toBe(false)
    expect(Item.is({ id: 3 })).toBe(false)
    expect(Item.is({ id: 3, name: "" })).toBe(true)
    expect(Item.is({ id: 3, name: "", description: "" })).toBe(true)
    const a = Item.create({ id: 3, name: "", description: "bla" } as any)
    expect((a as any).description).toBe(undefined)
})
test("#66 - it should not require defaulted fields", () => {
    const Item = types.model({
        id: types.number,
        name: types.optional(types.string, "boo")
    })
    expect(Item.is({})).toBe(false)
    expect(Item.is({ id: 3 })).toBe(true)
    expect(Item.is({ id: 3, name: "" })).toBe(true)
    expect(Item.is({ id: 3, name: "", description: "" })).toBe(true)
    const a = Item.create({ id: 3, description: "bla" } as any)
    expect((a as any).description).toBe(undefined)
    expect(a.name).toBe("boo")
})
test("#66 - it should be possible to omit defaulted fields", () => {
    const Item = types.model({
        id: types.number,
        name: "boo"
    })
    expect(Item.is({})).toBe(false)
    expect(Item.is({ id: 3 })).toBe(true)
    expect(Item.is({ id: 3, name: "" })).toBe(true)
    expect(Item.is({ id: 3, name: "", description: "" })).toBe(true)
    const a = Item.create({ id: 3, description: "bla" } as any)
    expect((a as any).description).toBe(undefined)
    expect(a.name).toBe("boo")
})
test("#66 - it should pick the correct type of defaulted fields", () => {
    const Item = types.model({
        id: types.number,
        name: "boo"
    })
    const a = Item.create({ id: 3 })
    unprotect(a)
    expect(a.name).toBe("boo")
    if (process.env.NODE_ENV !== "production") {
        expect(() => ((a as any).name = 3)).toThrowError(
            `[mobx-state-tree] Error while converting \`3\` to \`string\`:\n\n    value \`3\` is not assignable to type: \`string\` (Value is not a string).`
        )
    }
})
test("cannot create factories with null values", () => {
    expect(() =>
        types.model({
            x: null
        } as any)
    ).toThrow()
})
test("can create factories with maybe primitives", () => {
    const F = types.model({
        x: types.maybeNull(types.string)
    })
    expect(F.is(undefined)).toBe(false)
    expect(F.is({})).toBe(true)
    expect(F.is({ x: null })).toBe(true)
    expect(F.is({ x: "test" })).toBe(true)
    expect(F.is({ x: 3 })).toBe(false)
    expect(F.create().x).toBe(null)
    expect(F.create({ x: undefined }).x).toBe(null)
    expect(F.create({ x: "" }).x).toBe("")
    expect(F.create({ x: "3" }).x).toBe("3")
})
test("it is possible to refer to a type", () => {
    const Todo = types
        .model({
            title: types.string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    function x(): typeof Todo.Type {
        return Todo.create({ title: "test" })
    }
    const z = x()
    unprotect(z)
    z.setTitle("bla")
    z.title = "bla"
    // z.title = 3 // Test manual: should give compile error
    expect(true).toBe(true) // supress no asserts warning
})
test(".Type should not be callable", () => {
    const Todo = types
        .model({
            title: types.string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    expect(() => Todo.Type).toThrow()
})
test(".SnapshotType should not be callable", () => {
    const Todo = types
        .model({
            title: types.string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    expect(() => Todo.SnapshotType).toThrow()
})
test("types instances with compatible snapshots should not be interchangeable", () => {
    const A = types.model("A", {}).actions(self => {
        function doA() {}
        return {
            doA
        }
    })
    const B = types.model("B", {}).actions(self => {
        function doB() {}
        return {
            doB
        }
    })
    const C = types.model("C", {
        x: types.maybe(A)
    })
    expect(A.is({})).toBe(true)
    expect(A.is(B.create())).toBe(false) // if thies yielded true, then `B.create().doA()` should work!
    expect(A.is(getSnapshot(B.create()))).toBe(true)
    const c = C.create()
    unprotect(c)
    expect(() => {
        c.x = undefined
    }).not.toThrow()
    expect(() => {
        c.x = cast({})
    }).not.toThrow()
    expect(() => {
        c.x = A.create()
    }).not.toThrow()
    expect(() => {
        ;(c as any).x = B.create()
    }).toThrow()
})
test("it handles complex types correctly", () => {
    const Todo = types
        .model({
            title: types.string
        })
        .actions(self => {
            function setTitle(v: string) {}
            return {
                setTitle
            }
        })
    const Store = types
        .model({
            todos: types.map(Todo)
        })
        .views(self => {
            function getActualAmount() {
                return self.todos.size
            }
            return {
                get amount() {
                    return getActualAmount()
                },
                getAmount(): number {
                    return self.todos.size + getActualAmount()
                }
            }
        })
        .actions(self => {
            function setAmount() {
                const x: number = self.todos.size + self.amount + self.getAmount()
            }
            return {
                setAmount
            }
        })
    expect(true).toBe(true) // supress no asserts warning
})
if (process.env.NODE_ENV !== "production") {
    test("it should provide detailed reasons why the value is not appicable", () => {
        const Todo = types
            .model({
                title: types.string
            })
            .actions(self => {
                function setTitle(v: string) {}
                return {
                    setTitle
                }
            })
        const Store = types
            .model({
                todos: types.map(Todo)
            })
            .views(self => ({
                get amount() {
                    return self.todos.size
                },
                getAmount(): number {
                    return self.todos.size + self.todos.size
                }
            }))
            .actions(self => {
                function setAmount() {
                    const x: number = self.todos.size + self.amount + self.getAmount()
                }
                return {
                    setAmount
                }
            })
        expect(() =>
            Store.create({
                todos: { "1": { title: true, setTitle: "hello" } },
                amount: 1,
                getAmount: "hello"
            } as any)
        ).toThrowError(
            // MWE: TODO: Ideally (like in MST =< 0.9):
            // at path "/todos/1/setTitle" value \`"hello"\` is not assignable  (Action properties should not be provided in the snapshot).
            // at path "/amount" value \`1\` is not assignable  (Computed properties should not be provided in the snapshot).
            // at path "/getAmount" value \`"hello"\` is not assignable  (View properties should not be provided in the snapshot).`
            `[mobx-state-tree] Error while converting \`{"todos":{"1":{"title":true,"setTitle":"hello"}},"amount":1,"getAmount":"hello"}\` to \`AnonymousModel\`:

    at path "/todos/1/title" value \`true\` is not assignable to type: \`string\` (Value is not a string).`
        )
    })
}
test("it should type compose correctly", () => {
    const Car = types
        .model({
            wheels: 3
        })
        .actions(self => {
            let connection = (null as any) as Promise<any>
            function drive() {}
            function afterCreate() {
                connection = Promise.resolve(true)
            }
            return {
                drive,
                afterCreate
            }
        })
    const Logger = types
        .model({
            logNode: "test"
        })
        .actions(self => {
            function log(msg: string) {}
            return {
                log
            }
        })
    const LoggableCar = types.compose(
        Car,
        Logger
    )
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })
    // x.test() // compile error
    x.drive()
    x.log("z")
})
test("it should extend {pre,post}ProcessSnapshot on compose", () => {
    const CompositionTracker = types
        .model({
            composedOf: types.array(types.string),
            composedWith: types.array(types.string)
        })
        .preProcessSnapshot(snapshot => ({
            ...snapshot,
            composedOf: (snapshot.composedOf || []).concat("CompositionTracker")
        }))
        .postProcessSnapshot(snapshot => ({
            ...snapshot,
            composedWith: (snapshot.composedWith || []).concat("WagonTracker")
        }))
    const Car = types
        .model({})
        .preProcessSnapshot(snapshot => ({
            ...snapshot,
            composedOf: ((snapshot as any).composedOf || []).concat("Car")
        }))
        .postProcessSnapshot(snapshot => ({
            ...snapshot,
            composedWith: ((snapshot as any).composedWith || []).concat("Wagon")
        }))
    const Logger = types
        .model({})
        .preProcessSnapshot(snapshot => ({
            ...snapshot,
            composedOf: ((snapshot as any).composedOf || []).concat("CarLogger")
        }))
        .postProcessSnapshot(snapshot => ({
            ...snapshot,
            composedWith: ((snapshot as any).composedWith || []).concat("WagonLogger")
        }))

    const LoggableCar = types
        .compose(
            CompositionTracker,
            Car,
            Logger
        )
        .props({
            composedOf: types.array(types.string),
            composedWith: types.array(types.string)
        })
    const x = LoggableCar.create({})
    expect(x.composedOf).toContain("CompositionTracker")
    expect(x.composedOf).toContain("Car")
    expect(x.composedOf).toContain("CarLogger")
    expect(x.composedOf).toEqual(["CompositionTracker", "Car", "CarLogger"])
    expect(getSnapshot(x).composedWith).toContain("WagonTracker")
    expect(getSnapshot(x).composedWith).toContain("Wagon")
    expect(getSnapshot(x).composedWith).toContain("WagonLogger")
    expect(getSnapshot(x).composedWith).toEqual(["WagonTracker", "Wagon", "WagonLogger"])
})
test("it should extend types correctly", () => {
    const Car = types
        .model({
            wheels: 3
        })
        .actions(self => {
            function drive() {}
            return {
                drive
            }
        })
    const Logger = types
        .model("Logger")
        .props({
            logNode: "test"
        })
        .actions(self => {
            let connection: Promise<any>
            return {
                log(msg: string) {},
                afterCreate() {
                    connection = Promise.resolve(true)
                }
            }
        })
    const LoggableCar = types.compose(
        "LoggableCar",
        Car,
        Logger
    )
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })
    // x.test() // compile error
    x.drive()
    x.log("z")
})
test("self referring views", () => {
    const Car = types.model({ x: 3 }).views(self => {
        const views = {
            get tripple() {
                return self.x + views.double
            },
            get double() {
                return self.x * 2
            }
        }
        return views
    })
    expect(Car.create().tripple).toBe(9)
})

test("#922", () => {
    expect(() => {
        const Stateable = types.model("Statable", {
            state: types.optional(
                types.enumeration("state", ["initalized", "pending", "done", "error"]),
                "initalized"
            )
        })

        const Client = types.model("Client", {
            id: types.identifierNumber,
            name: types.string
        })

        const UserClientList = types.compose(
            "UserClientList",
            Stateable,
            types.model({
                items: types.array(Client),
                month: types.optional(types.Date, () => {
                    return new Date()
                })
            })
        )

        const NonExtendedUserClientList = types.model("NonExtendedUserClientList", {
            items: types.array(Client),
            month: types.optional(types.Date, () => {
                return new Date()
            }),
            state: types.optional(
                types.enumeration("state", ["initalized", "pending", "done", "error"]),
                "initalized"
            )
        })

        const User = types.model("User", {
            name: types.string,
            clients: types.optional(UserClientList, () => UserClientList.create({}))
        })

        const NonExtendedUser = types.model("User", {
            name: types.string,
            clients: types.optional(NonExtendedUserClientList, () =>
                NonExtendedUserClientList.create({})
            )
        })

        const you = NonExtendedUser.create({
            name: "you"
        })

        const me = User.create({
            name: "me"
        })
    }).not.toThrow()
})

test("#922 - 2", () => {
    expect(() => {
        types.optional(types.enumeration("state", ["init", "pending", "done", "error"]), "init")
    }).not.toThrow()
})

test("#932", () => {
    interface MyInterface {
        test: string
    }

    const MyModel = types.model("MyModel", {
        myField: types.array(types.frozen<MyInterface>())
    })

    const x = MyModel.create({ myField: [{ test: "stuff" }] })
    const a: string = x.myField[0].test
})

test("932 - 2", () => {
    type MyType = string
    const ModelA = types.model("ModelA", {
        myField: types.maybe(types.frozen<MyType>())
    })
    const x = ModelA.create({})
    const y = x.myField // y is string | undefined

    const ModelA2 = types.model("ModelA", {
        myField: types.frozen<MyType>()
    })
    const x2 = ModelA2.create({
        myField: "test" // mandatory
    })
    const y2: string = x2.myField // string only
})

test("#923", () => {
    const Foo = types.model("Foo", {
        name: types.optional(types.string, "")
    })

    const Bar = types.model("Bar", {
        foos: types.optional(types.array(Foo), [])
    })

    types.optional(types.map(Bar), {}) // Should have no compile error!
})

test("snapshot type of reference must be string | number", () => {
    const M = types.model({ id: types.identifier, a: "bar" })
    const R = types.reference(M)

    const S = types.model({ realM: M, refM: R })
    const s = S.create({
        realM: { id: "5" },
        refM: "5"
    })
    const sn: string | number = getSnapshot(s.refM)
})

test("#951", () => {
    const C = types.model({ a: 123 })

    // model as root
    const ModelWithC = types.model({ c: C })
    const modelInstance = ModelWithC.create({ c: C.create() })

    // getRoot
    const modelRoot1 = getRoot<typeof ModelWithC>(modelInstance.c)
    const modelCR1: Instance<typeof C> = modelRoot1.c
    const modelRoot2 = getRoot<Instance<typeof ModelWithC>>(modelInstance.c)
    const modelCR2: Instance<typeof C> = modelRoot2.c

    // getParent
    const modelParent1 = getParent<typeof ModelWithC>(modelInstance.c)
    const modelCP1: Instance<typeof ModelWithC> = modelParent1
    const modelParent2 = getParent<Instance<typeof ModelWithC>>(modelInstance.c)
    const modelCP2: Instance<typeof ModelWithC> = modelParent2

    // array as root
    const ArrayOfC = types.array(C)
    const arrayInstance = ArrayOfC.create([C.create()])

    // getRoot
    const arrayRoot1 = getRoot<typeof ArrayOfC>(arrayInstance[0])
    const arrayCR1: Instance<typeof C> = arrayRoot1[0]

    // getParent
    const arrayParent1 = getParent<typeof ArrayOfC>(arrayInstance[0])
    const arrayCP1: Instance<typeof ArrayOfC> = arrayParent1

    // map as root
    const MapOfC = types.map(C)
    const mapInstance = MapOfC.create({ a: C.create() })

    // getRoot
    const mapRoot1 = getRoot<typeof MapOfC>(mapInstance.get("a")!)
    const mapC1: Instance<typeof C> = mapRoot1.get("a")!

    // getParent
    const mapParent1 = getRoot<typeof MapOfC>(mapInstance.get("a")!)
    const mapCP1: Instance<typeof MapOfC> = mapParent1
})

test("cast and SnapshotOrInstance", () => {
    const NumberArray = types.array(types.number)
    const NumberMap = types.map(types.number)
    const A = types
        .model({ n: 123, n2: types.number, arr: NumberArray, map: NumberMap })
        .actions(self => ({
            // for primitives (although not needed)
            setN(nn: SnapshotOrInstance<typeof self.n>) {
                self.n = cast(nn)
            },
            setN2(nn: SnapshotOrInstance<typeof types.number>) {
                self.n = cast(nn)
            },
            setN3(nn: SnapshotOrInstance<number>) {
                self.n = cast(nn)
            },
            setN4(nn: number) {
                self.n = cast(nn)
            },
            setN5() {
                self.n = cast(5)
            },

            // for arrays
            setArr(nn: SnapshotOrInstance<typeof self.arr>) {
                self.arr = cast(nn)
            },
            setArr2(nn: SnapshotOrInstance<typeof NumberArray>) {
                self.arr = cast(nn)
            },
            setArr3(nn: SnapshotIn<typeof NumberArray>) {
                self.arr = cast(nn)
            },
            setArr31(nn: number[]) {
                self.arr = cast(nn)
            },
            setArr4() {
                // it works even without specifying the target type, magic!
                self.arr = cast([2, 3, 4])
                self.arr = cast(NumberArray.create([2, 3, 4]))
            },

            // for maps
            setMap(nn: SnapshotOrInstance<typeof self.map>) {
                self.map = cast(nn)
            },
            setMap2(nn: SnapshotOrInstance<typeof NumberMap>) {
                self.map = cast(nn)
            },
            setMap3(nn: SnapshotIn<typeof NumberMap>) {
                self.map = cast(nn)
            },
            setMap31(nn: { [k: string]: number }) {
                self.map = cast(nn)
            },
            setMap4() {
                // it works even without specifying the target type, magic!
                self.map = cast({ a: 2, b: 3 })
                self.map = cast(NumberMap.create({ a: 2, b: 3 }))
            }
        }))

    const C = types
        .model({ a: A, maybeA: types.maybe(A), maybeNullA: types.maybeNull(A) })
        .actions(self => ({
            // for submodels, using typeof self.var
            setA(na: SnapshotOrInstance<typeof self.a>) {
                self.a = cast(na)
                // we just want to check it compiles
                if (0 !== 0) {
                    self.maybeA = cast(na)
                    self.maybeNullA = cast(na)
                }
            },
            // for submodels, using the type directly
            setA2(na: SnapshotOrInstance<typeof A>) {
                self.a = cast(na)
                // we just want to check it compiles
                if (0 !== 0) {
                    self.maybeA = cast(na)
                    self.maybeNullA = cast(na)
                }
            },
            setA3(na: SnapshotIn<typeof A>) {
                self.a = cast(na)
                // we just want to check it compiles
                if (0 !== 0) {
                    self.maybeA = cast(na)
                    self.maybeNullA = cast(na)
                }
            },
            setA4(na: Instance<typeof self.a>) {
                self.a = cast(na)
                // we just want to check it compiles
                if (0 !== 0) {
                    self.maybeA = cast(na)
                    self.maybeNullA = cast(na)
                }
            },
            setA5() {
                // it works even without specifying the target type, magic!
                self.a = cast({ n2: 5 })
                self.a = cast(A.create({ n2: 5 }))
                // we just want to check it compiles
                if (0 !== 0) {
                    self.maybeA = cast({ n2: 5 })
                    self.maybeA = cast(A.create({ n2: 5 }))
                    self.maybeNullA = cast({ n2: 5 })
                    self.maybeNullA = cast(A.create({ n2: 5 }))
                }
            }
        }))

    const c = C.create({ a: { n2: 5 } })
    unprotect(c)
    // all below works
    c.setA({ n2: 5 })
    c.setA(A.create({ n2: 5 }))
    c.setA2({ n2: 5 })
    c.setA2(A.create({ n2: 5 }))
    c.setA3({ n2: 5 })
    // c.setA3(A.create({ n2: 5 })) // this one doesn't work (as expected, it wants the creation type)
    // c.setA4({n2: 5}) // this one doesn't work (as expected, it wants the instance type)
    c.setA4(A.create({ n2: 5 }))
    c.setA5()

    c.a.setN(1)
    c.a.setN2(1)
    c.a.setN3(1)
    c.a.setN4(1)
    c.a.setN5()

    c.a.setArr([])
    c.a.setArr(NumberArray.create([]))
    c.a.setArr2([])
    c.a.setArr2(NumberArray.create([]))
    c.a.setArr3([])
    c.a.setArr3(NumberArray.create([]))
    c.a.setArr4()

    c.a.setMap({ a: 2, b: 3 })
    c.a.setMap(NumberMap.create({ a: 2, b: 3 }))
    c.a.setMap2({ a: 2, b: 3 })
    c.a.setMap2(NumberMap.create({ a: 2, b: 3 }))
    c.a.setMap3({ a: 2, b: 3 })
    // c.a.setMap3(NumberMap.create({ a: 2, b: 3 })) // doesn't work (as expected, wants a plain object)
    c.a.setMap4()

    const arr = types.array(A).create()
    unprotect(arr)
    arr[0] = cast({ n2: 5 })

    const map = types.map(A).create()
    unprotect(map)
    map.set("a", cast({ n2: 5 })) // not really needed in this case, but whatever :)

    // this does not compile, yay!
    /*
    cast([])
    cast({ a: 5 })
    cast(NumberArray.create([]))
    cast(A.create({ n2: 5 }))
    cast({ a: 2, b: 5 })
    cast(NumberMap.create({ a: 2, b: 3 }))
    */
})

test("#994", () => {
    const Cinema = types.model("Cinema", {
        id: types.identifier,
        name: types.maybe(types.string)
    })

    const ref = types.reference(Cinema) // should compile ok on TS3
})

test("castToSnapshot", () => {
    const firstModel = types.model({ brew1: types.map(types.number) })
    const secondModel = types.model({ brew2: types.map(firstModel) }).actions(self => ({ do() {} }))
    const appMod = types.model({ aaa: secondModel })

    const storeSnapshot: SnapshotIn<typeof secondModel> = {
        brew2: { outside: { brew1: { inner: 222 } } }
    }
    const storeInstance = secondModel.create(storeSnapshot)
    const storeSnapshotOrInstance1: SnapshotOrInstance<typeof secondModel> = secondModel.create(
        storeSnapshot
    )
    const storeSnapshotOrInstance2: SnapshotOrInstance<typeof secondModel> = storeSnapshot

    appMod.create({ aaa: castToSnapshot(storeInstance) })
    appMod.create({ aaa: castToSnapshot(storeSnapshot) })
    appMod.create({ aaa: castToSnapshot(storeSnapshotOrInstance1) })
    appMod.create({ aaa: castToSnapshot(storeSnapshotOrInstance2) })
    // appMod.create({ aaa: castToSnapshot(5) }) // should not compile
})

test("create correctly chooses if the snapshot is needed or not - #920", () => {
    const X = types.model({
        test: types.string
    })
    const T = types.model({
        test: types.refinement(X, s => s.test.length > 5)
    })
    // T.create() // manual test: expects compilation error
    // T.create({}) // manual test: expects compilation error
    T.create({
        test: { test: "hellothere" }
    })

    const T2 = types.model({
        test: types.maybe(X)
    })
    T2.create() // ok
    T2.create({}) // ok

    const A = types.model({
        test: "bla"
    })
    A.create() // ok
    A.create({}) // ok

    const B = types.array(types.string)
    B.create() // ok
    B.create(["hi"]) // ok

    const C = types.map(types.string)
    C.create() // ok
    C.create({ hi: "hi" }) // ok

    const D = types.number
    // D.create() // manual test: expects compilation error
    D.create(5) // ok

    const E = types.optional(types.number, 5)
    E.create() // ok
    E.create(6) // ok

    const F = types.frozen<number>()
    // F.create() // manual test: compilation error
    F.create(6) // ok

    const FF = types.frozen<number | undefined>()
    FF.create() // ok
    FF.create(undefined) // ok

    const G = types.frozen(5)
    G.create() // ok
    G.create(6) // ok

    const H = types.frozen<any>(5)
    H.create() // ok
    H.create(6) // ok

    const I = types.optional(types.frozen<number>(), 6)
    I.create()
    I.create(7)
})

test("#1117", () => {
    const Failsafe = <C, S, T>(
        t: IType<C, S, T>,
        handleProblem: (
            value: C,
            validationError: ReturnType<IType<C, S, T>["validate"]>
        ) => void = (value, error) => {
            console.error("Skipping value: typecheck error on", value)
            console.error(error)
        }
    ) =>
        types.custom<C, T | null>({
            name: `Failsafe<${t.name}>`,
            fromSnapshot(snapshot: C) {
                try {
                    return t.create(snapshot) // this should compile
                } catch (e) {
                    handleProblem(snapshot, e)
                    return null
                }
            },
            toSnapshot(x) {
                if (isStateTreeNode(x)) return getSnapshot(x)
                return (x as any) as C
            },
            isTargetType(v) {
                if (isFrozenType(t)) {
                    return t.is(v)
                }
                return false
            },
            getValidationMessage() {
                return ""
            }
        })
})
