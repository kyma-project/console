const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    luigiConfig: './src/config/luigi-config/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
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
};
