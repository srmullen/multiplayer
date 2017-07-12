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
            template: "./client/index.html"
        })
    ],
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
