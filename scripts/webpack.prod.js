const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { merge } = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  externals: [
    {
      "react": "react",
      "react-dom": "react-dom",
      "interactjs": "interactjs"
    },
  ],
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt', '*.html'],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
  ],
});