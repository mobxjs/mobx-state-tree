module.exports = {
    displayName: "perf",
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
        "/test/perf/fixtures",
        "/test/perf/scenarios.ts",
        "/test/perf/report.ts",
        "/test/perf/timer.ts",
        "/test/perf/jest.config.js",
        "/\\./"
    ]
}
