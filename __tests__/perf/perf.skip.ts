import { smallScenario, mediumScenario, largeScenario } from "./scenarios"
import { start } from "./timer"
import { expect, test } from "bun:test"

// TODO: Not sure how this should work. This feels super fragile.
const TOO_SLOW_MS = 10000

test("performs well on small scenario", () => {
    expect(smallScenario(10).elapsed < TOO_SLOW_MS).toBe(true)
})

test("performs well on medium scenario", () => {
    expect(mediumScenario(10).elapsed < TOO_SLOW_MS).toBe(true)
})

test("performs well on large scenario", () => {
    expect(largeScenario(10, 0, 0).elapsed < TOO_SLOW_MS).toBe(true)
    expect(largeScenario(10, 10, 0).elapsed < TOO_SLOW_MS).toBe(true)
    expect(largeScenario(10, 0, 10).elapsed < TOO_SLOW_MS).toBe(true)
    expect(largeScenario(10, 10, 10).elapsed < TOO_SLOW_MS).toBe(true)
})

test("timer", () => async () => {
    const go = start()

    await new Promise(resolve => setTimeout(resolve, 2))
    const lap = go(true)

    await new Promise(resolve => setTimeout(resolve, 2))
    const d = go()
    expect(lap).not.toBe(0)
    expect(d).not.toBe(0)
    expect(lap).not.toBe(d)
})
