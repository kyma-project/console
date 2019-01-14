const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  devtool: false,
  mode: 'production',
  performance: { hints: false },
});
