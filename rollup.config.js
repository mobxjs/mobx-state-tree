import progress from "rollup-plugin-progress"
import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import uglify from "rollup-plugin-uglify"

export default {
    entry: "./lib/index.js",
    dest: "./mobx-state-tree.umd.js",
    format: "umd",
    moduleName: "mobxStateTree",
    external: ["mobx"],
    globals: {
        mobx: "mobx"
    },
    plugins: [resolve(), uglify(), progress(), filesize()]
}
