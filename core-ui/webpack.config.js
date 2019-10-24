const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json', 'javascript', 'typescript'],
    }),
  ],
  rules: [
    {
      test: /\.css$/,
      include: APP_DIR,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            namedExport: true,
          },
        },
      ],
    },
    {
      test: /\.css$/,
      include: MONACO_DIR,
      use: ['style-loader', 'css-loader'],
    },
  ],
};
