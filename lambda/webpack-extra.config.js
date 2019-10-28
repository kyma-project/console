const webpack = require('webpack');

function processConfigEnvVariables(sourceObject, prefix) {
  const result = {}
  for (var prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result[prop.replace(prefix, '')] = sourceObject[prop];
    }
  }
  return Object.keys(result).length ? result : undefined;
}

module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: './src/index.html' }]
    }
  },
  plugins: [
    new webpack.DefinePlugin({ INJECTED_CLUSTER_CONFIG: JSON.stringify(processConfigEnvVariables(process.env, 'REACT_APP_')) })
  ],
};
