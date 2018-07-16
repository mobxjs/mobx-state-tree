import { types, getSnapshot, unprotect, IType } from "../src"
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
    const a = Item.create({ id: 3, name: "", description: "bla" } as any) as any
    expect(a.description).toBe(undefined)
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
        return Todo.create({ title: "test" }) // as any to make sure the type is not inferred accidentally
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
        ;(c as any).x = {}
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
            function log(msg) {}
            return {
                log
            }
        })
    const LoggableCar = types.compose(
        Car,
        Logger
    )
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })
    //x.test() // compile error
    x.drive()
    x.log("z")
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

test("Alternative typeof syntax #885", () => {
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

    type TypeOf<T extends IType<any, any, any>> = T extends IType<any, any, infer T2> ? T2 : never
    type SnapshotTypeOf<T extends IType<any, any, any>> = T extends IType<any, infer S, any>
        ? S
        : never
    type CreationTypeOf<T extends IType<any, any, any>> = T extends IType<infer C, any, any>
        ? C
        : never

    type CarT = TypeOf<typeof Car>
    type Car2 = typeof Car.Type
    type CarSnapshot = SnapshotTypeOf<typeof Car>
})
