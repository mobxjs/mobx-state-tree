import {onSnapshot, onPatch, createFactory, applyPatch, _getNode, getPath, IJsonPatch, applySnapshot} from "../"
import {test} from "ava"
import "jest"

test("it should create a factory", (t) => {
    const factory = createFactory({
        hello: "world"
    })

    t.deepEqual(factory(), { hello: "world" })
})
