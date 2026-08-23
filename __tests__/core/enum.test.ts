import { getSnapshot, types, unprotect } from "../../src"
import { expect, test } from "bun:test"

enum ColorEnum {
    Red = "Red",
    Orange = "Orange",
    Green = "Green"
}
const colorEnumValues = Object.values(ColorEnum) as ColorEnum[]

test("should support enums", () => {
    const TrafficLight = types.model({ color: types.enumeration("Color", colorEnumValues) })
    expect(TrafficLight.is({ color: ColorEnum.Green })).toBe(true)
    expect(TrafficLight.is({ color: "Blue" })).toBe(false)
    expect(TrafficLight.is({ color: undefined })).toBe(false)
    const l = TrafficLight.create({ color: ColorEnum.Orange })
    unprotect(l)
    l.color = ColorEnum.Red
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrow(
            /Error while converting `"Blue"` to `Color`/
        )
    }
})
test("should support anonymous enums", () => {
    const TrafficLight = types.model({ color: types.enumeration(colorEnumValues) })
    const l = TrafficLight.create({ color: ColorEnum.Orange })
    unprotect(l)
    l.color = ColorEnum.Red
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrow(
            /Error while converting `"Blue"` to `"Red" | "Orange" | "Green"`/
        )
    }
})
test("should support optional enums", () => {
    const TrafficLight = types.optional(types.enumeration(colorEnumValues), ColorEnum.Orange)
    const l = TrafficLight.create()
    expect(l).toBe(ColorEnum.Orange)
})
test("should support optional enums inside a model", () => {
    const TrafficLight = types.model({
        color: types.optional(types.enumeration(colorEnumValues), ColorEnum.Orange)
    })
    const l = TrafficLight.create({})
    expect(l.color).toBe(ColorEnum.Orange)
})
test("should support plain string[] arrays", () => {
    const colorOptions: string[] = ["Red", "Orange", "Green"]
    const TrafficLight = types.model({ color: types.enumeration(colorOptions) })
    const l = TrafficLight.create({ color: "Orange" })
    unprotect(l)
    l.color = "Red"
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrow(
            /Error while converting `"Blue"` to `"Red" | "Orange" | "Green"`/
        )
    }
})
test("should support readonly enums as const", () => {
    const colorOptions = ["Red", "Orange", "Green"] as const
    const TrafficLight = types.model({ color: types.enumeration(colorOptions) })
    const l = TrafficLight.create({ color: "Orange" })
    unprotect(l)
    l.color = "Red"
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrow(
            /Error while converting `"Blue"` to `"Red" | "Orange" | "Green"`/
        )
    }
})
test("should support numeric enums", () => {
    const SpeedLimit = types.model({ limit: types.enumeration("SpeedLimit", [15, 30]) })
    expect(SpeedLimit.is({ limit: 15 })).toBe(true)
    expect(SpeedLimit.is({ limit: "15" as any })).toBe(false)
    expect(SpeedLimit.is({ limit: 45 as any })).toBe(false)
    const l = SpeedLimit.create({ limit: 30 })
    unprotect(l)
    l.limit = 15
    expect(SpeedLimit.describe()).toBe("{ limit: (15 | 30) }")
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.limit = 45 as any)).toThrow(/Error while converting `45` to `SpeedLimit`/)
    }
})
test("should support zero as a numeric enum option", () => {
    const Zero = types.model({ n: types.enumeration("Zero", [0, 1]) })
    expect(Zero.is({ n: 0 })).toBe(true)
    expect(Zero.is({ n: 1 })).toBe(true)
    expect(Zero.is({ n: "0" as any })).toBe(false)
    expect(Zero.is({ n: 2 as any })).toBe(false)
    expect(Zero.describe()).toBe("{ n: (0 | 1) }")

    const z = Zero.create({ n: 1 })
    unprotect(z)
    z.n = 0
    expect(getSnapshot(z)).toEqual({ n: 0 })

    if (process.env.NODE_ENV !== "production") {
        expect(() => (z.n = 2 as any)).toThrow(/Error while converting `2` to `Zero`/)
    }
})
test("should support numeric enums inside an optional array", () => {
    const OrdersRequest = types.model({
        paymentPeriod: types.optional(types.array(types.enumeration("PaymentPeriod", [15, 30])), [
            15
        ])
    })
    const r = OrdersRequest.create({})
    expect(r.paymentPeriod.slice()).toEqual([15])
    expect(getSnapshot(r)).toEqual({ paymentPeriod: [15] })
})
test("should support mixed string and number enums", () => {
    const options = ["a", 1] as const
    const Mixed = types.model({ value: types.enumeration(options) })
    expect(Mixed.is({ value: "a" })).toBe(true)
    expect(Mixed.is({ value: 1 })).toBe(true)
    expect(Mixed.is({ value: "1" as any })).toBe(false)
    expect(Mixed.describe()).toBe('{ value: ("a" | 1) }')
})
