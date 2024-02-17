import {
  getSnapshot,
  unprotect,
  recordPatches,
  types,
  IType,
  IJsonPatch,
  Instance,
  cast,
  IAnyModelType,
  IMSTMap
} from "../../src"

function testPatches<C, S, T extends object>(
  type: IType<C, S, T>,
  snapshot: C,
  fn: any,
  expectedPatches: IJsonPatch[],
  expectedInversePatches: IJsonPatch[]
) {
  const instance = type.create(snapshot)
  const baseSnapshot = getSnapshot(instance)
  const recorder = recordPatches(instance)
  unprotect(instance)
  fn(instance)
  recorder.stop()
  expect(recorder.patches).toEqual(expectedPatches)
  expect(recorder.inversePatches).toEqual(expectedInversePatches)
  const clone = type.create(snapshot)
  recorder.replay(clone)
  expect(getSnapshot(clone)).toEqual(getSnapshot(instance))
  recorder.undo()
  expect(getSnapshot(instance)).toEqual(baseSnapshot)
}
const Node = types.model("Node", {
  id: types.identifierNumber,
  text: "Hi",
  children: types.optional(types.array(types.late((): IAnyModelType => Node)), [])
})

test("it should apply simple patch", () => {
  testPatches(
    Node,
    { id: 1 },
    (n: Instance<typeof Node>) => {
      n.text = "test"
    },
    [
      {
        op: "replace",
        path: "/text",
        value: "test"
      }
    ],
    [
      {
        op: "replace",
        path: "/text",
        value: "Hi"
      }
    ]
  )
})

test("it should apply deep patches to arrays", () => {
  testPatches(
    Node,
    { id: 1, children: [{ id: 2 }] },
    (n: Instance<typeof Node>) => {
      const children = n.children as unknown as Instance<typeof Node>[]
      children[0].text = "test" // update
      children[0] = cast({ id: 2, text: "world" }) // this reconciles; just an update
      children[0] = cast({ id: 4, text: "coffee" }) // new object
      children[1] = cast({ id: 3, text: "world" }) // addition
      children.splice(0, 1) // removal
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
    ],
    [
      {
        op: "replace",
        path: "/children/0/text",
        value: "Hi"
      },
      {
        op: "replace",
        path: "/children/0/text",
        value: "test"
      },
      {
        op: "replace",
        path: "/children/0",
        value: {
          children: [],
          id: 2,
          text: "world"
        }
      },
      {
        op: "remove",
        path: "/children/1"
      },
      {
        op: "add",
        path: "/children/0",
        value: {
          children: [],
          id: 4,
          text: "coffee"
        }
      }
    ]
  )
})

test("it should apply deep patches to maps", () => {
  const NodeMap = types.model("NodeMap", {
    id: types.identifierNumber,
    text: "Hi",
    children: types.optional(types.map(types.late((): IAnyModelType => NodeMap)), {})
  })
  testPatches(
    NodeMap,
    { id: 1, children: { 2: { id: 2 } } },
    (n: Instance<typeof NodeMap>) => {
      const children = n.children as IMSTMap<typeof NodeMap>
      children.get("2")!.text = "test" // update
      children.put({ id: 2, text: "world" }) // this reconciles; just an update
      children.set("4", NodeMap.create({ id: 4, text: "coffee", children: { 23: { id: 23 } } })) // new object
      children.put({ id: 3, text: "world", children: { 7: { id: 7 } } }) // addition
      children.delete("2") // removal
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
    ],
    [
      {
        op: "replace",
        path: "/children/2/text",
        value: "Hi"
      },
      {
        op: "replace",
        path: "/children/2/text",
        value: "test"
      },
      {
        op: "remove",
        path: "/children/4"
      },
      {
        op: "remove",
        path: "/children/3"
      },
      {
        op: "add",
        path: "/children/2",
        value: {
          children: {},
          id: 2,
          text: "world"
        }
      }
    ]
  )
})

test("it should apply deep patches to objects", () => {
  const NodeObject = types.model("NodeObject", {
    id: types.identifierNumber,
    text: "Hi",
    child: types.maybe(types.late((): IAnyModelType => NodeObject))
  })
  testPatches(
    NodeObject,
    { id: 1, child: { id: 2 } },
    (n: Instance<typeof NodeObject>) => {
      n.child!.text = "test" // update
      n.child = cast({ id: 2, text: "world" }) // this reconciles; just an update
      n.child = NodeObject.create({ id: 2, text: "coffee", child: { id: 23 } })
      n.child = cast({ id: 3, text: "world", child: { id: 7 } }) // addition
      n.child = undefined // removal
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
            child: undefined,
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
            child: undefined,
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
        value: undefined
      }
    ],
    [
      {
        op: "replace",
        path: "/child/text",
        value: "Hi"
      },
      {
        op: "replace",
        path: "/child/text",
        value: "test"
      },
      {
        op: "replace",
        path: "/child",
        value: {
          child: undefined,
          id: 2,
          text: "world"
        }
      },
      {
        op: "replace",
        path: "/child",
        value: {
          child: {
            child: undefined,
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
            child: undefined,
            id: 7,
            text: "Hi"
          },
          id: 3,
          text: "world"
        }
      }
    ]
  )
})
