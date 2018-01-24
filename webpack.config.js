var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var SRC_DIR = path.resolve(__dirname, "src");
var DIST_DIR = path.resolve(__dirname, "dist");

var config = {
    entry: SRC_DIR + "/index.js",
    output: {
        path: DIST_DIR,
        //filename: "bundle.[hash].js",
        filename: "bundle.js"
        //,publicPath: "/"
    },
    devServer: {
        contentBase: DIST_DIR,
        compress: true,
        stats: "errors-only",   // Only show error messages
        open: true,             // Opens new browser window when running dev server for first time
        port: 3001
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: [
                    SRC_DIR
                ],
                exclude: [
                    /node_modules/
                ],
                loader: "babel-loader",
                options: {
                    presets: [
                        ["react"], 
                        ["es2015", { modules: false }],  // Enable tree-shaking
                        ["stage-2"] 
                    ]
                }
            },
            { 
                test: /\.scss$/, 
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"],
                    publicPath: "/dist"
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'React Webpack Starter',
            template: SRC_DIR + '/index.ejs', // Load a custom template (ejs by default see the FAQ for details)
            minify: {
                collapseWhitespace: true
            },
            hash: true   // Adds hash as query parameter
          }),
        new ExtractTextPlugin({     // Generate separate .css and remove from bundle.js
            //filename: "styles.[contenthash].css",
            filename: "styles.css",
            disable: false,
            allChunks: true
        })
    ]
};

module.exports = config;