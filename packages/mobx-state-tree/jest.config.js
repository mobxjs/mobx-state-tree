module.exports = {
    displayName: "test",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: ".*\\.test\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx"],
    globals: {
        "ts-jest": {
            tsConfig: "__tests__/tsconfig.json"
        }
    },
    reporters: ["default", "jest-junit"]
}
