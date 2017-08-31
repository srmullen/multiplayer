const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "cheap-module-source-map",
    entry: [
        "./client/main"
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            filename: "_index.html",
            template: "./client/index.html"
        })
    ],
    resolve: {
        modules: ["client", "node_modules"],
        alias: {
            entities: path.resolve(__dirname, "entities"),
            components: path.resolve(__dirname, "client/components")
        }
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ["style-loader", "css-loader"]
        },
        {
            test: /\.js$/,
            loaders: ["babel-loader"],
            exclude: /node_modules/
        }]
    }
}
