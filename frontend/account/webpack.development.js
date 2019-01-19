const
  path = require('path'),
  webpack = require('webpack'),  
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  cssNext = require('postcss-cssnext'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),  
  DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    context: ['jquery', 'bootstrap', 'lodash', 'moment', 'jquery.urianchor', 'jquery.event.gevent', 'jquery.event.ue'],
    index: path.join(__dirname, 'test/index.js')    
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },  
  watch: true,
  devServer: {
    contentBase: [path.join(__dirname, 'src'), __dirname],
    historyApiFallback : true,
    port               : 8080,
    compress           : false,
    inline             : true,
    watchContentBase   : true,
    hot                : true,
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
      test: /\.css$/,
      use: ['style-loader','css-loader']
    },{
      test: /\.scss$/,
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
            path.join(__dirname, 'front/src', 'assets', 'styles'),
            path.join(__dirname, 'front/src')
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
    },{
      test: require.resolve('moment'),
      use: [{
        loader: 'expose-loader',
        options: 'moment'
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({title:'Notesabc View'}),  
    new DashboardPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
});