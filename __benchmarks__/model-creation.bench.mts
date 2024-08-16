import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { Bench } from "tinybench"
import { createHeros, createMonsters, createTreasure } from "./fixtures/fixture-data"

const suite = withCodSpeed(
  new Bench({
    // Increase warmup time and iterations from the default 100ms to (hopefully) engage the JIT
    // and get measurements closer to steady state.
    warmupTime: 1000
  })
)

suite
  .add("small-sized roots", () => {
    createTreasure(10)
  })
  .add("medium-sized roots", () => {
    createHeros(10)
  })
  .add("large-sized roots with no children", () => {
    createMonsters(10, 0, 0)
  })
  .add("large-sized roots with some children", () => {
    createMonsters(10, 100, 10)
  })
  .add("large-sized roots with lots of children", () => {
    createMonsters(10, 1000, 100)
  })

await suite.warmup()
await suite.run()
console.table(suite.table())
