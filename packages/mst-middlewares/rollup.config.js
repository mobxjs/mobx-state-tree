import { baseConfig } from "../../rollup.base-config"

const config = (outFile, format, mode) =>
    baseConfig({
        outFile,
        format,
        mode,

        input: "./lib/index.js",
        globals: {
            mobx: "mobx",
            "mobx-state-tree": "mobxStateTree"
        },
        umdName: "mstMiddlewares",
        external: ["mobx", "mobx-state-tree"]
    })

export default [
    config("mst-middlewares.js", "cjs", "development"),
    config("mst-middlewares.min.js", "cjs", "production"),

    config("mst-middlewares.umd.js", "umd", "development"),
    config("mst-middlewares.umd.min.js", "umd", "production"),

    config("mst-middlewares.module.js", "es", "development")
]
