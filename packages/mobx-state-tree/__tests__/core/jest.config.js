module.exports = {
    displayName: "test",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    testRegex: ".*\\.test\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    testPathIgnorePatterns: ["/__tests__/perf/"]
}
