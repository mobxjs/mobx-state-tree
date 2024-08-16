import { smallScenario, mediumScenario, largeScenario } from "./scenarios"
import { withCodSpeed } from "@codspeed/benchmark.js-plugin"
import { createHeros, createMonsters, createTreasure } from "./fixtures/fixture-data"
import * as Benchmark from "benchmark"

withCodSpeed(new Benchmark.Suite())
  .add("when creating small-sized roots", () => {
    createTreasure(10)
  })
  .add("when creating medium-sized roots", () => {
    createHeros(10)
  })
  .add("when creating large-sized roots with no children", () => {
    createMonsters(10, 0, 0)
  })
  .add("when creating large-sized roots with some children", () => {
    createMonsters(10, 100, 10)
  })
  .add("when creating large-sized roots with lots of children", () => {
    createMonsters(10, 1000, 100)
  })
  .on("cycle", function (event: Benchmark.Event) {
    console.log(String(event.target))
  })
  .run()
