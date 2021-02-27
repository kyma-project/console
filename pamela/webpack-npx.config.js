const webpack = require('webpack');
const defaultConfig = require('./webpack.config');
const { merge } = require('webpack-merge');

module.exports = merge(defaultConfig, {
  output: { filename: 'pamela-npx.js' },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': 'npx' }),
  ],
});
