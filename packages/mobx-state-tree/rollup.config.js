import { baseConfig } from "../../rollup.base-config"

const config = (outFile, format, mode) =>
    baseConfig({
        outFile,
        format,
        mode,

        input: "./lib/index.js",
        globals: {
            mobx: "mobx"
        },
        umdName: "mobxStateTree",
        external: ["mobx"]
    })

export default [
    config("mobx-state-tree.js", "cjs", "development"),
    config("mobx-state-tree.min.js", "cjs", "production"),

    config("mobx-state-tree.umd.js", "umd", "development"),
    config("mobx-state-tree.umd.min.js", "umd", "production"),

    config("mobx-state-tree.module.js", "es", "development")
]
