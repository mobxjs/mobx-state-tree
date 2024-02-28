import { types, Instance } from "../../src/index"

describe("1525. Model instance maybe fields becoming TypeScript optional fields when included in a types.union", () => {
  test("should not throw a typescript error", () => {
    // Model - key part is that `bar` is a "maybe" type
    const Model = types.model("myModel", {
      foo: types.string,
      bar: types.maybe(types.integer)
    })

    // Store, showing the difference between using the module directly vs as part of a union
    const Store = types.model("store", {
      itemWithoutIssue: Model,
      itemWithIssue: types.union(types.literal("anotherValue"), Model)
    })

    // Interface derived from the Model instance
    interface IModel extends Instance<typeof Model> {}

    // Test store instance
    const store = Store.create({
      itemWithoutIssue: { foo: "works" },
      itemWithIssue: { foo: "has ts error" }
    })

    // The two variables below have different generated types, though they are both the Model

    // -------------------------------------
    // `Model2` below has a type error:
    // "Property 'bar' is optional in type ... but required in type 'IModel'".
    // -------------------------------------
    const itemWithoutIssueModel = store.itemWithoutIssue
    const itemWithIssueModel = store.itemWithIssue === "anotherValue" ? null : store.itemWithIssue

    // Test component
    interface IProps {
      model1: IModel
      model2: IModel
    }

    const testFunction = (props: IProps) => {
      const { model1, model2 } = props
      const { foo: foo1, bar: bar1 } = model1
      const { foo: foo2, bar: bar2 } = model2
    }

    // Call the test function with the two models
    testFunction({ model1: itemWithoutIssueModel, model2: itemWithIssueModel })
  })
})
