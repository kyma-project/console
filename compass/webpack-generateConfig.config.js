const webpack = require('webpack');
const path = require('path');

function processConfigEnvVariables(sourceObject, prefix) {
  const result = {};
  for (const prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result[prop.replace(prefix, '')] = sourceObject[prop];
    }
  }
  return Object.keys(result).length ? result : undefined;
}

module.exports = {
  mode: 'production',
  entry: {
    luigiConfig: './src/config/luigi-config/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public-luigi'),
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        options: {
          rootMode: 'root',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      INJECTED_CLUSTER_CONFIG: JSON.stringify(
        processConfigEnvVariables(process.env, 'REACT_APP_'),
      ),
    }),
  ],
};
