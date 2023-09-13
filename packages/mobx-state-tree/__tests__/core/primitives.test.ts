import { isFinite, isFloat, isInteger } from "../../src/utils"
import { types, applySnapshot, getSnapshot } from "../../src"

test("Date instance can be reused", () => {
    const Model = types.model({
        a: types.model({
            b: types.string
        }),
        c: types.Date // types.string -> types.Date
    })
    const Store = types
        .model({
            one: Model,
            index: types.array(Model)
        })
        .actions({
            set(one: typeof Model.Type) {
                this.one = one
            },
            push(model: typeof Model.Type) {
                this.index.push(model)
            }
        })
    const object = { a: { b: "string" }, c: new Date() } // string -> date (number)
    const instance = Store.create({
        one: object,
        index: [object]
    })
    instance.set(object)
    expect(() => instance.push(object)).not.toThrow()
    expect(instance.one.c).toBe(object.c)
    expect(instance.index[0].c).toBe(object.c)
})
test("Date can be rehydrated using unix timestamp", () => {
    const time = new Date()
    const newTime = 6813823163
    const Factory = types.model({
        date: types.optional(types.Date, () => time)
    })
    const store = Factory.create()
    expect(store.date.getTime()).toBe(time.getTime())
    applySnapshot(store, { date: newTime })
    expect(store.date.getTime()).toBe(newTime)
    expect(getSnapshot(store).date).toBe(newTime)
})

test("check isInteger", () => {
    expect(isInteger(5)).toBe(true)
    expect(isInteger(-5)).toBe(true)
    expect(isInteger(5.2)).toBe(false)
})

test("Default inference for integers is 'number'", () => {
    const A = types.model({
        x: 3
    })
    expect(
        A.is({
            x: 2.5
        })
    ).toBe(true)
})

test("check isFloat", () => {
    expect(isFloat(3.14)).toBe(true)
    expect(isFloat(-2.5)).toBe(true)
    expect(isFloat(Infinity)).toBe(true)
    expect(isFloat(10)).toBe(false)
    expect(isFloat(0)).toBe(false)
    expect(isFloat("3.14")).toBe(false)
    expect(isFloat(null)).toBe(false)
    expect(isFloat(undefined)).toBe(false)
    expect(isFloat(NaN)).toBe(false)
})

test("check isFinite", () => {
    expect(isFinite(3.14)).toBe(true)
    expect(isFinite(-2.5)).toBe(true)
    expect(isFinite(10)).toBe(true)
    expect(isFinite(0)).toBe(true)
    expect(isFinite("3.14")).toBe(false)
    expect(isFinite(null)).toBe(false)
    expect(isFinite(undefined)).toBe(false)
    expect(isFinite(NaN)).toBe(false)
    expect(isFinite(Infinity)).toBe(false)
})

if (process.env.NODE_ENV !== "production") {
    test("Passing non integer to types.integer", () => {
        const Size = types.model({
            width: types.integer,
            height: 20
        })

        expect(() => {
            const size = Size.create({ width: 10 })
        }).not.toThrow()

        expect(() => {
            const size = Size.create({ width: 10.5 })
        }).toThrow()
    })
}
