import { test } from "ava"
import { types } from "../src"

test("#158 - #88 - Identifiers should accept any string character", t => {
    const Todo = types.model("Todo", {
        id: types.identifier(types.string),
        title: types.string
    })

    t.notThrows(() => {
        ["coffee", "cof$fee", "cof|fee", "cof/fee"].forEach(id => {
            Todo.create({
                id: id,
                title: "Get coffee"
            })
        })
    })
})
