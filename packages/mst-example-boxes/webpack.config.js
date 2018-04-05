var path = require("path")
var webpack = require("webpack")

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: [
        "webpack-dev-server/client?http://localhost:4000",
        "webpack/hot/only-dev-server",
        "./src/index"
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/static/"
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader"],
                include: path.join(__dirname, "src")
            }
        ]
    }
}
