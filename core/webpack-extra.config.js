const webpack = require('webpack');

function processConfigEnvVariables(sourceObject, prefix) {
  const result = {}
  for (var prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result[prop.replace(prefix, '')] = JSON.stringify(sourceObject[prop]);
    }
  }
  // console.log('webpack cluster config: ', result)
  return result;
}

module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: './src/index.html' }]
    }
  },
  plugins: [
    new webpack.DefinePlugin({ 'window.clusterConfig': JSON.stringify(processConfigEnvVariables(process.env, 'REACT_APP_')) })
  ],
};
