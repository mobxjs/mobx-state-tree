import { types, unprotect } from "../src"
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
    expect(TrafficLight.describe()).toBe('{ color: ("Orange" | "Green" | "Red") }')
    // Note, any cast needed, compiler should correctly error otherwise
    if (process.env.NODE_ENV === "development") {
        expect(() => (l.color = "Blue")).toThrowError(/Error while converting `"Blue"` to `Color`/)
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
    expect(TrafficLight.describe()).toBe('{ color: ("Orange" | "Green" | "Red") }')
    // Note, any cast needed, compiler should correctly error otherwise
    if (process.env.NODE_ENV === "development") {
        expect(() => (l.color = "Blue")).toThrowError(
            /Error while converting `"Blue"` to `"Orange" | "Green" | "Red"`/
        )
    }
})
