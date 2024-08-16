import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { Bench } from "tinybench"
import { applyPatch, onPatch, types, type Instance, type IDisposer } from "../src"

const Model = types.model({
  string: types.string,
  number: types.number,
  integer: types.integer,
  float: types.float,
  boolean: types.boolean,
  date: types.Date
})

const suite = withCodSpeed(
  new Bench({
    warmupTime: 100
  })
)

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
  // TODO this one seems to run forever (likely it runs too fast and tinybench wants to run it way too much)
  .todo(
    "onPatch",
    () => {
      disposer = onPatch(m, (patch) => patch)
    },
    options
  )

// await suite.warmup()
await suite.run()
console.table(suite.table())
