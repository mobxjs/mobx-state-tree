import { types, getMembers, IModelReflectionData } from "../src"
import { test } from "ava"

const User = types.model("User", {
    id: types.identifier(types.string),
    name: types.string
})
const Model = types
    .model({
        isPerson: false,
        users: types.maybe(types.map(User)),
        dogs: types.maybe(types.array(User)),
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

test("reflection - model", t => {
    const node = Model.create()
    const reflection = getMembers(node)
    t.is(reflection.name, "AnonymousModel")
    t.is(reflection.actions.includes("actionName"), true)
    t.is(reflection.views.includes("viewName"), true)
    t.is(reflection.volatile.includes("volatileProperty"), true)
    t.is(!!reflection.properties.users, true)
    t.is(!!reflection.properties.isPerson, true)
})

test("reflection - map", t => {
    const node = Model.create({
        users: { "1": { id: "1", name: "Test" } }
    })
    const reflection = node.users
        ? getMembers(node.users.get("1") || {})
        : {} as IModelReflectionData
    t.is(reflection.name, "User")
    t.is(!!reflection.properties.id, true)
    t.is(!!reflection.properties.name, true)
})

test("reflection - array", t => {
    const node = Model.create({
        dogs: [{ id: "1", name: "Test" }]
    })
    const reflection = node.dogs ? getMembers(node.dogs[0]) : {} as IModelReflectionData
    t.is(!!reflection.properties.id, true)
    t.is(!!reflection.properties.name, true)
})

test("reflection - late", t => {
    const node = Model.create({
        user: { id: "5", name: "Test" }
    })
    const reflection = getMembers(node.user || {})
    const keys = Object.keys(reflection.properties || {})
    t.is(keys.includes("name"), true)
    t.is((reflection.properties as any).name.describe(), "string")
})

if (process.env.NODE_ENV === "development") {
    test("reflection - throw on non model node", t => {
        const node = Model.create({
            users: { "1": { id: "1", name: "Test" } }
        })
        let error = null
        try {
            const reflection = node.users ? getMembers(node.users) : {} as IModelReflectionData
        } catch (e) {
            error = e
        }
        t.is(!!error, true)
    })
}

test("reflection - can retrieve property names", t => {
    const node = Model.create()
    const reflection = getMembers(node)
    const keys = Object.keys(reflection.properties)
    t.is(keys.includes("users"), true)
    t.is(keys.includes("isPerson"), true)
})

test("reflection - property contains type", t => {
    const Model = types.model({
        string: types.string,
        optional: false
    })
    const node = Model.create({
        string: "hello"
    })
    const reflection = getMembers(node)
    t.is(reflection.properties.string, types.string)
    t.deepEqual(reflection.properties.optional, types.optional(types.boolean, false))
})

test("reflection - members chained", t => {
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
    t.is(keys.includes("isPerson"), true)
    t.is(reflection.actions.includes("actionName"), true)
    t.is(reflection.actions.includes("anotherAction"), true)
    t.is(reflection.views.includes("viewName"), true)
    t.is(reflection.views.includes("anotherView"), true)
})

test("reflection - conditionals respected", t => {
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
        .actions((self): { actionName1(): number } | { actionName2(): number } => {
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
        })
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
    t.is(reflection.actions.includes("actionName0"), true)
    t.is(reflection.actions.includes("actionName1"), true)
    t.is(reflection.actions.includes("actionName2"), false)
    t.is(reflection.views.includes("view1"), true)
    t.is(reflection.views.includes("view2"), false)

    swap = false
    const node2 = ConditionalModel.create()
    const reflection2 = getMembers(node2)
    t.is(reflection.actions.includes("actionName0"), true)
    t.is(reflection2.actions.includes("actionName1"), false)
    t.is(reflection2.actions.includes("actionName2"), true)
    t.is(reflection2.views.includes("view1"), false)
    t.is(reflection2.views.includes("view2"), true)
})
