import { types, getSnapshot, SnapshotIn } from "../../src"

test("arrays, maps, maybe, maybeNull", () => {
    const M = types
        .model({
            x: 5,
            array: types.array(types.self((): any => M)),
            map: types.map(types.self((): any => M))
        })
        .props({
            maybeChild: types.maybe(types.self((): any => M)),
            maybeNullChild: types.maybeNull(types.self((): any => M))
        })

    const e1 = M.create({ array: [{ array: [{ x: 6 }] }] })

    expect(e1.array[0]!.array[0].x).toBe(6)

    const e2 = M.create({
        map: {
            "0": {
                map: {
                    "0": {
                        x: 6
                    }
                }
            }
        }
    })

    expect(e2.map.get("0")!.map.get("0")!.x).toBe(6)

    const e3 = M.create({
        maybeChild: {
            maybeChild: {
                x: 6
            }
        }
    })

    expect(e3.maybeChild!.maybeChild!.x).toBe(6)

    const e4 = M.create({
        maybeNullChild: {
            maybeNullChild: {
                x: 6
            }
        }
    })
    expect(e4.maybeNullChild!.maybeNullChild!.x).toBe(6)
})

test("binary tree", () => {
    const BinaryTreeNode = types.model({
        data: types.string,
        leftNode: types.maybe(types.self((): any => BinaryTreeNode)),
        rightNode: types.maybe(types.self((): any => BinaryTreeNode))
    })

    const bt = BinaryTreeNode.create({
        data: "root",
        leftNode: {
            data: "l",
            leftNode: {
                data: "ll"
            }
        },
        rightNode: {
            data: "r",
            leftNode: {
                data: "rl"
            }
        }
    })

    expect(bt.data).toBe("root")
    expect(bt.leftNode!.data).toBe("l")
    expect(bt.leftNode!.leftNode!.data).toBe("ll")
    expect(bt.rightNode!.data).toBe("r")
    expect(bt.rightNode!.leftNode!.data).toBe("rl")
})

/*
test("model inside model", () => {
    const M = types.model({
        x: types.number,
        me: types.maybe(types.self((): any => M)),
        other: types.model({
            y: types.number,
            otherMe: types.maybe(types.self((): any => this))
        })
    })

    const snapshot: SnapshotIn<typeof M> = {
        x: 0,
        me: { x: 1, other: { y: 10 } },
        other: { y: 11, otherMe: { y: 12, otherMe: { y: 13 } } }
    }

    const m = M.create(snapshot)

    expect(getSnapshot(m)).toMatchObject(snapshot)
})
*/
