import * as path from "path"
import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import replace from "rollup-plugin-replace"

const devPlugins = () => [resolve(), filesize()]

// For umd builds, set process.env.NODE_ENV to "development" since 'process' is not available in the browser
const devPluginsUmd = () => [
    resolve(),
    replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
    filesize()
]

const prodPlugins = () => [
    resolve(),
    replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
    terser(),
    filesize()
]

export const baseConfig = ({ input, globals, umdName, external, outFile, format, mode }) => ({
    input,
    output: {
        file: path.join("./dist", outFile),
        format: format,
        globals,
        name: format === "umd" ? umdName : undefined
    },
    external,
    plugins:
        mode === "production" ? prodPlugins() : format === "umd" ? devPluginsUmd() : devPlugins()
})
