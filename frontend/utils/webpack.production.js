const
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  cssNext = require('postcss-cssnext'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  ImageminPlugin    = require('imagemin-webpack-plugin').default,
  OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'utils':'./src/utils.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase : path.join(__dirname, 'dist'),
    historyApiFallback : true,
    port               : 3001,
    compress           : true,
    inline             : false,
    watchContentBase   : true,
    hot                : false,
    host               : '0.0.0.0',
    disableHostCheck   : true,
    overlay            : true,
    stats: {
      assets     : true,
      children   : false,
      chunks     : false,
      hash       : false,
      modules    : false,
      publicPath : false,
      timings    : true,
      version    : false,
      warnings   : true,
      colors     : true
    }
  },
  module:{
    rules:[{
      test: /\.(sa|sc|c)ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      },{
        loader: 'css-loader',
        options: {
          sourceMap : false,
          minimize  : true
        }
      },{
        loader: 'postcss-loader',
        options: {
          sourceMap: false,
//          plugins: () => [cssNext()]
          plugins: function () {
            return [
              require('autoprefixer')
            ];
          }
        }
      },{
        loader: 'sass-loader',
        options: {
          sourceMap: false,
          includePaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src', 'assets', 'styles'),
            path.join(__dirname, 'src')
          ]
        }
      }]
    }]
  },  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].bundle.css',
    }),
    new CleanWebpackPlugin(['dist']),
    new ImageminPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ],
  optimization: {
//     minimizer: [
//       new UglifyJsPlugin({
//         cache: true,
//         parallel: true,
//         sourceMap: true // set to true if you want JS source maps
//       }),
//       new OptimizeCSSAssetsPlugin({})
//     ],
//     splitChunks: {
//       cacheGroups: {
//         styles: {
//           name: 'styles',
//           test: /\.(sa|sc|c)ss$/,
//           chunks: 'all',
//           enforce: true
//         }
//       }
//     }
  }  
});