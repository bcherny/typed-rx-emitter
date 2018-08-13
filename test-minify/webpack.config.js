const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'none',
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    }]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
    ],
  }
}