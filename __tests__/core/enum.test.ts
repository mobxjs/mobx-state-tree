import { types, unprotect } from "../../src"

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
    expect(() => (l.color = "Blue" as any)).toThrowError(
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
    expect(() => (l.color = "Blue" as any)).toThrowError(
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
    expect(() => (l.color = "Blue" as any)).toThrowError(
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
    expect(() => (l.color = "Blue" as any)).toThrowError(
      /Error while converting `"Blue"` to `"Red" | "Orange" | "Green"`/
    )
  }
})
