import { applySnapshot, getSnapshot, types } from "../../src"
import { Hook } from "../../src/internal"
import { describe, expect, it, jest, test } from "bun:test"

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
  expect(onSnapshot).toHaveBeenLastCalledWith({ val: 1 })
})
describe("Model instantiation", () => {
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
      }).toThrow()
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
        // @ts-expect-error - we explicitly allowed an invalid input, so we expect an empty object, but TS doesn't.
        expect(modelSnapshot).toEqual({})
      })
    } else {
      test("it should complain about invalid name", () => {
        expect(() => {
          types.model(null as any, {
            prop1: "prop1",
            prop2: 2
          })
        }).toThrow()
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

  describe("When a model has duplicate key in actions or views", () => {
    test.skip("it should show friendly message", () => {
      const UserModel = types
        .model("UserModel", {
          id: types.identifier,
          name: types.string
        })
        .views((user) => ({
          get name() {
            return user.name
          }
        }))

      expect(() =>
        UserModel.create({
          id: "chakri",
          name: "Subramanya Chakravarthy"
        })
      ).toThrow("[mobx-state-tree] name property is declared twice")
    })
  })
})
describe("Model properties objects", () => {
  describe("when a user names a property the same as an MST lifecycle hook", () => {
    test("it throws an error", () => {
      const hookValues = Object.values(Hook)

      hookValues.forEach((hook) => {
        expect(() => {
          types.model({
            [hook]: types.string
          })
        }).toThrow()
      })
    })
  })
  describe("when a user attempts to define a property with the get keyword", () => {
    test("it throws an error", () => {
      expect(() => {
        types.model({
          get foo() {
            return "bar"
          }
        })
      }).toThrow()
    })
  })
  describe("when a user attempts to define a property with null as the value", () => {
    test("it throws an error", () => {
      expect(() => {
        types.model({
          foo: null as any
        })
      }).toThrow()
    })
  })
  describe("when a user attempts to define a property with undefined as the value", () => {
    test("it throws an error", () => {
      expect(() => {
        types.model({
          foo: undefined as any
        })
      }).toThrow()
    })
  })
  describe("when a user defines a property using a primitive value (not null or undefined)", () => {
    describe("and the primitive value is a string", () => {
      test("it converts a string to an optional string", () => {
        const Model = types.model({
          foo: "bar"
        })

        const modelDescription = Model.describe()
        expect(modelDescription).toBe("{ foo: string? }")
      })
      test("it uses the primitive value as the default value", () => {
        const Model = types.model({
          foo: "bar"
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: "bar"
        })
      })
    })
    describe("and the primitive value is a number", () => {
      test("it converts a number to an optional number", () => {
        const Model = types.model({
          foo: 1
        })

        const modelDescription = Model.describe()
        expect(modelDescription).toBe("{ foo: number? }")
      })
      test("it uses the primitive value as the default value", () => {
        const Model = types.model({
          foo: 1
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: 1
        })
      })
    })
    describe("and the primitive value is a boolean", () => {
      test("it converts a boolean to an optional boolean", () => {
        const Model = types.model({
          foo: true
        })

        const modelDescription = Model.describe()
        expect(modelDescription).toBe("{ foo: boolean? }")
      })
      test("it uses the primitive value as the default value", () => {
        const Model = types.model({
          foo: true
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: true
        })
      })
    })
    describe("and the primitive value is a date", () => {
      test("it converts a date to an optional date", () => {
        const Model = types.model({
          foo: new Date()
        })

        const modelDescription = Model.describe()
        expect(modelDescription).toBe("{ foo: Date? }")
      })
      test("it sets a default value with the date in unix milliseconds timestamp", () => {
        const date = new Date("2023-07-24T04:26:04.701Z")
        const Model = types.model({
          foo: date
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: 1690172764701
        })
      })
    })
  })
  describe("when a user defines a property using a complex type", () => {
    describe('and that type is "types.map"', () => {
      test("it sets the default value to an empty map", () => {
        const Model = types.model({
          foo: types.map(types.string)
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: {}
        })
      })
    })
    describe('and that type is "types.array"', () => {
      test("it sets the default value to an empty array", () => {
        const Model = types.model({
          foo: types.array(types.string)
        })

        const modelSnapshot = getSnapshot(Model.create())
        expect(modelSnapshot).toEqual({
          foo: []
        })
      })
    })
    describe("and that type is another model", () => {
      test("it sets the default value to the default of that model", () => {
        const Todo = types.model({
          task: types.optional(types.string, "test")
        })

        const TodoStore = types.model("TodoStore", {
          todo1: types.optional(Todo, () => Todo.create())
        })

        const modelSnapshot = getSnapshot(TodoStore.create())
        expect(modelSnapshot).toEqual({
          todo1: {
            task: "test"
          }
        })
      })
    })
  })
  describe("when a user defines a property using a function", () => {
    if (process.env.NODE_ENV !== "production") {
      test("it throws an error when not in production", () => {
        expect(() => {
          // @ts-ignore
          types.model({
            foo: () => "bar"
          })
        }).toThrow()
      })
    }
  })
  describe("when a user defines a property using a plain JavaScript object", () => {
    if (process.env.NODE_ENV !== "production") {
      test("it throws an error when not in production", () => {
        expect(() => {
          // @ts-ignore
          types.model({
            foo: {}
          })
        }).toThrow()
      })
    }
  })
  describe("when a user uses `.props` to create a child model", () => {
    it("does not modify the parent properties", () => {
      const Parent = types.model({
        first: types.string
      })

      const Child = Parent.props({
        second: types.string
      })

      expect(Parent.properties).not.toHaveProperty("second")
    })
  })
})
