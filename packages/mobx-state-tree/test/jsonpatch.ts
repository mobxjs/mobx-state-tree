import { getSnapshot, unprotect, recordPatches, types } from "../src"
function testPatches(type, snapshot, fn, expectedPatches) {
    const instance = type.create(snapshot)
    const baseSnapshot = getSnapshot(instance)
    const recorder = recordPatches(instance)
    unprotect(instance)
    fn(instance)
    recorder.stop()
    expect(recorder.patches).toEqual(expectedPatches)
    const clone = type.create(snapshot)
    recorder.replay(clone)
    expect(getSnapshot(clone)).toEqual(getSnapshot(instance))
    recorder.undo()
    expect(getSnapshot(instance)).toEqual(baseSnapshot)
}
const Node = types.model("Node", {
    id: types.identifier(types.number),
    text: "Hi",
    children: types.optional(types.array(types.late(() => Node)), [])
})
test("it should apply simple patch", () => {
    testPatches(
        Node,
        { id: 1 },
        n => {
            n.text = "test"
        },
        [
            {
                op: "replace",
                path: "/text",
                value: "test"
            }
        ]
    )
})
test("it should apply deep patches to arrays", () => {
    testPatches(
        Node,
        { id: 1, children: [{ id: 2 }] },
        n => {
            n.children[0].text = "test" // update
            n.children[0] = { id: 2, text: "world" } // this reconciles; just an update
            n.children[0] = { id: 4, text: "coffee" } // new object
            n.children[1] = { id: 3, text: "world" } // addition
            n.children.splice(0, 1) // removal
        },
        [
            {
                op: "replace",
                path: "/children/0/text",
                value: "test"
            },
            {
                op: "replace",
                path: "/children/0/text",
                value: "world"
            },
            {
                op: "replace",
                path: "/children/0",
                value: {
                    id: 4,
                    text: "coffee",
                    children: []
                }
            },
            {
                op: "add",
                path: "/children/1",
                value: {
                    id: 3,
                    text: "world",
                    children: []
                }
            },
            {
                op: "remove",
                path: "/children/0"
            }
        ]
    )
})
test("it should apply deep patches to arrays with object instances", () => {
    testPatches(
        Node,
        { id: 1, children: [{ id: 2 }] },
        n => {
            n.children[0].text = "test" // update
            n.children[0] = Node.create({ id: 2, text: "world" }) // this does not reconcile, new instance is provided
            n.children[0] = Node.create({ id: 4, text: "coffee" }) // new object
        },
        [
            {
                op: "replace",
                path: "/children/0/text",
                value: "test"
            },
            {
                op: "replace",
                path: "/children/0",
                value: {
                    id: 2,
                    text: "world",
                    children: []
                }
            },
            {
                op: "replace",
                path: "/children/0",
                value: {
                    id: 4,
                    text: "coffee",
                    children: []
                }
            }
        ]
    )
})
test("it should apply non flat patches", () => {
    testPatches(
        Node,
        { id: 1 },
        n => {
            n.children.push({
                id: 2,
                children: [{ id: 4 }, { id: 5, text: "Tea" }]
            })
        },
        [
            {
                op: "add",
                path: "/children/0",
                value: {
                    id: 2,
                    text: "Hi",
                    children: [
                        {
                            id: 4,
                            text: "Hi",
                            children: []
                        },
                        {
                            id: 5,
                            text: "Tea",
                            children: []
                        }
                    ]
                }
            }
        ]
    )
})
test("it should apply non flat patches with object instances", () => {
    testPatches(
        Node,
        { id: 1 },
        n => {
            n.children.push(
                Node.create({
                    id: 2,
                    children: [{ id: 5, text: "Tea" }]
                })
            )
        },
        [
            {
                op: "add",
                path: "/children/0",
                value: {
                    id: 2,
                    text: "Hi",
                    children: [
                        {
                            id: 5,
                            text: "Tea",
                            children: []
                        }
                    ]
                }
            }
        ]
    )
})
test("it should apply deep patches to maps", () => {
    const NodeMap = types.model("NodeMap", {
        id: types.identifier(types.number),
        text: "Hi",
        children: types.optional(types.map(types.late(() => NodeMap)), {})
    })
    testPatches(
        NodeMap,
        { id: 1, children: { 2: { id: 2 } } },
        n => {
            n.children.get("2").text = "test" // update
            n.children.put({ id: 2, text: "world" }) // this reconciles; just an update
            n.children.set(
                "4",
                NodeMap.create({ id: 4, text: "coffee", children: { 23: { id: 23 } } })
            ) // new object
            n.children.put({ id: 3, text: "world", children: { 7: { id: 7 } } }) // addition
            n.children.delete("2") // removal
        },
        [
            {
                op: "replace",
                path: "/children/2/text",
                value: "test"
            },
            {
                op: "replace",
                path: "/children/2/text",
                value: "world"
            },
            {
                op: "add",
                path: "/children/4",
                value: {
                    children: {
                        23: {
                            children: {},
                            id: 23,
                            text: "Hi"
                        }
                    },
                    id: 4,
                    text: "coffee"
                }
            },
            {
                op: "add",
                path: "/children/3",
                value: {
                    children: {
                        7: {
                            children: {},
                            id: 7,
                            text: "Hi"
                        }
                    },
                    id: 3,
                    text: "world"
                }
            },
            {
                op: "remove",
                path: "/children/2"
            }
        ]
    )
})
test("it should apply deep patches to objects", () => {
    const NodeObject = types.model("NodeObject", {
        id: types.identifier(types.number),
        text: "Hi",
        child: types.maybe(types.late(() => NodeObject))
    })
    testPatches(
        NodeObject,
        { id: 1, child: { id: 2 } },
        n => {
            n.child.text = "test" // update
            n.child = { id: 2, text: "world" } // this reconciles; just an update
            n.child = NodeObject.create({ id: 2, text: "coffee", child: { id: 23 } })
            n.child = { id: 3, text: "world", child: { id: 7 } } // addition
            n.child = null // removal
        },
        [
            {
                op: "replace",
                path: "/child/text",
                value: "test"
            },
            {
                op: "replace",
                path: "/child/text",
                value: "world"
            },
            {
                op: "replace",
                path: "/child",
                value: {
                    child: {
                        child: null,
                        id: 23,
                        text: "Hi"
                    },
                    id: 2,
                    text: "coffee"
                }
            },
            {
                op: "replace",
                path: "/child",
                value: {
                    child: {
                        child: null,
                        id: 7,
                        text: "Hi"
                    },
                    id: 3,
                    text: "world"
                }
            },
            {
                op: "replace",
                path: "/child",
                value: null
            }
        ]
    )
})
test("it should correctly escape/unescape json patches", () => {
    const AppStore = types.model({
        items: types.map(types.frozen)
    })
    testPatches(
        AppStore,
        { items: {} },
        store => {
            store.items.set("with/slash~tilde", 1)
        },
        [{ op: "add", path: "/items/with~0slash~1tilde", value: 1 }]
    )
})
