import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { Bench } from "tinybench"

export const withBenchmark = async (name: string, fn: (suite: Bench) => void) => {
  const suite = withCodSpeed(
    new Bench({
      // Increase warmup time from default (100ms) to hopefully have everything JIT-ed
      warmupTime: 500,

      setup: (task, mode) => {
        switch (mode) {
          case "run":
            console.log(`Running benchmark "${task.name}"`)
            break
        }
      }
    })
  )

  fn(suite)

  console.log(`Warming up "${name}"...`)
  await suite.warmup()
  await suite.run()
  console.table(suite.table())
}
