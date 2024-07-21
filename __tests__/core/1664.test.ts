import { types as t } from "../../src/index"
import { describe, test } from "bun:test"

describe("1664. Array and model types are not inferred correctly when broken down into their components", () => {
  test("should not throw a typescript error", () => {
    // Simple concrete type with a creation type different than its instance type
    const date = t.custom<string, Date>({
      name: "Date",
      fromSnapshot: (snapshot) => new Date(snapshot),
      toSnapshot: (dt) => dt.toISOString(),
      isTargetType: (val: unknown) => val instanceof Date,
      getValidationMessage: (snapshot: unknown) =>
        typeof snapshot !== "string" || isNaN(Date.parse(snapshot))
          ? `${snapshot} is not a valid Date string`
          : ""
    })

    //Wrap the date type in an array type. IArrayType is a sub-interface of IType.
    const DateArray = t.array(date)

    //Pass the array type to t.union, which infers the component types as <C, S, T>
    const LoadableDateArray = t.union(t.literal("loading"), DateArray)

    //Instantiate the type
    const lda = LoadableDateArray.create([])

    //Try to use the array type as an instance
    if (lda !== "loading") {
      //Error: type of lda is essentially `(string | Date)[] | undefined`
      //The creation type has been mixed together with the instance type
      const dateArray: Date[] = lda
    }
  })
})
