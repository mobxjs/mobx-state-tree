import { types } from "../"
import { test } from "ava"

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

test("it should cast different compatible factories", (t) => {
    const { Box, Square } = createTestFactories()

    const doc = Square.create()

    t.deepEqual(Box.is(doc), true)
})

test("it should do typescript type inference correctly", (t) => {
    const A = types.model({
        x: types.number,
        y: types.maybe(types.string),
        method() { },
        get z(): string { return "hi" },
        set z(v: string) { }
    })

    // factory is invokable
    const a = A.create({ x: 2, y: "7" })

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
        name: types.withDefault(types.string, "boo")
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
    t.is(a.name, "boo")
    t.throws(() => a.name = 3 as any, `[mobx-state-tree] Value '3' is not assignable to type: string. Expected string instead.`)
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
        title: types.string,
        setTitle(v: string) {

        }
    })

    function x(): typeof Todo.Type {
        return Todo.create({ title: "test" }) as any // as any to make sure the type is not inferred accidentally
    }

    const z = x()
    z.setTitle("bla")
    z.title = "bla"
    // z.title = 3 // Test manual: should give compile error
})

test(".Type should not be callable", t => {
    const Todo = types.model({
        title: types.string,
        setTitle(v: string) {

        }
    })

    t.throws(() => Todo.Type)
})


test(".SnapshotType should not be callable", t => {
    const Todo = types.model({
        title: types.string,
        setTitle(v: string) {

        }
    })

    t.throws(() => Todo.SnapshotType)
})
