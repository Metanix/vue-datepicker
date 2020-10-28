const path = require('path');

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  outputDir: '../docs',
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: path.join(__dirname, '..', 'docs'),
  },
  configureWebpack: {
    resolve: {
      alias: {
        'vue': path.resolve('./node_modules/vue'),
      },
    },
  },
};
