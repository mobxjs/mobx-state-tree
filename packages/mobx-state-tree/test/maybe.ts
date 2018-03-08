import { types } from "../src"
test("It should warn when using types.maybe(types.frozen)", () => {
    if (process.env.NODE_ENV === "development") {
        expect(() => types.maybe(types.frozen)).toThrowError(
            `[mobx-state-tree] Unable to declare \`types.maybe(types.frozen)\`. Frozen already accepts \`null\`. Consider using \`types.optional(types.frozen, null)\` instead.`
        )
    } else {
        expect(true).toBe(true)
    }
})
