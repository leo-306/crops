const { merge } = require('webpack-merge');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    index: path.resolve(__dirname, '../demo/app.tsx'),
  },
  output: {
    // 打包文件根目录
    path: path.resolve(__dirname, '../demo/dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8082,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  plugins: [
    // 生成 index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../demo/index.html'),
    }),
  ]
});