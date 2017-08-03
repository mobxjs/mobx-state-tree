import { test } from "ava"
import { types, getSnapshot, unprotect } from "../src"

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

test("it should recognize a valid snapshot", t => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: 1, height: 2 }), true)
    t.deepEqual(Box.is({ width: 1, height: 2, depth: 3 }), true)
})

test("it should recognize an invalid snapshot", t => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: "1", height: "2" }), false)
})

test("it should check valid nodes as well", t => {
    const { Box } = createTestFactories()

    const doc = Box.create()

    t.deepEqual(Box.is(doc), true)
})

test("it should check invalid nodes as well", t => {
    const { Box } = createTestFactories()

    const doc = Box.create()

    t.deepEqual(types.model({ anotherAttr: types.number }).is(doc), false)
})

test("it should do typescript type inference correctly", t => {
    const A = types.model(
        {
            x: types.number,
            y: types.maybe(types.string),
            get z(): string {
                return "hi"
            },
            set z(v: string) {}
        },
        {
            method() {
                const x: string = this.z + this.x + this.y
                this.anotherMethod(x)
            },
            anotherMethod(x: string) {}
        }
    )

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
        // MANUAL TEST not ok: z: 4
        x: 3
    })

    // sub fields have proper type
    b.sub.x = 4
    const d: string = b.sub.y!

    a.y = null

    const zz: string = a.z
    a.z = "test"

    b.sub.method()

    t.is(true, true) // supress no asserts warning
})

test("#66 - it should accept superfluous fields", t => {
    const Item = types.model({
        id: types.number,
        name: types.string
    })

    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), false)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)

    const a = Item.create({ id: 3, name: "", description: "bla" } as any)
    t.is((a as any).description, undefined)
})

test("#66 - it should not require defaulted fields", t => {
    const Item = types.model({
        id: types.number,
        name: types.optional(types.string, "boo")
    })

    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), true)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)

    const a = Item.create({ id: 3, description: "bla" } as any)
    t.is((a as any).description, undefined)
    t.is(a.name, "boo")
})

test("#66 - it should be possible to omit defaulted fields", t => {
    const Item = types.model({
        id: types.number,
        name: "boo"
    })

    t.is(Item.is({}), false)
    t.is(Item.is({ id: 3 }), true)
    t.is(Item.is({ id: 3, name: "" }), true)
    t.is(Item.is({ id: 3, name: "", description: "" }), true)

    const a = Item.create({ id: 3, description: "bla" } as any)
    t.is((a as any).description, undefined)
    t.is(a.name, "boo")
})

test("#66 - it should pick the correct type of defaulted fields", t => {
    const Item = types.model({
        id: types.number,
        name: "boo"
    })

    const a = Item.create({ id: 3 })
    unprotect(a)

    t.is(a.name, "boo")
    t.throws(
        () => (a.name = 3 as any),
        err =>
            err.message.includes("[mobx-state-tree]") &&
            err.message.includes("3") &&
            err.message.includes("string") &&
            err.message.includes("not assignable")
    )
})

