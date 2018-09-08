import { deprecated } from "../../src/utils"
import { flow, createFlowSpawner } from "../../src/core/flow"
import { process as mstProcess, createProcessSpawner } from "../../src/core/process"

function createDeprecationListener() {
    // clear previous deprecation dedupe keys
    deprecated.ids = {}
    // save console.warn native implementation
    const originalWarn = console.warn
    // create spy to track warning call
    const spyWarn = (console.warn = jest.fn())
    // return callback to check if warn was called properly
    return function isDeprecated() {
        // replace original implementation
        console.warn = originalWarn
        // test for correct log message, if in development
        if (process.env.NODE_ENV !== "production") {
            expect(spyWarn).toHaveBeenCalledTimes(1)
            expect(spyWarn.mock.calls[0][0]).toMatch(/Deprecation warning:/)
        }
    }
}
test("`process` should mirror `flow`", () => {
    const isDeprecated = createDeprecationListener()
    const generator = function*(): IterableIterator<any> {}
    const flowResult = flow(generator)
    const processResult = mstProcess(generator)
    expect(processResult.name).toBe(flowResult.name)
    isDeprecated()
})
test("`createProcessSpawner` should mirror `createFlowSpawner`", () => {
    const isDeprecated = createDeprecationListener()
    const alias = "generatorAlias"
    const generator = function*(): IterableIterator<any> {}
    const flowSpawnerResult = createFlowSpawner(alias, generator)
    const processSpawnerResult = createProcessSpawner(alias, generator)
    expect(processSpawnerResult.name).toBe(flowSpawnerResult.name)
    isDeprecated()
})
