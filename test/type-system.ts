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

test("it should recognize a valid snapshot", (t) => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: 1, height: 2 }), true)
    t.deepEqual(Box.is({ width: 1, height: 2, depth: 3 }), true)
})

test("it should recognize an invalid snapshot", (t) => {
    const { Box } = createTestFactories()

    t.deepEqual(Box.is({ width: "1", height: "2" }), false)
})

test("it should check valid nodes as well", (t) => {
    const { Box } = createTestFactories()

    const doc = Box.create()

    t.deepEqual(Box.is(doc), true)
})

test("it should check invalid nodes as well", (t) => {
    const { Box } = createTestFactories()

    const doc = Box.create()

    t.deepEqual(types.model({ anotherAttr: types.number }).is(doc), false)
})

test("it should do typescript type inference correctly", (t) => {
    const A = types.model({
        x: types.number,
        y: types.maybe(types.string),
        get z(): string { return "hi" },
        set z(v: string) { }
    }, {
        method() {
            const x: string = this.z + this.x + this.y
            this.anotherMethod(x)
        },
        anotherMethod(x: string) {

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
    unprotect(b.sub)

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
    t.throws(() => a.name = 3 as any, `[mobx-state-tree] Error while converting 3 to string:
snapshot 3 is not assignable to type: string.`)
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
    t.is(F.create({ x: undefined}).x, null)
    t.is(F.create({ x: ""}).x, "")
    t.is(F.create({ x: "3"}).x, "3")
})

test("it is possible to refer to a type", t => {
    const Todo = types.model({
        title: types.string
    }, {
        setTitle(v: string) {

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
    const Todo = types.model({
        title: types.string
    }, {
        setTitle(v: string) {

        }
    })

    t.throws(() => Todo.Type)
})

test(".SnapshotType should not be callable", t => {
    const Todo = types.model({
        title: types.string
    }, {
        setTitle(v: string) {

        }
    })

    t.throws(() => Todo.SnapshotType)
})

test("types instances with compatible snapshots should not be interchangeable", t => {
    const A = types.model("A", {}, {
        doA() {}
    })
    const B = types.model("B", {}, {
        doB() {}
    })
    const C = types.model("C", {
        x: types.maybe(A)
    })

    t.is(A.is({}), true)
    t.is(A.is(B.create()), false) // if thies yielded true, then `B.create().doA()` should work!
    t.is(A.is(getSnapshot(B.create())), true)

    const c = C.create()
    unprotect(c)

    t.notThrows(() => { c.x = null })
    t.notThrows(() => { c.x = {} as any })
    t.notThrows(() => { c.x = A.create() })
    // TODO: in this test, use constant identifiers, and try this again when maybe supports identifiers. Should not reconcile even though identifier is the same! (throw or new instance, what is the correct behavior?)
    // t.throws(
    //     () => { c.x = B.create() as any },
    //     "[mobx-state-tree] Value of type B: '{}' is not assignable to type: A | null, expected an instance of A | null or a snapshot like '({  } | null)' instead. (Note that a snapshot of the provided value is compatible with the targeted type)"
    // )
})

test("it handles complex types correctly", t => {
    const Todo = types.model({
        title: types.string
    }, {
        setTitle(v: string) {

        }
    })

    const Store = types.model({
        todos: types.map(Todo),
        get amount() {
            // double check, not available design time:
            /// this.setAmount()
            return this.todos.size
        },
        getAmount(): number {
            return this.todos.size + this.amount
        }
    }, {
        setAmount() {
            const x: number = this.todos.size + this.amount + this.getAmount
        }
    })

    t.is(true, true) // supress no asserts warning
})
