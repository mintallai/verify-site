module.exports = {
  hot: true,
  contentBase: 'dist',
  publicPath: 'build',
  historyApiFallback: 'index.html',
  port: 5000,
  // proxy: {    '/': 'http://localhost:5000'  } legacy. Needs spassr running.
};
