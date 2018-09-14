const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.modules = [path.resolve('./node_modules'), 'node_modules'];

  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(javascript|go)$`),
    ),
  );

  return config;
};
