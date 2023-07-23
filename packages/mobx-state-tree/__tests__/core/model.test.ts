import { applySnapshot, getSnapshot, types } from "../../src"

test("it should call preProcessSnapshot with the correct argument", () => {
    const onSnapshot = jest.fn((snapshot: any) => {
        return {
            val: snapshot.val + 1
        }
    })

    const Model = types
        .model({
            val: types.number
        })
        .preProcessSnapshot(onSnapshot)

    const model = Model.create({ val: 0 })
    applySnapshot(model, { val: 1 })
    expect(onSnapshot).lastCalledWith({ val: 1 })
})
describe("Model name", () => {
    test("Providing a string as the first argument should set it as the model's name.", () => {
        const Model = types.model("Name", {})

        expect(Model.name).toBe("Name")
    })
    test("Providing an empty string as the first argument should set it as the model's name.", () => {
        const Model = types.model("", {})

        expect(Model.name).toBe("")
    })
    describe("Providing a non-string argument as the first argument should set the model's name as 'AnonymousModel'.", () => {
        const testCases = [
            {},
            null,
            undefined,
            1,
            true,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
            NaN,
            Infinity
        ]

        testCases.forEach((testCase) => {
            test(`Providing ${JSON.stringify(
                testCase
            )} as the first argument should set the model's name as 'AnonymousModel'.`, () => {
                const Model = types.model(testCase as any)

                expect(Model.name).toBe("AnonymousModel")
            })
        })
    })
})
describe("Model properties", () => {
    test("Providing a string as the first argument and an object as the second argument should use the object's properties in the model.", () => {
        const Model = types.model("name", {
            prop1: "prop1",
            prop2: 2
        })

        expect(Model.properties).toHaveProperty("prop1")
        expect(Model.properties).toHaveProperty("prop2")
    })
    test("Providing an object as the first argument should parse and use its properties.", () => {
        const Model = types.model({
            prop1: "prop1",
            prop2: 2
        })

        expect(Model.properties).toHaveProperty("prop1")
        expect(Model.properties).toHaveProperty("prop2")
    })
    test("Providing a string as the first argument and a falsy value as the second argument should result in an empty set of properties.", () => {
        const Model = types.model("name", null as any)

        expect(Model.properties).toEqual({})
    })
})
describe("Model identifier", () => {
    test("If no identifier attribute is provided, the identifierAttribute should be undefined.", () => {
        const Model = types.model("name", {})

        expect(Model.identifierAttribute).toBeUndefined()
    })
    test("If an identifier attribute is provided, the identifierAttribute should be set for the object.", () => {
        const Model = types.model("name", {
            id: types.identifier
        })

        expect(Model.identifierAttribute).toBe("id")
    })
    test("If an identifier attribute has already been provided, an error should be thrown when attempting to provide a second one.", () => {
        expect(() => {
            types.model("name", {
                id: types.identifier,
                id2: types.identifier
            })
        }).toThrowErrorMatchingInlineSnapshot(
            `"[mobx-state-tree] Cannot define property 'id2' as object identifier, property 'id' is already defined as identifier property"`
        )
    })
})
describe("Edge case behavior", () => {
    describe("when we provide no arguments to the function", () => {
        test("the model will be named AnonymousModel", () => {
            const Model = types.model()

            expect(Model.name).toBe("AnonymousModel")
        })
        test("the model will have no properties", () => {
            const Model = types.model()

            const modelSnapshot = getSnapshot(Model.create())
            expect(modelSnapshot).toEqual({})
        })
        if (process.env.NODE_ENV !== "production") {
            test("it should not throw an error", () => {
                expect(() => {
                    types.model()
                }).not.toThrow()
            })
        }
    })
    describe("when we provide an invalid name value, but a valid property object", () => {
        if (process.env.NODE_ENV === "production") {
            test("the model will be named AnonymousModel", () => {
                const Model = types.model(null as any, {
                    prop1: "prop1",
                    prop2: 2
                })

                expect(Model.name).toBe("AnonymousModel")
            })
            test("the model will have no properties", () => {
                const Model = types.model(null as any, {
                    prop1: "prop1",
                    prop2: 2
                })

                const modelSnapshot = getSnapshot(Model.create())
                expect(modelSnapshot).toEqual({})
            })
        } else {
            test("it should complain about invalid name", () => {
                expect(() => {
                    types.model(null as any, {
                        prop1: "prop1",
                        prop2: 2
                    })
                }).toThrowErrorMatchingInlineSnapshot(
                    `"[mobx-state-tree] Model creation failed. First argument must be a string when two arguments are provided"`
                )
            })
        }
    })
    describe("when we provide three arguments to the function", () => {
        test("the model gets the correct name", () => {
            // @ts-ignore
            const Model = types.model("name", {}, {})

            expect(Model.name).toBe("name")
        })
        test("the model gets the correct properties", () => {
            const Model = types.model(
                "name",
                {
                    prop1: "prop1",
                    prop2: 2
                },
                // @ts-ignore
                {}
            )

            const modelSnapshot = getSnapshot(Model.create())
            expect(modelSnapshot).toEqual({
                prop1: "prop1",
                prop2: 2
            })
        })
    })
})
