var webpack = require('webpack');

module.exports = {
    entry: './lib/mobx-state-tree.js',
    output: {
        libraryTarget: 'umd',
        library: 'mobxStateTree',
        path: __dirname,
        filename: 'mobx-state-tree.umd.js'
    },
    resolve: {
        extensions: ['', '.js'],
    },
    externals: {
        mobx: 'mobx'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
