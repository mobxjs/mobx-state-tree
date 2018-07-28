module.exports = {
    displayName: "test",
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
        "/__tests__/core/jest.config.js",
        "/__tests__/perf/",
        "/\\./"
    ]
}
