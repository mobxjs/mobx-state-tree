module.exports = {
    displayName: "test",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: ".*\\.test\\.(j|t)sx?$",
    moduleFileExtensions: ["ts", "tsx", "js"],
    globals: {
        "ts-jest": {
            tsConfig: "__tests__/tsconfig.json"
        }
    },
    reporters: ["default", "jest-junit"]
}
