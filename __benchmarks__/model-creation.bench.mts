import * as path from "path"
import { createHeros, createMonsters, createTreasure } from "./fixtures/fixture-data"
import { withBenchmark } from "./lib"

await withBenchmark(path.parse(__filename).name, (suite) => {
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
})
