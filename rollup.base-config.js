import * as path from "path"
import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"
import replace from "rollup-plugin-replace"

const devPlugins = () => [resolve(), filesize()]

const prodPlugins = () => [
    resolve(),
    replace({ "process.env.NODE_ENV": "production" }),
    uglify(),
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
    plugins: mode === "production" ? prodPlugins() : devPlugins()
})
