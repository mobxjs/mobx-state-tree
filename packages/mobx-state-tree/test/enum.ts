import { types, unprotect } from "../src"
import { test } from "ava"

test("should support enums", t => {
    const TrafficLight = types.model({
        color: types.enumeration("Color", ["Red", "Orange", "Green"])
    })

    t.is(TrafficLight.is({ color: "Green" }), true)
    t.is(TrafficLight.is({ color: "Blue" }), false)
    t.is(TrafficLight.is({ color: undefined }), false)

    const l = TrafficLight.create({
        color: "Orange"
    })
    unprotect(l)
    l.color = "Red"
    t.is(TrafficLight.describe(), '{ color: ("Orange" | "Green" | "Red") }')

    // Note, any cast needed, compiler should correctly error otherwise
    t.throws(() => (l.color = "Blue" as any), /Error while converting `"Blue"` to `Color`/)
})

test("should support anonymous enums", t => {
    const TrafficLight = types.model({
        color: types.enumeration(["Red", "Orange", "Green"])
    })

    const l = TrafficLight.create({
        color: "Orange"
    })
    unprotect(l)
    l.color = "Red"
    t.is(TrafficLight.describe(), '{ color: ("Orange" | "Green" | "Red") }')

    // Note, any cast needed, compiler should correctly error otherwise
    t.throws(
        () => (l.color = "Blue" as any),
        /Error while converting `"Blue"` to `"Orange" | "Green" | "Red"`/
    )
})
