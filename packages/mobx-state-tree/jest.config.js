module.exports = {
    displayName: "test",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.jsx?$": "babel-jest"
    },
    testRegex: ".*\\.test\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    globals: {
        "ts-jest": {
            tsConfig: "__tests__/tsconfig.json"
        }
    },
    reporters: ["default", "jest-junit"]
}
