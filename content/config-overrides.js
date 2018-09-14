const path = require('path');
//tricky
const rewirePreact = require('react-app-rewire-preact');
const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.modules = [path.resolve('./node_modules'), 'node_modules'];
  const languages = ['javascript', 'yaml'].join('|');

  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(\`${languages}\`)$`),
    ),
  );
  config = rewirePreact(config, env);

  // console.log('config', config)

  return config;
};
