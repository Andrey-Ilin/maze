
'use strict';
var webpack = require('webpack');

module.exports = {
    entry: "./frontend/js/app.js",
    output: {
        path: __dirname + '/public',
        publicPath:'/public/',
        filename: "bundle.js"
    },

    watch: true,
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};