test("cannot create factories with null values", t => {
    t.throws(
        () => types.model({ x: null }),
        /The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe\(someType\)`?/
    )
})

test("can create factories with maybe primitives", t => {
    const F = types.model({
        x: types.maybe(types.string)
    })

    t.is(F.is(undefined as any), false)
    t.is(F.is({}), true)
    t.is(F.is({ x: null }), true)
    t.is(F.is({ x: "test" }), true)
    t.is(F.is({ x: 3 }), false)

    t.is(F.create().x, null)
    t.is(F.create({ x: undefined }).x, null)
    t.is(F.create({ x: "" }).x, "")
    t.is(F.create({ x: "3" }).x, "3")
})

test("it is possible to refer to a type", t => {
    const Todo = types.model(
        {
            title: types.string
        },
        {
            setTitle(v: string) {}
        }
    )

    function x(): typeof Todo.Type {
        return Todo.create({ title: "test" }) as any // as any to make sure the type is not inferred accidentally
    }

    const z = x()
    unprotect(z)

    z.setTitle("bla")
    z.title = "bla"
    // z.title = 3 // Test manual: should give compile error

    t.is(true, true) // supress no asserts warning
})

test(".Type should not be callable", t => {
    const Todo = types.model(
        {
            title: types.string
        },
        {
            setTitle(v: string) {}
        }
    )

    t.throws(() => Todo.Type)
})

test(".SnapshotType should not be callable", t => {
    const Todo = types.model(
        {
            title: types.string
        },
        {
            setTitle(v: string) {}
        }
    )

    t.throws(() => Todo.SnapshotType)
})

test("types instances with compatible snapshots should not be interchangeable", t => {
    const A = types.model(
        "A",
        {},
        {
            doA() {}
        }
    )
    const B = types.model(
        "B",
        {},
        {
            doB() {}
        }
    )
    const C = types.model("C", {
        x: types.maybe(A)
    })

    t.is(A.is({}), true)
    t.is(A.is(B.create()), false) // if thies yielded true, then `B.create().doA()` should work!
    t.is(A.is(getSnapshot(B.create())), true)

    const c = C.create()
    unprotect(c)

    t.notThrows(() => {
        c.x = null
    })
    t.notThrows(() => {
        c.x = {} as any
    })
    t.notThrows(() => {
        c.x = A.create()
    })

    t.throws(() => {
        c.x = B.create() as any
    }, /value of type B: <B@<root>> is not assignable to type: `A | null`/)
})

test("it handles complex types correctly", t => {
    const Todo = types.model(
        {
            title: types.string
        },
        {
            setTitle(v: string) {}
        }
    )

    const Store = types.model(
        {
            todos: types.map(Todo),
            get amount() {
                // double check, not available design time:
                /// this.setAmount()
                return this.todos.size
            },
            getAmount(): number {
                return this.todos.size + this.amount
            }
        },
        {
            setAmount() {
                const x: number = this.todos.size + this.amount + this.getAmount
            }
        }
    )

    t.is(true, true) // supress no asserts warning
})

test("it should provide detailed reasons why the value is not appicable", t => {
    const Todo = types.model(
        {
            title: types.string
        },
        {
            setTitle(v: string) {}
        }
    )

    const Store = types.model(
        "StoreTest",
        {
            todos: types.map(Todo),
            get amount() {
                // double check, not available design time:
                /// this.setAmount()
                return this.todos.size
            },
            getAmount(): number {
                return this.todos.size + this.amount
            }
        },
        {
            setAmount() {
                const x: number = this.todos.size + this.amount + this.getAmount
            }
        }
    )

    t.throws(
        () =>
            Store.create({
                todos: {
                    "1": {
                        title: true,
                        setTitle: "hello"
                    }
                },
                amount: 1,
                getAmount: "hello"
            }),
        err =>
            err.message.includes("[mobx-state-tree]") &&
            err.message.includes("StoreTest") &&
            err.message.includes("/todos/1/title") &&
            err.message.includes("/todos/1/setTitle") &&
            err.message.includes("/amount") &&
            err.message.includes("/getAmount") &&
            err.message.toLowerCase().includes("action properties") &&
            err.message.toLowerCase().includes("computed properties") &&
            err.message.toLowerCase().includes("view properties")
    )
})

test("it should type compose correctly", t => {
    const Car = types.model(
        {
            wheels: 3
        },
        { connection: (null as any) as Promise<any> },
        {
            drive() {},
            afterCreate() {
                this.connection = Promise.resolve(true)
            }
        }
    )

    const Logger = types.model(
        {
            logNode: "test"
        },
        {
            log(msg: string) {}
        }
    )

    const LoggableCar = types.compose(Car, Logger)
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })

    //x.test() // compile error
    x.drive()
    x.log("z")
    x.connection.then(() => {})

    t.pass()
})

test("it should extend types correctly", t => {
    const Car = types.model(
        {
            wheels: 3
        },
        {
            drive() {}
        }
    )

    const LoggableCar = types.compose(
        "LoggableCar",
        Car,
        {
            logNode: "test"
        },
        { connection: (null as any) as Promise<any> },
        {
            log(msg: string) {},
            afterCreate() {
                this.connection = Promise.resolve(true)
            }
        }
    )
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })

    // x.test() // compile error
    x.drive()
    x.log("z")
    x.connection.then(() => {})

    t.pass()
})
