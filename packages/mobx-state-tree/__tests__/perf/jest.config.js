module.exports = {
    displayName: "perf",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    testRegex: ".*\\.ts?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/src/",
        "/dist/",
        "/__tests__/core/",
        "/__tests__/perf/fixtures",
        "/__tests__/perf/scenarios.ts",
        "/__tests__/perf/report.ts",
        "/__tests__/perf/timer.ts",
        "/__tests__/perf/jest.config.js",
        "/\\./"
    ]
}
