import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"
import replace from "rollup-plugin-replace"

function getEnvVariables(production) {
    return { "process.env.NODE_ENV": production ? "'production'" : "'development'" }
}

const input = "./lib/index.js"
const externals = ["mobx"]
const globals = {
    mobx: "mobx"
}

export default [
    {
        input: input,
        output: {
            file: "./dist/mobx-state-tree.js",
            format: "cjs",
            globals: globals
        },
        external: externals,
        plugins: [resolve(), filesize()]
    },
    {
        input: input,
        output: {
            file: "./dist/mobx-state-tree.umd.js",
            format: "umd",
            globals: globals,
            name: "mobxStateTree"
        },
        external: externals,
        plugins: [resolve(), replace(getEnvVariables(true)), uglify(), filesize()]
    },
    {
        input: input,
        output: {
            file: "./dist/mobx-state-tree.module.js",
            format: "es",
            globals: globals
        },
        external: externals,
        plugins: [resolve(), filesize()]
    }
]
