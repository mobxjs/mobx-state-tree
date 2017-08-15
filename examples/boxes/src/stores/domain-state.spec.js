import { getSnapshot, applyAction, clone, testActions } from "mobx-state-tree"
import { Box } from "./domain-state"

test("it should be able to move boxes - 1", () => {
    var box = Box.create({ x: 100, y: 100, id: "1", name: "test" })

    box.move(23, 10)
    expect(getSnapshot(box)).toMatchSnapshot()

    box.move(22, -13)
    expect(getSnapshot(box)).toMatchSnapshot()
})

test("it should be able to move boxes - 2", () => {
    const box = Box.create({ x: 100, y: 100, id: "1", name: "test" })
    applyAction(box, [{ name: "move", args: [5, 5] }, { name: "move", args: [3, 2] }])
    expect(box.toJSON()).toMatchSnapshot()
})
