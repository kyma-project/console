const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');

require('babel-polyfill');

let libraryName = pkg.name;

module.exports = {
  entry: ['./src/index'],
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        type: 'javascript/auto',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        type: 'javascript/auto',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), 'node_modules'],
    extensions: ['.js'],
  },
  output: {
    path: path.join(__dirname, '/lib'),
    publicPath: '/',
    filename: 'index.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devServer: {
    contentBase: './src',
    hot: true,
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  optimization: {
    minimize: false,
  },
  externals: {
    'styled-components': {
      commonjs: 'styled-components',
      commonjs2: 'styled-components',
      amd: 'styled-components',
    },
  },
};
