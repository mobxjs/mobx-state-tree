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
    t.deepEqual(
        types
            .model({
                anotherAttr: types.number
            })
            .is(doc),
        false
    )
})

test("it should do typescript type inference correctly", t => {
    const A = types
        .model({
            x: types.number,
            y: types.maybe(types.string)
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
        // MANUAL TEST not ok: z: 4
        x: 3
    })
    // sub fields have proper type
    b.sub.x = 4
    const d: string = b.sub.y!
    a.y = null
    const zz: string = a.z
    // Manual test not assignable:
    // a.z = "test"
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
        `[mobx-state-tree] Error while converting \`3\` to \`string\`:\nvalue \`3\` is not assignable to type: \`string\` (Value is not a string).`
    )
})

test("cannot create factories with null values", t => {
    t.throws(() =>
        types.model({
            x: null
        })
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
    t.throws(() => Todo.Type)
})

test(".SnapshotType should not be callable", t => {
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
    t.throws(() => Todo.SnapshotType)
})

test("types instances with compatible snapshots should not be interchangeable", t => {
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
    })
})

test("it handles complex types correctly", t => {
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
    t.is(true, true) // supress no asserts warning
})

test("it should provide detailed reasons why the value is not appicable", t => {
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
    t.throws(
        () =>
            Store.create({
                todos: { "1": { title: true, setTitle: "hello" } },
                amount: 1,
                getAmount: "hello"
            } as any),
        `[mobx-state-tree] Error while converting \`{"todos":{"1":{"title":true,"setTitle":"hello"}},"amount":1,"getAmount":"hello"}\` to \`AnonymousModel\`:
at path "/todos/1/title" value \`true\` is not assignable to type: \`string\` (Value is not a string).`

        // MWE: TODO: Ideally (like in MST =< 0.9):
        // at path "/todos/1/setTitle" value \`"hello"\` is not assignable  (Action properties should not be provided in the snapshot).
        // at path "/amount" value \`1\` is not assignable  (Computed properties should not be provided in the snapshot).
        // at path "/getAmount" value \`"hello"\` is not assignable  (View properties should not be provided in the snapshot).`
    )
})

test("it should type compose correctly", t => {
    const Car = types
        .model({
            wheels: 3
        })
        .actions(self => {
            var connection = (null as any) as Promise<any>
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
    const LoggableCar = types.compose(Car, Logger)
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })
    //x.test() // compile error
    x.drive()
    x.log("z")
    //x.connection.then(() => {}) // compile error
    t.pass()
})

test("it should extend types correctly", t => {
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
    const LoggableCar = types.compose("LoggableCar", Car, Logger)
    const x = LoggableCar.create({ wheels: 3, logNode: "test" /* compile error: x: 7  */ })
    // x.test() // compile error
    x.drive()
    x.log("z")
    t.pass()
})
