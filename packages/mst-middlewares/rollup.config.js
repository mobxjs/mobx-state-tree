import resolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"

const input = "./lib/index.js"
const externals = ["mobx", "mobx-state-tree"]
const globals = {
    mobx: "mobx",
    "mobx-state-tree": "mobxStateTree"
}

export default [
    {
        input: input,
        output: {
            file: "./dist/mst-middlewares.js",
            format: "cjs",
            globals: globals
        },
        external: externals,
        plugins: [resolve()]
    },
    {
        input: input,
        output: {
            file: "./dist/mst-middlewares.umd.js",
            format: "umd",
            globals: globals,
            name: "mobxStateTree"
        },
        external: externals,
        plugins: [resolve(), uglify()]
    },
    {
        input: input,
        output: {
            file: "./dist/mst-middlewares.module.js",
            format: "es",
            globals: globals
        },
        external: externals,
        plugins: [resolve()]
    }
]
