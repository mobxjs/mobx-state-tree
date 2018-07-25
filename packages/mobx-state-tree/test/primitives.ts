import { types, applySnapshot, getSnapshot } from "../src"
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
        .actions(self => {
            function set(one: typeof Model.Type) {
                self.one = one
            }
            function push(model: typeof Model.Type) {
                self.index.push(model)
            }
            return {
                set,
                push
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
