module.exports = {
    displayName: "test",
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
        "/test/jest.config.js",
        "/test/perf/",
        "/\\./"
    ]
}
