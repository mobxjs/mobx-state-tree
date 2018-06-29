import { types, getMembers, IStateTreeNode } from "../src"
const User = types.model("User", {
    id: types.identifier,
    name: types.string
})
const Model = types
    .model({
        isPerson: false,
        users: types.optional(types.map(User), {}),
        dogs: types.optional(types.array(User), []),
        user: types.maybe(types.late(() => User))
    })
    .volatile(self => ({
        volatileProperty: { propName: "halo" }
    }))
    .actions(self => {
        function actionName() {
            return 1
        }
        return {
            actionName
        }
    })
    .views(self => ({
        get viewName() {
            return 1
        }
    }))
test("reflection - model", () => {
    const node = Model.create()
    const reflection = getMembers(node)
    expect(reflection.name).toBe("AnonymousModel")
    expect(reflection.actions.includes("actionName")).toBe(true)
    expect(reflection.views.includes("viewName")).toBe(true)
    expect(reflection.volatile.includes("volatileProperty")).toBe(true)
    expect(!!reflection.properties.users).toBe(true)
    expect(!!reflection.properties.isPerson).toBe(true)
})
test("reflection - map", () => {
    const node = Model.create({
        users: { "1": { id: "1", name: "Test" } }
    })
    const reflection = getMembers(node.users.get("1")! as IStateTreeNode)
    expect(reflection.name).toBe("User")
    expect(!!reflection.properties.id).toBe(true)
    expect(!!reflection.properties.name).toBe(true)
})
test("reflection - array", () => {
    const node = Model.create({
        dogs: [{ id: "1", name: "Test" }]
    })
    const reflection = getMembers(node.dogs[0])
    expect(!!reflection.properties.id).toBe(true)
    expect(!!reflection.properties.name).toBe(true)
})
test("reflection - late", () => {
    const node = Model.create({
        user: { id: "5", name: "Test" }
    })
    const reflection = getMembers(node.user || {})
    const keys = Object.keys(reflection.properties || {})
    expect(keys.includes("name")).toBe(true)
    expect(reflection.properties.name.describe()).toBe("string")
})
if (process.env.NODE_ENV !== "production") {
    test("reflection - throw on non model node", () => {
        const node = Model.create({
            users: { "1": { id: "1", name: "Test" } }
        })
        expect(() => (node.users ? getMembers(node.users) : {})).toThrowError()
    })
}
test("reflection - can retrieve property names", () => {
    const node = Model.create()
    const reflection = getMembers(node)
    const keys = Object.keys(reflection.properties)
    expect(keys.includes("users")).toBe(true)
    expect(keys.includes("isPerson")).toBe(true)
})
test("reflection - property contains type", () => {
    const TestModel = types.model({
        string: types.string,
        optional: false
    })
    const node = TestModel.create({
        string: "hello"
    })
    const reflection = getMembers(node)
    expect(reflection.properties.string).toBe(types.string)
    expect(reflection.properties.optional).toEqual(types.optional(types.boolean, false))
})
test("reflection - members chained", () => {
    const ChainedModel = types
        .model({
            isPerson: false
        })
        .actions(self => {
            return {
                actionName() {
                    return 1
                }
            }
        })
        .actions(self => {
            return {
                anotherAction() {
                    return 1
                }
            }
        })
        .views(self => ({
            get viewName() {
                return 1
            }
        }))
        .views(self => ({
            anotherView(prop) {
                return 1
            }
        }))
    const node = ChainedModel.create()
    const reflection = getMembers(node)
    const keys = Object.keys(reflection.properties || {})
    expect(keys.includes("isPerson")).toBe(true)
    expect(reflection.actions.includes("actionName")).toBe(true)
    expect(reflection.actions.includes("anotherAction")).toBe(true)
    expect(reflection.views.includes("viewName")).toBe(true)
    expect(reflection.views.includes("anotherView")).toBe(true)
})
test("reflection - conditionals respected", () => {
    let swap = true
    const ConditionalModel = types
        .model({
            isPerson: false
        })
        .actions(self => ({
            actionName0() {
                return 1
            }
        }))
        .actions(
            (self): { actionName1(): number } | { actionName2(): number } => {
                if (swap) {
                    return {
                        actionName1() {
                            return 1
                        }
                    }
                } else {
                    return {
                        actionName2() {
                            return 1
                        }
                    }
                }
            }
        )
        .views(self => {
            if (swap) {
                return {
                    get view1() {
                        return 1
                    }
                }
            } else {
                return {
                    get view2() {
                        return 1
                    }
                }
            }
        })
    // swap true
    const node = ConditionalModel.create()
    const reflection = getMembers(node)
    expect(reflection.actions.includes("actionName0")).toBe(true)
    expect(reflection.actions.includes("actionName1")).toBe(true)
    expect(reflection.actions.includes("actionName2")).toBe(false)
    expect(reflection.views.includes("view1")).toBe(true)
    expect(reflection.views.includes("view2")).toBe(false)
    swap = false
    const node2 = ConditionalModel.create()
    const reflection2 = getMembers(node2)
    expect(reflection.actions.includes("actionName0")).toBe(true)
    expect(reflection2.actions.includes("actionName1")).toBe(false)
    expect(reflection2.actions.includes("actionName2")).toBe(true)
    expect(reflection2.views.includes("view1")).toBe(false)
    expect(reflection2.views.includes("view2")).toBe(true)
})
