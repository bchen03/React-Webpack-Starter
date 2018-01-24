# React - Webpack - Starter

## Creating the React - Webpack - Starter application using React, WebPack, Babel...

Some resources for learning Webpack: 

* On Youtube, look at videos by IHateTomatoes.


### Basic setup for React/Webpack app:

* Create app folder, initialize npm, and install webpack locally:

```
md React-Webpack-Starter & cd React-Webpack-Starter
npm init -y
npm install --save-dev webpack
``` 

* Now setup the directory structure:

```
React-Webpack-Starter
|- package.json
|- /src
   |- index.js
   |- /components
   |- /css
   |- /images
|- /dist   
```

To test webpack, create ```/src/app.js``` and add:

```
console.log('Hello World!');
```

Then run: 

```
webpack ./src/index.js ./dist/bundle.js
```

If you open ```dist/bundle.js``` and you should see the ```console.log()```. 

```-p``` to create a production version, which is minified. 

```--watch``` to automatically re-run webpack when ```index.js``` changes.  
  
  
* Instead of typing webpack commands on the command-line, let's create a webpack configuration file:

```
type NUL > webpack.config.js
```

and initialize:

```
var webpack = require('webpack');
var path = require('path');

var SRC_DIR = path.resolve(__dirname, "src");
var DIST_DIR = path.resolve(__dirname, "dist");

var config = {
    entry: SRC_DIR + "/index.js",
    output: {
        path: DIST_DIR,
        filename: "bundle.js"
    }
};

module.exports = config;
```

* Let's also add scripts to package.json to run webpack:

```
{
  "name": "react-webpack-starter",
  "version": "1.0.0",
  "description": "React Webpack Starter Application",
  "main": "index.js",
  "scripts": {
    "dev": "webpack -d --watch",
    "prod": "webpack -p"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^3.9.1"
  }
}
```

To run the npm scripts:

```npm run dev|prod```

To load webpage in browser:

```file:///C:/dev/React-Webpack-Starter/dist/index.html```


* html-webpack-plugin

This plugin will generate  an index.html file automatically. Here's the link: https://github.com/jantimon/html-webpack-plugin

```npm install html-webpack-plugin --save-dev```

Add this to webpack.config.js:

```
var HtmlWebpackPlugin = require('html-webpack-plugin');

...

plugins: [
    new HtmlWebpackPlugin({
        title: 'React Webpack Starter',
        template: SRC_DIR + '/index.ejs', // Load a custom template (ejs by default see the FAQ for details)
        minify: {
            collapseWhitespace: true
        },
        hash: true   // Adds hash as query parameter
        })
    ]    

```

Here's the ```index.ejs``` template file (ejs = embedded javascript):

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <meta name="description" content="React Webpack Starter">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body>
    <div id="root"></div>
 </body>
</html>
```

* CSS-loader, style-loader, sass-loader, node-sass, extract-text-webpack-plugin

To add styling to the webpack bundle, first install css-loader, style-loader, sass-loader, and node-sass:

```
npm install --save-dev css-loader
npm install --save-dev style-loader 
npm install --save-dev sass-loader node-sass
```

```css-loader``` resolves ```import/require()```, while ```style-loader``` adds css in ```style``` tag in ```<head>```. ```sass-loader``` and ```node-sass``` provides Sass support.

Then add a rule to webpack.config.js:

```
module: {
    rules: [
        { test: /\.(scss|css)$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
},
```

Finally add the .scss to index.js:

```
const scss = require('./css/styles.scss'); // Uses NodeJS/CommonJS
--or--
import '../css/styles.scss'; // Uses ES6 modules
```

Since ```style-loader``` creates an inline ```<style>```, to move the styles into a separate .css file use the ```extract-text-webpack-plugin```. 

First install the plugin:

```
npm install --save-dev extract-text-webpack-plugin
```

Then add to webpack.config.js:

```
var ExtractTextPlugin = require("extract-text-webpack-plugin");

...

module: {
    rules: [
        { 
            test: /\.scss$/, 
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "sass-loader"],
                publicPath: "/dist"
            })
        }
    ]

...

plugins: [
    new ExtractTextPlugin({     // Generate separate .css and remove from bundle.js
        filename: "styles.[contenthash].css",
        disable: false,
        allChunks: true
    })

```

* Webpack dev server

To run using webpack's dev server, first install:

```
npm install --save-dev webpack-dev-server
```

Then change ```package.json``` npm script to:

```
"scripts": {
    "dev": "webpack-dev-server",
```

Running ```npm run dev``` will show the URL to use from a browser: 

```Project is running at http://localhost:8080/```

The difference between running ```webpack-dev-server``` and ```webpack -d``` is ```webpack-dev-server``` builds 
the artifacts (bundle.js, styles.css) in memory while ```webpack -d``` will save on disk.

To set different configuration options (https://webpack.js.org/configuration/dev-server/), in webpack.config.js:

```
devServer: {
    contentBase: DIST_DIR,
    compress: true,
    stats: "errors-only",   // Only show error messages
    open: true,             // Opens new browser window when running dev server
    port: 3001
},
```

* Installing React and Babel

Install React and Babel:

```
npm install react react-dom --save
npm install babel babel-loader babel-core babel-preset-react babel-preset-es2015 babel-preset-stage-2 -D
```

In webpack.config.js, add a rule:

```
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
```

The presets can instead be added to ./.babelrc:

```
{
    "presets": ["es2015","react", "stage-2"]
}
```

In index.js:

```
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
    render() {
        return (
            <div>Hello World!</div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
```

