const webpack = require('webpack');

function processConfigEnvVariables(sourceObject, prefix) {
  const result = {}
  for (var prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result['window.clusterConfig.' + prop.replace(prefix, '')] = sourceObject[prop];
    }
  }
  return result;
}

module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: './src/index.html' }]
    }
  },
  plugins: [
    new webpack.DefinePlugin(processConfigEnvVariables(process.env, 'REACT_APP_'))
  ],
};
