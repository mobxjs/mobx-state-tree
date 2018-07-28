import { types, unprotect } from "../../src"
test("should support enums", () => {
    const TrafficLight = types.model({
        color: types.enumeration("Color", ["Red", "Orange", "Green"])
    })
    expect(TrafficLight.is({ color: "Green" })).toBe(true)
    expect(TrafficLight.is({ color: "Blue" })).toBe(false)
    expect(TrafficLight.is({ color: undefined })).toBe(false)
    const l = TrafficLight.create({
        color: "Orange"
    })
    unprotect(l)
    l.color = "Red"
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    // Note, any cast needed, compiler should correctly error otherwise
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrowError(
            /Error while converting `"Blue"` to `Color`/
        )
    }
})
test("should support anonymous enums", () => {
    const TrafficLight = types.model({
        color: types.enumeration(["Red", "Orange", "Green"])
    })
    const l = TrafficLight.create({
        color: "Orange"
    })
    unprotect(l)
    l.color = "Red"
    expect(TrafficLight.describe()).toBe('{ color: ("Red" | "Orange" | "Green") }')
    // Note, any cast needed, compiler should correctly error otherwise
    if (process.env.NODE_ENV !== "production") {
        expect(() => (l.color = "Blue" as any)).toThrowError(
            /Error while converting `"Blue"` to `"Red" | "Orange" | "Green"`/
        )
    }
})
test("should support optional enums", () => {
    const TrafficLight = types.optional(types.enumeration(["Red", "Orange", "Green"]), "Orange")
    const l = TrafficLight.create()
    expect(l).toBe("Orange")
})
test("should support optional enums inside a model", () => {
    const TrafficLight = types.model({
        color: types.optional(types.enumeration(["Red", "Orange", "Green"]), "Orange")
    })
    const l = TrafficLight.create({})
    expect(l.color).toBe("Orange")
})
