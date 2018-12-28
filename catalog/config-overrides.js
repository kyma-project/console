const path = require('path');

module.exports = function override(config, env) {
  config.resolve.modules = [path.resolve('./node_modules'), 'node_modules']

  return config;
};
