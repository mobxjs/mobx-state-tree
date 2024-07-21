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

const config = (outFile, format, mode) => ({
  input: "./lib/src/index.js",
  output: {
    file: path.join("./dist", outFile),
    format: format,
    globals: {
      mobx: "mobx"
    },
    name: format === "umd" ? "mobxStateTree" : undefined
  },
  external: ["mobx"],
  plugins: mode === "production" ? prodPlugins() : format === "umd" ? devPluginsUmd() : devPlugins()
})

export default [
  config("mobx-state-tree.js", "cjs", "development"),
  config("mobx-state-tree.min.js", "cjs", "production"),
  config("mobx-state-tree.umd.js", "umd", "development"),
  config("mobx-state-tree.umd.min.js", "umd", "production"),
  config("mobx-state-tree.module.js", "es", "development")
]
