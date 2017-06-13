var webpack = require("webpack")

module.exports = {
    entry: "./lib/index.js",
    output: {
        libraryTarget: "umd",
        library: "mobxStateTree",
        path: __dirname,
        filename: "mobx-state-tree.umd.js"
    },
    resolve: {
        extensions: ["", ".js"]
    },
    externals: {
        mobx: "mobx"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        require("webpack-fail-plugin")
    ]
}
