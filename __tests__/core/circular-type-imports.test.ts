import { expect, test } from "bun:test"
import { resolve } from "path"
import { compileTypes, fixtureDirectory } from "../type-perf/compiler"

test("circular model imports preserve nested types and reject invalid access", () => {
    expect(compileTypes([resolve(fixtureDirectory, "usage.ts")]).diagnostics).toEqual([])
})

test("the previous writable-key declaration reproduces the circular type error", () => {
    const { diagnostics } = compileTypes([resolve(fixtureDirectory, "usage.ts")], "legacy")
    expect(diagnostics.some(diagnostic => diagnostic.code === 2310)).toBe(true)
    expect(diagnostics.some(diagnostic => diagnostic.code === 7022)).toBe(true)
})

test("create accepts snapshots and instances while rejecting view-only objects", () => {
    expect(compileTypes([resolve(fixtureDirectory, "view-input.ts")]).diagnostics).toEqual([])
})

test("Parameters of create retains the snapshot input type", () => {
    expect(compileTypes([resolve(fixtureDirectory, "create-parameters.ts")]).diagnostics).toEqual(
        []
    )
})

test("create reports a snapshot type error on the invalid property", () => {
    const { diagnostics } = compileTypes([resolve(fixtureDirectory, "invalid-snapshot.ts")])
    expect(diagnostics).toEqual([
        expect.objectContaining({
            code: 2322,
            text: "name",
            message: "Type 'number' is not assignable to type 'string'."
        })
    ])
})
