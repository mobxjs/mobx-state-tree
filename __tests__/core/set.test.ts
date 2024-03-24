import { configure } from "mobx"
import {
  onSnapshot,
  onPatch,
  applyPatch,
  applySnapshot,
  getSnapshot,
  types,
  unprotect,
  isStateTreeNode,
  SnapshotOut,
  IJsonPatch,
  IAnyModelType,
  detach
} from "../../src"

const createTestFactories = () => {
  const ItemFactory = types.model({
    to: "world"
  })
  const Factory = types.set(ItemFactory)
  const PrimitiveMapFactory = types.model({
    boolean: types.set(types.boolean),
    string: types.set(types.string),
    numner: types.set(types.number)
  })
  return { Factory, ItemFactory, PrimitiveMapFactory }
}

// === FACTORY TESTS ===
test("it should create a factory [set]", () => {
  const { Factory } = createTestFactories()
  const snapshot = getSnapshot(Factory.create())
  expect(snapshot).toEqual([])
})
