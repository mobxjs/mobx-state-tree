module.exports = function(wallaby) {
    return {
        files: ["src/**/*.ts"],

        tests: ["__tests__/**/*.ts"],

        compilers: {
            "**/*.ts": wallaby.compilers.typeScript({
                module: "commonjs",
                files: ["src/index.ts"]
            })
        },

        env: {
            type: "node"
        },

        testFramework: "ava",

        debug: true
    }
}
