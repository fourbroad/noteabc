const
  path = require('path'),
  webpack = require('webpack'),  
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  cssNext = require('postcss-cssnext'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  DashboardPlugin = require('webpack-dashboard/plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',  
  devtool: 'inline-source-map',
  entry: {
    context: ['jquery', 'bootstrap', 'lodash'],
    index: './test/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true,
  devServer: {
    contentBase        : path.join(__dirname, 'dist'),
    historyApiFallback : true,
    compress           : false,
    inline             : true,
    watchContentBase   : true,
    hot                : true,
    host               : '0.0.0.0',
    port               : 8080,
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
        loader: 'style-loader',
      },{
        loader: 'css-loader',
        options: {
          sourceMap : true,
          minimize  : false
        }
      },{
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: () => [cssNext()]
        }
      },{
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src'),
            path.join(__dirname, 'test')
          ]
        }
      }]
    },{
      test: require.resolve('jquery'),
      use: [{
        loader: 'expose-loader',
        options: 'jQuery'
      },{
        loader: 'expose-loader',
        options: '$'
      }]
    },{
      test: require.resolve('lodash'),
      use: [{
        loader: 'expose-loader',
        options: '_'
      }]
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Popper: ['popper.js', 'default']      
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'test/index.html'),
      path: path.join(__dirname, 'dist'),
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true
      },
    }),    
    new DashboardPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]  
});

