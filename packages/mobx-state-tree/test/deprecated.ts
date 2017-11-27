import { spy } from "sinon"
import { test, TestContext } from "ava"
import { deprecated } from "../src/utils"
import { flow, createFlowSpawner } from "../src/core/flow"
import { process as mstProcess, createProcessSpawner } from "../src/core/process"

function createDeprecationListener() {
    // clear previous deprecation dedupe keys
    deprecated.ids = {}
    // save console.warn native implementation
    const originalWarn = console.warn
    // create spy to track warning call
    const spyWarn = (console.warn = spy())
    // return callback to check if warn was called properly
    return function isDeprecated(t: TestContext) {
        // replace original implementation
        console.warn = originalWarn
        // test for correct log message, if in development
        if (process.env.NODE_ENV === "development") {
            t.true(spyWarn.called)
            t.regex(spyWarn.getCall(0).args[0], /Deprecation warning:/)
        }
    }
}

test("`process` should mirror `flow`", t => {
    const isDeprecated = createDeprecationListener()

    const generator = function*() {}

    const flowResult = flow(generator)
    const processResult = mstProcess(generator)

    t.is(processResult.name, flowResult.name)

    isDeprecated(t)
})

test("`createProcessSpawner` should mirror `createFlowSpawner`", t => {
    const isDeprecated = createDeprecationListener()

    const alias = "generatorAlias"
    const generator = function*() {}

    const flowSpawnerResult = createFlowSpawner(alias, generator)
    const processSpawnerResult = createProcessSpawner(alias, generator)

    t.is(processSpawnerResult.name, flowSpawnerResult.name)

    isDeprecated(t)
})
