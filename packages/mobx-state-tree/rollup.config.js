import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"
import replace from "rollup-plugin-replace"

function getEnvVariables(production) {
    return { "process.env.NODE_ENV": production ? "'production'" : "'development'" }
}

export default [
    {
        input: "./lib/index.js",
        output: {
            file: "./dist/mobx-state-tree.js",
            format: "cjs",
            globals: {
                mobx: "mobx"
            }
        },
        external: ["mobx"],
        plugins: [resolve(), filesize()]
    },
    {
        input: "./lib/index.js",
        output: {
            file: "./dist/mobx-state-tree.umd.js",
            format: "umd",
            globals: {
                mobx: "mobx"
            },
            name: "mobxStateTree"
        },
        external: ["mobx"],
        plugins: [resolve(), replace(getEnvVariables(true)), uglify(), filesize()]
    },
    {
        input: "./lib/index.js",
        output: {
            file: "./dist/mobx-state-tree.module.js",
            format: "es",
            globals: {
                mobx: "mobx"
            }
        },
        external: ["mobx"],
        plugins: [resolve(), filesize()]
    }
]
