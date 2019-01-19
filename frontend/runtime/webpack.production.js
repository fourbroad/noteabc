const 
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  common = require('./webpack.common.js'),
  cssNext = require('postcss-cssnext'),
//   UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  ImageminPlugin    = require('imagemin-webpack-plugin').default,
  HtmlWebpackPlugin = require('html-webpack-plugin');

const name = '@notesabc/runtime';
const identity = "_" + name.replace(/[\.,@,/,-]/g,'_');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    runtime: path.join(__dirname, 'src/runtime.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
//     publicPath: '@notesabc/runtime/',
    library: identity,
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: [path.join(__dirname, 'src'), __dirname, path.join(__dirname, '../../distributions')],
    historyApiFallback : true,
    port               : process.env.PORT || 8080,
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
          plugins: () => [precss, cssNext()]
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
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      moment: 'moment',
      'window.moment': 'moment',
      _: 'lodash',
      'window._':'lodash',
      Popper: ['popper.js', 'default']
    }),
//     new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),  
    new ImageminPlugin(),
//     new UglifyJSPlugin({sourceMap: true}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})    
  ]
});