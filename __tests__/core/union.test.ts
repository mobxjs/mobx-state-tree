import { configure } from "mobx"
import {
  types,
  hasParent,
  tryResolve,
  getSnapshot,
  applySnapshot,
  getType,
  setLivelinessChecking,
  SnapshotIn,
  Instance,
  IAnyType
} from "../../src"
import { describe, expect, it, test, beforeEach } from "bun:test"

const createTestFactories = () => {
  const Box = types.model("Box", {
    width: types.number,
    height: types.number
  })
  const Square = types.model("Square", {
    width: types.number
  })
  const Cube = types.model("Cube", {
    width: types.number,
    height: types.number,
    depth: types.number
  })
  const Plane = types.union(Square, Box)
  const Heighed = types.union(Box, Cube)
  const DispatchPlane = types.union(
    { dispatcher: (snapshot) => (snapshot && "height" in snapshot ? Box : Square) },
    Box,
    Square
  )
  const Block = types.model("Block", {
    list: types.array(Heighed)
  })
  return { Box, Square, Cube, Plane, DispatchPlane, Heighed, Block }
}
const createLiteralTestFactories = () => {
  const Man = types.model("Man", { type: types.literal("M") })
  const Woman = types.model("Woman", { type: types.literal("W") })
  const All = types.model("All", { type: types.string })
  const ManWomanOrAll = types.union(Man, Woman, All)
  return { Man, Woman, All, ManWomanOrAll }
}
if (process.env.NODE_ENV !== "production") {
  test("it should complain about multiple applicable types no dispatch method", () => {
    const { Box, Square } = createTestFactories()
    const PlaneNotEager = types.union({ eager: false }, Square, Box)
    expect(() => {
      PlaneNotEager.create({ width: 2, height: 2 })
    }).toThrow(/Error while converting/)
  })
}
test("it should have parent whenever creating or applying from a complex data structure to a model which has Union typed children", () => {
  const { Block, Heighed } = createTestFactories()
  const block = Block.create({
    list: [{ width: 2, height: 2 }]
  })
  const child = tryResolve(block, "./list/0")
  expect(hasParent(child)).toBe(true)
})
if (process.env.NODE_ENV !== "production") {
  test("it should complain about no applicable types", () => {
    const { Heighed } = createTestFactories()
    expect(() => {
      Heighed.create({ height: 2 } as any)
    }).toThrow(/Error while converting/)
  })
}
test("it should be smart enough to discriminate by keys", () => {
  const { Box, Plane, Square } = createTestFactories()
  const doc = types.union(Square, Box).create({ width: 2 })
  expect(Box.is(doc)).toEqual(false)
  expect(Square.is(doc)).toEqual(true)
})
test("it should discriminate by value type", () => {
  const Size = types.model("Size", {
    width: 0,
    height: 0
  })
  const Picture = types.model("Picture", {
    url: "",
    size: Size
  })
  const Square = types.model("Square", {
    size: 0
  })
  const PictureOrSquare = types.union(Picture, Square)
  const doc = PictureOrSquare.create({ size: { width: 0, height: 0 } })
  expect(Picture.is(doc)).toEqual(true)
  expect(Square.is(doc)).toEqual(false)
})
test("it should compute exact union types", () => {
  const { Box, Plane, Square } = createTestFactories()
  expect(Plane.is(Box.create({ width: 3, height: 2 }))).toEqual(true)
  expect(Plane.is(Square.create({ width: 3 }))).toEqual(true)
})
test("it should compute exact union types - 2", () => {
  const { Box, DispatchPlane, Square } = createTestFactories()
  expect(DispatchPlane.is(Box.create({ width: 3, height: 2 }))).toEqual(true)
  expect(
    DispatchPlane.is(
      Square.create({ width: 3, height: 2 } as any /* incorrect type, superfluous attr!*/)
    )
  ).toEqual(true)
})
test("it should use dispatch to discriminate", () => {
  const { Box, DispatchPlane, Square } = createTestFactories()
  const a = DispatchPlane.create({ width: 3 })
  expect(getSnapshot(a)).toEqual({ width: 3 })
})

test("it should eagerly match by ambiguos value", () => {
  const { ManWomanOrAll, All, Man } = createLiteralTestFactories()
  const person = ManWomanOrAll.create({ type: "Z" })
  expect(All.is(person)).toEqual(true)
  expect(Man.is(person)).toEqual(false)
})

test("it should eagerly match by ambiguos value - 2", () => {
  const { All, Man } = createLiteralTestFactories()
  const person = types.union(All, Man).create({ type: "M" })
  expect(All.is(person)).toEqual(true)
  expect(Man.is(person)).toEqual(false) // not matched, All grabbed everything!
})

test("it should eagerly match by value literal", () => {
  const { ManWomanOrAll, All, Man } = createLiteralTestFactories()
  const person = ManWomanOrAll.create({ type: "M" })
  expect(All.is(person)).toEqual(false)
  expect(Man.is(person)).toEqual(true)
})

