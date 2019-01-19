const 
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  cssNext = require('postcss-cssnext'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  ImageminPlugin    = require('imagemin-webpack-plugin').default ;

const name = '@notesabc/dashboard';
const identity = "_" + name.replace(/[\.,@,/,-]/g,'_');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    dashboard: path.join(__dirname, 'src/dashboard.js')    
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:8088/@notesabc/dashboard/',
    library: identity,
    libraryTarget: 'umd'
  },  
  devServer: {
    contentBase : path.join(__dirname, 'dist'),
    historyApiFallback : true,
    port               : 8081,
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
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"]      
    },{
      test: /\.scss$/,
      use: [{
        loader: 'style-loader',
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
          plugins: () => [cssNext()]
        }
      },{
        loader: 'sass-loader',
        options: {
          sourceMap: false,
          includePaths: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname,'src', 'assets', 'styles'),
            path.join(__dirname,'src')
          ]
        }
      }]
    }]
  },
  externals: {
    jquery: {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery'
    },
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash'
    },
    moment: {
      commonjs: 'moment',
      commonjs2: 'moment',
      amd: 'moment'
    }

// import 'jquery-ui/ui/widget';
// import 'bootstrap';
// import _ from 'lodash';
// import moment from 'moment';
    
  },  
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ImageminPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})    
  ]
});
