module.exports = function(wallaby) {
    return {
        files: ["src/**/*.ts"],

        tests: ["test/**/*.ts"],

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
