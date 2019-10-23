const path = require('path');
const webpack = require('webpack');

function processConfigEnvVariables(sourceObject, prefix) {
  const result = {}
  for (var prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result[prop.replace(prefix, '')] = sourceObject[prop];
    }
  }
  return result;
}

module.exports = {
  mode: 'production',
  entry: {
    luigiConfig: './src/luigi-config/luigi-config.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src/assets')
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        options: {
          rootMode: 'root'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ INJECTED_CLUSTER_CONFIG: JSON.stringify(processConfigEnvVariables(process.env, 'REACT_APP_')) })
  ]
}

