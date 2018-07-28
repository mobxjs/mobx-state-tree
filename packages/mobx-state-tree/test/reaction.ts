import { isObservableArray } from "mobx"
import { destroy } from "mobx-state-tree"
import { types } from "../src"
import { isNode } from "../src/internal"
import { isObject } from "util"

const celsiusToFahrenheit = (val: number) => val * (9 / 5) + 32
const celsiusToKelvin = (val: number) => fahrenheitToKelvin(celsiusToFahrenheit(val)) // for consistency
const fahrenheitToKelvin = (val: number) => (val + 459.67) * (5 / 9)
const celsiusToRankine = (val: number) => (val + 273.15) * (9 / 5)

let nextId = 0
const getNextId = () => `${nextId++}`

const Temperature = types
    .model({
        id: types.identifier,
        temperatureCelsius: types.optional(types.number, 0)
    })
    .views(self => ({
        get temperatureFahrenheit() {
            return celsiusToFahrenheit(self.temperatureCelsius)
        },

        get temperatureKelvin() {
            return fahrenheitToKelvin(self.temperatureFahrenheit)
        }
    }))
    .actions(self => ({
        setTemperatureCelsius(value: number) {
            self.temperatureCelsius = value
        }
    }))

test("basic reactions", () => {
    expect.assertions(6)

    const temperature = Temperature.reactions(self => ({
        temperatureCelsius(val: number, oldVal: number) {
            expect(val).toBe(25)
            expect(oldVal).toBe(20)
        },

        temperatureFahrenheit(val: number, oldVal: number) {
            expect(val).toBe(celsiusToFahrenheit(25))
            expect(oldVal).toBe(celsiusToFahrenheit(20))
        },

        temperatureKelvin(val: number, oldVal: number) {
            expect(val).toBe(celsiusToKelvin(25))
            expect(oldVal).toBe(celsiusToKelvin(20))
        }
    })).create({
        id: getNextId(),
        temperatureCelsius: 20
    })

    temperature.setTemperatureCelsius(25)
})

if (process.env.NODE_ENV !== "production") {
    test("setting reaction on non observable/computed prop", () => {
        expect(() => {
            const temperature = Temperature.reactions(self => ({
                temperatureRankine(val: number, oldVal: number) {
                    expect(val).toBe(celsiusToRankine(celsiusToRankine(25)))
                    expect(oldVal).toBe(celsiusToRankine(celsiusToRankine(20)))
                }
            })).create({ id: getNextId(), temperatureCelsius: 20 })

            temperature.setTemperatureCelsius(25)
        }).toThrowError(
            `[mobx-state-tree] temperatureRankine is neither observable nor computed value`
        )
    })
}

describe("test reaction on observable array", () => {
    const Temperatures = types
        .model({
            items: types.optional(types.array(Temperature), [])
        })
        .actions(self => ({
            add(item) {
                self.items.push(item)
            },

            update(idx, item) {
                self.items[idx] = item
            },

            remove(item) {
                destroy(item)
            }
        }))

    test("item is added", () => {
        expect.assertions(2)

        const temperatures = Temperatures.reactions(self => ({
            items(val, oldVal) {
                expect(val).toEqual(oldVal)
                expect(isObservableArray(val)).toBe(true)
            }
        })).create()

        temperatures.add(Temperature.create({ id: getNextId(), temperatureCelsius: 25 }))
    })

    test("item is removed", () => {
        expect.assertions(2)

        const temperature = Temperature.create({
            id: getNextId(),
            temperatureCelsius: 20
        })
        const temperatures = Temperatures.reactions(self => ({
            items(val, oldVal) {
                expect(val).toEqual(oldVal)
                expect(isObservableArray(val)).toBe(true)
            }
        })).create({ items: [temperature] })

        temperatures.remove(temperature)
    })

    test("item is updated", () => {
        expect.assertions(2)

        const temperatures = Temperatures.reactions(self => ({
            items(val, oldVal) {
                expect(val).toEqual({
                    id: "2",
                    temperatureCelsius: 25
                })
                expect(oldVal).toEqual({
                    id: "1",
                    temperatureCelsius: 20
                })
            }
        })).create({
            items: [Temperature.create({ id: "1", temperatureCelsius: 20 })]
        })

        temperatures.update(
            0,
            Temperature.create({
                id: "2",
                temperatureCelsius: 25
            })
        )
    })

    test("reaction with single argument", () => {
        expect.assertions(5)

        const temperatures = Temperatures.reactions(self => ({
            items(change) {
                expect(change.type).toBe("update")
                expect(isObservableArray(change.object)).toBe(true)
                expect(isNode(change.newValue)).toBe(true)
                expect(isNode(change.oldValue)).toBe(true)
                expect(change.newValue.snapshot).toEqual({
                    id: "2",
                    temperatureCelsius: 25
                })
            }
        })).create({
            items: [Temperature.create({ id: "1", temperatureCelsius: 20 })]
        })

        temperatures.update(
            0,
            Temperature.create({
                id: "2",
                temperatureCelsius: 25
            })
        )
    })
})

describe("test reaction on observable map", () => {
    const TemperaturesMap = types
        .model({
            items: types.optional(types.map(Temperature), {})
        })
        .actions(self => ({
            add(item) {
                self.items.put(item)
            },

            remove(item) {
                self.items.delete(item.id)
            }
        }))

    test("item is added", () => {
        expect.assertions(2)

        const temperatures = TemperaturesMap.reactions(self => ({
            items(val, oldVal) {
                expect(val).toEqual({ id: "1", temperatureCelsius: 20 })
                expect(oldVal).toBeUndefined()
            }
        })).create()

        const temperature = Temperature.create({
            id: "1",
            temperatureCelsius: 20
        })
        temperatures.add(temperature)
    })

    test("item is removed", () => {
        expect.assertions(2)

        const temperature = Temperature.create({
            id: "1",
            temperatureCelsius: 20
        })

        const temperatures = TemperaturesMap.reactions(self => ({
            items(val, oldVal) {
                expect(val).toBeUndefined()
                expect(oldVal).toEqual({ id: "1", temperatureCelsius: 20 })
            }
        })).create({ items: { [temperature.id]: temperature } })

        temperatures.remove(temperature)
    })
})
