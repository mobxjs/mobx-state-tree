import resolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"

const externals = ["mobx", "mobx-state-tree"]
const globals = {
    mobx: "mobx",
    "mobx-state-tree": "mobxStateTree"
}

export default [
    {
        entry: "./lib/index.js",
        dest: "./dist/mst-middlewares.js",
        format: "cjs",
        external: externals,
        globals: globals,
        plugins: [resolve()]
    },
    {
        entry: "./lib/index.js",
        dest: "./dist/mst-middlewares.umd.js",
        format: "umd",
        moduleName: "mobxStateTree",
        external: externals,
        globals: globals,
        plugins: [resolve(), uglify()]
    },
    {
        entry: "./lib/index.js",
        dest: "./dist/mst-middlewares.module.js",
        format: "es",
        external: externals,
        globals: globals,
        plugins: [resolve()]
    }
]
