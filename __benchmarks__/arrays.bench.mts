import * as path from "path"
import { applyPatch, onPatch, types, type IDisposer, type Instance } from "../src"
import { withBenchmark } from "./lib"

const SampleModel = types.model({
  name: types.string,
  id: types.string
})

const SampleStore = types
  .model({
    items: types.array(SampleModel)
  })
  .actions((self) => ({
    add(name: string, id: string) {
      self.items.push({ name, id })
    }
  }))

let store: Instance<typeof SampleStore>

await withBenchmark(path.parse(__filename).name, (suite) => {
  suite
    .add(
      "adding one item to an array",
      () => {
        store.add("item-1", "id-1")
      },
      {
        beforeEach() {
          store = SampleStore.create({ items: [] })
        }
      }
    )
    .add(
      "adding 100 items to an array",
      () => {
        for (let i = 0; i < 100; i++) {
          store.add(`item-${i}`, `id-${i}`)
        }
      },
      {
        beforeEach() {
          store = SampleStore.create({ items: [] })
        }
      }
    )
})