test("dispatch", () => {
  const Odd = types
    .model({
      value: types.number
    })
    .actions((self) => ({
      isOdd() {
        return true
      },
      isEven() {
        return false
      }
    }))
  const Even = types.model({ value: types.number }).actions((self) => ({
    isOdd() {
      return false
    },
    isEven() {
      return true
    }
  }))
  const Num = types.union(
    { dispatcher: (snapshot) => (snapshot.value % 2 === 0 ? Even : Odd) },
    Even,
    Odd
  )
  expect(Num.create({ value: 3 }).isOdd()).toBe(true)
  expect(Num.create({ value: 3 }).isEven()).toBe(false)
  expect(Num.create({ value: 4 }).isOdd()).toBe(false)
  expect(Num.create({ value: 4 }).isEven()).toBe(true)
  if (process.env.NODE_ENV !== "production") {
    expect(() => {
      types.union(
        ((snapshot: any) => (snapshot.value % 2 === 0 ? Even : Odd)) as any, // { dispatcher: snapshot => (snapshot.value % 2 === 0 ? Even : Odd) },
        Even,
        Odd
      )
    }).toThrow("expected object")
  }
})

test("961 - apply snapshot to union should not throw when union keeps models with different properties and snapshot is got by getSnapshot", () => {
  const Foo = types.model({ foo: 1 })
  const Bar = types.model({ bar: 1 })
  const U = types.union(Foo, Bar)

  const u = U.create({ foo: 1 })
  applySnapshot(u, getSnapshot(Bar.create()))
})

describe("1045 - secondary union types with applySnapshot and ids", () => {
  function initTest(
    useSnapshot: boolean,
    useCreate: boolean,
    submodel1First: boolean,
    type: number
  ) {
    setLivelinessChecking("error")

    const Submodel1NoSP = types.model("Submodel1", {
      id: types.identifier,
      extraField1: types.string,
      extraField2: types.maybe(types.string)
    })

    const Submodel1SP = types.snapshotProcessor(Submodel1NoSP, {
      preProcessor(sn: SnapshotIn<Instance<typeof Submodel1NoSP>>) {
        const { id, extraField1, extraField2 } = sn
        return {
          id,
          extraField1: extraField1.toUpperCase(),
          extraField2: extraField2?.toUpperCase()
        }
      }
    })

    const Submodel2NoSP = types.model("Submodel2", {
      id: types.identifier,
      extraField1: types.maybe(types.string),
      extraField2: types.string
    })

    const Submodel2SP = types.snapshotProcessor(Submodel2NoSP, {
      preProcessor(sn: SnapshotIn<Instance<typeof Submodel2NoSP>>) {
        const { id, extraField1, extraField2 } = sn
        return {
          id,
          extraField1: extraField1?.toUpperCase(),
          extraField2: extraField2.toUpperCase()
        }
      }
    })

    const Submodel1 = useSnapshot ? Submodel1SP : Submodel1NoSP
    const Submodel2 = useSnapshot ? Submodel2SP : Submodel2NoSP

    const Submodel = submodel1First
      ? types.union(Submodel1, Submodel2)
      : types.union(Submodel2, Submodel1)

    const Model = types.array(Submodel)

    const store = Model.create([{ id: "id1", extraField1: "extraField1" }])

    return {
      store,
      applySn: function () {
        const sn1 = {
          id: "id1",
          extraField1: "new extraField1",
          extraField2: "some value"
        }
        const sn2 = {
          id: "id1",
          extraField1: undefined,
          extraField2: "some value"
        }
        const sn = type === 1 ? sn1 : sn2
        const submodel = type === 1 ? Submodel1 : Submodel2
        const expected = useSnapshot
          ? {
              id: sn.id,
              extraField1: sn.extraField1?.toUpperCase(),
              extraField2: sn.extraField2?.toUpperCase()
            }
          : sn

        applySnapshot(store, [useCreate ? (submodel as any).create(sn) : sn])

        expect(store.length).toBe(1)
        expect(store[0]).toEqual(expected)
        expect(getType(store[0])).toBe(
          useSnapshot ? (submodel.getSubTypes() as IAnyType) : submodel
        )
      }
    }
  }

  for (const useSnapshot of [false, true]) {
    describe(useSnapshot ? "with snapshotProcessor" : "without snapshotProcessor", () => {
      for (const submodel1First of [true, false]) {
        describe(submodel1First ? "submodel1 first" : "submodel2 first", () => {
          for (const useCreate of [false, true]) {
            describe(useCreate ? "using create" : "not using create", () => {
              for (const type of [2, 1]) {
                describe(`snapshot is of type Submodel${type}`, () => {
                  beforeEach(() => {
                    configure({
                      useProxies: "never"
                    })
                  })

                  it(`apply snapshot works when the node is not touched`, () => {
                    const t = initTest(useSnapshot, useCreate, submodel1First, type)
                    t.applySn()
                  })

                  it(`apply snapshot works when the node is touched`, () => {
                    const t = initTest(useSnapshot, useCreate, submodel1First, type)
                    // tslint:disable-next-line:no-unused-expression
                    t.store[0]
                    t.applySn()
                  })
                })
              }
            })
          }
        })
      }
    })
  }
})
