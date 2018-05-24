import { types, getEnv, getParent } from "../src"
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

// NOTE: parents are now always created before children;
// moreover, we do not actually have actions hash during object-node creation
test.skip("Parent property does not have value during child's afterCreate() event", () => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })
    // Because the child is created before the parent creation is finished, this one will yield `true` (the .fetch view is still undefined)
    expect(parent.child.parentPropertyIsNullAfterCreate).toBe(true)
    // ... but, the env is available
    expect(parent.child.parentEnvIsNullAfterCreate).toBe(false)
})
test("Parent property has value during child's afterAttach() event", () => {
    const mockFetcher = () => Promise.resolve(true)
    const parent = ParentModel.create({}, { fetch: mockFetcher })
    expect(parent.child.parentPropertyIsNullAfterAttach).toBe(false)
})
