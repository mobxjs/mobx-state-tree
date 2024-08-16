import * as path from "path"
import {
  applySnapshot,
  getSnapshot,
  onSnapshot,
  types,
  type IDisposer,
  type Instance,
  type SnapshotIn
} from "../src"
import { withBenchmark } from "./lib"

const Model = types
  .model({
    string: types.string,
    number: types.number,
    integer: types.integer,
    float: types.float,
    boolean: types.boolean,
    date: types.Date
  })
  .actions((self) => ({
    changeString(newString: string) {
      self.string = newString
    }
  }))

const snapshot: SnapshotIn<typeof Model> = Object.freeze({
  string: "newString",
  number: 2,
  integer: 2,
  float: 2.2,
  boolean: false,
  date: new Date()
})

let m: Instance<typeof Model>
let disposer: IDisposer | undefined

const modelCreate = () => {
  m = Model.create({
    string: "string",
    number: 1,
    integer: 1,
    float: 1.1,
    boolean: true,
    date: new Date()
  })
}

const runDisposer = () => {
  disposer?.()
  disposer = undefined
}

await withBenchmark(path.parse(__filename).name, (suite) => {
  return suite
    .add("getSnapshot", () => getSnapshot(m), {
      beforeAll: modelCreate
    })
    .add(
      "running an action with onSnapshot",
      () => {
        m.changeString("newString")
      },
      {
        beforeEach() {
          modelCreate()
          disposer = onSnapshot(m, (snapshot) => snapshot)
        },
        afterEach: runDisposer
      }
    )
    .add("applySnapshot", () => applySnapshot(m, snapshot), {
      beforeEach: modelCreate
    })
    .add(
      "applySnapshot with model that has onSnapshot",
      () => {
        return applySnapshot(m, {
          string: "newString",
          number: 2,
          integer: 2,
          float: 2.2,
          boolean: false,
          date: new Date()
        })
      },
      {
        beforeEach() {
          modelCreate()
          disposer = onSnapshot(m, (snapshot) => snapshot)
        },
        afterEach: runDisposer
      }
    )
})
