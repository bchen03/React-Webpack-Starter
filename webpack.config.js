'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var SRC_DIR = path.resolve(__dirname, "src");
var DIST_DIR = path.resolve(__dirname, "dist");

var isProduction = process.env.NODE_ENV === "production";
console.log("webpack.config.js - isProduction =", isProduction);

var plugins = [
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
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: isProduction ? "vendor.[hash].js" : "vendor.js",
        minChunks(module) {
            return module.context && module.context.indexOf("node_modules") > -1;
        }
    })
];

if (isProduction) {
    // Only use UglifyJsPlugin() in production mode, 
    // Redux shows a console warning when used in development mode
    plugins.push(
        new UglifyJsPlugin()
    );
}

var config = {
    entry: SRC_DIR + "/index.js",
    devtool: isProduction ? "" : "source-map",
    output: {
        path: DIST_DIR,
        filename: isProduction ? "bundle.[hash].js" : "bundle.js"
        //,publicPath: "/"
    },
    devServer: {
        contentBase: DIST_DIR,
        compress: true,
        stats: "errors-only",   // Only show error messages
        open: true,             // Opens new browser window when running dev server for first time
        port: 3002
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
                        // ["react"], 
                        // ["es2015", { modules: false }],  // Enable tree-shaking
                        // ["stage-2"] 
                    ]
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            },
            { 
                test: /\.(css|scss)$/, 
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"],
                    publicPath: "/dist"
                })
            },
            {
                test: /\.(gif|jpg|png|svg)$/, 
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                ] 
            },            
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                        {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'font/',
                            publicPath: '/',
                            useRelativePath: true
                        }
                    }
                ]
            }            
        ]
    },
    plugins: plugins
};

module.exports = config;