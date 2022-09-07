const path = require('path')
const WebpackBar = require('webpackbar');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './../src/index.ts'),
  },
  output: {
    globalObject: 'this',
    // 打包文件根目录
    path: path.resolve(__dirname, '../dist/lib'),
    filename: `index.js`,
    library: {
      type: 'umd',
    },
  },
  plugins: [
    new WebpackBar(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              silent: true,
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(jsx|js)?$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.less?$/,
        use: [
          '@teamsupercell/typings-for-css-modules-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            }
          }
          // 'less-loader',
        ],
      },
      {
        test: /\.css?$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      }
    ],
  },
}
