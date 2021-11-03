/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

const path = require("path");
const extend = require("extend");
const webpack = require("webpack");
const AssetsPlugin = require("assets-webpack-plugin");
const pkg = require("./package.json");
const Dotenv = require("dotenv-webpack");
const isDebug =
  global.DEBUG === false ? false : !process.argv.includes("--release");
const isVerbose =
  process.argv.includes("--verbose") || process.argv.includes("-v");
const useHMR = !!global.HMR; // Hot Module Replacement (HMR))

// Webpack configuration (main.js => public/dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {
  // The base directory for resolving the entry option
  context: __dirname,

  // The entry point for the bundle
  entry: ["whatwg-fetch", "./src/main.js"],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    publicPath: "/dist/",
    filename: isDebug ? "[name].js?[hash]" : "[name].[hash].js",
    chunkFilename: isDebug ? "[id].js?[chunkhash]" : "[id].[chunkhash].js",
    sourcePrefix: "  ",
  },
  node: {
    fs: "empty",
  },
  // Switch loaders to debug or release mode
  debug: isDebug,

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? "source-map" : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, "./public/dist"),
      filename: "assets.json",
      prettyPrint: true,
    }),

    // after compile global will defined `process.env` this Object
    // new webpack.DefinePlugin({
    //   BUILD_AT: Date.now().toString(32),
    //   DEBUG: process.env.NODE_ENV !== "production",
    //   "process.env": {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
    //     API_URL: JSON.stringify(process.env.API_URL),
    //   },
    // }),

    new Dotenv(),
  ],

  // Options affecting the normal modules
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "./src")],
        loader: "babel-loader",
        query: extend({}, pkg.babel, { babelrc: false }),
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: isDebug,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: isDebug
              ? "[name]_[local]_[hash:base64:3]"
              : "[hash:base64:4]",
            // CSS Nano http://cssnano.co/options/
            minimize: !isDebug,
          })}`,
        ],
      },
      {
        test: /\.styl$/,
        loaders: [
          "style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: isDebug,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: isDebug
              ? "[name]_[local]_[hash:base64:3]"
              : "[hash:base64:4]",
            // CSS Nano http://cssnano.co/options/
            minimize: !isDebug,
          })}`,
          "stylus-loader",
        ],
      },
      {
        test: /\.json$/,
        exclude: [path.resolve(__dirname, "./src/routes.json")],
        loader: "json-loader",
      },
      {
        test: /\.json$/,
        include: [path.resolve(__dirname, "./src/routes.json")],
        loader: path.resolve(__dirname, "./src/utils/routes-loader.js"),
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, "./src/utils/markdown-loader.js"),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: "url-loader",
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: "file-loader",
      },
    ],
  },

  // Stylus plugins
  stylus: {
    use: [require("nib")()],
    import: ["~nib/lib/nib/index.styl"],
  },
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: isVerbose } })
  );
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  config.entry.unshift(
    "react-hot-loader/patch",
    "webpack-hot-middleware/client"
  );
  config.module.loaders
    .find((x) => x.loader === "babel-loader")
    .query.plugins.unshift("react-hot-loader/babel");
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = config;
