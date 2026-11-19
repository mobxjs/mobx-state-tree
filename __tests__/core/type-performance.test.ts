import { expect, test } from "bun:test"
import { compileTypes } from "../type-perf/compiler"
import { deepInference, layeredModels } from "../type-perf/scenarios"

test("create avoids extra compiler instantiations in the existing deep-inference regression", () => {
    const legacy = compileTypes(deepInference.entryPoints, "legacy")
    const current = compileTypes(deepInference.entryPoints)
    expect(legacy.diagnostics).toEqual([])
    expect(current.diagnostics).toEqual([])
    // Compare with the same compiler version, allowing substantial headroom over
    // the observed reduction without pinning counts to a TypeScript release.
    expect(current.instantiations).toBeLessThan(legacy.instantiations * 0.25)
}, 15000)

test("compiler instantiations scale with additional layered models", () => {
    const small = layeredModels(5)
    const large = layeredModels(20)
    const empty = layeredModels(0)
    const baseline = compileTypes(empty.entryPoints, "current", empty.files)
    const smallResult = compileTypes(small.entryPoints, "current", small.files)
    const largeResult = compileTypes(large.entryPoints, "current", large.files)
    const legacy = compileTypes(large.entryPoints, "legacy", large.files)
    expect(smallResult.diagnostics).toEqual([])
    expect(largeResult.diagnostics).toEqual([])
    expect(baseline.diagnostics).toEqual([])
    expect(legacy.diagnostics).toEqual([])
    // Subtract the shared cost of checking MST so it cannot hide growth in the
    // generated models. Four times the models should cost roughly four times as much.
    const smallCost = smallResult.instantiations - baseline.instantiations
    const largeCost = largeResult.instantiations - baseline.instantiations
    expect(smallCost).toBeGreaterThan(0)
    expect(largeCost).toBeLessThan(smallCost * 4.4)
    // TypeScript 5.9 also reduced the cost of the legacy declaration. Keep
    // a meaningful savings requirement across compiler versions.
    expect(largeResult.instantiations).toBeLessThan(legacy.instantiations * 0.5)
}, 15000)
