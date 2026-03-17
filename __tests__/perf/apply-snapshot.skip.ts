import { types, getSnapshot, applySnapshot } from "../../src"
import { start } from "./timer"
import { expect, test } from "bun:test"

/**
 * Benchmark reproducing the scenario from issue #2128:
 * applySnapshot on a large array where only a few items have changed.
 *
 * @see https://github.com/mobxjs/mobx-state-tree/issues/2128
 */

const Shape = types
    .model("Shape", {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 90,
        fill: "red",
        stroke: "black",
        name: ""
    })
    .actions(self => ({
        set(attrs: Record<string, any>) {
            Object.assign(self, attrs)
        }
    }))

const Group = types.model("Group", {
    shapes: types.array(Shape)
})

function benchmarkApplySnapshot(itemCount: number, changedCount: number) {
    const group = Group.create({
        shapes: new Array(itemCount).fill({})
    })

    const baseline = getSnapshot(group)

    const indices = Array.from({ length: changedCount }, (_, i) =>
        Math.floor((i * itemCount) / changedCount)
    )
    for (const idx of indices) {
        group.shapes[idx].set({ x: 20, y: 30 })
    }

    const time = start()
    applySnapshot(group, baseline)
    const elapsed = time()

    return elapsed
}

test("applySnapshot - 10k items, 1 changed", () => {
    benchmarkApplySnapshot(100, 1) // warmup

    const elapsed = benchmarkApplySnapshot(10000, 1)
    console.log(`  10k items, 1 changed: ${elapsed}ms`)
    expect(elapsed).toBeLessThan(100)
})

test("applySnapshot - 10k items, 10 changed", () => {
    const elapsed = benchmarkApplySnapshot(10000, 10)
    console.log(`  10k items, 10 changed: ${elapsed}ms`)
    expect(elapsed).toBeLessThan(100)
})

test("applySnapshot - 10k items, 100 changed", () => {
    const elapsed = benchmarkApplySnapshot(10000, 100)
    console.log(`  10k items, 100 changed: ${elapsed}ms`)
    expect(elapsed).toBeLessThan(200)
})

test("applySnapshot - 1k items, all changed (worst case baseline)", () => {
    const elapsed = benchmarkApplySnapshot(1000, 1000)
    console.log(`  1k items, all changed: ${elapsed}ms`)
})
