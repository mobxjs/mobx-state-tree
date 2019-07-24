import { types } from "../../src"

test("it should allow valid names", () => {
    let didThrow = false
    try {
        types.model("My_Model")
        types.model("_MyModel")
        types.model("MyModel@82d92470-d05e-4dab-92cc-25b45f7fa2e4")
        types.model("MyModel$$$")
    } catch (e) {
        didThrow = true
    }
    expect(didThrow).toBe(false)
})

describe("it should throw on invalid names", () => {
    test("begins with dash", () => {
        let didThrow = false
        try {
            types.model("-MyModel")
        } catch (e) {
            didThrow = true
        }
        expect(didThrow).toBe(true)
    })

    test("begins with at", () => {
        let didThrow = false
        try {
            types.model("@MyModel")
        } catch (e) {
            didThrow = true
        }
        expect(didThrow).toBe(true)
    })

    test("begins with dollar sign", () => {
        let didThrow = false
        try {
            types.model("$MyModel")
        } catch (e) {
            didThrow = true
        }
        expect(didThrow).toBe(true)
    })
})
