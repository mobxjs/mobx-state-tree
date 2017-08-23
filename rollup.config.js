import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"
import replace from "rollup-plugin-replace"

function getEnvVariables(production) {
    return { "process.env.NODE_ENV": production ? "'production'" : "'development'" }
}

export default [
    {
        entry: "./lib/index.js",
        dest: "./dist/mobx-state-tree.js",
        format: "cjs",
        external: ["mobx"],
        globals: {
            mobx: "mobx"
        },
        plugins: [resolve(), filesize()]
    },
    {
        entry: "./lib/index.js",
        dest: "./dist/mobx-state-tree.umd.js",
        format: "umd",
        moduleName: "mobxStateTree",
        external: ["mobx"],
        globals: {
            mobx: "mobx"
        },
        plugins: [resolve(), replace(getEnvVariables(true)), uglify(), filesize()]
    },
    {
        entry: "./lib/index.js",
        dest: "./dist/mobx-state-tree.module.js",
        format: "es",
        external: ["mobx"],
        globals: {
            mobx: "mobx"
        },
        plugins: [resolve(), filesize()]
    }
]
