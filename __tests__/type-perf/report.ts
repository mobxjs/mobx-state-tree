import { resolve } from "path"
import { version } from "typescript"
import { compileTypes, fixtureDirectory } from "./compiler"
import { deepInference, layeredModels } from "./scenarios"

const scenarios = [
    { name: "#2230 deep inference", ...deepInference },
    { name: "5 layered models", ...layeredModels(5) },
    { name: "20 layered models", ...layeredModels(20) },
    { name: "circular parent and child", entryPoints: [resolve(fixtureDirectory, "usage.ts")] }
]

console.log(`TypeScript ${version}; median of 3 fresh programs per declaration`)
console.log(
    "Elapsed time includes parsing and checking; compare instantiations for stable regressions."
)
const rows = []
for (const scenario of scenarios) {
    const results = {
        legacy: [] as ReturnType<typeof compileTypes>[],
        current: [] as ReturnType<typeof compileTypes>[]
    }
    // Alternate order to reduce warm-up bias. Errors are reported because the
    // legacy declaration cannot correctly check the circular workload.
    for (let run = 0; run < 3; run++) {
        const order = run % 2 ? (["current", "legacy"] as const) : (["legacy", "current"] as const)
        for (const declaration of order) {
            results[declaration].push(
                compileTypes(
                    scenario.entryPoints,
                    declaration,
                    "files" in scenario ? scenario.files : {}
                )
            )
        }
    }
    for (const declaration of ["legacy", "current"] as const) {
        const runs = results[declaration]
        if (
            runs.some(run => run.diagnostics.length) &&
            !(declaration === "legacy" && scenario.name === "circular parent and child")
        ) {
            throw new Error(JSON.stringify(runs[0].diagnostics, null, 2))
        }
        const times = runs.map(run => run.elapsedMs).sort((a, b) => a - b)
        rows.push({
            scenario: scenario.name,
            declaration,
            errors: runs[0].diagnostics.length,
            types: runs[0].types,
            instantiations: runs[0].instantiations,
            "median ms": Math.round(times[1])
        })
    }
}
console.table(rows)
