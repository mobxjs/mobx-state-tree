import { types } from "../../src"
import { getDebugName } from "mobx"

test("it should have a debug name", () => {
    const Model = types.model("Name")

    const model = Model.create()
    const array = types.array(Model).create()
    const map = types.map(Model).create()

    expect(getDebugName(model)).toBe("Name")
    expect(getDebugName(array)).toBe("Array<Name>")
    expect(getDebugName(map)).toBe("Map<string, Name>")
})
