import { types, Instance } from "../../src/index"
import { describe, it } from "bun:test"

describe("1525. Model instance maybe fields becoming TypeScript optional fields when included in a types.union", () => {
  it("does not throw a typescript error", () => {
    const Model = types.model("myModel", {
      foo: types.string,
      bar: types.maybe(types.integer)
    })

    const Store = types.model("store", {
      itemWithoutIssue: Model,
      itemWithIssue: types.union(types.literal("anotherValue"), Model)
    })

    interface IModel extends Instance<typeof Model> {}

    interface FunctionArgs {
      model1: IModel
      model2: IModel
    }

    const store = Store.create({
      itemWithoutIssue: { foo: "works" },
      itemWithIssue: { foo: "has ts error in a regression" }
    })

    const f = (props: FunctionArgs) => {}

    const itemWithoutIssueModel = store.itemWithoutIssue
    const itemWithIssueModel = store.itemWithIssue === "anotherValue" ? null : store.itemWithIssue
    itemWithIssueModel && f({ model1: itemWithoutIssueModel, model2: itemWithIssueModel })
  })
})
