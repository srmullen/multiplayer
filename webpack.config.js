const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: [
        "./client/main"
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins:[
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            filename: "_index.html",
            template: "./client/index.html"
        })
    ],
    resolve: {
        modules: ["client", "node_modules"],
        alias: {
            entities: path.resolve(__dirname, "entities")
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
