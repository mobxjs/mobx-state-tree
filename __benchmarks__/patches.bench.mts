import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { Bench } from "tinybench"
import { applyPatch, onPatch, types, type Instance, type IDisposer } from "../src"
import { withBenchmark } from "./lib"
import * as path from "path"

const Model = types.model({
  string: types.string,
  number: types.number,
  integer: types.integer,
  float: types.float,
  boolean: types.boolean,
  date: types.Date
})

let m: Instance<typeof Model>
let disposer: IDisposer | undefined

const options: Parameters<Bench["add"]>[2] = {
  beforeEach() {
    m = Model.create({
      string: "string",
      number: 1,
      integer: 1,
      float: 1.1,
      boolean: true,
      date: new Date()
    })
  },

  afterEach() {
    disposer?.()
    disposer = undefined
  }
}

await withBenchmark(path.parse(__filename).name, (suite) => {
  suite
    .add(
      "applyPatch",
      () => {
        applyPatch(m, {
          op: "replace",
          path: "/string",
          value: "new string"
        })
      },
      options
    )
    // TODO not sure why, but this one runs infinitely
    .todo(
      "onPatch",
      () => {
        disposer = onPatch(m, (patch) => patch)
      },
      options
    )
})
