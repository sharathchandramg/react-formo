var path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports = {
    mode: "production",
    cache: true,
    context: __dirname + "/src",
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "build"),
        publicPath: "/build/",
        filename: "bundles.js",
        library: "JSONSchemaFormO",
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ]
    },



    externals: {
        react: {
            root: "React",
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        },
        'react-dom': {
            root: "ReactDOM",
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
            umd: 'react-dom',
        }
    },

    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new LodashModuleReplacementPlugin
    ]
};
module.exports = config;