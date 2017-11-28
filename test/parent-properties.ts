import { types, getEnv, getParent } from "../src"
import { test } from "ava"

const ChildModel = types
    .model("Child", {
        parentPropertyIsNullAfterCreate: false,
        parentPropertyIsNullAfterAttach: false
    })
    .views(self => ({
        get parent() {
            return getParent(self)
        }
    }))
    .actions(self => ({
        afterCreate() {
            self.parentPropertyIsNullAfterCreate = typeof self.parent.fetch === "undefined"
        },
        afterAttach() {
            self.parentPropertyIsNullAfterAttach = typeof self.parent.fetch === "undefined"
        }
    }))

const ParentModel = types
    .model("Parent", {
        child: types.optional(ChildModel, {})
    })
    .views(self => ({
        get fetch() {
            return getEnv(self).fetch
        }
    }))

test("Parent property has value during child's afterCreate() event", t => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })

    t.is(parent.child.parentPropertyIsNullAfterCreate, false)
})

test("Parent property has value during child's afterAttach() event", t => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })

    t.is(parent.child.parentPropertyIsNullAfterAttach, false)
})
