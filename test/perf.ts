import { test } from "ava"
import { smallScenario, mediumScenario, largeScenario } from "./perf/scenarios"
import { start } from "./perf/timer"

// TODO: Not sure how this should work. This feels super fragile.
const TOO_SLOW_MS = 10000

test.serial("performs well on small scenario", t => {
    t.true(smallScenario(10).elapsed < TOO_SLOW_MS)
})

test.serial("performs well on medium scenario", t => {
    t.true(mediumScenario(10).elapsed < TOO_SLOW_MS)
})

test.serial("performs well on large scenario", t => {
    t.true(largeScenario(10, 0, 0).elapsed < TOO_SLOW_MS)
    t.true(largeScenario(10, 10, 0).elapsed < TOO_SLOW_MS)
    t.true(largeScenario(10, 0, 10).elapsed < TOO_SLOW_MS)
    t.true(largeScenario(10, 10, 10).elapsed < TOO_SLOW_MS)
})

test.cb("timer", t => {
    const go = start()
    setTimeout(function() {
        const lap = go(true)
        setTimeout(function() {
            const done = go()
            t.not(lap, 0)
            t.not(done, 0)
            t.not(lap, done)
            t.end()
        }, 2)
    }, 2)
})
