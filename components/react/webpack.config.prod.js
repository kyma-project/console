const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const webpackConfigBase = require('./webpack.config');
require('babel-polyfill');

const plugins = Array.from(webpackConfigBase.plugins);

plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
);

const webpackConfig = {
  ...webpackConfigBase,
  devtool: false,
  mode: 'production',
  performance: { hints: false },
  plugins,
};

module.exports = webpackConfig;
