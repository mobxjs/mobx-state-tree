import { smallScenario, mediumScenario, largeScenario } from "./scenarios"

// here's what we'll be testing
const plan = [
    "-----------",
    "Small Model",
    "-----------",
    () => smallScenario(100),
    () => smallScenario(1000),
    () => smallScenario(10000),
    () => smallScenario(1000),
    () => smallScenario(100),
    "",
    "------------",
    "Medium Model",
    "------------",
    () => mediumScenario(100),
    () => mediumScenario(1000),
    () => mediumScenario(10000),
    () => mediumScenario(1000),
    () => mediumScenario(100),
    "",
    "------------------------",
    "Large Model - 0 children",
    "------------------------",
    () => largeScenario(100, 0, 0),
    () => largeScenario(1000, 0, 0),
    () => largeScenario(100, 0, 0),
    "",
    "-------------------------------------------",
    "Large Model - 10 small & 10 medium children",
    "-------------------------------------------",
    () => largeScenario(50, 10, 10),
    () => largeScenario(250, 10, 10),
    () => largeScenario(50, 10, 10),
    "",
    "-------------------------------------------",
    "Large Model - 100 small & 0 medium children",
    "-------------------------------------------",
    () => largeScenario(50, 100, 0),
    () => largeScenario(250, 100, 0),
    () => largeScenario(50, 100, 0),
    "",
    "-------------------------------------------",
    "Large Model - 0 small & 100 medium children",
    "-------------------------------------------",
    () => largeScenario(50, 0, 100),
    () => largeScenario(250, 0, 100),
    () => largeScenario(50, 0, 100)
]

// burn a few to get the juices flowing
smallScenario(1000)
mediumScenario(500)
largeScenario(100, 10, 10)

// remember when this broke the internet?
function leftPad(value, length, char = " ") {
    return value.toString().length < length ? leftPad(char + value, length) : value
}

// let's start
plan.forEach(fn => {
    // strings get printed, i guess.
    if (typeof fn === "string") {
        console.log(fn)
        return
    }

    // trigger awkward gc up front if we can
    if (global.gc) {
        global.gc()
    }

    // run the report
    const result = fn()

    // calculate some fields
    const seconds = leftPad((result.elapsed / 1.0).toLocaleString(), 8)
    const times = leftPad(`x ${result.count.toLocaleString()}`, 10)
    const avg = leftPad((result.elapsed / result.count).toFixed(1), 4)

    // print
    console.log(`${seconds}ms | ${times} | ${avg}ms avg`)
})

console.log("")
