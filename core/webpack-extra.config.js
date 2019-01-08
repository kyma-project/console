module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /./, to: './src/index.html' }]
    }
  }
};
