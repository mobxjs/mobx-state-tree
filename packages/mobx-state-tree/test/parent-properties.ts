import { types, getEnv, getParent } from "../src"
import { test } from "ava"

const ChildModel = types
    .model("Child", {
        parentPropertyIsNullAfterCreate: false,
        parentEnvIsNullAfterCreate: false,
        parentPropertyIsNullAfterAttach: false
    })
    .views(self => {
        return {
            get parent() {
                return getParent(self)
            }
        }
    })
    .actions(self => ({
        afterCreate() {
            self.parentPropertyIsNullAfterCreate = typeof self.parent.fetch === "undefined"
            self.parentEnvIsNullAfterCreate = typeof getEnv(self.parent).fetch === "undefined"
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

test("Parent property does not have value during child's afterCreate() event", t => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })

    // Because the child is created before the parent creation is finished, this one will yield `true` (the .fetch view is still undefined)
    t.is(parent.child.parentPropertyIsNullAfterCreate, true)
    // ... but, the env is available
    t.is(parent.child.parentEnvIsNullAfterCreate, false)
})

test("Parent property has value during child's afterAttach() event", t => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })

    t.is(parent.child.parentPropertyIsNullAfterAttach, false)
})
